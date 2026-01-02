/**
 * Web Vitals Tracker - Observabilidade de Performance
 * Coleta e reporta métricas críticas de Core Web Vitals
 * LCP, FID, CLS, TTFB, FCP
 */

class WebVitalsTracker {
    constructor(options = {}) {
        this.options = {
            reportEndpoint: options.reportEndpoint || null,
            sampleRate: options.sampleRate || 1.0, // 100% por padrão
            debug: options.debug || false,
            ...options
        };

        this.metrics = {
            lcp: null,  // Largest Contentful Paint
            fid: null,  // First Input Delay
            cls: null,  // Cumulative Layout Shift
            fcp: null,  // First Contentful Paint
            ttfb: null  // Time to First Byte
        };

        this.init();
    }

    init() {
        // Verificar se deve rastrear (sample rate)
        if (Math.random() > this.options.sampleRate) {
            this.log('Fora do sample rate - tracking desabilitado para esta sessão');
            return;
        }

        this.trackNavigationTiming();
        this.trackPaintTiming();
        this.trackLCP();
        this.trackFID();
        this.trackCLS();
    }

    trackNavigationTiming() {
        // TTFB (Time to First Byte)
        if ('PerformanceNavigationTiming' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const ttfb = entry.responseStart - entry.requestStart;
                    this.recordMetric('ttfb', ttfb);
                });
            });
            observer.observe({ type: 'navigation', buffered: true });
        }
    }

    trackPaintTiming() {
        // FCP (First Contentful Paint)
        if ('PerformancePaintTiming' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        this.recordMetric('fcp', entry.startTime);
                    }
                });
            });
            observer.observe({ type: 'paint', buffered: true });
        }
    }

    trackLCP() {
        // LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.recordMetric('lcp', lastEntry.renderTime || lastEntry.loadTime);
            });
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        }
    }

    trackFID() {
        // FID (First Input Delay)
        if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('first-input')) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.recordMetric('fid', entry.processingStart - entry.startTime);
                });
            });
            observer.observe({ type: 'first-input', buffered: true });
        }
    }

    trackCLS() {
        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        let clsEntries = [];

        if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    // Apenas contar shifts sem input recente
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                });
                this.recordMetric('cls', clsValue);
            });
            observer.observe({ type: 'layout-shift', buffered: true });
        }
    }

    recordMetric(name, value) {
        this.metrics[name] = value;
        this.log(`${name.toUpperCase()}: ${value.toFixed(2)}ms`);

        // Classificar métrica
        const rating = this.getRating(name, value);
        
        // Enviar para analytics se configurado
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: name.toUpperCase(),
                value: Math.round(value),
                rating: rating,
                non_interaction: true
            });
        }

        // Enviar para endpoint custom se configurado
        if (this.options.reportEndpoint) {
            this.sendToEndpoint(name, value, rating);
        }

        // Disparar evento customizado
        const event = new CustomEvent('webVitalMeasured', {
            detail: { name, value, rating, metrics: this.metrics }
        });
        document.dispatchEvent(event);
    }

    getRating(name, value) {
        // Thresholds baseados em Core Web Vitals
        const thresholds = {
            lcp: { good: 2500, needsImprovement: 4000 },
            fid: { good: 100, needsImprovement: 300 },
            cls: { good: 0.1, needsImprovement: 0.25 },
            fcp: { good: 1800, needsImprovement: 3000 },
            ttfb: { good: 800, needsImprovement: 1800 }
        };

        const threshold = thresholds[name];
        if (!threshold) return 'unknown';

        if (value <= threshold.good) return 'good';
        if (value <= threshold.needsImprovement) return 'needs-improvement';
        return 'poor';
    }

    async sendToEndpoint(name, value, rating) {
        try {
            await fetch(this.options.reportEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metric: name,
                    value: value,
                    rating: rating,
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                }),
                keepalive: true // Garantir envio mesmo se página fechar
            });
        } catch (error) {
            this.log(`Erro ao enviar métrica ${name}:`, error);
        }
    }

    getMetrics() {
        return { ...this.metrics };
    }

    getSummary() {
        const summary = {};
        Object.entries(this.metrics).forEach(([name, value]) => {
            if (value !== null) {
                summary[name] = {
                    value: value.toFixed(2),
                    rating: this.getRating(name, value)
                };
            }
        });
        return summary;
    }

    log(...args) {
        if (this.options.debug) {
            console.log('[WebVitals]', ...args);
        }
    }
}

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.webVitalsTracker = new WebVitalsTracker({ debug: true });
    });
} else {
    window.webVitalsTracker = new WebVitalsTracker({ debug: true });
}
