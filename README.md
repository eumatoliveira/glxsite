# 🏛️ GLX Partners - Lean Healthcare Website

> **Arquitetura Refatorada por IA Staff Engineer**
> Segurança | Performance | Observabilidade | UX Premium

---

## 📁 Estrutura do Projeto

A organização segue o padrão de **governança de arquitetura** para facilitar a escalabilidade e manutenção:

- **`index.html`**: Landing page principal (Single Page Application feel).
- **`css/`**: Estilos globais e utilitários.
- **`js/`**: Lógica modularizada (componentes visuais, animações, lógica de negócio).
- **`img/`**: Assets otimizados (WebP/SVG).

## 🚀 Como Rodar Localmente

1. **Clone o repositório**

```bash
git clone https://github.com/glx-partners/leanhealth-website.git
cd leanhealth-website
```

2. **Instale um servidor estático**

```bash
npm install -g http-server
```

3. **Inicie o servidor**

```bash
http-server -p 8080
```

4. **Acesse no navegador**

Abra `http://localhost:8080` no seu navegador.

---

## 📋 OVERVIEW

Landing page premium para GLX Partners, consultoria especializada em Lean Healthcare.

### ✨ Features

- ✅ **Componentização Modular**: HTML separado em componentes reutilizáveis
- ✅ **Scroll Animations**: Intersection Observer API com suporte a `prefers-reduced-motion`
- ✅ **Web Vitals Tracking**: Observabilidade completa (LCP, FID, CLS)
- ✅ **Segurança**: CSP, sanitização de inputs, rate limiting
- ✅ **Performance**: Lazy loading, otimização de assets
- ✅ **Responsivo**: Mobile-first com breakpoints fluidos

---

## 🚀 QUICK START

### Desenvolvimento Local

```bash
# Instalar servidor estático
npm install -g http-server

# Rodar
cd leanhealth-website
http-server -p 8080

# Acessar
http://localhost:8080
```

### Produção

```bash
# Deploy para Netlify/Vercel
netlify deploy --prod

# Ou copiar pasta inteira para servidor web
rsync -avz ./ user@server:/var/www/glx/
```

---

## 📁 ESTRUTURA DE PASTAS

```
leanhealth-website/
├── index.html                 # Página principal (refatorada)
├── thank-you.html             # Página de agradecimento
├── components/                # Componentes HTML
│   └── navigation.html
├── css/
│   ├── accessibility.css      # Estilos de acessibilidade
│   └── custom.css             # Estilos customizados
├── js/
│   ├── animations.js          # Animações Framer Motion
│   ├── calculator.js          # Lógica da calculadora
│   ├── email-config.js        # Config do EmailJS
│   ├── component-loader.js    # Sistema de componentes
│   ├── scroll-animations.js   # Animações de scroll
│   ├── web-vitals-tracker.js  # Tracking de performance
│   └── security-manager.js    # Segurança e sanitização
├── img/                       # Assets de imagem
└── README.md
```

---

## 🛡️ SEGURANÇA

### Content Security Policy (CSP)

Adicionar no servidor (nginx/apache):

```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.emailjs.com https://www.google-analytics.com;
" always;
```

### Subresource Integrity (SRI)

Scripts CDN incluem hashes SRI para garantir integridade.

### Input Sanitization

Todos os inputs de formulário são sanitizados via `securityManager.sanitizeHTML()`.

---

## 📊 OBSERVABILIDADE

### Web Vitals

Métricas coletadas automaticamente:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **FCP** (First Contentful Paint): < 1.8s
- **TTFB** (Time to First Byte): < 800ms

Visualizar no console:
```javascript
console.table(window.webVitalsTracker.getSummary());
```

### Google Analytics 4

Eventos customizados:
- `web_vitals` - Métricas de performance
- `form_submit` - Envio de formulário
- `whatsapp_click` - Clique no WhatsApp
- `calculator_use` - Uso da calculadora

---

## 🎨 DESIGN SYSTEM

### Cores

```css
:root {
    --primary: #7c3aed;      /* Vibrant Purple */
    --secondary: #d946ef;    /* Magenta */
    --accent: #0ea5e9;       /* Sky Blue */
    --background-dark: #09090b;
    --surface-dark: #18181b;
}
```

### Tipografia

- **Font**: Plus Jakarta Sans (Google Fonts)
- **Escalação**: Modular Scale (1.250)

### Animações

- **Micro-interações**: Hover, click, focus
- **Scroll**: Fade-in, slide-up com Intersection Observer
- **Transições**: Spring physics via CSS cubic-bezier

---

## 🧪 TESTES

### Performance Audit

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:8080
```

### Acessibilidade

```bash
# axe-core
npm install -g @axe-core/cli
axe http://localhost:8080
```

---

## 📈 ROADMAP

- [ ] Converter para Astro/Next.js (SSG)
- [ ] Setup CI/CD (GitHub Actions + Netlify)
- [ ] A/B Testing (Google Optimize)
- [ ] Internationalization (i18n)
- [ ] CMS Integration (Strapi/Contentful)

---

## 📝 CHANGELOG

### v2.0.0 (2026-01-02) - Refatoração Completa

#### Added
- Sistema de componentização modular
- Scroll animations com Intersection Observer
- Web Vitals tracking
- Security manager (CSP, sanitization)
- SRI para scripts CDN

#### Changed
- Refatorado index.html (750 → 400 linhas)
- Melhorado feedback visual da calculadora
- Otimizado loading de assets

#### Security
- Adicionado CSP headers
- Implementado input sanitization
- Rate limiting para formulário

---

## 📄 LICENÇA

Propriedade de GLX Partners © 2024-2026

---

## 👥 CRÉDITOS

- **Design & Development**: GLX Partners Team
- **IA Architect**: Google Antigravity (Gemini Ultra)
- **Frameworks**: Tailwind CSS, Chart.js, EmailJS

---

**Built with ❤️ and AI**
