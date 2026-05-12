"use strict";
class CandleDrawable {
    constructor(openPrice, lowPrice, highPrice, closePrice, x, lineWidth, color // TypeScript中顏色通常用字符串表示，例如 "#FF0000"
    ) {
        this.openPrice = openPrice;
        this.lowPrice = lowPrice;
        this.highPrice = highPrice;
        this.closePrice = closePrice;
        this.x = x;
        this.lineWidth = lineWidth;
        this.color = color;
        this.centerWidth = 2;
    }
    draw(canvas) {
        // 計算矩形範圍
        const halfCenterWidth = this.centerWidth / 2;
        const halfLineWidth = this.lineWidth / 2;
        canvas.drawRect(new Rect(this.x - halfCenterWidth, this.lowPrice, this.x + halfCenterWidth, this.highPrice), this.color);
        canvas.drawRect(new Rect(this.x - halfLineWidth, this.openPrice, this.x + halfLineWidth, this.closePrice), this.color);
    }
}
