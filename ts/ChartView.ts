class ChartView implements CanvasListener {
    xUnitOfInterval = 60

    private compositionFactory = new CompositionFactory()
    private dividerDrawable = new DividerDrawable(this.xUnitOfInterval)
    private rightYAxis = new YAxisDrawable()
    private focusPoint: {x: number, y: number} | null = null

    private _insets: Rect = new Rect(0, 0, 0, 0);
    set insets(value: Rect) {
        this._insets = value;
        this.compositionFactory.insets = value
    }
    get insets(): Rect {
        return this._insets;
    }

    constructor(private canvas: ICanvas, private width: number, private height: number) {
        canvas.listener = this
        this.compositionFactory.canvasWidth = width
        this.compositionFactory.canvasHeight = height
    }

    addKLine(kData: KData[], barWidth: number, spacing: number) {
        const origin = kData[0]?.timestamp ?? 0;
        const factory = new KLineFactory(kData, this.width, this.height, barWidth, spacing)
        factory.leftMargin = barWidth / 2
        factory.xUnitOfInterval = xUnitOfInterval
        
        this.compositionFactory.add(factory)
        this.compositionFactory.insets = this.insets
        this.compositionFactory.canvasHeight = this.height

        this.canvas.contentWidth = this.compositionFactory.getMaxWidth()

        this.dividerDrawable.origin = origin
        this.dividerDrawable.pixelOfInterval = barWidth + spacing
        this.dividerDrawable.leftMargin = barWidth / 2
    }

    addMA(kData: KData[], barWidth: number, spacing: number, period: number, color: string) {
        const origin = kData[0]?.timestamp ?? 0;
        const factory = new MAFactory(kData, this.width, period, barWidth + spacing)
        factory.leftMargin = barWidth / 2
        factory.color = color
        factory.xUnitOfInterval = xUnitOfInterval
        
        this.compositionFactory.add(factory)
        this.compositionFactory.insets = this.insets
        this.compositionFactory.canvasHeight = this.height

        this.canvas.contentWidth = this.compositionFactory.getMaxWidth()

        this.dividerDrawable.origin = origin
        this.dividerDrawable.pixelOfInterval = barWidth + spacing
        this.dividerDrawable.leftMargin = barWidth / 2
    }

    onScroll(canvas: ICanvas, offset: Point): void {
        this.compositionFactory.contentOffset = offset
        this.refresh()
    }

    onFocus(canvas: ICanvas, point: Point): void {
        this.focusPoint = {x: point.x, y: point.y}
        this.rightYAxis.focusValues = null
        const data = this.compositionFactory.getFocusData(point.x);
        if (data == null) {
            
            this.dividerDrawable.highlightValue = []
            this.refresh()
            return;
        }
        const ys = data.map(element => {
            return element.y
        })
        
        this.rightYAxis.focusValues = ys
        this.dividerDrawable.highlightValue = [data[0]]
        this.refresh()
    }

    draw(canvas: ICanvas): void {
        const range = this.compositionFactory.getYRange()
        if (range == null)
            return
        
        this.dividerDrawable.inset = this.insets
        this.dividerDrawable.minY = range[0]
        this.dividerDrawable.maxY = range[1]
        this.dividerDrawable.draw(canvas)

        this.rightYAxis.topInset = this.insets.top
        this.rightYAxis.bottomInset = this.insets.bottom
        this.rightYAxis.partition = 4
        this.rightYAxis.height = this.height
        this.rightYAxis.setRange(canvas, range[0], range[1])
        this.rightYAxis.draw(canvas)
        this.rightYAxis.drawFocus(canvas)
    
        this.compositionFactory.getDrawables(range[0], range[1])?.forEach(element => {
            element.draw(canvas)
        });

        if (this.focusPoint) {
            this.compositionFactory.getFocusDrawables(this.focusPoint)?.forEach(element => {
                element.draw(canvas)
            });
        }
    }

    refresh(): void {
        this.canvas.refresh()
    }

}