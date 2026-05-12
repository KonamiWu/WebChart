class PathDrawable {
    constructor(
        private points: {x: number, y: number}[],
        private lineWidth: number,
        private color: string,
    ) {

    }

    draw(canvas: ICanvas): void {
       canvas.drawPath(this.points, this.lineWidth, this.color)
    }
}
