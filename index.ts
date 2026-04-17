// ══════════════════════════════════════════════════════════════════════
// CEDARWINGS — Bloom Sync Edge Function
// Runs every 5 minutes via Supabase CRON
// Calls Bloom API → saves to Cedarwings database
// Deploy: supabase functions deploy bloom-sync
// ══════════════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BLOOM_API_BASE  = 'https://api.bloomaligner.fr'
const BLOOM_API_TOKEN = '2405cb1d3b6520787d35b03f8e586582437e6db0e77b1e3252b04fd7825c9e15'
const BLOOM_HEADERS   = {
  'Authorization': `Bearer ${BLOOM_API_TOKEN}`,
  'Content-Type': 'application/json'
}

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ── Helpers ──────────────────────────────────────────────────────────

async function bloomFetchAllPages(path: string): Promise<any[]> {
  const limit = 100
  let offset = 0
  const all: any[] = []
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const res = await fetch(`${BLOOM_API_BASE}${path}${sep}offset=${offset}&limit=${limit}`, {
      headers: BLOOM_HEADERS
    })
    if (!res.ok) throw new Error(`Bloom API ${path}: ${res.status} ${await res.text()}`)
    const data = await res.json()
    // Handle array or wrapped response
    const items = Array.isArray(data) ? data
      : (data.cases || data.aligners || data.data || data.results || [])
    all.push(...items)
    if (items.length < limit) break
    offset += limit
  }
  return all
}

// ── Main handler ─────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE)

  // Start sync log
  const { data: logRow } = await sb.from('bloom_sync_log').insert({
    sync_type: 'polling',
    started_at: new Date().toISOString(),
    status: 'running'
  }).select().single()
  const logId = logRow?.id

  let casesNew = 0, casesUpdated = 0, alignersFetched = 0

  try {
    // Get last sync timestamp
    const { data: setting } = await sb.from('system_settings')
      .select('value').eq('key', 'bloom_last_sync').single()
    const lastSync = setting?.value || '2020-01-01T00:00:00Z'
    const syncStart = new Date().toISOString()

    // ── STEP 1: Fetch all cases (incremental) ─────────────────────
    const rawCases = await bloomFetchAllPages(
      `/api/integration/data_sync/case?updated_since=${encodeURIComponent(lastSync)}`
    )

    // ── STEP 2: Map and upsert cases ──────────────────────────────
    const mappedCases = rawCases
      .filter((c: any) => c.case_id || c.id)
      .map((c: any) => ({
        case_id:                     String(c.case_id || c.id || ''),
        patient_name:                c.patient_name || c.patientName || null,
        doctor:                      c.doctor || c.doctor_name || null,
        clinic:                      c.clinic || null,
        distributor:                 c.distributor || null,
        current_status:              c.current_status || c.status || null,
        action_required_for:         c.action_required_for || c.action_required || null,
        overdue_for:                 c.overdue_for || null,
        status_change_date:          c.status_change_date || null,
        number_of_extra_refinements: c.number_of_extra_refinements || null,
        notes:                       c.notes || null,
        last_synced_at:              new Date().toISOString()
      }))

    if (mappedCases.length > 0) {
      // Check which are new vs updated
      const ids = mappedCases.map(c => c.case_id)
      const { data: existing } = await sb.from('bloom_cases')
        .select('case_id').in('case_id', ids)
      const existSet = new Set((existing || []).map((e: any) => e.case_id))
      casesNew = mappedCases.filter(c => !existSet.has(c.case_id)).length
      casesUpdated = mappedCases.filter(c => existSet.has(c.case_id)).length

      // Upsert in batches of 100
      for (let i = 0; i < mappedCases.length; i += 100) {
        const batch = mappedCases.slice(i, i + 100)
        const { error } = await sb.from('bloom_cases')
          .upsert(batch, { onConflict: 'case_id' })
        if (error) console.error('Cases upsert error:', error.message)
      }
    }

    // ── STEP 3: Fetch aligner details for new cases only ──────────
    const newCaseIds = mappedCases
      .filter(c => !rawCases.find((r: any) => r.case_id === c.case_id && r.aligner_upper != null))
      .map(c => c.case_id)
      .slice(0, 50) // max 50 per sync cycle to avoid timeout

    for (const caseId of newCaseIds) {
      try {
        const aligners = await bloomFetchAllPages(
          `/api/integration/data_sync/cases/${caseId}/aligners`
        )
        alignersFetched += aligners.length

        if (aligners.length === 0) continue

        // Delete old rows for this case, then insert all fresh
        await sb.from('bloom_aligner_details').delete().eq('case_number', caseId)

        const rows = aligners.map((a: any, idx: number) => ({
          case_number:        String(caseId),
          order_id:           a.order_no || a.order_id || a.id || null,
          order_index:        idx,
          aligner_upper:      a.aligner_upper != null ? Number(a.aligner_upper) : null,
          aligner_lower:      a.aligner_lower != null ? Number(a.aligner_lower) : null,
          number_of_aligners: a.number_of_aligners != null ? String(a.number_of_aligners) : null,
          package_type:       a.package_type || null,
          order_type:         a.order_type || 'TreatmentPlan',
          // Each order has its own date — not from the case level
          updated_at:         a.updated_at || a.update_date || null,
          status:             a.status || null
        }))

        const { error } = await sb.from('bloom_aligner_details').insert(rows)
        if (error) console.error(`Aligners insert error for ${caseId}:`, error.message)

      } catch (e: any) {
        console.warn(`No aligners for case ${caseId}:`, e.message)
      }
    }

    // ── STEP 4: Update last sync timestamp ────────────────────────
    await sb.from('system_settings')
      .upsert({ key: 'bloom_last_sync', value: syncStart, updated_at: new Date().toISOString() })

    // ── STEP 5: Log sync success ──────────────────────────────────
    if (logId) {
      await sb.from('bloom_sync_log').update({
        completed_at: new Date().toISOString(),
        cases_fetched: rawCases.length,
        cases_new: casesNew,
        cases_updated: casesUpdated,
        aligners_fetched: alignersFetched,
        status: 'success'
      }).eq('id', logId)
    }

    return new Response(JSON.stringify({
      success: true,
      cases_fetched: rawCases.length,
      cases_new: casesNew,
      cases_updated: casesUpdated,
      aligners_fetched: alignersFetched
    }), { headers: { 'Content-Type': 'application/json' } })

  } catch (err: any) {
    console.error('Bloom sync error:', err)
    if (logId) {
      await sb.from('bloom_sync_log').update({
        completed_at: new Date().toISOString(),
        status: 'error',
        error_message: err.message
      }).eq('id', logId)
    }
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
})
