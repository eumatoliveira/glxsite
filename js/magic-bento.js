/**
 * Magic Bento - Vanilla JS Implementation
 * Adds mouse-following spotlight and border glow effects to cards
 */

class MagicBento {
    constructor(container) {
        this.container = container;
        this.cards = container.querySelectorAll('.bento-card');
        this.init();
    }

    init() {
        this.container.onmousemove = e => this.handleMouseMove(e);
        this.container.onmouseleave = e => this.handleMouseLeave(e);
    }

    handleMouseMove(e) {
        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Optional: Tilt Effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -2; // Max tilt deg
            const rotateY = ((x - centerX) / centerX) * 2;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }
    
    handleMouseLeave() {
        this.cards.forEach(card => {
            card.style.transform = '';
        });
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-magic-bento]').forEach(container => {
        new MagicBento(container);
    });
});
