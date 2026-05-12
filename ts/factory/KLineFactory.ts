// import { ChartDrawable, CandleDrawable } from './chartDrawable'; // 需實現相應的 ChartDrawable 和 CandleDrawable 類
// import { KData } from './kData'; // 需實現 KData 類

class KLineFactory extends AbstractFactory<KData[], KData> {
    private kData: KData[];
    private barWidth: number;
    private positiveColor: string = "red";
    private negativeColor: string = "green";
    private highlightColor: string = "black";
    private highlightTextSize: number = 14;
    public infoTextSize: number = 1;
    public infoTextColor: string = "black";

    constructor(kData: KData[], canvasWidth: number, canvasHeight: number, barWidth: number, spacing: number) {
        super(kData, kData.length ? kData[0].timestamp : 0, canvasWidth);
        this.convertData()
        this.kData = kData;
        this.barWidth = barWidth;
        this.pixelOfInterval = barWidth + spacing;
    }

    convert(inputData: KData[]): KData[] {
        return inputData;
    }

    minValue(data: KData): number {
        return Math.min(data.openPrice, data.closePrice, data.highPrice, data.lowPrice);
    }

    maxValue(data: KData): number {
        return Math.max(data.openPrice, data.closePrice, data.highPrice, data.lowPrice);
    }

    getDataX(data: KData): number {
        return data.timestamp;
    }

    getValues(index: number): Array<{x: number, y: number}> | null {
        if (index < this.kData.length) {
            return [{x: this.kData[index].timestamp, y: this.kData[index].closePrice}];
        }
        return null;
    }

    getWidth(): number {
        return this.getX(this.kData.length - 1) + this.insets.right;
    }

    getDrawables(startIndex: number, endIndex: number): Drawable[] | null {
        if (!this.convertY) return null;
        const candles: Drawable[] = [];
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

    getFocusDrawables(index: number): Drawable[] | null {
        if (!this.convertY) return null;
        if (index < 0 || index >= this.kData.length - 1)
            return null
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

    getDescriptionString(index: number): string | null {
        if (index > this.kData.length) return null;

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