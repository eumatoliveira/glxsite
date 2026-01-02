/**
 * SplitText Animation - Vanilla JS version of React Bits SplitText
 * Splits text into words/chars and animates them with stagger effect
 */

class SplitText {
    constructor(element, options = {}) {
        this.element = element;
        this.splitType = options.splitType || 'chars'; // 'chars' | 'words'
        this.delay = options.delay || 50;
        this.duration = options.duration || 0.6;
        this.threshold = options.threshold || 0.1;
        this.once = options.once !== false; // default true
        
        this.words = [];
        this.chars = [];
        this.originalText = this.element.textContent.trim();
        
        this.init();
    }

    init() {
        // Prepare DOM
        this.split();
        
        // Setup Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    if (this.once) this.observer.unobserve(this.element);
                }
            });
        }, { threshold: this.threshold, rootMargin: '-50px' });
        
        this.observer.observe(this.element);
    }

    split() {
        this.element.textContent = '';
        const words = this.originalText.split(' ');
        
        words.forEach((wordText, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word inline-block whitespace-nowrap';
            wordSpan.style.marginRight = '0.25em'; 
            
            if (this.splitType === 'words') {
                this.setupSpan(wordSpan, wordText, wordIndex);
                this.words.push(wordSpan);
            } else {
                const chars = wordText.split('');
                chars.forEach((char, charIndex) => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = char;
                    charSpan.className = 'split-char inline-block';
                    
                    // Global index calculation for char stagger across words
                    const globalIndex = this.chars.length;
                    this.setupSpan(charSpan, char, globalIndex);
                    
                    this.chars.push(charSpan);
                    wordSpan.appendChild(charSpan);
                });
            }
            
            this.element.appendChild(wordSpan);
        });
    }

    setupSpan(span, text, index) {
        if (this.splitType === 'words') span.textContent = text;
        
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `opacity ${this.duration}s cubic-bezier(0.2, 0.65, 0.3, 0.9), transform ${this.duration}s cubic-bezier(0.2, 0.65, 0.3, 0.9)`;
        // Stagger delay
        span.style.transitionDelay = `${index * (this.delay / 1000)}s`;
    }

    animate() {
        const targets = this.splitType === 'words' ? this.words : this.chars;
        
        // Force reflow
        this.element.offsetHeight;
        
        targets.forEach(target => {
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
        });
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-split-text]').forEach(el => {
        new SplitText(el, {
            splitType: el.dataset.splitType || 'chars',
            delay: parseInt(el.dataset.delay) || 30,
            duration: parseFloat(el.dataset.duration) || 0.8
        });
    });
});
