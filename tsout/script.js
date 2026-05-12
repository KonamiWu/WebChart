"use strict";
const filePath = './line_data.csv';
// 設置 Canvas 和上下文
const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// 設置 Canvas 大小
const canvasWidth = 800;
const canvasHeight = 400;
const ratio = window.devicePixelRatio || 1;
// 設置 Canvas 實際尺寸
canvas.width = canvasWidth * ratio;
canvas.height = canvasHeight * ratio;
// 設置 CSS 尺寸
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;
const xUnitOfInterval = 60;
const topPadding = 0 * ratio;
const bottomPadding = 20 * ratio;
const rightPadding = 40 * ratio;
// for kline
const barWidth = 10 * ratio;
const spacing = 5 * ratio;
var chartView;
fetch(filePath)
    .then(response => response.text())
    .then(data => {
    const kData = parseCSV(data);
    const htmlCanvas = new HTMLCanvas(canvas, canvasWidth * ratio, canvasHeight * ratio, ratio);
    chartView = new ChartView(htmlCanvas, canvasWidth * ratio, canvasHeight * ratio);
    chartView.insets = new Rect(0, topPadding, rightPadding, bottomPadding);
    chartView.addKLine(kData, barWidth, spacing);
    chartView.addMA(kData, barWidth, spacing, 5, 'red');
    chartView.addMA(kData, barWidth, spacing, 10, 'blue');
    chartView.addMA(kData, barWidth, spacing, 30, 'green');
    chartView.addMA(kData, barWidth, spacing, 60, 'purple');
    chartView.addMA(kData, barWidth, spacing, 120, 'orange');
    chartView.addMA(kData, barWidth, spacing, 240, 'black');
    chartView.refresh();
})
    .catch(error => console.error('Error fetching the CSV file:', error));
function parseCSV(text) {
    const result = [];
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') {
            return;
        }
        const component = line.split(',');
        const open = parseFloat(component[1]);
        const high = parseFloat(component[2]);
        const low = parseFloat(component[3]);
        const close = parseFloat(component[4]);
        const volume = parseFloat(component[5]);
        const dataString = component[0];
        const timestamp = new Date(dataString).getTime() / 1000; // 假設 dataString 是一個可被 Date 解析的格式
        result.push(new KData(open, low, high, close, volume, timestamp));
    });
    return result;
}
