# Skill: Astro + Cloudflare Project Boilerplate

Este documento es un prompt/skill para que un agente de IA configure desde cero un proyecto web con el stack Astro + Cloudflare. Sigue las instrucciones de arriba a abajo. Reemplaza todos los placeholders `[PROJECT_NAME]`, `[ACCOUNT_ID]`, etc. con los valores del proyecto en cuestión.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Astro 6.x |
| UI | React 19 (para componentes interactivos) |
| Estilos | Tailwind CSS v4 (via Vite plugin) |
| Animaciones | GSAP 3.x |
| Runtime / Deploy | Cloudflare Workers (`@astrojs/cloudflare`) |
| Base de datos | Cloudflare D1 (SQLite serverless) |
| Sesiones / Caché | Cloudflare KV |
| PDF / Render remoto | Cloudflare Browser Rendering (opcional) |
| CLI deploy | Wrangler v4 |
| Lenguaje | TypeScript (modo strict) |
| Node mínimo | 22.12.0 |

---

## 1. Crear el proyecto

```bash
npm create astro@latest [PROJECT_NAME]
# Seleccionar: Empty / TypeScript strict / No git (o sí, según preferencia)
cd [PROJECT_NAME]
```

---

## 2. Instalar dependencias

```bash
# Adaptador Cloudflare + React
npx astro add cloudflare react

# Tailwind CSS v4 (Vite plugin)
npm install tailwindcss @tailwindcss/vite

# GSAP
npm install gsap

# Wrangler (CLI de Cloudflare)
npm install wrangler --save-dev

# Librerías opcionales según proyecto
npm install embla-carousel          # Carrusel
npm install gsap                    # Animaciones (ya incluido arriba)
```

> **Node engines** — Agrega esto a `package.json`:
> ```json
> "engines": { "node": ">=22.12.0" }
> ```

---

## 3. Scripts en `package.json`

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "dev:cf": "wrangler dev --remote",
  "dev:cf:build": "astro build && wrangler dev --remote",
  "generate-types": "wrangler types"
}
```

---

## 4. Archivos de configuración

### `astro.config.mjs`

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()],
  adapter: cloudflare(),
});
```

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    ".astro/types.d.ts",
    "**/*",
    "./worker-configuration.d.ts"
  ],
  "exclude": ["dist"]
}
```

### `wrangler.jsonc`

```jsonc
{
  "compatibility_date": "2026-03-24",
  "compatibility_flags": ["nodejs_compat_v2"],
  "name": "[PROJECT_NAME]",
  "account_id": "[ACCOUNT_ID]",
  "main": "@astrojs/cloudflare/entrypoints/server",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  },
  "kv_namespaces": [
    {
      "binding": "SESSION",
      "id": "[KV_NAMESPACE_ID]"
    }
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_id": "[D1_DATABASE_ID]",
      "database_name": "[PROJECT_NAME]-db"
    }
  ]
  // Descomenta si necesitas PDF generation via Browser Rendering:
  // "browser": {
  //   "binding": "BROWSER",
  //   "remote": true
  // }
}
```

> **Crear recursos en Cloudflare:**
> ```bash
> # Crear D1 database
> wrangler d1 create [PROJECT_NAME]-db
>
> # Crear KV namespace
> wrangler kv namespace create SESSION
> ```
> Copia los IDs generados al `wrangler.jsonc`.

### `src/env.d.ts`

```ts
/// <reference types="astro/client" />

declare module 'cloudflare:workers' {
  export const env: {
    DB: D1Database;
    SESSION: KVNamespace;
    ASSETS: Fetcher;
    ADMIN_API_KEY: string;
    // BROWSER: Fetcher; // si usas Browser Rendering
  };
}
```

> Después de configurar `wrangler.jsonc` ejecuta `npm run generate-types` para regenerar `worker-configuration.d.ts` automáticamente.

### `.dev.vars` (NO commitear)

```
ADMIN_API_KEY=tu-clave-secreta-local
```

### `.gitignore` — entradas clave

```
.env
.env.production
.dev.vars
dist/
.wrangler/
node_modules/
```

---

## 5. Estructura de carpetas

```
[PROJECT_NAME]/
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0002_seed_data.sql
├── public/
│   ├── assets/          # Imágenes, SVGs, PDFs
│   ├── fonts/           # Fuentes self-hosted (.woff2)
│   └── favicon.svg
├── src/
│   ├── components/      # Componentes Astro reutilizables
│   ├── data/            # Tipos e interfaces TypeScript
│   ├── layouts/
│   │   └── Layout.astro # Layout principal
│   ├── pages/
│   │   ├── api/         # Endpoints del servidor
│   │   │   └── admin/   # Endpoints protegidos
│   │   └── index.astro
│   ├── scripts/         # JS client-side específico de página
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
├── astro.config.mjs
├── wrangler.jsonc
├── tsconfig.json
└── package.json
```

---

## 6. Global CSS (`src/styles/global.css`)

```css
/* Fuente de Google Fonts (body) */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Tailwind v4 */
@import "tailwindcss";

