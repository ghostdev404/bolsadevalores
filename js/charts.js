/* ================================================================
   BOLSA & POLÍTICA — Charts Engine (Canvas 2D)
   Motor de gráficos nativo sem dependências
   ================================================================ */

class StockChart {

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Object} options 
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = [];
        this.animationFrame = null;
        this.animationProgress = 0;

        // Configurações padrão
        this.options = {
            lineColor: '#3b82f6',
            lineWidth: 2.5,
            fillGradientTop: 'rgba(59, 130, 246, 0.25)',
            fillGradientBottom: 'rgba(59, 130, 246, 0)',
            gridColor: 'rgba(255, 255, 255, 0.04)',
            labelColor: 'rgba(139, 156, 196, 0.7)',
            labelFont: '11px "JetBrains Mono", monospace',
            padding: { top: 20, right: 15, bottom: 30, left: 60 },
            showGrid: true,
            showLabels: true,
            showDots: false,
            showCrosshair: true,
            animate: true,
            animationDuration: 800,
            ...options
        };

        // State for crosshair
        this._mouseX = -1;
        this._mouseY = -1;
        this._hovering = false;

        this._setupCanvas();
        this._bindEvents();
    }

    /**
     * Setup canvas for high-DPI displays
     */
    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Bind mouse events for crosshair
     */
    _bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this._mouseX = e.clientX - rect.left;
            this._mouseY = e.clientY - rect.top;
            this._hovering = true;
            this._drawFrame();
        });

        this.canvas.addEventListener('mouseleave', () => {
            this._hovering = false;
            this._drawFrame();
        });

        // Responsive resize
        const resizeObserver = new ResizeObserver(() => {
            this._setupCanvas();
            this._drawFrame();
        });
        resizeObserver.observe(this.canvas);
    }

    /**
     * Update chart data and redraw with animation
     * @param {number[]} newData - Array of values
     * @param {string[]} labels - Optional array of labels
     */
    updateData(newData, labels = []) {
        const oldData = this.data.length > 0 ? [...this.data] : newData.map(() => newData[0]);
        this.data = [...newData];
        this.labels = labels;

        if (this.options.animate) {
            this._animateTransition(oldData, newData);
        } else {
            this._drawFrame();
        }
    }

    /**
     * Animate from old data to new data
     */
    _animateTransition(oldData, newData) {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

        const duration = this.options.animationDuration;
        const startTime = performance.now();

        // Normalize array lengths
        const maxLen = Math.max(oldData.length, newData.length);
        const oldNormalized = this._normalizeLength(oldData, maxLen);
        const newNormalized = this._normalizeLength(newData, maxLen);

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = Utils.easeOutCubic(progress);

            // Interpolate data
            const interpolated = oldNormalized.map((oldVal, i) => {
                return Utils.lerp(oldVal, newNormalized[i], easedProgress);
            });

            this.animationProgress = easedProgress;
            this._drawChart(interpolated);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    _normalizeLength(arr, targetLen) {
        if (arr.length === targetLen) return arr;
        if (arr.length === 0) return new Array(targetLen).fill(0);
        
        const result = [];
        for (let i = 0; i < targetLen; i++) {
            const srcIdx = (i / (targetLen - 1)) * (arr.length - 1);
            const low = Math.floor(srcIdx);
            const high = Math.min(Math.ceil(srcIdx), arr.length - 1);
            const t = srcIdx - low;
            result.push(Utils.lerp(arr[low], arr[high], t));
        }
        return result;
    }

    /**
     * Draw current frame
     */
    _drawFrame() {
        if (this.data.length > 0) {
            this._drawChart(this.data);
        }
    }

    /**
     * Main draw routine
     * @param {number[]} data 
     */
    _drawChart(data) {
        const ctx = this.ctx;
        const { padding } = this.options;
        const chartWidth = this.width - padding.left - padding.right;
        const chartHeight = this.height - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, this.width, this.height);

        if (data.length < 2) return;

        // Data bounds
        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const range = maxVal - minVal || 1;
        const paddedMin = minVal - range * 0.05;
        const paddedMax = maxVal + range * 0.05;
        const paddedRange = paddedMax - paddedMin;

        // Point mapping helper
        const getX = (i) => padding.left + (i / (data.length - 1)) * chartWidth;
        const getY = (val) => padding.top + chartHeight - ((val - paddedMin) / paddedRange) * chartHeight;

        // Draw grid
        if (this.options.showGrid) {
            this._drawGrid(ctx, paddedMin, paddedMax, padding, chartWidth, chartHeight);
        }

        // Draw filled area
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < data.length; i++) {
            const xc = (getX(i - 1) + getX(i)) / 2;
            const yc = (getY(data[i - 1]) + getY(data[i])) / 2;
            ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1]), xc, yc);
        }
        ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
        ctx.lineTo(getX(data.length - 1), padding.top + chartHeight);
        ctx.lineTo(getX(0), padding.top + chartHeight);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, this.options.fillGradientTop);
        gradient.addColorStop(1, this.options.fillGradientBottom);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < data.length; i++) {
            const xc = (getX(i - 1) + getX(i)) / 2;
            const yc = (getY(data[i - 1]) + getY(data[i])) / 2;
            ctx.quadraticCurveTo(getX(i - 1), getY(data[i - 1]), xc, yc);
        }
        ctx.lineTo(getX(data.length - 1), getY(data[data.length - 1]));
        ctx.strokeStyle = this.options.lineColor;
        ctx.lineWidth = this.options.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw last point glow
        const lastX = getX(data.length - 1);
        const lastY = getY(data[data.length - 1]);
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.options.lineColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
        ctx.fillStyle = this.options.lineColor.replace(')', ', 0.2)').replace('rgb', 'rgba');
        ctx.fill();

        // Draw crosshair
        if (this._hovering && this.options.showCrosshair) {
            this._drawCrosshair(ctx, data, getX, getY, padding, chartWidth, chartHeight);
        }

        // Draw Y-axis labels
        if (this.options.showLabels) {
            this._drawYLabels(ctx, paddedMin, paddedMax, padding, chartHeight);
        }
    }

    /**
     * Draw background grid
     */
    _drawGrid(ctx, min, max, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = this.options.gridColor;
        ctx.lineWidth = 1;

        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (i / gridLines) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }
    }

    /**
     * Draw Y-axis value labels
     */
    _drawYLabels(ctx, min, max, padding, chartHeight) {
        ctx.fillStyle = this.options.labelColor;
        ctx.font = this.options.labelFont;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const gridLines = 5;
        const range = max - min;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (i / gridLines) * chartHeight;
            const value = max - (i / gridLines) * range;
            ctx.fillText(value.toFixed(2), padding.left - 8, y);
        }
    }

    /**
     * Draw interactive crosshair on hover
     */
    _drawCrosshair(ctx, data, getX, getY, padding, chartWidth, chartHeight) {
        const mx = this._mouseX;
        const my = this._mouseY;

        // Find nearest data point
        const dataIdx = Math.round(((mx - padding.left) / chartWidth) * (data.length - 1));
        const clampedIdx = Math.max(0, Math.min(data.length - 1, dataIdx));
        const pointX = getX(clampedIdx);
        const pointY = getY(data[clampedIdx]);

        // Vertical line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(pointX, padding.top);
        ctx.lineTo(pointX, padding.top + chartHeight);
        ctx.stroke();

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(padding.left, pointY);
        ctx.lineTo(padding.left + chartWidth, pointY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Data point highlight
        ctx.beginPath();
        ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.options.lineColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
        ctx.strokeStyle = this.options.lineColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tooltip
        const value = data[clampedIdx].toFixed(2);
        const label = this.labels && this.labels[clampedIdx] ? this.labels[clampedIdx] : '';
        const tooltipText = label ? `${label}: R$ ${value}` : `R$ ${value}`;
        
        ctx.font = '12px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(tooltipText).width;
        const tooltipW = textWidth + 16;
        const tooltipH = 28;
        let tooltipX = pointX - tooltipW / 2;
        let tooltipY = pointY - tooltipH - 12;

        // Keep tooltip in bounds
        tooltipX = Math.max(padding.left, Math.min(tooltipX, padding.left + chartWidth - tooltipW));
        if (tooltipY < padding.top) tooltipY = pointY + 12;

        // Tooltip background
        ctx.fillStyle = 'rgba(17, 24, 42, 0.95)';
        ctx.beginPath();
        this._roundRect(ctx, tooltipX, tooltipY, tooltipW, tooltipH, 6);
        ctx.fill();
        ctx.strokeStyle = this.options.lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Tooltip text
        ctx.fillStyle = '#f0f4fc';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tooltipText, tooltipX + tooltipW / 2, tooltipY + tooltipH / 2);
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
    }

    /**
     * Destroy chart and clean up
     */
    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    }
}


