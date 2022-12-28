export class Cell {
    constructor(r, c)
    {
        this.r = r;
        this.c = c;
        this.x = c + 0.5;
        this.y = r + 0.5;//将canvas的坐标转换为画布上的坐标轴，另外由于画的是圆，所以需要将其进行转换
    }
}
