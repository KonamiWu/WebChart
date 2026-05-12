abstract class IndicatorLineFactory<S extends any[]> extends AbstractFactory<S, { x: number, y: number }> {
    lineWidth: number = 2;
    color: string = 'black';
    
    private startColor: string = 'black';
    private endColor: string = 'black';
    private readonly drawGradient: boolean;
    
    constructor(protected data: S, origin: number, canvasWidth: number, startColor?: string, endColor?: string) {
        super(data, origin, canvasWidth);
        if (startColor && endColor) {
            this.startColor = startColor;
            this.endColor = endColor;
            this.drawGradient = true;
        } else {
            this.drawGradient = false;
        }
    }
    
    getDrawables(start: number, end: number): Drawable[] | null {
        if (!this.convertY) return null;

        const pathPoints: {x: number, y: number}[] = []
        let gradientPathPoints: {x: number, y: number}[] | null = null

        if (this.drawGradient) {
            gradientPathPoints = []
        }
        
        for (let i = start; i <= end; i++) {
            const x = this.getX(i);
            const y = this.convertY(this.convertedData[i].y);
            pathPoints.push({x: x, y: y})
            gradientPathPoints?.push({x: x, y: y})
        }

        gradientPathPoints?.push({x: this.getX(end), y: this.insets.bottom});
        gradientPathPoints?.push({x: this.getX(start), y: this.insets.bottom});
        const pathDrawable = new PathDrawable(pathPoints, this.lineWidth, this.color);
        if (this.drawGradient) {
            const gradientDrawable = new GradientDrawable(gradientPathPoints ?? [], this.startColor, this.endColor);
            return [pathDrawable, gradientDrawable];
        } else {
            return [pathDrawable];
        }
    }

    getFocusDrawables(index: number): Drawable[] | null {
        if (this.convertedData.length === 0 || !this.convertY) return null;
        
        const x = this.getX(index);
        const y = this.convertY(this.convertedData[index].y);
        const point = { x, y };
        
        const drawable = new DotDrawable(point, this.color);

        return [drawable];
    }
    
    getValues(index: number): { x: number, y: number }[] | null {
        if (index > 0 && index < this.convertedData.length)
            return [{ x: this.convertedData[index].x, y: this.convertedData[index].y }];
        else {
            return null
        }
    }

    minValue(data: { x: number, y: number }): number {
        return data.y;
    }

    maxValue(data: { x: number, y: number }): number {
        return data.y;
    }

    getDataX(data: { x: number, y: number }): number {
        return data.x;
    }
}
