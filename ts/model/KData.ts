class KData {
    openPrice: number;
    lowPrice: number;
    highPrice: number;
    closePrice: number;
    volume: number;
    timestamp: number;

    constructor(
        openPrice: number,
        lowPrice: number,
        highPrice: number,
        closePrice: number,
        volume: number,
        timestamp: number
    ) {
        this.openPrice = openPrice;
        this.lowPrice = lowPrice;
        this.highPrice = highPrice;
        this.closePrice = closePrice;
        this.volume = volume;
        this.timestamp = timestamp;
    }
}
