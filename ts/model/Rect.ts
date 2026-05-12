class Rect {
    constructor(
        public left: number,
        public top: number,
        public right: number,
        public bottom: number
    ) {}

    // 計算矩形的寬度
    getWidth(): number {
        return this.right - this.left;
    }

    // 計算矩形的高度
    getHeight(): number {
        return this.bottom - this.top;
    }

    // 確定矩形是否包含某點
    contains(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }
}
