export const prerender = false;
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  const browser = (env as any).BROWSER;
  if (!browser) {
    return new Response(JSON.stringify({ error: 'Browser Run binding no disponible.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const origin = new URL(request.url).origin;
    const pdfResponse: Response = await browser.quickAction('pdf', {
      url: `${origin}/disponibilidad-print`,
    });

    if (!pdfResponse.ok) {
      const text = await pdfResponse.text();
      return new Response(JSON.stringify({ error: `Browser Run: ${pdfResponse.status} — ${text}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pdf = await pdfResponse.arrayBuffer();
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="listado-precios-costamare.pdf"',
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('PDF generation error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
