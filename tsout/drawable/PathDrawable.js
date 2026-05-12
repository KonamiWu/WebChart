"use strict";
class PathDrawable {
    constructor(points, lineWidth, color) {
        this.points = points;
        this.lineWidth = lineWidth;
        this.color = color;
    }
    draw(canvas) {
        canvas.drawPath(this.points, this.lineWidth, this.color);
    }
}
