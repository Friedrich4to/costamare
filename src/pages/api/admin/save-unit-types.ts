import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface UnitTypePayload {
  id: number;
  name: string;
  price_usd: number;
  interior_m2: number;
  terraza_m2: number | null;
  total_m2: number;
  spaces: { name: string; m2: number }[];
  features: string[];
  tour_url: string;
  optional_package_label: string | null;
  optional_package_price: number | null;
  gallery: string[];
}

export const POST: APIRoute = async ({ request }) => {
  let body: { key?: string; unitTypes?: UnitTypePayload[] };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  if (!env.ADMIN_API_KEY || body.key !== env.ADMIN_API_KEY) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  const db = env.DB;
  if (!db || !body.unitTypes?.length) {
    return json({ ok: false, error: 'Missing data' }, 400);
  }

  try {
    const stmt = db.prepare(`
      UPDATE unit_types SET
        name = ?,
        price_usd = ?,
        interior_m2 = ?,
        terraza_m2 = ?,
        total_m2 = ?,
        spaces = ?,
        features = ?,
        tour_url = ?,
        optional_package_label = ?,
        optional_package_price = ?,
        gallery = ?
      WHERE id = ?
    `);

    await db.batch(
      body.unitTypes.map(ut =>
        stmt.bind(
          ut.name,
          ut.price_usd,
          ut.interior_m2,
          ut.terraza_m2 ?? null,
          ut.total_m2,
          JSON.stringify(ut.spaces),
          JSON.stringify(ut.features),
          ut.tour_url,
          ut.optional_package_label || null,
          ut.optional_package_price ?? null,
          JSON.stringify(ut.gallery),
          ut.id,
        )
      )
    );

    return json({ ok: true }, 200);
  } catch (e) {
    console.error('save-unit-types error:', e);
    return json({ ok: false, error: 'Database error' }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
