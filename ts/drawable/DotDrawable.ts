class DotDrawable {
    private point: { x: number; y: number };
    private color: string;
    private radius: number = 10;
    private border: number = 4;
    private borderColor: string = 'white';

    constructor(point: { x: number; y: number }, color: string) {
        this.point = point;
        this.color = color;
    }

    draw(canvas: ICanvas): void {
        canvas.drawCircle(this.point, this.radius + this.border, this.borderColor)
        canvas.drawCircle(this.point, this.radius, this.color)
    }
}