"use strict";
class YAxisDrawable {
    constructor() {
        this.textSize = 20;
        this.side = 'right';
        this.partition = 4;
        this.topInset = 0;
        this.bottomInset = 0;
        this.showZero = true;
        this.height = 0;
        this.minY = 0;
        this.maxY = 0;
        this.unit = 0;
        this.heightPerUnit = 0;
        this.textColor = 'black';
        this.highlightTextColor = 'white';
        this.highlightBackgroundColor = 'black';
        this.requiredWidth = 0;
    }
    draw(canvas) {
        let y = this.minY;
        let yHeight = this.convertToPixel(canvas, y);
        while (this.convertToPixel(canvas, y) <= (this.height - this.topInset)) {
            this.drawText(canvas, y, this.textColor, false);
            y += this.unit;
        }
    }
    drawFocus(canvas) {
        if (this.focusValues) {
            this.focusValues.forEach(value => {
                this.drawText(canvas, value, this.highlightTextColor, true);
            });
        }
    }
    setRange(canvas, min, max) {
        this.minY = min;
        this.maxY = max;
        this.unit = this.maxY === this.minY ? this.maxY / this.partition : (this.maxY - this.minY) / this.partition;
        let y = this.minY;
        this.heightPerUnit = (this.height - this.topInset - this.bottomInset) / this.partition;
        this.requiredWidth = 0;
        while (this.convertToPixel(canvas, y) <= (this.height - this.topInset)) {
            const width = this.measureText(this.formatYString(y), this.textSize).width;
            this.requiredWidth = Math.max(this.requiredWidth, width);
            this.measureText(this.formatYString(y), this.textSize).width;
            y += this.unit;
        }
    }
    convertToPixel(canvas, y) {
        // return canvas.size.y - ((y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset);
        return ((y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset);
    }
    drawText(canvas, y, textColor, highlight) {
        // const yHeight = (y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset;
        const yHeight = this.convertToPixel(canvas, y);
        const string = this.formatYString(y);
        const textRect = this.measureText(string, this.textSize);
        switch (this.side) {
            case 'left':
                if (highlight) {
                    const highlightRectX = canvas.offset.x - textRect.width;
                    const highlightRect = new Rect(highlightRectX, yHeight - textRect.height / 2, highlightRectX + textRect.width, yHeight - textRect.height / 2 + textRect.height);
                    canvas.drawRect(highlightRect, this.highlightBackgroundColor);
                }
                canvas.drawText(string, { x: canvas.offset.x - textRect.width / 2, y: yHeight }, this.textSize, 'normal', textColor);
                break;
            case 'right':
                const alignX = canvas.offset.x + canvas.size.x - this.requiredWidth - textRect.width / 2;
                const x = alignX + textRect.width;
                if (highlight) {
                    const highlightRect = new Rect(x - textRect.width / 2, yHeight - textRect.height / 2, textRect.width + x - textRect.width / 2, textRect.height + yHeight - textRect.height / 2);
                    canvas.drawRect(highlightRect, this.highlightBackgroundColor);
                }
                canvas.drawText(string, { x: x, y: yHeight }, this.textSize, 'normal', textColor);
                break;
        }
    }
    formatYString(y) {
        if (y === 0 && !this.showZero) {
            return '';
        }
        return y - Math.floor(y) === 0 ? String(Math.floor(y)) : (y === 0 ? '' : y.toFixed(2));
    }
    measureText(text, fontSize) {
        // Create a temporary canvas to measure text dimensions
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = `${fontSize}px monospace`;
            const metrics = context.measureText(text);
            return { width: metrics.width, height: fontSize };
        }
        return { width: 0, height: 0 };
    }
}
