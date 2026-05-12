class HTMLCanvas implements ICanvas {
    listener?: CanvasListener;
    scale: number = 1;
    offset: Point = { x: 0, y: 0 };
    contentWidth: number = 0;
    targetX = 0;
    isUpdating = false;
    context?: CanvasRenderingContext2D | null
    private focusPoint: Point = new Point(0,0);
    private isScrolling: number | null = null;
    private isDragging = false;
    private totalDistance = new Point(0, 0)
    private previousPoint = new Point(0, 0)
    private lastMoveTime: number | null = null;
    private totalTime = 0;
    get size(): Point {
        return new Point(this.width, this.height)
    }

    constructor(private canvas: HTMLCanvasElement, private width: number, private height: number, private deviceRatio: number) {
        this.context = canvas.getContext('2d');
        if (this.context == null)
            return
        
        this.context.imageSmoothingEnabled = true
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (this.isScrolling !== null) {
                clearTimeout(this.isScrolling);
            }
            this.targetX += event.deltaY * deviceRatio;
            if(this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width;
            }
            if(this.targetX <= 0) {
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
            this.targetX = this.offset.x
            this.refresh();
        });

        canvas.addEventListener('mousemove', (event) => {
            this.focusPoint.x = event.clientX;
            this.focusPoint.y = event.clientY;
            
            if (this.isDragging && this.lastMoveTime){
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.lastMoveTime) / 1000;
                const dx = event.offsetX - this.previousPoint.x;
                this.totalDistance.x -= dx * deviceRatio;
                this.totalTime += deltaTime;
                this.previousPoint = new Point(event.offsetX, event.offsetY);
                this.lastMoveTime = currentTime;
                this.targetX -= dx * deviceRatio;
                if(this.targetX > this.contentWidth - width) {
                    this.targetX = this.contentWidth - width
                }
                if(this.targetX <= 0) {
                    this.targetX = 0;
                }
                this.offset.x = this.targetX
                this.refresh()

                window.setTimeout(() => {
                    this.totalTime = 0;
                    this.totalDistance = new Point(0, 0);
                }, 100);
            } else {
                this.refresh()
            }
        });

        canvas.addEventListener('mouseup', (event) => {
            if (this.totalTime != 0) {
                const velocity = this.totalDistance.x / this.totalTime
                this.targetX += velocity
            }
            if(this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width
            }
            if(this.targetX <= 0) {
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
            this.targetX = this.offset.x
            this.refresh();
        });

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.focusPoint.x = touch.clientX;
            this.focusPoint.y = touch.clientY;
            
            if (this.isDragging && this.lastMoveTime){
                const currentTime = Date.now();
                const deltaTime = (currentTime - this.lastMoveTime) / 1000;
                const dx = touch.clientX - this.previousPoint.x;
                this.totalDistance.x -= dx * deviceRatio;
                this.totalTime += deltaTime;
                this.previousPoint = new Point(touch.clientX, touch.clientY);
                this.lastMoveTime = currentTime;
                this.targetX -= dx * deviceRatio;
                if(this.targetX > this.contentWidth - width) {
                    this.targetX = this.contentWidth - width
                }
                if(this.targetX <= 0) {
                    this.targetX = 0;
                }
                this.offset.x = this.targetX
                this.refresh()

                window.setTimeout(() => {
                    this.totalTime = 0;
                    this.totalDistance = new Point(0, 0);
                }, 100);
            } 
        });

        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (this.totalTime != 0) {
                const velocity = this.totalDistance.x / this.totalTime
                this.targetX += velocity
            }

            if(this.targetX > this.contentWidth - width) {
                this.targetX = this.contentWidth - width
            }
            if(this.targetX <= 0) {
                this.targetX = 0;
            }

            this.isDragging = false;
            this.lastMoveTime = null;

            this.refresh();
        });
    }

    private draw(): void {
        const context = this.context
        if (context == null) {
            return;
        }

        context.setTransform(1, 0, 0, 1, -this.offset.x, this.offset.y);
        context.clearRect(this.offset.x,  this.offset.y, this.width, this.height);
        this.listener?.draw(this);
    }

    refresh(): void {
        if(!this.isUpdating) {
            this.isUpdating = true
            this.updateScroll()
        }
    }

    private updateScroll(): void {
        const rect = canvas.getBoundingClientRect();
        const x = this.focusPoint.x
        const y = this.focusPoint.y
        
        this.offset.x += (this.targetX - this.offset.x) * 0.03;
        if (Math.abs(this.targetX - this.offset.x) < 1) {
            this.offset.x = this.targetX;   
        }
        this.listener?.onScroll(this, this.offset);

        if (x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height) {
            canvas.style.cursor = 'pointer';
            this.listener?.onFocus(this, new Point((x - rect.x) * this.deviceRatio, y))
        } else {
            canvas.style.cursor = 'default';
        }
        this.draw()
        
        if (this.offset.x !== this.targetX) {
            requestAnimationFrame(this.updateScroll.bind(this));
        } else {
            this.isUpdating = false
        }
    }

    drawRect(rect: Rect, color: string): void {
        const context = this.context
        if (context == null) {
            return;
        }
        
        const newRect = new Rect(rect.left, this.height - rect.top, rect.right, this.height - rect.bottom)
        context.fillStyle = color;
        context.fillRect(newRect.left, newRect.top, newRect.getWidth(), newRect.getHeight());
    }

    drawText(text: string, center: Point, textSize: number, weight: 'normal' | 'bold', color: string): void {
        const context = this.context
        if (context == null) {
            return;
        }
    
        context.font = `${weight} ${textSize}px Arial`;
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, center.x, this.height - center.y);
    }

    drawLine(startPoint: Point, endPoint: Point, lineWidth: number, color: string): void {
        const context = this.context
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

    drawPath(points: {x: number, y: number}[], lineWidth: number, color: string) {
        const context = this.context
        if (context == null) {
            return;
        }

        const path = new Path2D();
        let isFirst = true
        points.forEach(point => {
            if (isFirst) {
                isFirst = false
                path.moveTo(point.x, this.height - point.y);
            } else {
                path.lineTo(point.x, this.height - point.y);
            }
        })
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke(path);
    }

    drawGradient(points: {x: number, y: number}[], startColor: string, endColor: string) {
        const context = this.context
        if (context == null) {
            return;
        }

        const path = new Path2D();
        let isFirst = true
        points.forEach(point => {
            if (isFirst) {
                isFirst = false
                path.moveTo(point.x, this.height - point.y);
            } else {
                path.lineTo(point.x, this.height - point.y);
            }
        })

        const gradient = context.createLinearGradient(0, 0, 0, context.canvas.height);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        context.fillStyle = gradient;
        context.fill(path);
    }

    drawCircle(point: { x: number; y: number }, radius: number, color: string) {
        const context = this.context
        if (context == null) {
            return;
        }

        context.beginPath();
        context.arc(point.x, this.height - point.y, radius, 0, Math.PI * 2, true);
        context.fillStyle = color;
        context.fill();
    }
}