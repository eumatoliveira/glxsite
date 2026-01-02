/**
 * Bento Gallery - Modern CSS Grid Implementation
 * Modern Bento/Masonry layout for Lean Healthcare
 * @[/system-design] @[/arquiteturastaff]
 */

const LEAN_HEALTH_IMAGES = [
    {
        id: "1",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
        title: "Recepção Eficiente",
        span: "md:col-span-2 md:row-span-1"
    },
    {
        id: "2",
        img: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
        title: "Precisão Cirúrgica",
        span: "md:col-span-1 md:row-span-1"
    },
    {
        id: "3",
        img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
        title: "Tecnologia de Ponta",
        span: "md:col-span-1 md:row-span-2"
    },
    {
        id: "4",
        img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
        title: "Foco no Paciente",
        span: "md:col-span-2 md:row-span-1"
    },
    {
        id: "5",
        img: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop",
        title: "Infraestrutura",
        span: "md:col-span-1 md:row-span-1"
    },
    {
        id: "6",
        img: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=800&auto=format&fit=crop",
        title: "Gestão à Vista",
        span: "md:col-span-1 md:row-span-1"
    }
];

class BentoGallery {
    constructor(containerId, items) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.items = items;
        this.init();
    }

    init() {
        // Clear and setup grid
        this.container.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]';
        this.container.style.position = 'relative';
        
        this.createItems();
        this.initSpotlight();
    }

    createItems() {
        this.container.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const el = document.createElement('div');
            // Support for the span classes from data
            el.className = `bento-item spotlight-card relative transition-all duration-700 ease-out group overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 ${item.span}`;
            
            // Initial animation state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            el.innerHTML = `
                <div class="spotlight-overlay absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none z-20"></div>
                
                <!-- Content Container -->
                <div class="relative w-full h-full overflow-hidden z-10">
                    <!-- Image -->
                    <img src="${item.img}" alt="${item.title}" 
                         class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100">
                    
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                        <div class="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 class="text-white font-bold text-xl mb-1">${item.title}</h3>
                            <div class="w-12 h-1 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    </div>
                </div>

                <!-- Hover Glow -->
                <div class="absolute inset-0 border-2 border-transparent group-hover:border-white/10 rounded-[2.5rem] pointer-events-none transition-colors duration-500 z-30"></div>
            `;
            
            this.container.appendChild(el);
            
            // Staggered Entry Animation
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 150));
        });
    }

    initSpotlight() {
        // If SpotlightManager exists (from spotlight.js), it will pick up these cards
        if (window.SpotlightManager) {
            // Give it a small delay for DOM to settle
            setTimeout(() => {
                const manager = new window.SpotlightManager();
                manager.initSpotlight();
            }, 500);
        }
    }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('masonry-grid');
    if (grid) {
        new BentoGallery('masonry-grid', LEAN_HEALTH_IMAGES);
    }
});
