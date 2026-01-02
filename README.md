# 🏛️ GLX Partners - Lean Healthcare Website

> **Arquitetura High-End Refatorada por IA Staff Engineer (2050 Ready)**
> Performance | Motion UX | Multi-Cloud | Segurança | Observabilidade

---

## 📁 Estrutura de Governança de Arquitetura

Este projeto foi reconstruído seguindo os princípios de **Separação de Preocupações (SoP)** e **Responsabilidade Única (SRP)**, garantindo manutenibilidade e escala:

- **Estética & Motion**: Implementação de **Mesh Gradients via CSS**, **Bento Grid Layouts** e **Interações Magnéticas**.
- **Infraestrutura**: Configurações nativas para **Vercel, Netlify, Cloudflare, AWS, GCP, Azure e Firebase**.
- **Segurança**: **Sanitização de HTML dinâmica**, **CSP estrito** e mitigação de alucinações de estado.
- **Observabilidade**: Monitoramento contínuo de **Web Vitals** e resumo de performance no console.

---

## 🚀 Modernização & Design Insights (v2.5)

### ✨ Principais Inovações
- ✅ **Mesh Gradient v2**: Fundo dinâmico animado via GPU (sem imagens pesadas).
- ✅ **Bento Grid Showcase**: Exibição de cases e galeria utilizando grids assimétricos modernos (Estilo Apple/Linear).
- ✅ **Spotlight Interaction**: Cards interativos com rastreamento de mouse e gradientes radiais dinâmicos.
- ✅ **Interactive Folder System**: Componente de materiais gratuitos com física de espalhamento fluida.
- ✅ **Glassmorphism Nav**: Navegação flutuante com desfoque de alta fidelidade (`backdrop-blur-2xl`).

---

## 🌐 Deploy Multi-Cloud (Universal Support)

O repositório está configurado para deploy automático em qualquer uma das plataformas abaixo:

| Cloud | Arquivo de Configuração |
| :--- | :--- |
| **Cloudflare** | `_headers`, `_redirects`, `wrangler.toml` |
| **Vercel** | `vercel.json` |
| **Netlify** | `netlify.toml` |
| **AWS Amplify** | `amplify.yml` |
| **GCP App Engine** | `app.yaml` |
| **Azure Static Web Apps** | `staticwebapp.config.json` |
| **Firebase Hosting** | `firebase.json` |
| **WordPress/Apache** | `.htaccess` |

---

## 📋 Arquitetura Técnica

### 📁 Estrutura de Pastas (SRP Compliance)

```
leanhealth-website/
├── index.html                 # Orquestrador de Layout (Refatorado)
├── components/                # Blocos HTML reutilizáveis
├── css/
│   ├── accessibility.css      # Policiamento de contraste e foco
│   └── animations.css         # Keyframes de alta fidelidade
├── js/
│   ├── logic/                 # Lógica de Negócio (Calculadora, Email)
│   ├── ui/                    # Componentes Visuais (Bento, Folder, Spotlight)
│   ├── infrastructure/        # Observabilidade e Segurança (Web Vitals, Security)
│   └── motion/                # Motores de Animação (Scroll, Split-Text)
└── . [deployment configs]     # Configurações de nuvem
```

---

## 🛡️ Segurança & Auditoria (/appauditor)

### Proteção de Camada 7
Todos os formulários passam pelo `securityManager.js`, que aplica sanitização contra XSS e limitação de taxa (rate limiting) local para prevenir spam.

### Content Security Policy (CSP)
O site utiliza políticas estritas para garantir que apenas scripts autorizados (Google, EmailJS) sejam executados, eliminando riscos de injeção externa.

---

## 📊 Observabilidade de Performance (/sre)

O sistema de monitoramento integrado (`web-vitals-tracker.js`) reporta o estado de saúde do site para o console em tempo real.

Para auditoria rápida, execute:

```javascript
console.table(window.webVitalsTracker.getSummary());
```

---

## 📝 Changelog Recente

### v2.5.0 (2026-01-02) - A Era Bento & Cloud
- **REFACTOR**: Substituição de Masonry.js por **Magic Bento** nativo CSS Grid.
- **FEAT**: Implementação de Motor de **Spotlight** para cards de métricas.
- **UX**: Ajuste de física na **Pasta de Materiais** (prevenção de colisão de texto).
- **INFRA**: Adição de compatibilidade universal para 7+ provedores de nuvem.
- **DOCS**: Guia de compatibilidade para **WordPress e Elementor** incluído.

---

## 👥 Créditos & Governança

- **Arquiteto de Sistemas**: Google Antigravity (AI Staff Engineer)
- **Design Strategy**: System Design Motion Architect
- **Propriedade**: GLX Partners © 2026

---

**Built with ❤️ and AI Architecture Governance**
