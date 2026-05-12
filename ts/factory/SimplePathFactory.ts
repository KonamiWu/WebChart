abstract class SimplePathFactory extends IndicatorLineFactory<{ x: number, y: number }[]> {
    constructor(data: { x: number, y: number }[], origin: number, canvasWidth: number, color: string, startColor?: string, endColor?: string) {
        super(data, origin, canvasWidth, startColor, endColor);
        this.color = color;
        this.lineWidth = 2;
    }

    getPoint(data: Point[]): Point[] {
        return data.map(point => ({ x: point.x, y: point.y }));
    }

    getWidth(): number {
        return this.getX(this.data.length - 1) + this.insets.right;
    }
}