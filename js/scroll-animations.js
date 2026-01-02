/**
 * 🌊 SCROLL ANIMATIONS - ARCHITECTURE ENGINE
 * Role: Global Motion Orchestration
 * Patterns: Intersection Observer, Strategy Pattern (Transitions)
 * Governance: A11y (prefers-reduced-motion) | Staggered Orchestration
 * Audit: @[/sre] @[/system-design]
 */

class ScrollAnimations {
    constructor(options = {}) {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
            animationClass: 'animate-fade-in',
            stagger: 100,
            respectReducedMotion: true,
            ...options
        };

        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.observer = null;
        this.animatedElements = new WeakSet();
    }

    init() {
        // Adicionar estilos CSS necessários se ainda não existirem
        this.injectStyles();

        // Se usuário prefere reduzir movimento, desabilitar animações
        if (this.options.respectReducedMotion && this.prefersReducedMotion) {
            console.log('[ScrollAnimations] prefers-reduced-motion detectado - animações desabilitadas');
            return;
        }

        this.setupObserver();
        this.observeElements();
    }

    injectStyles() {
        if (document.getElementById('scroll-animations-styles')) return;

        const styles = `
            <style id="scroll-animations-styles">
                /* Animações de Scroll */
                [data-scroll-animate] {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                [data-scroll-animate].animate-fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }

                [data-scroll-animate="fade-up"].animate-fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }

                [data-scroll-animate="fade-left"] {
                    transform: translateX(30px);
                }

                [data-scroll-animate="fade-left"].animate-fade-in {
                    opacity: 1;
                    transform: translateX(0);
                }

                [data-scroll-animate="fade-right"] {
                    transform: translateX(-30px);
                }

                [data-scroll-animate="fade-right"].animate-fade-in {
                    opacity: 1;
                    transform: translateX(0);
                }

                [data-scroll-animate="scale"] {
                    transform: scale(0.9);
                }

                [data-scroll-animate="scale"].animate-fade-in {
                    opacity: 1;
                    transform: scale(1);
                }

                /* Respeitar prefers-reduced-motion */
                @media (prefers-reduced-motion: reduce) {
                    [data-scroll-animate] {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        });
    }

    observeElements() {
        const elements = document.querySelectorAll('[data-scroll-animate]');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    animateElement(element) {
        // Obter delay de stagger se houver
        const staggerDelay = parseInt(element.dataset.scrollStagger) || 0;

        setTimeout(() => {
            element.classList.add(this.options.animationClass);
            this.animatedElements.add(element);

            // Disparar evento customizado
            const event = new CustomEvent('scrollAnimationComplete', {
                detail: { element }
            });
            document.dispatchEvent(event);
        }, staggerDelay);
    }

    /**
     * Adiciona animação a novos elementos dinamicamente
     */
    addElement(element) {
        if (this.observer && !this.animatedElements.has(element)) {
            this.observer.observe(element);
        }
    }

    /**
     * Remove observação de um elemento
     */
    removeElement(element) {
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }

    /**
     * Destrói o observer e limpa recursos
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        this.animatedElements = new WeakSet();
    }
}

// Inicializar automaticamente quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.scrollAnimations = new ScrollAnimations();
        window.scrollAnimations.init();
    });
} else {
    window.scrollAnimations = new ScrollAnimations();
    window.scrollAnimations.init();
}
