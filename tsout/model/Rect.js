"use strict";
class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    // 計算矩形的寬度
    getWidth() {
        return this.right - this.left;
    }
    // 計算矩形的高度
    getHeight() {
        return this.bottom - this.top;
    }
    // 確定矩形是否包含某點
    contains(x, y) {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }
}
