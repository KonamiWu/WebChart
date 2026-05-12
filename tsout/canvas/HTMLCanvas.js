"use strict";
class HTMLCanvas {
    get size() {
        return new Point(this.width, this.height);
    }
    constructor(canvas, width, height, deviceRatio) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.deviceRatio = deviceRatio;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.contentWidth = 0;
        this.targetX = 0;
        this.isUpdating = false;
        this.focusPoint = new Point(0, 0);
        this.isScrolling = null;
        this.isDragging = false;
        this.totalDistance = new Point(0, 0);
        this.previousPoint = new Point(0, 0);
        this.lastMoveTime = null;
        this.totalTime = 0;
        this.context = canvas.getContext('2d');
        if (this.context == null)
            return;
        this.context.imageSmoothingEnabled = true;
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (this.isScrolling !== null) {
                clearTimeout(this.isScrolling);
            }
            this.targetX += event.deltaY * deviceRatio;
            if (this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width;
            }
            if (this.targetX <= 0) {
                this.targetX = 0;
            }
            this.refresh();
            this.isScrolling = window.setTimeout(() => {
                this.targetX = this.offset.x;
                this.refresh();
            }, 100);
        });
        canvas.addEventListener('mousedown', (event) => {
            this.isDragging = true;
            this.lastMoveTime = Date.now();
            this.totalTime = 0;
            this.totalDistance = new Point(0, 0);
            this.previousPoint.x = event.offsetX;
            this.previousPoint.y = event.offsetY;
            this.targetX = this.offset.x;
            this.refresh();
        });
        canvas.addEventListener('mousemove', (event) => {
            this.focusPoint.x = event.clientX;
            this.focusPoint.y = event.clientY;
            if (this.isDragging && this.lastMoveTime) {
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.lastMoveTime) / 1000;
                const dx = event.offsetX - this.previousPoint.x;
                this.totalDistance.x -= dx * deviceRatio;
                this.totalTime += deltaTime;
                this.previousPoint = new Point(event.offsetX, event.offsetY);
                this.lastMoveTime = currentTime;
                this.targetX -= dx * deviceRatio;
                if (this.targetX > this.contentWidth - width) {
                    this.targetX = this.contentWidth - width;
                }
                if (this.targetX <= 0) {
                    this.targetX = 0;
                }
                this.offset.x = this.targetX;
                this.refresh();
                window.setTimeout(() => {
                    this.totalTime = 0;
                    this.totalDistance = new Point(0, 0);
                }, 100);
            }
            else {
                this.refresh();
            }
        });
        canvas.addEventListener('mouseup', (event) => {
            if (this.totalTime != 0) {
                const velocity = this.totalDistance.x / this.totalTime;
                this.targetX += velocity;
            }
            if (this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width;
            }
            if (this.targetX <= 0) {
                this.targetX = 0;
            }
            this.isDragging = false;
            this.lastMoveTime = null;
            this.refresh();
        });
        canvas.addEventListener('mouseleave', (event) => {
            this.isDragging = false;
            this.lastMoveTime = null;
            this.refresh();
        });
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.isDragging = true;
            this.lastMoveTime = Date.now();
            this.totalTime = 0;
            this.totalDistance = new Point(0, 0);
            this.previousPoint.x = touch.clientX;
            this.previousPoint.y = touch.clientY;
            this.targetX = this.offset.x;
            this.refresh();
        });
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.focusPoint.x = touch.clientX;
            this.focusPoint.y = touch.clientY;
            if (this.isDragging && this.lastMoveTime) {
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.lastMoveTime) / 1000;
                const dx = touch.clientX - this.previousPoint.x;
                this.totalDistance.x -= dx * deviceRatio;
                this.totalTime += deltaTime;
                this.previousPoint = new Point(touch.clientX, touch.clientY);
                this.lastMoveTime = currentTime;
                this.targetX -= dx * deviceRatio;
                if (this.targetX > this.contentWidth - width) {
                    this.targetX = this.contentWidth - width;
                }
                if (this.targetX <= 0) {
                    this.targetX = 0;
                }
                this.offset.x = this.targetX;
                this.refresh();
                window.setTimeout(() => {
                    this.totalTime = 0;
                    this.totalDistance = new Point(0, 0);
                }, 100);
            }
        });
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (this.totalTime != 0) {
                const velocity = this.totalDistance.x / this.totalTime;
                this.targetX += velocity;
            }
            if (this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width;
            }
            if (this.targetX <= 0) {
                this.targetX = 0;
            }
            this.isDragging = false;
            this.lastMoveTime = null;
            this.refresh();
        });
    }
    draw() {
        var _a;
        const context = this.context;
        if (context == null) {
            return;
        }
        context.setTransform(1, 0, 0, 1, -this.offset.x, this.offset.y);
        context.clearRect(this.offset.x, this.offset.y, this.width, this.height);
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.draw(this);
    }
    refresh() {
        if (!this.isUpdating) {
            this.isUpdating = true;
            this.updateScroll();
        }
    }
    updateScroll() {
        var _a, _b;
        const rect = canvas.getBoundingClientRect();
        const x = this.focusPoint.x;
        const y = this.focusPoint.y;
        this.offset.x += (this.targetX - this.offset.x) * 0.03;
        if (Math.abs(this.targetX - this.offset.x) < 1) {
            this.offset.x = this.targetX;
        }
        (_a = this.listener) === null || _a === void 0 ? void 0 : _a.onScroll(this, this.offset);
        if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
            canvas.style.cursor = 'pointer';
            (_b = this.listener) === null || _b === void 0 ? void 0 : _b.onFocus(this, new Point((x - rect.x) * this.deviceRatio, y));
        }
        else {
            canvas.style.cursor = 'default';
        }
        this.draw();
        if (this.offset.x !== this.targetX) {
            requestAnimationFrame(this.updateScroll.bind(this));
        }
        else {
            this.isUpdating = false;
        }
    }
    drawRect(rect, color) {
        const context = this.context;
        if (context == null) {
            return;
        }
        const newRect = new Rect(rect.left, this.height - rect.top, rect.right, this.height - rect.bottom);
        context.fillStyle = color;
        context.fillRect(newRect.left, newRect.top, newRect.getWidth(), newRect.getHeight());
    }
    drawText(text, center, textSize, weight, color) {
        const context = this.context;
        if (context == null) {
            return;
        }
        context.font = `${weight} ${textSize}px Arial`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, center.x, this.height - center.y);
    }
    drawLine(startPoint, endPoint, lineWidth, color) {
        const context = this.context;
        if (context == null) {
            return;
        }
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(startPoint.x, this.height - startPoint.y);
        context.lineTo(endPoint.x, this.height - endPoint.y);
        context.stroke();
    }
    drawPath(points, lineWidth, color) {
        const context = this.context;
        if (context == null) {
            return;
        }
        const path = new Path2D();
        let isFirst = true;
        points.forEach(point => {
            if (isFirst) {
                isFirst = false;
                path.moveTo(point.x, this.height - point.y);
            }
            else {
                path.lineTo(point.x, this.height - point.y);
            }
        });
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke(path);
    }
    drawGradient(points, startColor, endColor) {
        const context = this.context;
        if (context == null) {
            return;
        }
        const path = new Path2D();
        let isFirst = true;
        points.forEach(point => {
            if (isFirst) {
                isFirst = false;
                path.moveTo(point.x, this.height - point.y);
            }
            else {
                path.lineTo(point.x, this.height - point.y);
            }
        });
        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        context.fillStyle = gradient;
        context.fill(path);
    }
    drawCircle(point, radius, color) {
        const context = this.context;
        if (context == null) {
            return;
        }
        context.beginPath();
        context.arc(point.x, this.height - point.y, radius, 0, Math.PI * 2, true);
        context.fillStyle = color;
        context.fill();
    }
}
