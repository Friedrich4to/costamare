export const prerender = false;
import { env } from 'cloudflare:workers';

export async function GET() {
  try {
    const db = env.DB;
    const [utRes, uRes] = await Promise.all([
      db.prepare(
        'SELECT id, price_usd, interior_m2, terraza_m2, total_m2, optional_package_label, optional_package_price FROM unit_types ORDER BY id'
      ).all(),
      db.prepare(
        'SELECT unit_id, status, floor, unit_type_id FROM units ORDER BY unit_id'
      ).all(),
    ]);
    return Response.json({
      units: uRes.results ?? [],
      unitTypes: utRes.results ?? [],
    });
  } catch (e) {
    return Response.json({ error: 'DB error' }, { status: 500 });
  }
}
