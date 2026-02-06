import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const payload = await request.json();

  return new Response(JSON.stringify({ ok: true, received: payload }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
