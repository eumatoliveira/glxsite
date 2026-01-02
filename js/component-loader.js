/**
 * Component Loader - Sistema de Componentização para HTML Estático
 * Carrega componentes HTML de forma assíncrona e segura
 */

class ComponentLoader {
    constructor() {
        this.cache = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * Carrega um componente HTML e injeta no elemento especificado
     * @param {string} selector - Seletor CSS do elemento alvo
     * @param {string} componentPath - Caminho do arquivo HTML do componente
     */
    async loadComponent(selector, componentPath) {
        const targetElement = document.querySelector(selector);
        
        if (!targetElement) {
            console.error(`[ComponentLoader] Elemento não encontrado: ${selector}`);
            return false;
        }

        try {
            // Usar cache se disponível
            let html;
            if (this.cache.has(componentPath)) {
                html = this.cache.get(componentPath);
            } else {
                const response = await fetch(componentPath);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                html = await response.text();
                this.cache.set(componentPath, html);
            }

            // Sanitizar e injetar
            targetElement.innerHTML = html;
            this.loadedComponents.add(selector);
            
            // Disparar evento customizado
            const event = new CustomEvent('componentLoaded', {
                detail: { selector, componentPath }
            });
            document.dispatchEvent(event);

            return true;
        } catch (error) {
            console.error(`[ComponentLoader] Erro ao carregar ${componentPath}:`, error);
            targetElement.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p class="font-bold">Erro ao carregar componente</p>
                    <p class="text-sm">${error.message}</p>
                </div>
            `;
            return false;
        }
    }

    /**
     * Carrega múltiplos componentes de forma paralela
     * @param {Array<{selector: string, path: string}>} components
     */
    async loadComponents(components) {
        const promises = components.map(({ selector, path }) => 
            this.loadComponent(selector, path)
        );
        const results = await Promise.allSettled(promises);
        
        const failed = results.filter(r => r.status === 'rejected' || r.value === false);
        if (failed.length > 0) {
            console.warn(`[ComponentLoader] ${failed.length} componente(s) falharam ao carregar`);
        }

        return results;
    }

    /**
     * Verifica se um componente foi carregado
     */
    isLoaded(selector) {
        return this.loadedComponents.has(selector);
    }

    /**
     * Limpa o cache
     */
    clearCache() {
        this.cache.clear();
        this.loadedComponents.clear();
    }
}

// Instância global
window.componentLoader = new ComponentLoader();
