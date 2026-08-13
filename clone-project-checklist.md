# Checklist: clonar proyecto inmobiliario para nuevo cliente (Costamare)

Contexto para el agente: este repo es una copia directa de un proyecto Astro + Cloudflare
(D1 + KV + Workers, sin R2) que ya está en producción para OTRO cliente. El objetivo es
dejarlo desacoplado del proyecto original en config/infraestructura/secrets antes del primer
`wrangler deploy`, **manteniendo intencionalmente** las imágenes, escenas de tour y datos de
unidades del proyecto original como placeholders visuales/estructurales — estos se reemplazan
en una fase posterior, NO en esta pasada.

Recursos de Cloudflare del proyecto nuevo — YA CREADOS, no crear de nuevo:

| Recurso | Nombre | ID |
|---|---|---|
| D1 | `costamare-db` | `8a804132-1f37-441b-b6d0-068d4d5e0734` |
| KV | `SESSION` | `b3a0ceb00a54431297f4b582b433a23a` |
| R2 | — | No aplica a este proyecto |

Placeholders a reemplazar en todo el repo:
- `[OLD_PROJECT_NAME]` → nombre del proyecto original (ej. "Harmony Residences IV" / "hriv")
- `[OLD_D1_NAME]` → nombre del binding/database D1 del proyecto original en `wrangler.jsonc`
- `[OLD_ACCOUNT_ID]` / `[NEW_ACCOUNT_ID]` → cuentas de Cloudflare
- `[OLD_DOMAIN]` / `[NEW_DOMAIN]` → dominios

Ejecutar las fases en orden. No saltar la Fase 0.

---

## Fase 0 — Búsqueda de referencias hardcodeadas (hacer PRIMERO, antes de tocar nada)

Correr estos comandos desde la raíz del repo y anotar cada archivo que devuelva resultados.
No asumir que la lista de abajo es exhaustiva — es el punto de partida, no el final.

⚠️ Esta búsqueda es solo para **texto/branding/config**. NO incluye imágenes ni contenido de
tour/unidades — esos se preservan a propósito (ver nota al final de esta fase).

```bash
# Nombre del proyecto original en cualquier variante (ajustar el patrón al nombre real)
grep -rniE "[OLD_PROJECT_NAME]" --exclude-dir={node_modules,.git,.wrangler,dist} .

# Dominio original
grep -rniE "[OLD_DOMAIN]" --exclude-dir={node_modules,.git,.wrangler,dist} .

# IDs de Cloudflare (D1, KV, account_id) que puedan estar pegados fuera de wrangler.jsonc
grep -rniE "account_id|database_id|kv_namespaces" --exclude-dir={node_modules,.git,.wrangler,dist} .

# Filenames de PDF u otros artefactos con el nombre del cliente anterior embebido
grep -rniE "\.pdf[\"']" --exclude-dir={node_modules,.git,.wrangler,dist} src/

# Emails, teléfonos o WhatsApp del cliente anterior en el directorio de enlaces / footer
grep -rniE "wa\.me|mailto:|tel:" --exclude-dir={node_modules,.git,.wrangler,dist} src/
```

Reportar la lista completa de coincidencias antes de continuar a la Fase 1.

> **No tocar en esta fase ni en las siguientes:** rutas de imágenes en `public/`, URLs de
> imágenes 360 del tour, ni las filas de datos que se migren en la Fase 3. Son placeholders
> deliberados del cliente anterior hasta que se reemplacen manualmente más adelante. Si el
> agente encuentra una referencia de imagen o de tour durante los greps de arriba, dejarla
> intacta y solo anotarla como "placeholder pendiente de reemplazo futuro", no como pendiente
> de esta tarea.

---

## Fase 1 — Infraestructura Cloudflare

Los recursos YA EXISTEN (ver tabla al inicio del documento). Esta fase es solo de verificación,
no de creación:

- [ ] Confirmar que `costamare-db` y el KV `SESSION` son visibles en la cuenta activa de Wrangler:
      ```bash
      wrangler d1 list
      wrangler kv namespace list
      ```
- [ ] Confirmar si el proyecto va en la misma cuenta de Cloudflare que el original o en otra
      → si es otra, obtener el `account_id` correcto antes de la Fase 2
- [ ] No ejecutar `wrangler d1 create`, `wrangler kv namespace create` ni `wrangler r2 bucket create`
      — ya están provisionados

## Fase 2 — `wrangler.jsonc`

- [ ] `name`: cambiar a `costamare` (o el nombre de Worker que corresponda; evita colisión con
      el Worker original)
- [ ] `account_id`: actualizar si aplica (Fase 1)
- [ ] `d1_databases`: reemplazar por
      ```jsonc
      "d1_databases": [
        {
          "binding": "DB",
          "database_id": "8a804132-1f37-441b-b6d0-068d4d5e0734",
          "database_name": "costamare-db"
        }
      ]
      ```
- [ ] `kv_namespaces`: reemplazar por
      ```jsonc
      "kv_namespaces": [
        { "binding": "SESSION", "id": "b3a0ceb00a54431297f4b582b433a23a" }
      ]
      ```
- [ ] Eliminar el bloque `r2_buckets` por completo si existe en el `wrangler.jsonc` copiado del
      proyecto original — este proyecto no usa R2
- [ ] `routes` / dominio custom si está declarado aquí en vez del dashboard

## Fase 3 — Base de datos: migrar SCHEMA + DATA del proyecto original como placeholder

