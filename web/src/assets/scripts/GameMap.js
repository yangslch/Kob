import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

//在vue中创建地图对象后，就可以进行动态计算内部矩阵的最大边长 + 动态画地图
export class GameMap extends AcGameObject {
    constructor(ctx, parent) {//ctx是前端中的画布，parent画布的父元素，用来动态修改画布的长宽
        super();//调用父类的构造函数

        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;//游戏对象的绝对单位

        this.rows = 13;
        this.cols = 14;//游戏的行数和列数，通过让行/列不相同，改变两条蛇的横纵坐标相加的奇偶，从而使得不会相遇
        //而且因为将正方形变为了矩形，所以需要将轴对称变为中心对称
        
        this.inner_walls_count = 20;//内部障碍物的数量
        this.walls = [];//开一个数组用来存储所有的墙对象

        //创建2条蛇
        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ];


    }

    check_connectivity(g, sx, sy, tx, ty) {//保证连通性函数，算法使用的是FloodFill算法
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;
    }

    create_walls() {//创建墙
        const g = [];//开辟一个二维bool数组，标记该位置是否有墙，若有则为
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];//对g的每一行先赋一个数组，这样才能表示除g是一个二维数组
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;//初始化，都没有墙
            }
        }

        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++ ) {//创建随机障碍物可能会重叠，而最多有100+个格子，1000必然可以完成创建
                let r = parseInt(Math.random() * this.rows);//random函数生成[0,1)，乘上rows即[0， row - 1)
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;//对称创建，如果已经有了直接跳过
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                    continue;//如果创建在了左上角和右下角得重新创建，因为那是蛇开始得地方

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;//创建成功一个即跳出当前循环，执行下一次
                break;
            }
        }

        //js中深度复制一个对象的方法，先将其转为json，再将json解析出来，即完成了深度复制
        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))
            return false;

         //即连通性检查成功，开始根据g数组(标记是否有障碍物的数组)构造障碍物   
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        return true;
    }


    add_listening_events() {//添加监听键盘输入的事件
        this.ctx.canvas.focus();//聚焦

        const [snake0, snake1] = this.snakes;//取出两条蛇


        this.ctx.canvas.addEventListener("keydown", e => {
            if(e.key === 'w') snake0.set_direction(0);
            else if(e.key === 'd') snake0.set_direction(1);
            else if(e.key === 's') snake0.set_direction(2);
            else if(e.key === 'a') snake0.set_direction(3);
            else if(e.key === 'ArrowUp') snake1.set_direction(0);
            else if(e.key === 'ArrowRight') snake1.set_direction(1);
            else if(e.key === 'ArrowDown') snake1.set_direction(2);
            else if(e.key === 'ArrowLeft') snake1.set_direction(3);
        })

    }

    start() {
        for (let i = 0; i < 1000; i ++ ) //循环尝试1000次，一定能构造出彼此连通的带障碍物的图
            if (this.create_walls())
                break;
        this.add_listening_events();//创建地图成功后即开始
    }

    update_size() {
        //每一帧都对正方形的最大边长进行更新 this.parent.clientWidth是检查当前帧下画布的宽度，该函数是parent自带的
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {//判断两条蛇是否准备好了下一回合
        for(const snake of this.snakes) {
            if(snake.status !== "idle") return false;
            if(snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {//让两条蛇进入下一个状态
        for(const snake of this.snakes) {
            snake.next_step();
        }

    }

    check_valid(cell) {  // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {  // 当蛇尾会前进的时候，蛇尾不要判断
                k -- ;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }


    update() {
        this.update_size();
        if(this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {//对地图进行渲染，每一帧执行一次
        //canvas坐标系向右是x，向下是y，与常规刚好相反，所以进行画图时要注意行列，(r, c) 行/列 ---> canvas （c, r) 行/列
        const color_even = "#AAD751", color_odd = "#A2D149";//地图如果不是障碍物，就是一堆深浅相间的格子，设置深浅颜色
        for (let r = 0; r < this.rows; r ++ ) {//根据x+y的和 是奇数还是偶数来决定上什么色
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;//设置颜色
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);//绘画图形
            }
        }
    }
}
