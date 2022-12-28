const AC_GAME_OBJECTS = [];//全局变量，用于存储所有的游戏对象，即渲染出来的都是对象，要继承该类

export class AcGameObject {//将Ac类向外导出，将该类视为一个基类，constructor构造函数对使用的值进行赋初值
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0;//这一帧与上一帧之间的时间间隔
        this.has_called_start = false;//start函数是否执行过
    }

    start() {  // 只执行一次
    }

    update() {  // 每一帧执行一次，除了第一帧之外

    }

    on_destroy() {  // 删除之前执行

    }

    destroy() {
        this.on_destroy();

        //删除函数，即删除这个对象，从数组中取出要删除的对象，删除掉即可
        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj === this) {
                AC_GAME_OBJECTS.splice(i);//js从数组中删除元素
                break;
            }
        }
    }
}

let last_timestamp;  // 上一次执行的时刻
//该函数的结果是保证了每一个AcGameObject对象都执行了一次start函数，如果执行过start函数，即执行update函数

const step = timestamp => {//传递一个参数，即当前执行的时刻， =》{} 是js的匿名函数的写法
    for (let obj of AC_GAME_OBJECTS) {//js中of遍历的数组中的值，in遍历数组的下标
        if (!obj.has_called_start) {//当前对象是否执行过start函数
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;//得出时间间隔
            obj.update();
        }
    }

    last_timestamp = timestamp;//更新上一次执行的时刻，准备进入下一次执行，通过递归，
    requestAnimationFrame(step)//使得不断的在下一帧游览器刷新之前执行step函数
}

requestAnimationFrame(step)//该函数用于在下一帧游览器刷新之前先调用传递的函数
