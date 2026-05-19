// push-ack — marks a push_log row opened when the user clicks the
// notification (called by the service worker, sw.js). verify_jwt is
// false on purpose: the only input is an unguessable push_log UUID and
// the only effect is stamping opened_at once.
//   Deploy: supabase functions deploy push-ack --no-verify-jwt
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
  try {
    const id = new URL(req.url).searchParams.get('id') || ''
    if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response('bad id', { status: 400, headers: CORS })
    await fetch(`${SUPABASE_URL}/rest/v1/push_log?id=eq.${id}&opened_at=is.null`, {
      method: 'PATCH',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ opened_at: new Date().toISOString() }),
    })
    return new Response(null, { status: 204, headers: CORS })
  } catch {
    return new Response(null, { status: 204, headers: CORS })
  }
})
