interface ICanvas {

    listener?: CanvasListener;
    scale: number;
    offset: Point;
    readonly size: Point;
    contentWidth: number;

    drawText(text: string, center: Point, textSize: number, weight: 'normal' | 'bold', color: string): void
    drawLine(startPoint: Point, endPoint: Point, lineWidth: number, color: string): void;
    drawPath(points: {x: number, y: number}[], lineWidth: number, color: string): void;
    drawCircle(point: { x: number; y: number }, radius: number, color: string): void 
    drawGradient(points: {x: number, y: number}[], startColor: string, endColor: string): void;
    drawRect(rect: Rect, color: string): void;
    refresh(): void;
}