import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface UnitPayload {
  unit_id: string;
  status: string;
  unit_type_id: number;
}

const VALID_STATUSES = new Set(['available', 'reserved', 'sold']);

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
    if (!VALID_STATUSES.has(u.status)) {
      return json({ ok: false, error: `Invalid status: ${u.status}` }, 400);
    }
  }

  try {
    const stmt = db.prepare(
      'UPDATE units SET status = ?, unit_type_id = ? WHERE unit_id = ?'
    );

    await db.batch(
      body.units.map(u => stmt.bind(u.status, u.unit_type_id, u.unit_id))
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
