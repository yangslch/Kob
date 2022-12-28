import { AcGameObject } from "./AcGameObject";
//障碍物组件，用于动态画墙
export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {//墙的横纵坐标 + 地图对象
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }

    update() {
        this.render();
    }

    render() {//本项目的render函数即渲染函数
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}
