"use strict";
class ChartView {
    set insets(value) {
        this._insets = value;
        this.compositionFactory.insets = value;
    }
    get insets() {
        return this._insets;
    }
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.xUnitOfInterval = 60;
        this.compositionFactory = new CompositionFactory();
        this.dividerDrawable = new DividerDrawable(this.xUnitOfInterval);
        this.rightYAxis = new YAxisDrawable();
        this.focusPoint = null;
        this._insets = new Rect(0, 0, 0, 0);
        canvas.listener = this;
        this.compositionFactory.canvasWidth = width;
        this.compositionFactory.canvasHeight = height;
    }
    addKLine(kData, barWidth, spacing) {
        var _a, _b;
        const origin = (_b = (_a = kData[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;
        const factory = new KLineFactory(kData, this.width, this.height, barWidth, spacing);
        factory.leftMargin = barWidth / 2;
        factory.xUnitOfInterval = xUnitOfInterval;
        this.compositionFactory.add(factory);
        this.compositionFactory.insets = this.insets;
        this.compositionFactory.canvasHeight = this.height;
        this.canvas.contentWidth = this.compositionFactory.getMaxWidth();
        this.dividerDrawable.origin = origin;
        this.dividerDrawable.pixelOfInterval = barWidth + spacing;
        this.dividerDrawable.leftMargin = barWidth / 2;
    }
    addMA(kData, barWidth, spacing, period, color) {
        var _a, _b;
        const origin = (_b = (_a = kData[0]) === null || _a === void 0 ? void 0 : _a.timestamp) !== null && _b !== void 0 ? _b : 0;
        const factory = new MAFactory(kData, this.width, period, barWidth + spacing);
        factory.leftMargin = barWidth / 2;
        factory.color = color;
        factory.xUnitOfInterval = xUnitOfInterval;
        this.compositionFactory.add(factory);
        this.compositionFactory.insets = this.insets;
        this.compositionFactory.canvasHeight = this.height;
        this.canvas.contentWidth = this.compositionFactory.getMaxWidth();
        this.dividerDrawable.origin = origin;
        this.dividerDrawable.pixelOfInterval = barWidth + spacing;
        this.dividerDrawable.leftMargin = barWidth / 2;
    }
    onScroll(canvas, offset) {
        this.compositionFactory.contentOffset = offset;
        this.refresh();
    }
    onFocus(canvas, point) {
        this.focusPoint = { x: point.x, y: point.y };
        this.rightYAxis.focusValues = null;
        const data = this.compositionFactory.getFocusData(point.x);
        if (data == null) {
            this.dividerDrawable.highlightValue = [];
            this.refresh();
            return;
        }
        const ys = data.map(element => {
            return element.y;
        });
        this.rightYAxis.focusValues = ys;
        this.dividerDrawable.highlightValue = [data[0]];
        this.refresh();
    }
    draw(canvas) {
        var _a, _b;
        const range = this.compositionFactory.getYRange();
        if (range == null)
            return;
        this.dividerDrawable.inset = this.insets;
        this.dividerDrawable.minY = range[0];
        this.dividerDrawable.maxY = range[1];
        this.dividerDrawable.draw(canvas);
        this.rightYAxis.topInset = this.insets.top;
        this.rightYAxis.bottomInset = this.insets.bottom;
        this.rightYAxis.partition = 4;
        this.rightYAxis.height = this.height;
        this.rightYAxis.setRange(canvas, range[0], range[1]);
        this.rightYAxis.draw(canvas);
        this.rightYAxis.drawFocus(canvas);
        (_a = this.compositionFactory.getDrawables(range[0], range[1])) === null || _a === void 0 ? void 0 : _a.forEach(element => {
            element.draw(canvas);
        });
        if (this.focusPoint) {
            (_b = this.compositionFactory.getFocusDrawables(this.focusPoint)) === null || _b === void 0 ? void 0 : _b.forEach(element => {
                element.draw(canvas);
            });
        }
    }
    refresh() {
        this.canvas.refresh();
    }
}
