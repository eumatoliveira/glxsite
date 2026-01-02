/**
 * Auto-Animation Loader - Aplica animações automaticamente aos elementos
 * Evita modificação manual do HTML de 800+ linhas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hero Section
    const heroTitle = document.querySelector('h1');
    if (heroTitle) {
        heroTitle.classList.add('animate__animated', 'animate__fadeInDown');
    }

    const heroSubtitle = document.querySelectorAll('p')[0];
    if (heroSubtitle) {
        heroSubtitle.classList.add('animate__animated', 'animate__fadeInUp', 'animate__delay-1s');
    }

    // Service Cards - Card Lift Effect
    const serviceCards = document.querySelectorAll('.glass, .bg-white\\/5');
    serviceCards.forEach(card => {
        card.classList.add('card-lift');
    });

    // Buttons - Magnetic Effect
    const buttons = document.querySelectorAll('button:not(#chatToggle):not(#chatClose), a.bg-primary, a.bg-accent');
    buttons.forEach(btn => {
        btn.classList.add('btn-magnetic');
    });

    // Números com glow
    const strongElements = document.querySelectorAll('strong');
    strongElements.forEach(strong => {
        if (strong.textContent.includes('%')) {
            strong.classList.add('glow-text');
        }
    });

    // Intersection Observer para scroll reveals
    const scrollRevealElements = document.querySelectorAll('section > div, .grid > div');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
