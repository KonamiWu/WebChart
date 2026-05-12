class GradientDrawable {
    constructor(
        private points: {x: number, y: number}[],
        private startColor: string,
        private endColor: string,
    ) {

    }

    draw(canvas: ICanvas): void {
       canvas.drawGradient(this.points, this.startColor, this.endColor)
    }
}
