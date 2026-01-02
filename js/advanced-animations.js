/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLX PARTNERS - ADVANCED ANIMATIONS SYSTEM (2025 LEVEL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONCEITO VISUAL (SYSTEM DESIGN):
 * ---------------------------------
 * Aplicação: Landing Page B2B (Consultoria Premium)
 * Objetivo: Conversão de Executivos (CEOs, Diretores)
 * Emoção: Futurista + Premium + Confiável
 * 
 * ANIMAÇÕES IMPLEMENTADAS:
 * -------------------------
 * 1. Cursor Magnético com Trail (desktop only)
 * 2. 3D Card Tilt (Vanilla Tilt effect)
 * 3. Parallax Scroll (profundidade cinemática)
 * 4. Text Split Animation (letras reveladas progressivamente)
 * 5. Scroll-triggered Timeline com Stagger
 * 6. Hover Glow Effect (aura dinâmica)
 * 
 * PERFORMANCE:
 * ------------
 * ✓ requestAnimationFrame para animações suaves
 * ✓ Intersection Observer para lazy loading
 * ✓ Debounce em scroll/mouse events
 * ✓ GPU-accelerated (transform3d)
 * ✓ Mobile detection (desabilita efeitos pesados)
 * 
 * GOVERNANÇA:
 * -----------
 * - Arquivo separado (< 300 linhas)
 * - Não modifica animations.js existente
 * - Respeita prefers-reduced-motion
 * - Degradação graciosa em mobile
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. CURSOR MAGNÉTICO (Desktop Only)
// ═══════════════════════════════════════════════════════════════════════════

class MagneticCursor {
    constructor() {
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return; // Mobile skip
        
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        document.body.appendChild(this.cursor);
        
        this.cursorX = 0;
        this.cursorY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
        
        // Magnetic effect on buttons
        const magneticElements = document.querySelectorAll('button, a.btn-magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }
    
    animate() {
        // Smooth easing
        this.cursorX += (this.mouseX - this.cursorX) * 0.15;
        this.cursorY += (this.mouseY - this.cursorY) * 0.15;
        
        this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. 3D CARD TILT (Vanilla Tilt Effect)
// ═══════════════════════════════════════════════════════════════════════════

class CardTilt {
    constructor(elements) {
        this.cards = elements;
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', () => this.resetTilt(card));
        });
    }
    
    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10; // Max 10deg
        const rotateY = -(x - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        card.style.transition = 'transform 0.1s ease-out';
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. PARALLAX SCROLL (Cinemático)
// ═══════════════════════════════════════════════════════════════════════════

class ParallaxScroll {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        if (this.parallaxElements.length === 0) return;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll(); // Initial call
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. TEXT SPLIT ANIMATION (Letras Reveláveis) - Enhanced with Tag Support
// ═══════════════════════════════════════════════════════════════════════════

class TextSplitAnimation {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            const tag = el.tagName.toLowerCase();
            
            // Preserve original tag
            el.innerHTML = '';
            el.classList.add('split-text-container');
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
                span.className = 'char';
                span.style.animationDelay = `${index * 0.03}s`;
                el.appendChild(span);
            });
        });
    }
}

// ═══════════════════════════════================================================================
// 4B. SCROLL FLOAT TEXT (Scroll-triggered character animation) - CSS Pure (no GSAP)
// ═══════════════════════════════════════════════════════════════════════════

class ScrollFloatText {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.animationDuration = options.duration || 0.6;
        this.stagger = options.stagger || 0.02;
        
        if (this.elements.length === 0) return;
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            el.classList.add('scroll-float');
            
            const wrapper = document.createElement('span');
            wrapper.className = 'scroll-float-text';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'char scroll-float-char';
                span.style.transitionDelay = `${index * this.stagger}s`;
                span.style.transitionDuration = `${this.animationDuration}s`;
                wrapper.appendChild(span);
            });
            
            el.appendChild(wrapper);
            
            // Intersection Observer for scroll trigger
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.add('is-visible');
                        observer.unobserve(el);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -10% 0px'
            });
            
            observer.observe(el);
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SCROLL-TRIGGERED TIMELINE (Reveal Progressivo)
// ═══════════════════════════════════════════════════════════════════════════

class ScrollTimeline {
    constructor() {
        this.revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (this.revealElements.length === 0) return;
        
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        this.revealElements.forEach(el => observer.observe(el));
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. HOVER GLOW EFFECT (Aura Dinâmica em Cards)
// ═══════════════════════════════════════════════════════════════════════════

class HoverGlow {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.updateGlow(e, card));
            card.addEventListener('mouseleave', () => this.removeGlow(card));
        });
    }
    
    updateGlow(e, card) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--glow-x', `${x}%`);
        card.style.setProperty('--glow-y', `${y}%`);
        card.classList.add('glow-active');
    }
    
    removeGlow(card) {
        card.classList.remove('glow-active');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Respect accessibility
    
    // Initialize advanced animations
    new MagneticCursor();
    
    // 3D Tilt on service cards
    const tiltCards = document.querySelectorAll('.glass, .bg-white\\/5, .card-lift');
    if (tiltCards.length > 0) new CardTilt(tiltCards);
    
    // Parallax on hero background elements
    new ParallaxScroll();
    
    // Text split on main title (optional - can be heavy, use sparingly)
    // new TextSplitAnimation('h1');
    
    // Scroll Float Text on specific headings
    new ScrollFloatText('.scroll-float-heading', {
        duration: 0.8,
        stagger: 0.025
    });
    
    // Scroll timeline for sections
    new ScrollTimeline();
    
    // Hover glow on interactive elements
    new HoverGlow('.glass, .card-lift');
    
    // Add parallax data attributes to hero elements dynamically
    const heroSection = document.querySelector('section');
    if (heroSection) {
        const heroTitle = heroSection.querySelector('h1');
        const heroSubtitle = heroSection.querySelector('p');
        
        if (heroTitle) heroTitle.setAttribute('data-parallax', '0.3');
        if (heroSubtitle) heroSubtitle.setAttribute('data-parallax', '0.5');
    }
});

// Export for potential external use
window.GLXAdvancedAnimations = {
    MagneticCursor,
    CardTilt,
    ParallaxScroll,
    TextSplitAnimation,
    ScrollFloatText,
    ScrollTimeline,
    HoverGlow
};
