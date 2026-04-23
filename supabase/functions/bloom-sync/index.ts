// bloom-sync — poll the Bloom Aligner API and mirror cases +
// aligners into Supabase. Triggered by pg_cron every 5 minutes
// (see README.md) and by the "Full Resync" button in
// bloom_import.html.
//
// verify_jwt is false on this function so the scheduled pg_cron
// job (which posts with the anon bearer) can reach it. The
// function is write-only from the caller's perspective — there
// is no way to exfiltrate data through it — so the practical
// abuse vector is DoS / API-credit burn, not data leak.
//
// Deploy: supabase functions deploy bloom-sync --project-ref cvrmadmzzualqukxxlro
// Env:    BLOOM_API_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BLOOM_BASE  = 'https://api.bloomaligner.fr'
const BLOOM_TOKEN = Deno.env.get('BLOOM_API_TOKEN') ?? ''
const BLOOM_HEADERS = { 'Authorization': `Bearer ${BLOOM_TOKEN}`, 'Content-Type': 'application/json' }
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// Full-history anchor for the 'full backfill' mode.
const FULL_SINCE = '2020-01-01T00:00:00Z'

async function bloomFetchAllPages(path: string): Promise<any[]> {
  const limit = 100; let offset = 0; const all: any[] = []
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const res = await fetch(`${BLOOM_BASE}${path}${sep}offset=${offset}&limit=${limit}`, { headers: BLOOM_HEADERS })
    if (!res.ok) throw new Error(`Bloom API ${path}: ${res.status}`)
    const data = await res.json()
    const items = data.results || (Array.isArray(data) ? data : (data.cases || data.aligners || data.data || []))
    all.push(...items)
    if (items.length < limit) break
    offset += limit
  }
  return all
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })

  if (!BLOOM_TOKEN) {
    return new Response(JSON.stringify({ success: false, error: 'BLOOM_API_TOKEN secret not set' }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  }

  // Body may carry { full: true } to fetch ALL cases since 2020-01-01.
  // Otherwise the default 7-day window is used (matches cron behavior).
  let full = false
  let since: string | null = null
  try {
    const body = await req.json()
    full = !!body?.full
    since = typeof body?.since === 'string' ? body.since : null
  } catch { /* no body, default */ }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE)
  const syncedAt = new Date().toISOString()
  const { data: logRow } = await sb.from('bloom_sync_log').insert({
    sync_type: full ? 'full' : 'polling', started_at: syncedAt, status: 'running'
  }).select().single()
  const logId = logRow?.id
  let casesNew = 0, casesUpdated = 0, alignersFetched = 0, snapshotsSaved = 0

  try {
    const windowStart = since
      ?? (full
        ? FULL_SINCE
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    const rawCases = await bloomFetchAllPages(
      `/api/integration/data_sync/cases?updated_since=${encodeURIComponent(windowStart)}`
    )
    console.log(`[bloom-sync] mode=${full ? 'full' : 'polling'} since=${windowStart} fetched ${rawCases.length}`)

    if (rawCases.length > 0) {
      const mappedCases = rawCases.filter((c: any) => c.case_id || c.id).map((c: any) => ({
        case_id: String(c.case_id || c.id || ''),
        patient_name: c.patient_name || null,
        doctor: c.doctor || null,
        clinic: c.clinic || null,
        distributor: c.distributor || null,
        current_status: c.current_status || c.status || null,
        action_required_for: c.action_required_for || null,
        overdue_for: c.overdue_for || null,
        status_change_date: c.status_change_date || null,
        number_of_extra_refinements: c.number_of_extra_refinements || null,
        notes: c.notes || null,
        last_synced_at: syncedAt
      }))

      const ids = mappedCases.map((c: any) => c.case_id)
      // Get existing cases in chunks of 500 to avoid URL length limits
      const existMap = new Map<string, any>()
      for (let i = 0; i < ids.length; i += 500) {
        const slice = ids.slice(i, i + 500)
        const { data: ex } = await sb
          .from('bloom_cases')
          .select('case_id, current_status, status_change_date, action_required_for')
          .in('case_id', slice)
        ;(ex || []).forEach((e: any) => existMap.set(e.case_id, e))
      }

      casesNew     = mappedCases.filter((c: any) => !existMap.has(c.case_id)).length
      casesUpdated = mappedCases.filter((c: any) =>  existMap.has(c.case_id)).length

      for (let i = 0; i < mappedCases.length; i += 100)
        await sb.from('bloom_cases').upsert(mappedCases.slice(i, i+100), { onConflict: 'case_id' })

      const changedCases = mappedCases.filter((c: any) => {
        const prev = existMap.get(c.case_id)
        if (!prev) return true
        return (
          c.current_status     !== prev.current_status     ||
          c.status_change_date !== prev.status_change_date ||
          c.action_required_for!== prev.action_required_for
        )
      })

      console.log(`[bloom-sync] ${changedCases.length} cases changed → saving snapshots`)

      if (changedCases.length > 0) {
        const snapshots = changedCases.map((c: any) => ({
          case_id:             c.case_id,
          patient_name:        c.patient_name,
          doctor:              c.doctor,
          clinic:              c.clinic,
          distributor:         c.distributor,
          current_status:      c.current_status,
          status_change_date:  c.status_change_date,
          action_required_for: c.action_required_for,
          synced_at:           syncedAt
        }))
        for (let i = 0; i < snapshots.length; i += 200)
          await sb.from('bloom_case_snapshots').insert(snapshots.slice(i, i+200))
        snapshotsSaved = snapshots.length
      }

      // Aligners: in polling mode pull only for new cases (cheap). In full
      // mode pull for every case that didn't have aligners yet so initial
      // population is complete.
      const alignerTargetIds = full
        ? (async () => {
            const have = new Set<string>()
            for (let i = 0; i < ids.length; i += 500) {
              const slice = ids.slice(i, i + 500)
              const { data } = await sb
                .from('bloom_aligner_details')
                .select('case_number')
                .in('case_number', slice)
              ;(data || []).forEach((r: any) => have.add(String(r.case_number)))
            }
            return mappedCases.filter((c: any) => !have.has(c.case_id)).map((c: any) => c.case_id)
          })()
        : Promise.resolve(
            mappedCases.filter((c: any) => !existMap.has(c.case_id)).map((c: any) => c.case_id)
          )

      const toFetch = await alignerTargetIds
      const cap = full ? Number.MAX_SAFE_INTEGER : 30
      for (const caseId of toFetch.slice(0, cap)) {
        try {
          const als = await bloomFetchAllPages(`/api/integration/data_sync/cases/${caseId}/aligners`)
          alignersFetched += als.length
          if (!als.length) continue
          await sb.from('bloom_aligner_details').delete().eq('case_number', caseId)
          await sb.from('bloom_aligner_details').insert(
            als.map((a: any, idx: number) => ({
              case_number:        String(caseId),
              order_id:           a.order_no || a.order_id || a.id || null,
              order_index:        idx,
              aligner_upper:      a.aligner_upper !== '' && a.aligner_upper != null ? Number(a.aligner_upper) : null,
              aligner_lower:      a.aligner_lower !== '' && a.aligner_lower != null ? Number(a.aligner_lower) : null,
              number_of_aligners: a.number_of_aligners != null ? String(a.number_of_aligners) : null,
              package_type:       a.package_type || null,
              order_type:         a.order_type || 'TreatmentPlan',
              updated_at:         a.updated_at || null,
              status:             a.status || null
            }))
          )
        } catch(e: any) { console.warn(`aligners ${caseId}:`, e.message) }
      }
    }

    if (logId) await sb.from('bloom_sync_log').update({
      completed_at:     new Date().toISOString(),
      cases_fetched:    rawCases.length,
      cases_new:        casesNew,
      cases_updated:    casesUpdated,
      aligners_fetched: alignersFetched,
      status:           'success'
    }).eq('id', logId)

    return new Response(JSON.stringify({
      success: true,
      mode: full ? 'full' : 'polling',
      since: windowStart,
      cases_fetched:  rawCases.length,
      cases_new:      casesNew,
      cases_updated:  casesUpdated,
      snapshots_saved: snapshotsSaved,
      aligners_fetched: alignersFetched
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } })

  } catch (err: any) {
    if (logId) await sb.from('bloom_sync_log').update({
      completed_at: new Date().toISOString(),
      status: 'error',
      error_message: err.message
    }).eq('id', logId)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
    })
  }
})