/* ================================================================
   Sparkline — Mini charts for stock cards
   ================================================================ */

class Sparkline {

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Object} options 
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            lineColor: '#3b82f6',
            lineWidth: 1.5,
            fillOpacity: 0.1,
            animate: true,
            ...options
        };
        this._setupCanvas();
    }

    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Draw sparkline with data
     * @param {number[]} data 
     */
    draw(data) {
        if (!data || data.length < 2) return;

        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const pad = 2;

        ctx.clearRect(0, 0, w, h);

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const getX = (i) => pad + (i / (data.length - 1)) * (w - pad * 2);
        const getY = (v) => pad + (h - pad * 2) - ((v - min) / range) * (h - pad * 2);

        // Determine line color based on trend
        const isUp = data[data.length - 1] >= data[0];
        const color = isUp ? '#22c55e' : '#ef4444';

        // Fill gradient
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < data.length; i++) {
            ctx.lineTo(getX(i), getY(data[i]));
        }
        ctx.lineTo(getX(data.length - 1), h);
        ctx.lineTo(getX(0), h);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, isUp ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(data[0]));
        for (let i = 1; i < data.length; i++) {
            ctx.lineTo(getX(i), getY(data[i]));
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = this.options.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}


/* ================================================================
   ImpactGauge — Semicircular gauge for impact meter
   ================================================================ */

