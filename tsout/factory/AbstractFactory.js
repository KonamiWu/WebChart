"use strict";
class AbstractFactory {
    constructor(inputData, origin, canvasWidth) {
        this.inputData = inputData;
        this.origin = origin;
        this.canvasWidth = canvasWidth;
        this.pixelOfInterval = 1;
        this.xUnitOfInterval = 60;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.insets = new Rect(0, 0, 0, 0);
        this.canvasHeight = 0;
        this.scale = 1;
        this.contentOffset = { x: 0, y: 0 };
        this.convertY = null;
        this.convertedData = [];
        // this.convertedData = this.convert(inputData);
    }
    convertData() {
        this.convertedData = this.convert(this.inputData);
    }
    getIndexRange() {
        const firstMatchIndex = this.binarySearchWithInset();
        if (firstMatchIndex === null)
            return null;
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
    getYRange(startIndex, endIndex) {
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
    setConversionInfo(min, max) {
        const ratio = min === max ? 1 : (this.canvasHeight - this.insets.bottom - this.insets.top) / Math.abs(max - min);
        const bottom = this.insets.bottom;
        this.convertY = (value) => (value - min) * ratio + bottom;
    }
    getFocusIndex(x) {
        if (x > this.canvasWidth - this.insets.right || x < this.insets.left)
            return null;
        const focusX = x + this.contentOffset.x;
        if (focusX < this.getX(0) || focusX > this.getX(this.convertedData.length - 1))
            return null;
        let left = 0;
        let right = this.convertedData.length;
        while (left < right) {
            const middle = Math.floor((left + right) / 2);
            const midX = this.getX(middle);
            if (Math.abs(midX - focusX) < (this.pixelOfInterval * this.scale) / 2) {
                return middle;
            }
            else if (midX > focusX) {
                right = middle - 1;
            }
            else {
                left = middle + 1;
            }
        }
        return left === right ? left : null;
    }
    getX(index) {
        if (index >= this.convertedData.length) {
            return 0;
        }
        const distance = (this.getDataX(this.convertedData[index]) - this.origin) / this.xUnitOfInterval * this.pixelOfInterval;
        const x = (distance + this.leftMargin) * this.scale + this.insets.left;
        return x;
    }
    binarySearchWithInset() {
        let left = 0;
        let right = this.convertedData.length;
        while (left < right) {
            const middle = Math.floor((left + right) / 2);
            const x = this.getX(middle);
            const leftEdge = this.contentOffset.x + this.insets.left;
            const rightEdge = this.contentOffset.x + this.canvasWidth - this.insets.right;
            if (x >= leftEdge && x <= rightEdge) {
                return middle;
            }
            else if (x > rightEdge) {
                right = middle - 1;
            }
            else {
                left = middle + 1;
            }
        }
        return left === right ? left : null;
    }
}
