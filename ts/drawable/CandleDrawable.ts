class CandleDrawable implements Drawable {
    private readonly centerWidth: number = 2;
    
    constructor(
        private readonly openPrice: number,
        private readonly lowPrice: number,
        private readonly highPrice: number,
        private readonly closePrice: number,
        private readonly x: number,
        private readonly lineWidth: number,
        private readonly color: string // TypeScript中顏色通常用字符串表示，例如 "#FF0000"
    ) {}

    draw(canvas: ICanvas): void {
        // 計算矩形範圍
        const halfCenterWidth = this.centerWidth / 2;
        const halfLineWidth = this.lineWidth / 2;
        canvas.drawRect(new Rect(this.x - halfCenterWidth, this.lowPrice, this.x + halfCenterWidth, this.highPrice), this.color);
        canvas.drawRect(new Rect(this.x - halfLineWidth, this.openPrice, this.x + halfLineWidth, this.closePrice), this.color);
    }
}