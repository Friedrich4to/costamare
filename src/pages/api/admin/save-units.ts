import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface UnitPayload {
  numero: string;
  m2: number;
  patio_m2: number | null;
  terraza_m2: number | null;
  m2_total: number;
  disponibilidad: string;
  tour_url: string | null;
  gallery: string[];
  precio: number;
}

const VALID_DISPONIBILIDAD = new Set(['available', 'reserved', 'sold']);

export const POST: APIRoute = async ({ request }) => {
  let body: { key?: string; units?: UnitPayload[] };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  if (!env.ADMIN_API_KEY || body.key !== env.ADMIN_API_KEY) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  const db = env.DB;
  if (!db || !body.units?.length) {
    return json({ ok: false, error: 'Missing data' }, 400);
  }

  for (const u of body.units) {
    if (!VALID_DISPONIBILIDAD.has(u.disponibilidad)) {
      return json({ ok: false, error: `Invalid disponibilidad: ${u.disponibilidad}` }, 400);
    }
  }

  try {
    const stmt = db.prepare(
      'UPDATE units SET m2=?, patio_m2=?, terraza_m2=?, m2_total=?, disponibilidad=?, tour_url=?, gallery=?, precio=? WHERE numero=?'
    );

    await db.batch(
      body.units.map(u => stmt.bind(
        u.m2,
        u.patio_m2 ?? null,
        u.terraza_m2 ?? null,
        u.m2_total,
        u.disponibilidad,
        u.tour_url ?? null,
        JSON.stringify(u.gallery ?? []),
        u.precio,
        u.numero,
      ))
    );

    return json({ ok: true }, 200);
  } catch (e) {
    console.error('save-units error:', e);
    return json({ ok: false, error: 'Database error' }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
