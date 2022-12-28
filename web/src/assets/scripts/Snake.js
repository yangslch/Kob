import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        //传入蛇的信息和地图
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;//拿到蛇的id和颜色，并且拿到地图的引用


        this.cells = [new Cell(info.r, info.c)];//存放蛇的身体，cell[0]存放蛇头
        this.next_cell = null;//下一步要走得位置

        this.speed = 5;// 蛇每秒走5个格子

        this.direction = -1;//蛇的下一步指令，-1表示没有指令，0，1，2，3表示上右下左
        this.status = "idle";//表示蛇的状态，分为3种， idle表示静止，move表示正在移动，die表示死亡

        this.dr = [-1, 0, 1, 0];//四个方向得偏移量
        this.dc = [0, 1, 0, -1];

        this.step = 0;//表示蛇的回合数

        this.eps = 1e-2; //允许的误差，当小于这个数时认为其移动是到达位置的

        this.eye_direction = 0;//蛇眼睛的方向
        if(this.id === 1) this.eye_direction = 2; // 左下角的蛇眼睛初始朝上，右上角的蛇眼睛初始朝下

        this.eye_dx = [
            //蛇眼睛不同方向x的偏移量
            [-1, 1],
            [1, 1],
            [-1, 1],
            [-1, -1]
        ];

        this.eye_dy = [
            //蛇眼睛纵方向的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [-1, 1]
        ]
    }

    start() {

    }

    set_direction(d) {//设置方向函数
        this.direction = d;
    }

    check_tail_increasing() 
    {
        //检测当前回合蛇的长度是否增加
        if(this.step <= 10) return true;
        if(this.step % 3 === 1) return true;    
        return false;
    }

    next_step() {//将蛇得状态更新为下一步得状态
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.eye_direction = d;//改变蛇眼睛的方向
        this.direction = -1;//清空操作
        this.status = "move";
        this.step ++ ;

        const k = this.cells.length;//创建新蛇头进行移动
        for(let i = k; i > 0; i -- ) {
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if (!this.gamemap.check_valid(this.next_cell)) {  // 下一步操作撞了，蛇瞬间去世
            this.status = "die";
        }


    }

    update_move() {
        //蛇的每一帧下的移动函数，只需要让蛇头进行移动即可
        
        const dx = this.next_cell.x - this.cells[0].x;//x 和 y轴上移动的偏移量
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if(distance < this.eps) {
            this.cells[0] = this.next_cell;//添加一个新蛇头
            this.next_cell = null;
            this.status = 'idle';//移动完成

            //走到目标点，但是蛇没有变长，则将蛇尾砍断
            if(!this.check_tail_increasing()) {
                this.cells.pop();
            }
            

        } else {
            //进行移动
            const move_distance = this.speed * this.timedelta / 1000; //算出蛇的每一帧移动的距离
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if(!this.check_tail_increasing()) {//没有走到目标点，这个部分有些疑问
                //人为定义的一些蛇的操作，刚开始10步蛇尾不增加，后面每2 或 3步蛇尾才进行增加
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }

        }


    }

    update() {
        this.render();
        if(this.status === 'move') {
            this.update_move();
        }
        
    }

    render() {
        const L = this.gamemap.L;//取出单元格长度
        const ctx = this.gamemap.ctx;//取出画布的引用，方便进行构造

        ctx.fillStyle = this.color;

        if (this.status === "die") {
            ctx.fillStyle = "white";
        }


        for(const cell of this.cells) {//将蛇的每一个cell都画出来
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();

        }

        for(let i = 1; i < this.cells.length; i ++ ) 
        {
            const a = this.cells[i - 1], b = this.cells[i];
            if(Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)//两个球重合
                continue;
            if(Math.abs(a.x - b.x) < this.eps) {//两个球处于竖直方向的相同，即x轴一样
                //起始左上角的位置， 
                //为了蛇的美观，将蛇的大小设置为整体单元格的80%，然后因为偏移量发生了变化，变为-0.4
                ctx.fillRect( (a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            }else {
                ctx.fillRect( Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
            
        }

        ctx.fillStyle = "black";
        for(let i = 0; i < 2; i ++ )
        {
            //得到蛇眼睛的坐标并且将其画出，i枚举的是左眼和右眼，偏移量相对于蛇头是0.25
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }
        
    }
}