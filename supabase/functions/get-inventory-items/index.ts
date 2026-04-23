// get-inventory-items — DEPRECATED, retained as a 410 Gone stub.
//
// This function used the service-role key + verify_jwt=false to
// return every inventory_items row to any anonymous caller. RLS
// on inventory_items now permits authenticated reads directly via
// sb.from('inventory_items').select('*') from any logged-in page.
//
// inventory.html was updated to read directly; this stub is here
// so any stale browser cache fails loudly instead of silently
// returning stale / empty results.
Deno.serve((_req: Request) => new Response(
  JSON.stringify({
    error: 'Gone',
    message: 'get-inventory-items is deprecated. Use sb.from("inventory_items").select("*") directly — RLS allows authenticated reads.'
  }),
  { status: 410, headers: { 'Content-Type': 'application/json' } }
))
