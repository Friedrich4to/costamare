export const prerender = false;
import { env } from 'cloudflare:workers';

export async function GET() {
  try {
    const db = env.DB;
    const res = await db.prepare(
      'SELECT id, numero, m2, patio_m2, terraza_m2, m2_total, disponibilidad, tour_url, gallery, precio FROM units ORDER BY numero'
    ).all();
    return Response.json({ units: res.results ?? [] });
  } catch (e) {
    return Response.json({ error: 'DB error' }, { status: 500 });
  }
}
