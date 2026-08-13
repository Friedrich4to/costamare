# TODO: Reemplazar data placeholder antes de producción

Las siguientes tablas en `costamare-db` contienen data del proyecto original (HRIV)
migrada como placeholder estructural. Deben reemplazarse manualmente antes de que
el sitio vaya a producción con el cliente Costamare.

## Tablas con data placeholder

| Tabla | Contenido placeholder | Acción requerida |
|-------|----------------------|------------------|
| `unit_types` | 3 tipos: 1er Piso / 2do Piso / Penthouse del proyecto HRIV | Actualizar precios, áreas, nombres y URLs de tour según specs de Costamare |
| `units` | 12 unidades S101–S304 con estados del proyecto original | Actualizar IDs, labels y estados reales de Costamare |

## Cómo actualizar

1. Usar el panel de administración (`/administrar`) con la nueva `ADMIN_API_KEY`
2. O ejecutar un nuevo SQL de seed: `wrangler d1 execute costamare-db --remote --file=migrations/XXXX_seed_costamare.sql`

## Imágenes y assets también pendientes (fase posterior)

- `public/assets/units/` — imágenes de renders de HRIV (p1.avif, p2.avif, ph-1.avif, ph-2.avif)
- `public/` — logo_horizontal.svg, logo.svg, bg.avif, favicon.svg
- `public/` — dossier.pdf, hriv.sog (maqueta 3D)
- Tours 360° — escenas del proyecto original
