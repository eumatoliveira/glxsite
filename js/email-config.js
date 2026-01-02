/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLX PARTNERS - EMAIL CONFIGURATION & INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PROPÓSITO (WHY - Nível CTO):
 * -----------------------------
 * Módulo crítico responsável por envio de leads sem necessidade de backend.
 * EmailJS permite MVP rápido sem custos de servidor, mas introduz dependência
 * de terceiro. Este arquivo centraliza toda configuração para facilitar migração
 * futura para backend próprio.
 * 
 * JUSTIFICATIVA TÉCNICA:
 * 1. **Custo**: $0 até 500 emails/mês (vs $5-20/mês DigitalOcean + manutenção)
 * 2. **Velocidade**: Deploy imediato sem provisionar servidores
 * 3. **Simplicidade**: Frontend-only, sem APIs a manter
 * 4. **Tradeoff**: Quotas limitadas, menos controle, expõe Public Key no client
 * 
 * CONFIGURAÇÃO ATUAL (PRODUCTION):
 * ---------------------------------
 * - PUBLIC_KEY:   kmX7xEdJ5TF8pKbwi
 * - SERVICE_ID:   service_y8pgvhf   (Gmail SMTP configurado)
 * - TEMPLATE_ID:  template_y3g4zb1  (Template com variáveis {{nome}}, {{email}}, etc)
 * - TO_EMAIL:     contato@glxpartners.com, matheus.rob.oliveira@gmail.com
 * - QUOTA:        500 emails/mês (Free Tier)
 * - STATUS:       ✅ Configurado e testado em 2026-01-02
 * 
 * SEGURANÇA (CRITICAL):
 * ----------------------
 * ⚠️  **PUBLIC_KEY é pública por design**: Não é senha, mas exposta no client
 * ⚠️  **Rate Limiting**: EmailJS limita 500/mês, mas sem proteção contra spam no client
 * ⚠️  **Sem CAPTCHA**: Qualquer bot pode enviar emails (MITIGAÇÃO: monitorar quota)
 * ✅ **Sem dados sensíveis**: Apenas lead info (nome, email, desafio) - nada confidencial
 * ✅ **HTTPS only**: EmailJS SDK requer HTTPS em produção
 * 
 * DEPENDÊNCIAS EXTERNAS:
 * -----------------------
 * - EmailJS Browser SDK v3.x (CDN: https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js)
 * - Carregado em index.html via <script> tag
 * - Disponível globalmente como `window.emailjs`
 * 
 * VARIÁVEIS DO TEMPLATE (CONTRATO COM EMAILJS):
 * ----------------------------------------------
 * As seguintes variáveis DEVEM existir no template EmailJS:
 * - {{nome}}      → Nome completo do lead
 * - {{cargo}}     → Cargo na empresa (ex: "CEO", "Diretor")
 * - {{email}}     → Email de contato
 * - {{desafio}}   → Principal desafio da clínica (ex: "Faturamento")
 * - {{mensagem}}  → Mensagem ou dúvida adicional (opcional)
 * - {{to_email}}  → Destinatários (preenchido automaticamente)
 * 
 * EXEMPLO DE EMAIL ENVIADO:
 * -------------------------
 * Para: contato@glxpartners.com, matheus.rob.oliveira@gmail.com
 * Assunto: Nova Solicitação de Análise - GLX Partners
 * 
 * Corpo:
 * ```
 * Nova solicitação recebida:
 * 
 * Nome: João Silva
 * Cargo: CEO
 * E-mail: joao@clinica.com.br
 * Principal Desafio: Reduzir custos operacionais
 * Mensagem: Gostaria de agendar uma reunião
 *    Assunto: Nova Solicitação de Análise - GLX Partners
 *    
 *    Corpo:
 *    Nova solicitação de análise recebida:
 *    
 *    Nome: {{nome}}
 *    Cargo: {{cargo}}
 *    E-mail: {{email}}
 *    Principal Desafio: {{desafio}}
 *    
 *    Mensagem:
 *    {{mensagem}}
 *    
 *    ---
 *    Enviado via formulário GLX Partners
 *    
 *    Configure o "To Email" como: contato@glxpartners.com
 *    Copie o TEMPLATE_ID gerado
 * 
 * 4. Vá em "Account" > "General" e copie seu PUBLIC_KEY
 * 
 * 5. Substitua os valores abaixo pelas suas credenciais:
 */

const EMAILJS_CONFIG = {
    // Substitua pelos seus valores reais do EmailJS
    PUBLIC_KEY: 'kmX7xEdJ5TF8pKbwi',      // Sua chave pública do EmailJS
    SERVICE_ID: 'service_y8pgvhf',       // ID do serviço de email configurado
    TEMPLATE_ID: 'template_y3g4zb1',     // ID do template de email criado
    
    // Emails de destino (configure ambos no template EmailJS separados por vírgula)
    // No template EmailJS, configure o campo "To Email" como: {{to_email}}
    TO_EMAIL: 'contato@glxpartners.com, matheus.rob.oliveira@gmail.com'
};

// Inicializar EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS inicializado com sucesso');
    } else {
        console.error('❌ EmailJS SDK não carregado');
    }
})();

/**
 * Função para enviar o formulário de contato
 * @param {Object} formData - Dados do formulário
 * @returns {Promise} - Promessa do envio
 */
function sendContactEmail(formData) {
    // Verificar se as credenciais foram configuradas
    if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || 
        EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' || 
        EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
        
        const errorMsg = '⚠️ Configuração do EmailJS pendente! Substitua os placeholders em js/email-config.js pelas suas chaves reais.';
        console.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
    }

    const templateParams = {
        nome: formData.nome,
        cargo: formData.cargo,
        email: formData.email,
        desafio: formData.desafio,
        mensagem: formData.mensagem || 'Não informada',
        to_email: EMAILJS_CONFIG.TO_EMAIL
    };
    
    return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    );
}

// Exportar para uso global
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
window.sendContactEmail = sendContactEmail;
