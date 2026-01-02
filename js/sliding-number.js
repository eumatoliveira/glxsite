/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SLIDING NUMBER - Vanilla JS Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * INSPIRADO EM: shadcn/ui SlidingNumber component
 * STACK: Vanilla JavaScript (sem React)
 * 
 * FUNCIONALIDADE:
 * - Anima números de 0 até valor final
 * - Efeito de "contagem" suave
 * - Intersection Observer (anima só quando visível)
 * - Suporta decimais e sufixos (%, K, M)
 * 
 * USO:
 * <span class="sliding-number" data-value="40" data-suffix="%">0</span>
 */

class SlidingNumber {
    constructor(element, options = {}) {
        this.element = element;
        this.from = parseFloat(options.from) || 0;
        this.to = parseFloat(element.dataset.value) || parseFloat(element.textContent) || 0;
        this.duration = parseFloat(options.duration) || 2000; // ms
        this.suffix = element.dataset.suffix || options.suffix || '';
        this.decimals = parseInt(element.dataset.decimals) || 0;
        
        this.hasAnimated = false;
        this.currentValue = this.from;
        
        this.init();
    }
    
    init() {
        // Set initial value
        this.element.textContent = this.formatNumber(this.from);
        
        // Use Intersection Observer to animate when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                    observer.unobserve(this.element);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(this.element);
    }
    
    animate() {
        this.hasAnimated = true;
        const startTime = performance.now();
        const startValue = this.from;
        const endValue = this.to;
        const change = endValue - startValue;
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function (easeOutExpo)
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            this.currentValue = startValue + (change * easedProgress);
            this.element.textContent = this.formatNumber(this.currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Ensure final value is exact
                this.element.textContent = this.formatNumber(endValue);
            }
        };
        
        requestAnimationFrame(step);
    }
    
    formatNumber(value) {
        let formatted = value.toFixed(this.decimals);
        return formatted + this.suffix;
    }
}

// Auto-initialize all .sliding-number elements
document.addEventListener('DOMContentLoaded', () => {
    const slidingNumbers = document.querySelectorAll('.sliding-number');
    slidingNumbers.forEach(el => {
        new SlidingNumber(el);
    });
});

// Export for manual use
window.SlidingNumber = SlidingNumber;