class ImpactGauge {

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentAngle = 0;
        this._setupCanvas();
    }

    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Draw gauge with score 0-100
     * @param {number} score 
     * @param {boolean} animate 
     */
    draw(score, animate = true) {
        const targetAngle = (score / 100) * Math.PI;

        if (animate) {
            this._animateTo(targetAngle);
        } else {
            this.currentAngle = targetAngle;
            this._drawGauge(targetAngle);
        }
    }

    _animateTo(targetAngle) {
        const startAngle = this.currentAngle;
        const startTime = performance.now();
        const duration = 1000;

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = Utils.easeOutCubic(progress);
            const currentAngle = Utils.lerp(startAngle, targetAngle, eased);

            this._drawGauge(currentAngle);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentAngle = targetAngle;
            }
        };

        requestAnimationFrame(animate);
    }

    _drawGauge(angle) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const centerX = w / 2;
        const centerY = h - 10;
        const radius = Math.min(w / 2, h) - 20;

        ctx.clearRect(0, 0, w, h);

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Colored gradient arc
        const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(0.35, '#f59e0b');
        gradient.addColorStop(0.5, '#eab308');
        gradient.addColorStop(0.65, '#84cc16');
        gradient.addColorStop(1, '#22c55e');

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + angle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow effect
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + angle);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.shadowColor = this._getScoreColor(angle / Math.PI * 100);
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Needle dot
        const needleX = centerX + radius * Math.cos(Math.PI + angle);
        const needleY = centerY + radius * Math.sin(Math.PI + angle);
        
        ctx.beginPath();
        ctx.arc(needleX, needleY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f4fc';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(needleX, needleY, 3, 0, Math.PI * 2);
        ctx.fillStyle = this._getScoreColor(angle / Math.PI * 100);
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
    }

    _getScoreColor(score) {
        if (score < 25) return '#ef4444';
        if (score < 45) return '#f59e0b';
        if (score < 55) return '#eab308';
        if (score < 75) return '#84cc16';
        return '#22c55e';
    }
}
