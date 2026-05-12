class CompositionFactory {
    private dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    private factories: Factory[] = [];

    private _canvasWidth: number = 0;
    set canvasWidth(value: number) {
        this._canvasWidth = value;
        this.factories.forEach(f => f.canvasWidth = value);
    }
    get canvasWidth(): number {
        return this._canvasWidth;
    }

    private _scale: number = 1;
    set scale(value: number) {
        this._scale = value;
        this.factories.forEach(f => f.scale = value);
    }
    get scale(): number {
        return this._scale;
    }

    private _insets: Rect = new Rect(0, 0, 0, 0);
    set insets(value: Rect) {
        this._insets = value;
        this.factories.forEach(f => f.insets = value);
    }
    get insets(): Rect {
        return this._insets;
    }

    private _xUnitOfInterval: number = 1;
    set xUnitOfInterval(value: number) {
        this._xUnitOfInterval = value;
        this.factories.forEach(f => f.xUnitOfInterval = value);
    }
    get xUnitOfInterval(): number {
        return this._xUnitOfInterval;
    }

    private _pixelOfInterval: number = 1;
    set pixelOfInterval(value: number) {
        this._pixelOfInterval = value;
        this.factories.forEach(f => f.pixelOfInterval = value);
    }
    get pixelOfInterval(): number {
        return this._pixelOfInterval;
    }

    private _canvasHeight: number = 0;
    get canvasHeight(): number {
        return this.factories.length > 0 ? this.factories[0].canvasHeight : 0;
    }
    set canvasHeight(value: number) {
        this.factories.forEach(f => f.canvasHeight = value);
    }

    private _contentOffset: Point = { x: 0, y: 0 };
    set contentOffset(value: Point) {
        this._contentOffset = value;
        this.factories.forEach(f => f.contentOffset = value);
    }
    get contentOffset(): Point {
        return this._contentOffset;
    }

    add(factory: Factory) {
        this.factories.push(factory);
    }

    remove(factory: Factory) {
        const index = this.factories.indexOf(factory);
        if (index > -1) {
            this.factories.splice(index, 1);
        }
    }

    getYRange(): [number, number] | null {
        if (this.factories.length === 0) return null;

        let minValue = Number.MAX_VALUE;
        let maxValue = -Number.MAX_VALUE;
        let hasResult = false;

        for (const factory of this.factories) {
            const indexRange = factory.getIndexRange();
            if (indexRange === null) continue;

            const yRange = factory.getYRange(indexRange[0], indexRange[1]);
            if (yRange === null) continue;

            hasResult = true;
            minValue = Math.min(minValue, yRange[0]);
            maxValue = Math.max(maxValue, yRange[1]);
        }

        return hasResult ? [minValue, maxValue] : null;
    }

    getDrawables(min: number, max: number): Drawable[] | null {
        const result: Drawable[] = [];
        for (const factory of this.factories) {
            const indexRange = factory.getIndexRange();
            if (indexRange === null) continue;

            factory.setConversionInfo(min, max);
            const data = factory.getDrawables(indexRange[0], indexRange[1]);
            if (data === null) continue;

            result.push(...data);
        }
        return result.length > 0 ? result : null;
    }

    getFocusDrawables(point: Point): Drawable[] | null {
        const result: Drawable[] = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(point.x);
            if (index === null) continue;

            const drawables = factory.getFocusDrawables(index);
            if (drawables === null || drawables == undefined) continue;

            result.push(...drawables);
        }
        return result.length > 0 ? result : null;
    }

    getFocusData(x: number): {x: number, y: number}[] | null {
        const result: {x: number, y: number}[] = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null || index == undefined) continue;
            
            const values = factory.getValues(index);
            if (values === null || values == undefined) continue;

            result.push(...values);
        }
        
        return result.length > 0 ? result : null;
    }

    getDescriptionString(x: number): string | null {
        let result = '';
        let hasValue = false;
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null) continue;

            const string = factory.getDescriptionString(index);
            if (string === null) continue;

            hasValue = true;
            result += string;
        }
        return hasValue ? result : null;
    }

    getFocusDateString(x: number): string | null {
        const result: {x: number, y: number}[] = [];
        for (const factory of this.factories) {
            const index = factory.getFocusIndex(x);
            if (index === null) continue;

            const values = factory.getValues(index);
            if (values === null) continue;

            result.push(...values);
        }

        const timestamp = result[0]?.x;
        if (timestamp === undefined) return null;

        const date = new Date(timestamp);
        const dateString = this.dateFormatter.format(date);

        return dateString;
    }

    getMaxWidth(): number {
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