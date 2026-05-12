"use strict";
// import { ChartDrawable, CandleDrawable } from './chartDrawable'; // 需實現相應的 ChartDrawable 和 CandleDrawable 類
// import { KData } from './kData'; // 需實現 KData 類
class KLineFactory extends AbstractFactory {
    constructor(kData, canvasWidth, canvasHeight, barWidth, spacing) {
        super(kData, kData.length ? kData[0].timestamp : 0, canvasWidth);
        this.positiveColor = "red";
        this.negativeColor = "green";
        this.highlightColor = "black";
        this.highlightTextSize = 14;
        this.infoTextSize = 1;
        this.infoTextColor = "black";
        this.convertData();
        this.kData = kData;
        this.barWidth = barWidth;
        this.pixelOfInterval = barWidth + spacing;
    }
    convert(inputData) {
        return inputData;
    }
    minValue(data) {
        return Math.min(data.openPrice, data.closePrice, data.highPrice, data.lowPrice);
    }
    maxValue(data) {
        return Math.max(data.openPrice, data.closePrice, data.highPrice, data.lowPrice);
    }
    getDataX(data) {
        return data.timestamp;
    }
    getValues(index) {
        if (index < this.kData.length) {
            return [{ x: this.kData[index].timestamp, y: this.kData[index].closePrice }];
        }
        return null;
    }
    getWidth() {
        return this.getX(this.kData.length - 1) + this.insets.right;
    }
    getDrawables(startIndex, endIndex) {
        if (!this.convertY)
            return null;
        const candles = [];
        for (let i = startIndex; i <= endIndex; i++) {
            const data = this.kData[i];
            const color = data.closePrice >= data.openPrice ? this.positiveColor : this.negativeColor;
            const open = this.convertY(data.openPrice);
            const close = this.convertY(data.closePrice);
            const low = this.convertY(data.lowPrice);
            const high = this.convertY(data.highPrice);
            const x = this.getX(i);
            const candle = new CandleDrawable(open, low, high, close, x, this.barWidth * this.scale, color);
            candles.push(candle);
        }
        return candles;
    }
    getFocusDrawables(index) {
        if (!this.convertY)
            return null;
        if (index < 0 || index >= this.kData.length - 1)
            return null;
        const focus = this.kData[index];
        const color = focus.closePrice >= focus.openPrice ? this.positiveColor : this.negativeColor;
        const open = this.convertY(focus.openPrice);
        const close = this.convertY(focus.closePrice);
        const low = this.convertY(focus.lowPrice);
        const high = this.convertY(focus.highPrice);
        const x = this.getX(index);
        const candle = new CandleDrawable(open, low, high, close, x, this.barWidth * this.scale, color);
        return [candle];
    }
    getDescriptionString(index) {
        if (index > this.kData.length)
            return null;
        const value = this.kData[index];
        const openTitle = `開: `;
        const highTitle = `高: `;
        const lowTitle = `低: `;
        const closeTitle = `收: `;
        const volumeTitle = `量: `;
        const color = value.closePrice >= value.openPrice ? this.positiveColor : this.negativeColor;
        const openValue = `${value.openPrice.toFixed(2)}`;
        const highValue = `${value.highPrice.toFixed(2)}`;
        const lowValue = `${value.lowPrice.toFixed(2)}`;
        const closeValue = `${value.closePrice.toFixed(2)}`;
        const volumeValue = `${value.volume.toFixed(2)}`;
        return `${openTitle}${openValue} ${highTitle}${highValue} ${lowTitle}${lowValue} ${closeTitle}${closeValue} ${volumeTitle}${volumeValue}`;
    }
}
