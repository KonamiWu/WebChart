"use strict";
class DividerDrawable {
    constructor(xUnitOfInterval) {
        this.minY = 0;
        this.maxY = 0;
        this.partition = 4;
        this.inset = new Rect(0, 0, 0, 0);
        this.leftMargin = 0;
        this.highlightRectInset = 0;
        this.textSize = 20;
        this.color = ChartColor.black3;
        this.textColor = 'black';
        this.focusLineColor = 'black';
        this.highlightTextColor = 'white';
        this.highlightBackgroundColor = 'black';
        this.origin = 0;
        this.pixelOfInterval = 1;
        this.highlightValue = null;
        this.drawHighlightYLine = true;
        this.xAxisTextTopMargin = 0;
        this.lineWidth = 1;
        this.dateFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' });
        this.xTextTopMargin = 0;
        this.xUnitOfInterval = xUnitOfInterval;
    }
    get partitionHeight() {
        return this.maxY === this.minY ? this.maxY / this.partition : (this.maxY - this.minY) / this.partition;
    }
    draw(canvas) {
        this.drawHorizontal(canvas);
        this.drawVertical(canvas);
        this.drawFocus(canvas);
    }
    drawHorizontal(canvas) {
        const minX = canvas.offset.x + this.inset.left;
        const maxX = canvas.offset.x + canvas.size.x - this.inset.right;
        const topY = canvas.size.y - this.inset.top;
        let yValue = this.minY;
        const heightPerPartition = (canvas.size.y - this.inset.top - this.inset.bottom) / this.partition;
        while (yValue < this.maxY) {
            const yPoint = ((yValue - this.minY) / this.partitionHeight * heightPerPartition + this.inset.bottom);
            if (yPoint > topY)
                break;
            canvas.drawLine({ x: minX, y: yPoint }, { x: maxX, y: yPoint }, this.lineWidth, this.color);
            yValue += (this.maxY - this.minY) / this.partition;
        }
        canvas.drawLine({ x: minX, y: this.inset.bottom }, { x: maxX, y: this.inset.bottom }, this.lineWidth, this.color);
        // canvas.drawLine({ x: minX, y: topY }, { x: maxX, y: topY }, this.lineWidth, this.color);
    }
    drawVertical(canvas) {
        const leftTimestamp = (canvas.offset.x / (this.pixelOfInterval * canvas.scale)) * this.xUnitOfInterval + this.origin;
        const diff = (canvas.size.x - this.leftMargin * canvas.scale - this.inset.left - this.inset.right) /
            (this.pixelOfInterval * canvas.scale) * this.xUnitOfInterval;
        const rightTimestamp = leftTimestamp + diff;
        const unit = this.measureUnit(leftTimestamp, rightTimestamp);
        let time = Math.floor(leftTimestamp / unit) * unit + unit;
        while (time < rightTimestamp) {
            this.drawXLine(canvas, time, this.color);
            this.drawXText(canvas, time, false);
            time += unit;
        }
        const leftX = canvas.offset.x + this.inset.left;
        canvas.drawLine({ x: leftX, y: this.inset.bottom }, { x: leftX, y: canvas.size.y - this.inset.top }, this.lineWidth, this.color);
        const maxX = canvas.offset.x + canvas.size.x - this.inset.right;
        canvas.drawLine({ x: maxX, y: this.inset.bottom }, { x: maxX, y: canvas.size.y - this.inset.top }, this.lineWidth, this.color);
    }
    drawFocus(canvas) {
        var _a;
        const heightPerPartition = (canvas.size.y - this.inset.bottom - this.inset.top) / this.partition;
        const minX = canvas.offset.x + this.inset.left;
        const maxX = canvas.offset.x + canvas.size.x - this.inset.right;
        (_a = this.highlightValue) === null || _a === void 0 ? void 0 : _a.forEach(highlight => {
            if (this.drawHighlightYLine) {
                const yPoint = (highlight.y - this.minY) / this.partitionHeight * heightPerPartition + this.inset.bottom;
                canvas.drawLine({ x: minX, y: yPoint }, { x: maxX, y: yPoint }, this.lineWidth, this.focusLineColor);
            }
            this.drawXLine(canvas, highlight.x, this.focusLineColor);
            this.drawXText(canvas, highlight.x, true);
        });
    }
    drawXLine(canvas, time, color) {
        const x = this.convertX(canvas, time);
        canvas.drawLine({ x: x, y: this.inset.bottom }, { x: x, y: canvas.size.y - this.inset.top }, this.lineWidth, color);
    }
    drawXText(canvas, time, highlight) {
        const x = this.convertX(canvas, time);
        const text = this.dateFormatter.format(new Date(time * 1000));
        const textSize = this.textSize;
        const textColor = highlight ? this.highlightTextColor : this.textColor;
        const size = this.measureText(text, textSize);
        if (highlight) {
            const rectLeft = x - size.width / 2;
            const rectTop = this.inset.bottom / 2 + size.height / 2 + this.xTextTopMargin;
            const rectRight = rectLeft + size.width;
            const rectBottom = rectTop - size.height;
            const highlightRect = new Rect(rectLeft, rectTop, rectRight, rectBottom);
            canvas.drawRect(highlightRect, this.highlightBackgroundColor);
            canvas.drawText(text, { x: x, y: this.inset.bottom / 2 + this.xAxisTextTopMargin }, textSize, "bold", this.highlightTextColor);
        }
        else {
            canvas.drawText(text, { x: x, y: this.inset.bottom / 2 + this.xAxisTextTopMargin }, textSize, "bold", textColor);
        }
    }
    convertX(canvas, time) {
        const distance = (time - this.origin) / this.xUnitOfInterval * this.pixelOfInterval;
        return (distance + this.leftMargin) * canvas.scale + this.inset.left;
    }
    measureUnit(minTimestamp, maxTimestamp) {
        const preferredPartitionCount = 5;
        const partitionInterval = (maxTimestamp - minTimestamp) / preferredPartitionCount;
        if (partitionInterval < xUnitOfInterval) {
            return xUnitOfInterval;
        }
        else if (partitionInterval < xUnitOfInterval * 5) {
            return xUnitOfInterval * 5;
        }
        else if (partitionInterval < xUnitOfInterval * 10) {
            return xUnitOfInterval * 10;
        }
        else if (partitionInterval < xUnitOfInterval * 15) {
            return xUnitOfInterval * 15;
        }
        else if (partitionInterval < xUnitOfInterval * 30) {
            return xUnitOfInterval * 30;
        }
        else if (partitionInterval < xUnitOfInterval * 60) {
            return xUnitOfInterval * 60;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 12) {
            return xUnitOfInterval * 60 * 12;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 24) {
            return xUnitOfInterval * 60 * 24;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 24 * 3) {
            return xUnitOfInterval * 60 * 24 * 3;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 24 * 5) {
            return xUnitOfInterval * 60 * 24 * 5;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 24 * 15) {
            return xUnitOfInterval * 60 * 24 * 15;
        }
        else if (partitionInterval < xUnitOfInterval * 60 * 24 * 30) {
            return xUnitOfInterval * 60 * 24 * 30;
        }
        else {
            return xUnitOfInterval;
        }
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
