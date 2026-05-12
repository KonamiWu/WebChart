"use strict";
class GradientDrawable {
    constructor(points, startColor, endColor) {
        this.points = points;
        this.startColor = startColor;
        this.endColor = endColor;
    }
    draw(canvas) {
        canvas.drawGradient(this.points, this.startColor, this.endColor);
    }
}