A diferencia de un clon estándar, aquí la data del proyecto original (unidades, tipos de
unidad, puntos de interés, enlaces, escenas y hotspots de tour) se **preserva intencionalmente**
en el D1 nuevo, para usarla de placeholder hasta que se reemplace manualmente.

- [ ] Exportar schema + data completos del D1 original:
      ```bash
      wrangler d1 export [OLD_D1_NAME] --remote --output=migrations/0001_from_original.sql
      ```
      Este dump incluye tanto los `CREATE TABLE` como los `INSERT` con los datos reales del
      proyecto original — es exactamente lo que se necesita como placeholder.
- [ ] Revisar `migrations/0001_from_original.sql` generado: confirmar que contiene las tablas
      esperadas (`units`, `unit_types`, `points_of_interest`, `directory_links`, `tour_scenes`,
      `tour_hotspots`, o los nombres equivalentes en este proyecto) y que trae filas, no solo
      el schema vacío.
- [ ] Aplicar el dump al D1 nuevo, local primero y luego remoto:
      ```bash
      wrangler d1 execute costamare-db --local --file=migrations/0001_from_original.sql
      wrangler d1 execute costamare-db --remote --file=migrations/0001_from_original.sql
      ```
- [ ] Verificar que la data llegó completa:
      ```bash
      wrangler d1 execute costamare-db --remote --command "SELECT COUNT(*) FROM units"
      ```
      Comparar el conteo contra el original.
- [ ] Dejar un archivo `migrations/TODO_reemplazar_data.md` (o similar) listando explícitamente
      qué tablas contienen data placeholder del cliente anterior y deben reemplazarse antes de
      ir a producción con el cliente nuevo. Esto evita que el placeholder se quede sin
      reemplazar por accidente en un deploy futuro.

## Fase 4 — Secrets / variables de entorno

- [ ] `.dev.vars` local: generar `ADMIN_API_KEY` nueva, distinta a la del original
- [ ] Secret en Cloudflare para el Worker nuevo:
      ```bash
      wrangler secret put ADMIN_API_KEY
      ```
- [ ] Confirmar que `.dev.vars` está en `.gitignore` y no viajó en la copia por accidente

## Fase 5 — Branding y contenido hardcodeado (texto/config — NO imágenes ni tour)

Basarse en los resultados de la Fase 0 para esta lista, más estos puntos conocidos.
Recordatorio: imágenes, logo, y contenido del tour 360 se mantienen del proyecto original
en esta pasada — no forman parte de esta fase.

- [ ] `Layout.astro`: `[PROJECT_NAME]` en `title`, `meta[name=description]`, `og:title`,
      `og:description` (dejar `og:image` como está si sigue siendo un placeholder válido)
- [ ] Cualquier página de impresión / PDF (ej. `disponibilidad-print.astro`):
  - [ ] Nombre del proyecto en el `<title>` y en el HTML visible → "Costamare"
  - [ ] Filename del PDF descargado en el endpoint que lo genera (ej. `pdf.ts`)
  - [ ] Fecha de inicio/entrega del proyecto (`*Inicio ... – Entrega ...`) — actualizar si ya
        se conoce, o dejar como placeholder marcado si no
  - [ ] Plan de pagos / pasos del footer si difiere del original
- [ ] Directorio de enlaces (WhatsApp, email, redes): actualizar solo los datos de CONTACTO
      (teléfono, email) apuntando al cliente nuevo — los enlaces/labels estructurales que
      vinieron con la data migrada en la Fase 3 se dejan como placeholder junto con el resto

## Fase 6 — Git / CI/CD

- [ ] `git remote -v` → desconectar del repo original antes del primer `git push`
      ```bash
      git remote remove origin
      git remote add origin [URL_REPO_NUEVO]
      ```
- [ ] Si hay GitHub Actions u otro CI/CD, revisar que sus secrets (API tokens, `account_id`,
      `database_id`) apunten al proyecto nuevo, no al Worker original
- [ ] Borrar artefactos que no deben viajar en la copia si aún están presentes:
      ```bash
      rm -rf node_modules .wrangler dist
      npm install
      ```

## Fase 7 — Verificación final antes de `wrangler deploy`

- [ ] Re-correr TODOS los `grep` de la Fase 0 — deben devolver cero resultados
      (o solo resultados esperados/documentados, ej. nombres de columnas genéricas, o
      referencias a imágenes/tour ya identificadas como placeholder intencional)
- [ ] `npm run build` sin errores
- [ ] `npm run dev:cf` — probar manualmente: landing, disponibilidad, tour, mapa, directorio,
      login admin, generación de PDF — todo debe funcionar mostrando la data placeholder del
      proyecto original, no debe haber errores por falta de data
- [ ] Confirmar en el dashboard de Cloudflare que el Worker nuevo tiene nombre y bindings
      correctos (`costamare-db`, KV `SESSION`) ANTES de apuntar el dominio nuevo
- [ ] Confirmar que `migrations/TODO_reemplazar_data.md` quedó en el repo como recordatorio
      visible del trabajo pendiente
- [ ] Solo entonces: `wrangler deploy`

---

## Nota para el agente

Si algún grep de la Fase 0 devuelve un resultado ambiguo (ej. una palabra que coincide con el
nombre del cliente anterior pero es en realidad un término genérico), reportarlo en vez de
decidir unilateralmente si aplica o no. No continuar a la fase siguiente si la Fase 0 no se
completó y reportó explícitamente. Recordar en cada fase: imágenes, escenas/hotspots de tour,
y filas de data migradas en la Fase 3 son placeholders deliberados — no "limpiar" ni
reemplazar nada de eso salvo que se indique explícitamente en una tarea futura.
