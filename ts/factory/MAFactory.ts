class MAFactory extends IndicatorLineFactory<KData[]> {
    private highlightTextSize: number = 14;
    private font: string = `font-family: monospace; font-size: ${this.highlightTextSize}px; font-weight: regular;`;

    constructor(kData: KData[], canvasWidth: number, private period: number, interval: number) {
        super(kData, kData.length > 0 ? kData[0].timestamp : 0, canvasWidth);
        this.convertData()
        this.pixelOfInterval = interval;
    }

    override getWidth(): number {
        return this.getX(this.data.length - 1) + this.insets.right;
    }

    override convert(data: KData[]): { x: number; y: number }[] {
        if (data.length < this.period) {
            return [];
        }

        let maValues: { x: number; y: number }[] = [];

        for (let i = this.period - 1; i < data.length; i++) {
            let sum: number = 0;
            for (let j = i - this.period + 1; j <= i; j++) {
                sum += data[j].closePrice;
            }

            // Calculate the moving average
            let ma = sum / this.period;

            maValues.push({ x: data[i].timestamp, y: ma });
        }

        return maValues;
    }

    override getDescriptionString(index: number): string | null {
        const value = this.data[index];
        const valueString = `MA${this.period}:${value.closePrice.toFixed(2)} `;
        return `<span style="${this.font}; color: ${this.color};">${valueString}</span>`;
    }
}