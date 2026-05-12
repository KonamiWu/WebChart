class YAxisDrawable {
    textSize: number = 20;
    side: 'left' | 'right' = 'right';
    partition: number = 4;
    topInset: number = 0;
    bottomInset: number = 0;
    focusValues?: number[] | null;
    showZero: boolean = true;
    height: number = 0;
    // rightMargin: number = 2;
    // leftMargin: number = 2;
    partitionStrategy?: any;

    private minY: number = 0;
    private maxY: number = 0;
    private unit: number = 0;
    private heightPerUnit: number = 0;

    private textColor: string = 'black';
    private highlightTextColor: string = 'white';
    private highlightBackgroundColor: string = 'black';
    private requiredWidth = 0
    
    draw(canvas: ICanvas): void {
        let y = this.minY;
        let yHeight = this.convertToPixel(canvas, y)
        while (this.convertToPixel(canvas, y) <= (this.height - this.topInset)) {
            this.drawText(canvas, y, this.textColor, false);
            y += this.unit
        }
    }

    drawFocus(canvas: ICanvas): void {
        if (this.focusValues) {
            this.focusValues.forEach(value => {
                this.drawText(canvas, value, this.highlightTextColor, true);
            });
        }
    }

    setRange(canvas: ICanvas, min: number, max: number): void {
        this.minY = min;
        this.maxY = max;

        this.unit = this.maxY === this.minY ? this.maxY / this.partition : (this.maxY - this.minY) / this.partition;
        let y = this.minY;
        this.heightPerUnit = (this.height - this.topInset - this.bottomInset) / this.partition;
        this.requiredWidth = 0
        while (this.convertToPixel(canvas, y) <= (this.height - this.topInset)) {
            const width = this.measureText(this.formatYString(y), this.textSize).width;
            this.requiredWidth = Math.max(this.requiredWidth, width)
            this.measureText(this.formatYString(y), this.textSize).width;
            y += this.unit
        }
    }
    
    private convertToPixel(canvas: ICanvas, y: number): number {
        // return canvas.size.y - ((y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset);
        return ((y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset);
    }

    private drawText(canvas: ICanvas, y: number, textColor: string, highlight: boolean): void {
        // const yHeight = (y - this.minY) / this.unit * this.heightPerUnit + this.bottomInset;
        const yHeight = this.convertToPixel(canvas, y)
        const string = this.formatYString(y);
        const textRect = this.measureText(string, this.textSize);

        switch (this.side) {
            case 'left':
                if (highlight) {
                    const highlightRectX = canvas.offset.x - textRect.width;
                    const highlightRect = new Rect(
                        highlightRectX,
                        yHeight - textRect.height / 2,
                        highlightRectX + textRect.width,
                        yHeight - textRect.height / 2 + textRect.height
                    );
                    canvas.drawRect(highlightRect, this.highlightBackgroundColor);
                }
                canvas.drawText(string, { x: canvas.offset.x - textRect.width / 2, y: yHeight }, this.textSize, 'normal', textColor);
                break;
            case 'right':
                const alignX = canvas.offset.x + canvas.size.x - this.requiredWidth - textRect.width / 2;
                const x = alignX + textRect.width;
                if (highlight) {
                    const highlightRect = new Rect(
                        x - textRect.width / 2,
                        yHeight - textRect.height / 2,
                        textRect.width + x - textRect.width / 2,
                        textRect.height + yHeight - textRect.height / 2
                    );
                    canvas.drawRect(highlightRect, this.highlightBackgroundColor);
                }
                canvas.drawText(string, { x: x, y: yHeight }, this.textSize, 'normal', textColor);
                break;
        }
    }

    private formatYString(y: number): string {
        if (y === 0 && !this.showZero) {
            return '';
        }

        return y - Math.floor(y) === 0 ? String(Math.floor(y)) : (y === 0 ? '' : y.toFixed(2));
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