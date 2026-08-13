import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { key?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const validKey = env.ADMIN_API_KEY?.trim();
  if (!validKey || body.key?.trim() !== validKey) {
    return json({ ok: false }, 401);
  }

  return json({ ok: true }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
