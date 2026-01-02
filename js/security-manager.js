/**
 * Security Manager - Sistema de Segurança e Sanitização
 * CSP, Input Sanitization, XSS Protection
 */

class SecurityManager {
    constructor() {
        this.sanitizationRules = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
            allowedAttributes: {
                'a': ['href', 'title', 'target']
            }
        };

        this.init();
    }

    init() {
        this.setupCSP();
        this.monitorSecurityEvents();
    }

    /**
     * Content Security Policy - Definir headers via meta tag
     */
    setupCSP() {
        // CSP já deve vir do servidor, mas podemos adicionar via meta como fallback
        const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!cspMeta) {
            console.warn('[Security] CSP meta tag não encontrada - considere adicionar no servidor');
        }
    }

    /**
     * Sanitiza string removendo possíveis vetores de XSS
     */
    sanitizeHTML(dirty) {
        const temp = document.createElement('div');
        temp.textContent = dirty;
        return temp.innerHTML;
    }

    /**
     * Sanitiza URL para prevenir javascript: e data: URIs
     */
    sanitizeURL(url) {
        try {
            const parsed = new URL(url, window.location.origin);
            const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
            
            if (!allowedProtocols.includes(parsed.protocol)) {
                console.warn('[Security] Protocolo não permitido:', parsed.protocol);
                return '#';
            }
            
            return parsed.href;
        } catch (e) {
            console.error('[Security] URL inválida:', url);
            return '#';
        }
    }

    /**
     * Valida input de formulário
     */
    validateFormInput(input, type = 'text') {
        const validators = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^\+?[\d\s\-()]+$/.test(value),
            text: (value) => value.length > 0 && value.length < 1000,
            number: (value) => !isNaN(parseFloat(value)) && isFinite(value)
        };

        const validator = validators[type] || validators.text;
        return validator(input);
    }

    /**
     * Monitora eventos de segurança
     */
    monitorSecurityEvents() {
        // Detectar Content Security Policy violations
        document.addEventListener('securitypolicyviolation', (e) => {
            console.error('[Security] CSP Violation:', {
                violatedDirective: e.violatedDirective,
                effectiveDirective: e.effectiveDirective,
                originalPolicy: e.originalPolicy,
                blockedURI: e.blockedURI,
                sourceFile: e.sourceFile
            });

            // Enviar para analytics se configurado
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'exception', {
                    description: `CSP Violation: ${e.violatedDirective}`,
                    fatal: false
                });
            }
        });
    }

    /**
     * Rate limiting simples para prevenir abuse
     */
    createRateLimiter(maxAttempts = 5, windowMs = 60000) {
        const attempts = new Map();

        return (key) => {
            const now = Date.now();
            const userAttempts = attempts.get(key) || [];
            
            // Filtrar tentativas antigas
            const recentAttempts = userAttempts.filter(time => now - time < windowMs);
            
            if (recentAttempts.length >= maxAttempts) {
                return {
                    allowed: false,
                    retryAfter: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
                };
            }

            recentAttempts.push(now);
            attempts.set(key, recentAttempts);

            return { allowed: true };
        };
    }
}

// Instância global
window.securityManager = new SecurityManager();
