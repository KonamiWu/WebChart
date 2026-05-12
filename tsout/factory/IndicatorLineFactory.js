"use strict";
class IndicatorLineFactory extends AbstractFactory {
    constructor(data, origin, canvasWidth, startColor, endColor) {
        super(data, origin, canvasWidth);
        this.data = data;
        this.lineWidth = 2;
        this.color = 'black';
        this.startColor = 'black';
        this.endColor = 'black';
        if (startColor && endColor) {
            this.startColor = startColor;
            this.endColor = endColor;
            this.drawGradient = true;
        }
        else {
            this.drawGradient = false;
        }
    }
    getDrawables(start, end) {
        if (!this.convertY)
            return null;
        const pathPoints = [];
        let gradientPathPoints = null;
        if (this.drawGradient) {
            gradientPathPoints = [];
        }
        for (let i = start; i <= end; i++) {
            const x = this.getX(i);
            const y = this.convertY(this.convertedData[i].y);
            pathPoints.push({ x: x, y: y });
            gradientPathPoints === null || gradientPathPoints === void 0 ? void 0 : gradientPathPoints.push({ x: x, y: y });
        }
        gradientPathPoints === null || gradientPathPoints === void 0 ? void 0 : gradientPathPoints.push({ x: this.getX(end), y: this.insets.bottom });
        gradientPathPoints === null || gradientPathPoints === void 0 ? void 0 : gradientPathPoints.push({ x: this.getX(start), y: this.insets.bottom });
        const pathDrawable = new PathDrawable(pathPoints, this.lineWidth, this.color);
        if (this.drawGradient) {
            const gradientDrawable = new GradientDrawable(gradientPathPoints !== null && gradientPathPoints !== void 0 ? gradientPathPoints : [], this.startColor, this.endColor);
            return [pathDrawable, gradientDrawable];
        }
        else {
            return [pathDrawable];
        }
    }
    getFocusDrawables(index) {
        if (this.convertedData.length === 0 || !this.convertY)
            return null;
        const x = this.getX(index);
        const y = this.convertY(this.convertedData[index].y);
        const point = { x, y };
        const drawable = new DotDrawable(point, this.color);
        return [drawable];
    }
    getValues(index) {
        if (index > 0 && index < this.convertedData.length)
            return [{ x: this.convertedData[index].x, y: this.convertedData[index].y }];
        else {
            return null;
        }
    }
    minValue(data) {
        return data.y;
    }
    maxValue(data) {
        return data.y;
    }
    getDataX(data) {
        return data.x;
    }
}
