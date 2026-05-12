interface CanvasListener {
    onScroll(canvas: ICanvas, offset: Point): void
    onFocus(canvas: ICanvas, point: Point): void
    // onScale(canvas: ICanvas, scale: Float, offset: PointF)
    draw(canvas: ICanvas): void
}