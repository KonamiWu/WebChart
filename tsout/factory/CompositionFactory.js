"use strict";
class CompositionFactory {
    constructor() {
        this.dateFormatter = new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.factories = [];
        this._canvasWidth = 0;
        this._scale = 1;
        this._insets = new Rect(0, 0, 0, 0);
        this._xUnitOfInterval = 1;
        this._pixelOfInterval = 1;
        this._canvasHeight = 0;
        this._contentOffset = { x: 0, y: 0 };
    }
    set canvasWidth(value) {
        this._canvasWidth = value;
        this.factories.forEach(f => f.canvasWidth = value);
    }
    get canvasWidth() {
        return this._canvasWidth;
    }
    set scale(value) {
        this._scale = value;
        this.factories.forEach(f => f.scale = value);
    }
    get scale() {
        return this._scale;
    }
    set insets(value) {
        this._insets = value;
        this.factories.forEach(f => f.insets = value);
    }
    get insets() {
        return this._insets;
    }
    set xUnitOfInterval(value) {
        this._xUnitOfInterval = value;
        this.factories.forEach(f => f.xUnitOfInterval = value);
    }
    get xUnitOfInterval() {
        return this._xUnitOfInterval;
    }
    set pixelOfInterval(value) {
        this._pixelOfInterval = value;
        this.factories.forEach(f => f.pixelOfInterval = value);
    }
    get pixelOfInterval() {
        return this._pixelOfInterval;
    }
    get canvasHeight() {
        return this.factories.length > 0 ? this.factories[0].canvasHeight : 0;
    }
    set canvasHeight(value) {
        this.factories.forEach(f => f.canvasHeight = value);
    }
    set contentOffset(value) {
        this._contentOffset = value;
        this.factories.forEach(f => f.contentOffset = value);
    }
    get contentOffset() {
        return this._contentOffset;
    }
    add(factory) {
        this.factories.push(factory);
    }
    remove(factory) {
        const index = this.factories.indexOf(factory);
        if (index > -1) {
            this.factories.splice(index, 1);
        }
    }
    getYRange() {
        if (this.factories.length === 0)
            return null;
        let minValue = Number.MAX_VALUE;
        let maxValue = -Number.MAX_VALUE;
        let hasResult = false;
        for (const factory of this.factories) {
            const indexRange = factory.getIndexRange();
            if (indexRange === null)
                continue;
            const yRange = factory.getYRange(indexRange[0], indexRange[1]);
            if (yRange === null)
                continue;
            hasResult = true;
            minValue = Math.min(minValue, yRange[0]);
            maxValue = Math.max(maxValue, yRange[1]);
        }
        return hasResult ? [minValue, maxValue] : null;
    }
    getDrawables(min, max) {
        const result = [];
        for (const factory of this.factories) {
            const indexRange = factory.getIndexRange();
            if (indexRange === null)
                continue;
            factory.setConversionInfo(min, max);
            const data = factory.getDrawables(indexRange[0], indexRange[1]);
            if (data === null)
                continue;
            result.push(...data);
        }
        return result.length > 0 ? result : null;
    }
    getFocusDrawables(point) {
        const result = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(point.x);
            if (index === null)
                continue;
            const drawables = factory.getFocusDrawables(index);
            if (drawables === null || drawables == undefined)
                continue;
            result.push(...drawables);
        }
        return result.length > 0 ? result : null;
    }
    getFocusData(x) {
        const result = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null || index == undefined)
                continue;
            const values = factory.getValues(index);
            if (values === null || values == undefined)
                continue;
            result.push(...values);
        }
        return result.length > 0 ? result : null;
    }
    getDescriptionString(x) {
        let result = '';
        let hasValue = false;
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null)
                continue;
            const string = factory.getDescriptionString(index);
            if (string === null)
                continue;
            hasValue = true;
            result += string;
        }
        return hasValue ? result : null;
    }
    getFocusDateString(x) {
        var _a;
        const result = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null)
                continue;
            const values = factory.getValues(index);
            if (values === null)
                continue;
            result.push(...values);
        }
        const timestamp = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.x;
        if (timestamp === undefined)
            return null;
        const date = new Date(timestamp);
        const dateString = this.dateFormatter.format(date);
        return dateString;
    }
    getMaxWidth() {
        let maxWidth = 0;
        this.factories.forEach(f => {
            const width = f.getWidth();
            if (maxWidth < width) {
                maxWidth = width;
            }
        });
        return maxWidth;
    }
}
