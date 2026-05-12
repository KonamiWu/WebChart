abstract class AbstractFactory<InputType, ConvertedType> implements Factory {
    pixelOfInterval: number = 1;
    xUnitOfInterval: number = 60;
    leftMargin: number = 0;
    rightMargin: number = 0;
    insets: Rect = new Rect(0, 0, 0, 0);
    canvasHeight: number = 0;
    scale: number = 1;
    contentOffset: Point = { x: 0, y: 0 };
    protected convertY: ((value: number) => number) | null = null;
    convertedData: ConvertedType[] = [];

    constructor(
        private inputData: InputType,
        private origin: number,
        public canvasWidth: number
    ) {
        // this.convertedData = this.convert(inputData);
    }

    protected abstract minValue(data: ConvertedType): number;
    protected abstract maxValue(data: ConvertedType): number;
    protected abstract getDataX(data: ConvertedType): number;
    protected abstract convert(inputData: InputType): ConvertedType[];

    abstract getValues(index: number): Array<{x: number, y: number}> | null;
    abstract getDescriptionString(index: number): string | null;
    abstract getWidth(): number;
    abstract getDrawables(startIndex: number, endIndex: number): Drawable[] | null;
    abstract getFocusDrawables(index: number): Drawable[] | null;

    protected convertData(): void {
        this.convertedData = this.convert(this.inputData);
    }

    getIndexRange(): [number, number] | null {
        const firstMatchIndex = this.binarySearchWithInset();
        if (firstMatchIndex === null) return null;

        const leftEdge = this.contentOffset.x + this.insets.left;
        const rightEdge = this.contentOffset.x + this.canvasWidth - this.insets.right;

        let start = firstMatchIndex;
        while (start - 1 >= 0 && this.getX(start - 1) >= leftEdge) {
            start--;
        }
        let end = firstMatchIndex;
        while (end + 1 < this.convertedData.length && this.getX(end + 1) <= rightEdge) {
            end++;
        }

        // start = Math.max(start - 1, 0);
        // end = Math.min(end + 1, this.convertedData.length - 1);
        start = Math.max(start, 0);
        end = Math.min(end, this.convertedData.length - 1);

        return start <= end ? [start, end] : null;
    }

    getYRange(startIndex: number, endIndex: number): [number, number] | null {
        let hasMin = false;
        let hasMax = false;
        let minY = Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;

        for (let i = startIndex; i <= endIndex; i++) {
            const value = this.convertedData[i];
            if (minY > this.minValue(value)) {
                minY = this.minValue(value);
                hasMin = true;
            }

            if (maxY < this.maxValue(value)) {
                maxY = this.maxValue(value);
                hasMax = true;
            }
        }

        return hasMin && hasMax ? [minY, maxY] : null;
    }

    setConversionInfo(min: number, max: number): void {
        const ratio = min === max ? 1 : (this.canvasHeight - this.insets.bottom - this.insets.top) / Math.abs(max - min);
        const bottom = this.insets.bottom;
        this.convertY = (value: number) => (value - min) * ratio + bottom;
    }

    getFocusIndex(x: number): number | null {
        if (x > this.canvasWidth - this.insets.right || x < this.insets.left)
            return null
        const focusX = x + this.contentOffset.x;
        if (focusX < this.getX(0) || focusX > this.getX(this.convertedData.length - 1))
            return null
        let left = 0;
        let right = this.convertedData.length;
        while (left < right) {
            const middle = Math.floor((left + right) / 2);
            const midX = this.getX(middle);
            if (Math.abs(midX - focusX) < (this.pixelOfInterval * this.scale) / 2) {
                return middle;
            } else if (midX > focusX) {
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        }

        return left === right ? left : null;
    }

    getX(index: number): number {
        if (index >= this.convertedData.length) {
            return 0;
        }
        const distance = (this.getDataX(this.convertedData[index]) - this.origin) / this.xUnitOfInterval * this.pixelOfInterval;
        const x = (distance + this.leftMargin) * this.scale + this.insets.left;
        return x;
    }

    private binarySearchWithInset(): number | null {
        let left = 0;
        let right = this.convertedData.length;
        while (left < right) {
            const middle = Math.floor((left + right) / 2);
            const x = this.getX(middle);
            const leftEdge = this.contentOffset.x + this.insets.left;
            const rightEdge = this.contentOffset.x + this.canvasWidth - this.insets.right;
            if (x >= leftEdge && x <= rightEdge) {
                return middle;
            } else if (x > rightEdge) {
                right = middle - 1;
            } else {
                left = middle + 1;
            }
        }

        return left === right ? left : null;
    }
}