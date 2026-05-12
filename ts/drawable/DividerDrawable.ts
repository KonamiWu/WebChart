class DividerDrawable {
    xUnitOfInterval: number;
    minY: number = 0;
    maxY: number = 0;
    partition: number = 4;
    inset = new Rect(0, 0, 0, 0);
    leftMargin: number = 0;
    highlightRectInset: number = 0;
    textSize: number = 20;

    color: string = ChartColor.black3
    textColor: string = 'black'
    focusLineColor: string = 'black'
    highlightTextColor: string = 'white'
    highlightBackgroundColor: string = 'black';

    origin: number = 0;
    pixelOfInterval: number = 1;
    highlightValue: Array<{x: number, y: number}> | null = null;
    drawHighlightYLine: boolean = true;
    xAxisTextTopMargin: number = 0;

    private lineWidth: number = 1;
    private dateFormatter = new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' });
    private xTextTopMargin: number = 0;

    constructor(xUnitOfInterval: number) {
        this.xUnitOfInterval = xUnitOfInterval;
    }

    private get partitionHeight(): number {
        return this.maxY === this.minY ? this.maxY / this.partition : (this.maxY - this.minY) / this.partition;
    }

    draw(canvas: ICanvas): void {
        this.drawHorizontal(canvas);
        this.drawVertical(canvas);
        this.drawFocus(canvas);
    }

    private drawHorizontal(canvas: ICanvas): void {
        const minX = canvas.offset.x + this.inset.left;
        const maxX = canvas.offset.x + canvas.size.x - this.inset.right;
        const topY = canvas.size.y - this.inset.top;
        
        let yValue = this.minY;
        const heightPerPartition = (canvas.size.y - this.inset.top - this.inset.bottom) / this.partition;

        while (yValue < this.maxY) {
            const yPoint = ((yValue - this.minY) / this.partitionHeight * heightPerPartition + this.inset.bottom);
            if(yPoint > topY)
                break;
            canvas.drawLine({ x: minX, y: yPoint }, { x: maxX, y: yPoint }, this.lineWidth, this.color);
            yValue += (this.maxY - this.minY) / this.partition;
        }
        canvas.drawLine({ x: minX, y: this.inset.bottom }, { x: maxX, y: this.inset.bottom }, this.lineWidth, this.color);
        // canvas.drawLine({ x: minX, y: topY }, { x: maxX, y: topY }, this.lineWidth, this.color);
    }

    private drawVertical(canvas: ICanvas): void {
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

    private drawFocus(canvas: ICanvas): void {
        const heightPerPartition = (canvas.size.y - this.inset.bottom - this.inset.top) / this.partition;
        const minX = canvas.offset.x + this.inset.left;
        const maxX = canvas.offset.x + canvas.size.x - this.inset.right;

        this.highlightValue?.forEach(highlight => {
            if (this.drawHighlightYLine) {
                const yPoint = (highlight.y - this.minY) / this.partitionHeight * heightPerPartition + this.inset.bottom;
                canvas.drawLine({ x: minX, y: yPoint }, { x: maxX, y: yPoint }, this.lineWidth, this.focusLineColor);
            }
            this.drawXLine(canvas, highlight.x, this.focusLineColor);
            this.drawXText(canvas, highlight.x, true);
        });
    }

    private drawXLine(canvas: ICanvas, time: number, color: string): void {
        const x = this.convertX(canvas, time);
        canvas.drawLine({ x: x, y: this.inset.bottom }, { x: x, y: canvas.size.y - this.inset.top }, this.lineWidth, color);
    }

    private drawXText(canvas: ICanvas, time: number, highlight: boolean): void {
        const x = this.convertX(canvas, time);
        const text = this.dateFormatter.format(new Date(time * 1000));
        const textSize = this.textSize;
        const textColor = highlight ? this.highlightTextColor : this.textColor;
        const size = this.measureText(text, textSize)
        if (highlight) {
            const rectLeft = x - size.width / 2
            const rectTop = this.inset.bottom / 2 + size.height / 2 + this.xTextTopMargin
            const rectRight = rectLeft + size.width
            const rectBottom = rectTop - size.height
            const highlightRect = new Rect(rectLeft, rectTop, rectRight, rectBottom)
            canvas.drawRect(highlightRect, this.highlightBackgroundColor)
            canvas.drawText(text, { x: x, y: this.inset.bottom / 2 + this.xAxisTextTopMargin }, textSize, "bold", this.highlightTextColor);
        } else {
            canvas.drawText(text, { x: x, y: this.inset.bottom / 2 + this.xAxisTextTopMargin }, textSize, "bold", textColor);
        }
    }

    private convertX(canvas: ICanvas, time: number): number {
        const distance = (time - this.origin) / this.xUnitOfInterval * this.pixelOfInterval;
        return (distance + this.leftMargin) * canvas.scale + this.inset.left;
    }

    private measureUnit(minTimestamp: number, maxTimestamp: number): number {
        const preferredPartitionCount = 5;
        const partitionInterval = (maxTimestamp - minTimestamp) / preferredPartitionCount;
    
        if (partitionInterval < xUnitOfInterval) {
            return xUnitOfInterval;
        } else if (partitionInterval < xUnitOfInterval * 5) {
            return xUnitOfInterval * 5;
        } else if (partitionInterval < xUnitOfInterval * 10) {
            return xUnitOfInterval * 10;
        } else if (partitionInterval < xUnitOfInterval * 15) {
            return xUnitOfInterval * 15;
        } else if (partitionInterval < xUnitOfInterval * 30) {
            return xUnitOfInterval * 30;
        } else if (partitionInterval < xUnitOfInterval * 60) {
            return xUnitOfInterval * 60;
        } else if (partitionInterval < xUnitOfInterval * 60 * 12) {
            return xUnitOfInterval * 60 * 12;
        } else if (partitionInterval < xUnitOfInterval * 60 * 24) {
            return xUnitOfInterval * 60 * 24;
        } else if (partitionInterval < xUnitOfInterval * 60 * 24 * 3) {
            return xUnitOfInterval * 60 * 24 * 3;
        } else if (partitionInterval < xUnitOfInterval * 60 * 24 * 5) {
            return xUnitOfInterval * 60 * 24 * 5;
        } else if (partitionInterval < xUnitOfInterval * 60 * 24 * 15) {
            return xUnitOfInterval * 60 * 24 * 15;
        } else if (partitionInterval < xUnitOfInterval * 60 * 24 * 30) {
            return xUnitOfInterval * 60 * 24 * 30;
        } else {
            return xUnitOfInterval;
        }
    }

    private measureText(text: string, fontSize: number): { width: number, height: number } {
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