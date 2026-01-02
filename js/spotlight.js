/**
 * 🕯️ SPOTLIGHT CARD - ARCHITECTURE ENGINE
 * Role: Interactive Card Feedback / Radial Tracking
 * Patterns: Observer Pattern (MutationObserver), Event Delegation
 * Governance: Performance Stable | Low Memory Memory Footprint
 * Audit: @[/arquiteturastaff] @[/autogovernancadeia]
 */

class SpotlightManager {
    constructor() {
        this.cards = new Set(); // Use Set for uniqueness
        this.init();
        this.observe(); // Start observing DOM
    }

    init() {
        this.refresh();
    }

    refresh() {
        const found = document.querySelectorAll('.spotlight-card');
        found.forEach(card => {
            if (!this.cards.has(card)) {
                this.setupCard(card);
                this.cards.add(card);
            }
        });
    }

    observe() {
        const observer = new MutationObserver((mutations) => {
            let shouldRefresh = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    shouldRefresh = true;
                }
            });
            if (shouldRefresh) this.refresh();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    setupCard(card) {
        let overlay = card.querySelector('.spotlight-overlay');
        
        // Auto-inject overlay if missing (helper)
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'spotlight-overlay absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none';
            // Ensure z-index is correct if needed, but usually it should be behind content.
            // However, typical usage expects the structure to be ready. 
            // If we auto-inject, we must be careful. Let's assume structure is provided OR inject as first child.
            card.prepend(overlay);
        }

        card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card, overlay));
        card.addEventListener('mouseenter', () => this.handleMouseEnter(overlay));
        card.addEventListener('mouseleave', () => this.handleMouseLeave(overlay));
    }

    handleMouseMove(e, card, overlay) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update gradient position
        overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.15), transparent 80%)`;
    }

    handleMouseEnter(overlay) {
        overlay.style.opacity = '1';
    }

    handleMouseLeave(overlay) {
        overlay.style.opacity = '0';
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    new SpotlightManager();
});
