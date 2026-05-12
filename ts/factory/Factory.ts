interface Factory {
    pixelOfInterval: number;
    xUnitOfInterval: number;
    canvasWidth: number;
    leftMargin: number;
    rightMargin: number;
    insets: Rect;
    canvasHeight: number;
    scale: number;
    contentOffset: Point;

    getIndexRange(): [number, number] | null;
    getYRange(startIndex: number, endIndex: number): [number, number] | null;
    setConversionInfo(min: number, max: number): void;
    getDrawables(startIndex: number, endIndex: number): Drawable[] | null;
    getFocusDrawables(index: number): Drawable[] | null;
    getFocusIndex(x: number): number | null;
    getValues(index: number): Array<{x: number, y: number}> | null;
    getDescriptionString(index: number): string | null;
    getWidth(): number;
}