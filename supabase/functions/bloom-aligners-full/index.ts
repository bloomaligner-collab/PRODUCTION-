// bloom-aligners-full — DEPRECATED, retained as a 410 Gone stub.
//
// This function was a one-shot aligner backfill tool. The
// replacement is: call POST bloom-sync with { "full": true } — the
// bloom-sync function has a full-history mode that does the same
// work inside its main path. bloom-aligners-full previously had
// verify_jwt=false AND a hardcoded Bloom API token in source,
// which together meant anyone could trigger a full backfill.
//
// This stub intentionally returns 410 Gone so any stale caller
// fails loudly. verify_jwt=true so anonymous probes get 401 before
// reaching this code.
Deno.serve((_req: Request) => new Response(
  JSON.stringify({
    error: 'Gone',
    message: 'bloom-aligners-full is deprecated. Call bloom-sync with { "full": true } instead.'
  }),
  { status: 410, headers: { 'Content-Type': 'application/json' } }
))
