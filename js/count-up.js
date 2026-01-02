/**
 * CountUp Animation - Vanilla JS version of React Bits CountUp
 * Uses spring physics simulation for smooth counting
 */

class CountUp {
    constructor(element, options = {}) {
        this.element = element;
        this.startValue = options.from || 0;
        this.targetValue = options.to || 100;
        this.duration = options.duration || 2;
        this.direction = options.direction || 'up';
        this.separator = options.separator || '';
        this.decimals = options.decimals || 0;
        this.prefix = options.prefix || '';
        this.suffix = options.suffix || '';
        
        // Physics constants based on framer-motion defaults
        this.damping = 20 + 40 * (1 / this.duration);
        this.stiffness = 100 * (1 / this.duration);
        
        this.currentValue = this.direction === 'down' ? this.targetValue : this.startValue;
        this.velocity = 0;
        this.target = this.direction === 'down' ? this.startValue : this.targetValue;
        
        this.isInView = false;
        this.startTime = null;
        this.animationFrame = null;
        
        this.init();
    }

    init() {
        // Set initial value
        this.updateText(this.currentValue);
        
        // Setup Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isInView) {
                    this.isInView = true;
                    this.start();
                }
            });
        }, { threshold: 0.1 }); // Start when 10% visible
        
        this.observer.observe(this.element);
    }

    formatNumber(num) {
        let formatted = num.toFixed(this.decimals);
        
        if (this.separator) {
            const parts = formatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.separator);
            formatted = parts.join('.');
        }

        return `${this.prefix}${formatted}${this.suffix}`;
    }

    updateText(value) {
        this.element.textContent = this.formatNumber(value);
    }

    animate(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        
        // Spring physics simulation (Simplified Hooke's Law)
        // F = -k * x - c * v
        const force = -this.stiffness * (this.currentValue - this.target) - this.damping * this.velocity;
        const dt = 0.016; // Approx 60fps
        
        this.velocity += force * dt;
        this.currentValue += this.velocity * dt;

        // Check if animation is complete
        const isComplete = Math.abs(this.currentValue - this.target) < 0.1 && Math.abs(this.velocity) < 0.1;
        
        if (isComplete) {
            this.updateText(this.target);
            cancelAnimationFrame(this.animationFrame);
        } else {
            this.updateText(this.currentValue);
            this.animationFrame = requestAnimationFrame(this.animate.bind(this));
        }
    }

    start() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
}

// Auto-initialize elements with data-count-up attribute
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-count-up]');
    elements.forEach(el => {
        const to = parseFloat(el.dataset.to);
        const from = parseFloat(el.dataset.from) || 0;
        const duration = parseFloat(el.dataset.duration) || 2;
        const decimals = parseInt(el.dataset.decimals) || 0;
        const separator = el.dataset.separator || '';
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';

        new CountUp(el, {
            to, from, duration, decimals, separator, prefix, suffix
        });
    });
});
