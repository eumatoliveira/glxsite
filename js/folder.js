/**
 * Folder Component - Vanilla JS Implementation
 * Interactive folder that opens on click and reveals items
 */

class FolderComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.color = options.color || '#5227FF';
        this.size = options.size || 1.5;
        this.items = options.items || [
            { title: 'Guia Lean (PDF)', icon: 'description' },
            { title: 'Checklist (XLS)', icon: 'table_view' }, 
            { title: 'Case Study (PDF)', icon: 'menu_book' }
        ];
        
        this.isOpen = false;
        this.paperOffsets = this.items.map(() => ({ x: 0, y: 0 }));
        
        // Colors
        this.folderBackColor = this.darkenColor(this.color, 0.08);
        this.paperColors = [
            this.darkenColor('#ffffff', 0.1),
            this.darkenColor('#ffffff', 0.05),
            '#ffffff'
        ];

        this.init();
    }

    darkenColor(hex, percent) {
        let color = hex.startsWith('#') ? hex.slice(1) : hex;
        if (color.length === 3) color = color.split('').map(c => c + c).join('');
        
        const num = parseInt(color, 16);
        let r = (num >> 16) & 0xff;
        let g = (num >> 8) & 0xff;
        let b = num & 0xff;
        
        r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
        g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
        b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
        
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    init() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="folder-wrapper relative mx-auto" style="width: 100px; height: 80px; transform: scale(${this.size}); transform-origin: center;">
                <div class="folder-group relative w-full h-full cursor-pointer transition-all duration-200 ease-in hover:-translate-y-2">
                    
                    <!-- Back Folder -->
                    <div class="folder-back absolute w-[100px] h-[80px] rounded-tr-[10px] rounded-b-[10px]" style="background-color: ${this.folderBackColor};">
                        <span class="absolute bottom-[98%] left-0 w-[30px] h-[10px] rounded-t-[5px]" style="background-color: ${this.folderBackColor};"></span>
                    </div>

                    <!-- Papers -->
                    ${this.renderPapers()}

                    <!-- Front Flap (Two parts for animation) -->
                    <div class="folder-flap-1 absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out" 
                         style="background-color: ${this.color}; border-radius: 5px 10px 10px 10px;"></div>
                    
                    <div class="folder-flap-2 absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out" 
                         style="background-color: ${this.color}; border-radius: 5px 10px 10px 10px;"></div>

                </div>
                
                <!-- Label -->
                <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-300" id="folder-label">
                    <span class="text-xs font-bold bg-black/80 text-white px-3 py-1 rounded-full">Clique para abrir</span>
                </div>
            </div>
        `;
    }

    renderPapers() {
        return this.items.map((item, i) => `
            <div class="paper-item absolute z-20 bottom-[10%] left-1/2 -translate-x-1/2 translate-y-[10%] transition-all duration-500 ease-in-out flex items-center justify-center shadow-sm border border-slate-100/50 overflow-hidden group/paper"
                 data-index="${i}"
                 style="
                    background-color: ${this.paperColors[i]};
                    border-radius: 10px;
                    width: ${70 + (i * 10)}%;
                    height: ${80 - (i * 10)}%;
                 ">
                 <div class="text-center opacity-0 transition-opacity duration-300 open:opacity-100 flex flex-col items-center">
                    <span class="material-symbols-rounded text-slate-400 mb-1 text-[10px]">${item.icon}</span>
                    <span class="text-[6px] font-bold text-slate-600 block px-1 truncate w-full max-w-[60px]">${item.title}</span>
                 </div>
                 
                 <!-- Hover overlay -->
                 <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover/paper:opacity-100 transition-opacity"></div>
            </div>
        `).join('');
    }

    attachEvents() {
        const group = this.container.querySelector('.folder-group');
        const papers = this.container.querySelectorAll('.paper-item');
        const flap1 = this.container.querySelector('.folder-flap-1');
        const flap2 = this.container.querySelector('.folder-flap-2');
        const label = this.container.querySelector('#folder-label');

        // Hover Effect on Container
        group.addEventListener('mouseenter', () => {
            if (!this.isOpen) {
                flap1.style.transform = 'skew(15deg) scaleY(0.6)';
                flap2.style.transform = 'skew(-15deg) scaleY(0.6)';
                label.style.opacity = '1';
            }
        });

        group.addEventListener('mouseleave', () => {
            if (!this.isOpen) {
                flap1.style.transform = '';
                flap2.style.transform = '';
                label.style.opacity = '0';
            }
        });

        // Click to Open
        group.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            this.updateState(flap1, flap2, papers, group, label);
        });

        // Paper Interactions
        papers.forEach((paper, i) => {
            paper.addEventListener('mousemove', (e) => {
                if (!this.isOpen) return;
                const rect = paper.getBoundingClientRect();
                const x = (e.clientX - (rect.left + rect.width/2)) * 0.2;
                const y = (e.clientY - (rect.top + rect.height/2)) * 0.2;
                
                const baseTransform = this.getOpenTransform(i);
                paper.style.transform = `${baseTransform} translate(${x}px, ${y}px) scale(1.1)`;
            });

            paper.addEventListener('mouseleave', () => {
                if (!this.isOpen) return;
                const baseTransform = this.getOpenTransform(i);
                paper.style.transform = baseTransform;
            });
            
            // Simulation of "Download" on click
            paper.addEventListener('click', (e) => {
                if(!this.isOpen) return;
                e.stopPropagation(); // prevent folder close
                alert(`Baixando: ${this.items[i].title}`);
            });
        });
    }

    updateState(flap1, flap2, papers, group, label) {
        if (this.isOpen) {
            // Open State
            group.style.transform = 'translateY(-10px)';
            flap1.style.transform = 'skew(15deg) scaleY(0.6)';
            flap2.style.transform = 'skew(-15deg) scaleY(0.6)';
            label.style.opacity = '0';

            papers.forEach((paper, i) => {
                paper.style.transitionDelay = `${i * 50}ms`;
                paper.style.transform = this.getOpenTransform(i);
                
                // Show Content
                const content = paper.querySelector('div');
                if(content) {
                    content.classList.remove('opacity-0');
                    content.classList.add('opacity-100');
                }
                
                // Adjust Size for visibility
                if (i === 0) { paper.style.width = '70%'; paper.style.height = '80%'; }
                if (i === 1) { paper.style.width = '80%'; paper.style.height = '80%'; }
                if (i === 2) { paper.style.width = '90%'; paper.style.height = '80%'; }
            });

        } else {
            // Closed State
            group.style.transform = '';
            flap1.style.transform = '';
            flap2.style.transform = '';
            
            papers.forEach((paper, i) => {
                paper.style.transform = '';
                paper.style.transitionDelay = '0ms';
                // Hide Content
                const content = paper.querySelector('div');
                if(content) {
                    content.classList.remove('opacity-100');
                    content.classList.add('opacity-0');
                }
                
                // Reset Size
                if (i === 0) { paper.style.width = '70%'; paper.style.height = '80%'; }
                if (i === 1) { paper.style.width = '80%'; paper.style.height = '70%'; }
                if (i === 2) { paper.style.width = '90%'; paper.style.height = '60%'; }
            });
        }
    }

    getOpenTransform(index) {
        if (index === 0) return 'translate(-110%, -60%) rotate(-15deg) scale(1.5)'; // Left
        if (index === 1) return 'translate(110%, -60%) rotate(15deg) scale(1.5)';  // Right
        if (index === 2) return 'translate(0%, -90%) rotate(0deg) scale(1.5)';      // Center
        return '';
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('folder-container')) {
        new FolderComponent('folder-container', {
            color: '#7c3aed', // Primary Violet
            size: 2.5
        });
    }
});
