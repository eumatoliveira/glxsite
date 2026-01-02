# GLX Partners - WordPress & Elementor Compatibility Guide

Este site foi desenvolvido com tecnologias modernas (Tailwind CSS, Vanilla JS, HTML5). Para utilizá-lo dentro de um ecossistema WordPress/Elementor, você tem duas opções principais:

## 1. Importação via Elementor (JSON)
O Elementor permite importar estruturas via JSON se transformadas em "Templates". 
Para isso:
- Utilize o plugin **"Elementor Template Importer"**.
- Ou converta os blocos HTML em shortcodes usando o plugin **"Shortcoder"**.

## 2. Hospedagem Híbrida (Recomendado)
Você pode subir esta pasta estática para um subdiretório (ex: `seusite.com.br/lp/`) no mesmo servidor do WordPress.
O arquivo `.htaccess` incluído já garante que não haverá conflitos de rota com o WordPress.

## 3. Conversão para Shortcode
Copie o conteúdo de `index.html` (dentro da tag `<body>`) e cole em um widget de **HTML Personalizado** do Elementor.
Certifique-se de que os arquivos CSS e JS no cabeçalho estejam carregados corretamente no seu tema WordPress (via `functions.php` ou plugins de Header/Footer).

---
*Desenvolvedor: Antigravity AI*
