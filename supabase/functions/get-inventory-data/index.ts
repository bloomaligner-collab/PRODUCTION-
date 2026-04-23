// get-inventory-data — DEPRECATED, retained as a 410 Gone stub.
//
// This function used the service-role key to bypass RLS and return
// inventory_items + suppliers + locations. With verify_jwt=false
// it was an unauthenticated data leak. It has no frontend callers
// as of 2026-04-23; RLS on these tables now lets authenticated
// clients read them directly with sb.from('…').select('…').
//
// Returns 410 Gone so any stale caller fails loudly.
Deno.serve((_req: Request) => new Response(
  JSON.stringify({
    error: 'Gone',
    message: 'get-inventory-data is deprecated. Query inventory_items / suppliers / inventory_locations directly via the Supabase client — RLS allows authenticated reads.'
  }),
  { status: 410, headers: { 'Content-Type': 'application/json' } }
))
