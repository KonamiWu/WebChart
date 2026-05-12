"use strict";
class DotDrawable {
    constructor(point, color) {
        this.radius = 10;
        this.border = 4;
        this.borderColor = 'white';
        this.point = point;
        this.color = color;
    }
    draw(canvas) {
        canvas.drawCircle(this.point, this.radius + this.border, this.borderColor);
        canvas.drawCircle(this.point, this.radius, this.color);
    }
}
