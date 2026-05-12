"use strict";
class SimplePathFactory extends IndicatorLineFactory {
    constructor(data, origin, canvasWidth, color, startColor, endColor) {
        super(data, origin, canvasWidth, startColor, endColor);
        this.color = color;
        this.lineWidth = 2;
    }
    getPoint(data) {
        return data.map(point => ({ x: point.x, y: point.y }));
    }
    getWidth() {
        return this.getX(this.data.length - 1) + this.insets.right;
    }
}
