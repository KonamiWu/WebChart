"use strict";
class MAFactory extends IndicatorLineFactory {
    constructor(kData, canvasWidth, period, interval) {
        super(kData, kData.length > 0 ? kData[0].timestamp : 0, canvasWidth);
        this.period = period;
        this.highlightTextSize = 14;
        this.font = `font-family: monospace; font-size: ${this.highlightTextSize}px; font-weight: regular;`;
        this.convertData();
        this.pixelOfInterval = interval;
    }
    getWidth() {
        return this.getX(this.data.length - 1) + this.insets.right;
    }
    convert(data) {
        if (data.length < this.period) {
            return [];
        }
        let maValues = [];
        for (let i = this.period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = i - this.period + 1; j <= i; j++) {
                sum += data[j].closePrice;
            }
            // Calculate the moving average
            let ma = sum / this.period;
            maValues.push({ x: data[i].timestamp, y: ma });
        }
        return maValues;
    }
    getDescriptionString(index) {
        const value = this.data[index];
        const valueString = `MA${this.period}:${value.closePrice.toFixed(2)} `;
        return `<span style="${this.font}; color: ${this.color};">${valueString}</span>`;
    }
}
