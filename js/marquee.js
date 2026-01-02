/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MARQUEE COMPONENT - Infinite Scroll Testimonials
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * INSPIRADO EM: shadcn/ui Marquee
 * IMPLEMENTAÇÃO: Vanilla JavaScript (sem React)
 * 
 * FUNCIONALIDADE:
 * - Scroll infinito de depoimentos/logos
 * - Pause on hover
 * - Direção configurável (LTR/RTL)
 * - Performance otimizada (transform GPU-accelerated)
 * - Duplica conteúdo automaticamente para loop seamless
 * 
 * USO:
 * <div class="marquee" data-speed="60" data-direction="left">
 *   <div class="marquee-content">
 *     <!-- Cards de depoimentos -->
 *   </div>
 * </div>
 */

class Marquee {
    constructor(element, options = {}) {
        this.element = element;
        this.content = element.querySelector('.marquee-content');
        if (!this.content) return;
        
        // Config
        this.speed = parseFloat(element.dataset.speed) || 60; // segundos para completar
        this.direction = element.dataset.direction || 'left'; // left or right
        this.pauseOnHover = element.dataset.pauseOnHover !== 'false';
        
        this.init();
    }
    
    init() {
        // Duplicate content for seamless loop
        const clone = this.content.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        this.element.appendChild(clone);
        
        // Set animation duration
        this.content.style.animationDuration = `${this.speed}s`;
        clone.style.animationDuration = `${this.speed}s`;
        
        // Set animation direction
        const animationName = this.direction === 'left' ? 'marquee-left' : 'marquee-right';
        this.content.style.animationName = animationName;
        clone.style.animationName = animationName;
        
        // Pause on hover
        if (this.pauseOnHover) {
            this.element.addEventListener('mouseenter', () => this.pause());
            this.element.addEventListener('mouseleave', () => this.play());
        }
    }
    
    pause() {
        this.element.classList.add('paused');
    }
    
    play() {
        this.element.classList.remove('paused');
    }
}

// Auto-initialize all .marquee elements
document.addEventListener('DOMContentLoaded', () => {
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(el => new Marquee(el));
});

window.Marquee = Marquee;
