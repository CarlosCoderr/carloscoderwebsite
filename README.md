# carloscoder.com

Sitio estático (HTML + CSS + JS, sin build). Cada proyecto es una carpeta; todos comparten el mismo sistema de diseño.

```
carloscoder.com/
├── index.html              ← portada: lista de proyectos
├── assets/                 ← COMPARTIDO por todos los proyectos
│   ├── css/
│   │   ├── main.css        ← entrada única (importa lo de abajo en capas)
│   │   ├── tokens.css      ← colores, tipografía, espacios, radios (cambiar marca aquí)
│   │   ├── base.css        ← reset y tipografía
│   │   ├── components.css  ← .btn .card .chk .tab .faq .badge …
│   │   ├── layout.css      ← .container .section .grid .site-header .site-footer
│   │   └── deck.css        ← presentaciones 16:9 (solo si la página es un deck)
│   ├── js/
│   │   ├── core.js         ← WhatsApp (data-wa) y tabs
│   │   └── deck.js         ← motor de presentaciones
│   └── img/                ← logo y fotos de marca
├── _plantilla/index.html   ← copia esta carpeta para crear un proyecto nuevo
└── presentacion-de-venta/               ← un proyecto = una carpeta
    ├── index.html
    ├── brochure.css        ← solo lo exclusivo del proyecto (dentro de @layer page)
    └── brochure.js
```

## Crear un proyecto nuevo
1. Copia `_plantilla/` y renómbrala (`mi-proyecto/`). Se publica en `carloscoder.com/mi-proyecto/`.
2. Edita `index.html`. Si necesitas estilos propios, crea `mi-proyecto.css` envuelto en `@layer page { … }`.
3. Añade la tarjeta en `index.html` de la raíz.

## Reglas
- **Colores, fuentes y espacios solo vía variables** de `tokens.css` (`var(--sage)`, `var(--radius-m)`…). Nunca valores sueltos.
- Si algo se usa en 2 proyectos, se sube a `components.css`; si es de uno solo, se queda en su carpeta.
- Rutas **relativas** (`../assets/...`), así funciona igual con doble clic en local y en el dominio.
- Capas CSS: `tokens < base < components < layout < deck < page`. Lo del proyecto siempre gana.
- WhatsApp: `<a data-wa>`; el mensaje va en `<body data-wa-message="…">` o en el propio enlace. Número en `core.js`.
- Un proyecto con presentación horizontal usa `<body class="deck">` + `deck.css` + `deck.js` (ver `presentacion-de-venta/`).