/* Fuente display self-hosted (variable font) */
@font-face {
  font-family: 'DisplayFont';
  src: url('/fonts/DisplayFont.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* Tema personalizado para Tailwind v4 */
@theme {
  --color-base: #073247;       /* Color principal */
  --color-white: #F4F4F4;
  --color-accent: #C23E3E;     /* Color de acento */
  --font-sans: 'Outfit', sans-serif;
  --font-display: 'DisplayFont', sans-serif;
}
```

> En Tailwind v4 **no existe** `tailwind.config.js`. Todo el tema va en `@theme {}` dentro del CSS.

---

## 7. Layout principal (`src/layouts/Layout.astro`)

```astro
---
import '../styles/global.css'
import Navbar from '../components/navbar.astro'
import Footer from '../components/footer.astro'

interface Props {
  title?: string
  bare?: boolean       // true = sin Navbar/Footer (útil para tours, iframes)
}
const { title = '[PROJECT_NAME]', bare = false } = Astro.props
const pageTitle = `[PROJECT_NAME] - ${title}`
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="[Descripción del proyecto]" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{pageTitle}</title>

    <!-- Open Graph -->
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content="[Descripción]" />
    <meta property="og:image" content="/assets/og-image.jpg" />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={pageTitle} />
  </head>
  <body>
    {!bare && <Navbar />}
    <slot />
    {!bare && <Footer />}
  </body>
</html>
```

---

## 8. Patrón de API route con D1

```ts
// src/pages/api/items.ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ locals }) => {
  const { DB } = locals.runtime.env

  const { results } = await DB.prepare(
    'SELECT * FROM items WHERE status = ?'
  ).bind('available').all()

  return Response.json({ items: results })
}
```

---

## 9. Patrón de API route protegida (Admin)

```ts
// src/pages/api/admin/update-item.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, locals }) => {
  const { DB, ADMIN_API_KEY } = locals.runtime.env
  const body = await request.json() as { key: string; id: number; value: string }

  if (body.key !== ADMIN_API_KEY) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  await DB.prepare('UPDATE items SET value = ? WHERE id = ?')
    .bind(body.value, body.id)
    .run()

  return Response.json({ ok: true })
}
```

---

## 10. Patrón de migración D1

```sql
-- migrations/0001_initial_schema.sql
CREATE TABLE IF NOT EXISTS items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  data       TEXT,           -- JSON serializado
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
```

```bash
# Aplicar migración en local (D1 local)
wrangler d1 execute [PROJECT_NAME]-db --local --file=migrations/0001_initial_schema.sql

# Aplicar migración en producción
wrangler d1 execute [PROJECT_NAME]-db --remote --file=migrations/0001_initial_schema.sql
```

---

## 11. GSAP — Patrón de uso en Astro

```astro
---
// src/components/AnimatedSection.astro
---

<section id="animated-section">
  <h2 class="reveal-title">Título</h2>
  <p class="reveal-text">Contenido</p>
</section>

<script>
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  gsap.registerPlugin(ScrollTrigger)

  gsap.from('.reveal-title', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#animated-section',
      start: 'top 80%',
    }
  })

  gsap.from('.reveal-text', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#animated-section',
      start: 'top 80%',
    }
  })
</script>
```

> GSAP se importa directamente en el `<script>` de Astro. Astro bundlea el JS del cliente automáticamente. No se necesita configuración adicional.

---

## 12. Tipos TypeScript para datos (`src/data/types.ts`)

```ts
export type ItemStatus = 'active' | 'inactive'

export interface Item {
  id: number
  slug: string
  name: string
  status: ItemStatus
  data?: Record<string, unknown>
}

// Helper para parsear JSON guardado en D1
export function parseItem(row: Record<string, unknown>): Item {
  return {
    ...row,
    data: row.data ? JSON.parse(row.data as string) : undefined,
  } as Item
}
```

---

## 13. Flujo de desarrollo

```bash
# Desarrollo local (sin Cloudflare bindings)
npm run dev

# Desarrollo con bindings de Cloudflare remotos
npm run dev:cf

# Build + desarrollo con bindings remotos
npm run dev:cf:build

# Regenerar tipos de Cloudflare (después de cambiar wrangler.jsonc)
npm run generate-types

# Deploy a producción
wrangler deploy
```

---

## 14. Checklist de arranque

- [ ] `npm create astro@latest` y seleccionar TypeScript strict
- [ ] Instalar dependencias (`cloudflare`, `react`, `tailwindcss`, `gsap`, `wrangler`)
- [ ] Crear D1 database con `wrangler d1 create`
- [ ] Crear KV namespace con `wrangler kv namespace create`
- [ ] Completar `wrangler.jsonc` con los IDs generados
- [ ] Ejecutar `npm run generate-types` para generar `worker-configuration.d.ts`
- [ ] Configurar `src/env.d.ts` con los bindings del proyecto
- [ ] Crear `.dev.vars` con las variables locales (no commitear)
- [ ] Copiar patrón de `Layout.astro` y personalizar meta tags
- [ ] Configurar `src/styles/global.css` con fuentes y colores del proyecto
- [ ] Crear las migraciones SQL y aplicarlas (`--local` primero, luego `--remote`)
- [ ] Verificar que `npm run dev:cf` funciona con los bindings

---

## Notas finales

- **Tailwind v4** no usa `tailwind.config.js`. Todo el tema va en `@theme {}` en el CSS.
- **Sin middleware**: La autenticación se maneja a nivel de route handler con `ADMIN_API_KEY`.
- **JSON en D1**: D1 no tiene tipo `JSON`; guarda arrays/objetos como `TEXT` y parsea con `JSON.parse()`.
- **`bare` layout**: Útil para páginas que no deben mostrar navbar/footer (tours 360, iframes, páginas de impresión).
- **GSAP con ScrollTrigger** requiere `gsap.registerPlugin(ScrollTrigger)` antes de usarlo.
