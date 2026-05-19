// bloom_case_view.js — read-only Bloom Import case detail, shown as
// an in-page modal so other pages (e.g. Customer Feedback) can pull
// up a case's patient/doctor/clinic/distributor, aligner orders and
// full evolution history WITHOUT navigating away (which would drop
// the session and bounce to the login page).
//
//   import { openBloomCaseModal } from './bloom_case_view.js'
//   openBloomCaseModal(sb, '4373')
//
// Data: bloom_cases (by case_id), bloom_aligner_details (by
// case_number), bloom_case_snapshots (by case_id). Same shape the
// Bloom Import page renders — kept faithful to that view.

const _esc = s => String(s == null ? '' : s)
  .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// ── Bloom date / status helpers (mirrors bloom_import.html) ───────────
const parseB = s => { if (!s) return null; const m = String(s).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : new Date(s) }
const fmtD = v => { if (!v) return '—'; const d = parseB(v) || new Date(v); if (isNaN(d)) return v; return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
const fdt = v => { if (!v) return '—'; const d = new Date(v), now = new Date(), diff = Math.floor((now - d) / 1000); if (diff < 60) return diff + 's ago'; if (diff < 3600) return Math.floor(diff / 60) + 'm ago'; if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'; return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
const fmtDT = v => v ? new Date(v).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const cl = s => (s || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
const SC = {
  ALIGNERS_RECEIVED: '#16a34a', REFINEMENT_ALIGNERS_RECEIVED: '#16a34a', RETAINER_ALIGNERS_RECEIVED: '#16a34a', REPLACEMENT_ALIGNERS_RECEIVED: '#16a34a',
  ALIGNERS_ORDER_CREATED: '#3b5fe2', REFINEMENT_ORDER_CREATED: '#3b5fe2', RETAINER_ORDER_READY_TO_PRINT: '#3b5fe2', REPLACEMENT_ORDER_READY_TO_PRINT: '#3b5fe2',
  ORDER_IS_PRINTED: '#d97706', REFINEMENT_ORDER_IS_PRINTED: '#d97706', ALIGNERS_ARE_MADE: '#d97706', RETAINER_ALIGNERS_ARE_MADE: '#d97706',
  PLAN_WITH_BLOOM_ADDED: '#7c3aed', PLAN_WITH_BLOOM_PROCESSED: '#7c3aed', PLAN_WITH_BLOOM_CONFIRMED: '#7c3aed', PLAN_WITH_BLOOM_CONFIRMATION_PROCESSED: '#7c3aed',
  REFINEMENT_PLAN_ADDED: '#7c3aed', REFINEMENT_PLAN_PROCESSED: '#7c3aed', TREATMENT_ASSESSMENT_PERFORMED: '#0d9488', DRAFT: '#94a3b8',
  TREATMENT_PLAN_DECLINED_DOCTOR: '#dc2626', TREATMENT_PLAN_DECLINED_OBSERVER: '#dc2626',
  REFINEMENT_PLAN_DECLINED_DOCTOR: '#dc2626', REFINEMENT_PLAN_DECLINED_OBSERVER: '#dc2626',
}
const sc = s => SC[s] || '#94a3b8'

// Collapse repeated identical sync snapshots. Each sync saves a row
// even when nothing changed, so a stable case shows hundreds of
// identical tiles. Keep only the snapshot where the state first
// changed. `desc` is newest-first; walk oldest→newest keeping a row
// whenever its signature differs from the previously kept one, then
// return newest-first for display.
const snapSig = s => [
  s.current_status || '', s.status_change_date || '',
  s.total_aligners ?? '', s.aligner_upper ?? '', s.aligner_lower ?? '',
  s.package_type || ''
].join('|')
function dedupeSnaps(desc) {
  const asc = (desc || []).slice().reverse()
  const kept = []
  let prev = null
  for (const s of asc) { const sig = snapSig(s); if (sig !== prev) { kept.push(s); prev = sig } }
  return kept.reverse()
}

let _modal = null
function ensureModal() {
  if (_modal) return _modal
  const wrap = document.createElement('div')
  wrap.id = 'bcvModal'
  wrap.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:900;display:none;align-items:center;justify-content:center;padding:20px'
  wrap.innerHTML = `
    <div style="background:var(--card,#fff);border-radius:18px;padding:24px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 6px 24px rgba(0,0,0,.18)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px">
        <div>
          <div id="bcvTitle" style="font-size:17px;font-weight:800;letter-spacing:-.3px">Case</div>
          <div id="bcvSub" style="font-size:12px;color:var(--mu,#64748b);margin-top:2px"></div>
        </div>
        <button type="button" id="bcvX" title="Close" style="border:1px solid var(--bdr,#e2e8f0);background:var(--card,#fff);width:32px;height:32px;border-radius:9px;cursor:pointer;font-size:15px;flex-shrink:0">✕</button>
      </div>
      <div id="bcvBody" style="margin-top:12px"></div>
    </div>`
  document.body.appendChild(wrap)
  const close = () => { wrap.style.display = 'none' }
  wrap.addEventListener('click', e => { if (e.target === wrap) close() })
  wrap.querySelector('#bcvX').addEventListener('click', close)
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.style.display === 'flex') close() })
  _modal = wrap
  return wrap
}

function alignerCard(a) {
  const tot = Number(a.number_of_aligners) || (Number(a.aligner_upper || 0) + Number(a.aligner_lower || 0))
  return `<div style="background:var(--b50,#eef2ff);border:1px solid var(--b100,#e0e7ff);border-radius:10px;padding:12px;margin-bottom:8px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <span style="font-weight:700;color:var(--blue,#3b5fe2)">${_esc(a.order_type || '—')}</span>
      <span style="background:#f1f5f9;color:var(--mu,#64748b);font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${_esc(a.package_type || '—')}</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
      <div><div style="color:var(--mu,#64748b);font-size:10px">UPPER</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--blue,#3b5fe2)">${a.aligner_upper != null ? _esc(a.aligner_upper) : '—'}</div></div>
      <div><div style="color:var(--mu,#64748b);font-size:10px">LOWER</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--purple,#7c3aed)">${a.aligner_lower != null ? _esc(a.aligner_lower) : '—'}</div></div>
      <div><div style="color:var(--mu,#64748b);font-size:10px">TOTAL</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--teal,#0d9488)">${tot || '—'}</div></div>
    </div>
  </div>`
}

export async function openBloomCaseModal(sb, caseNo) {
  const no = String(caseNo || '').trim()
  if (!no || !sb) return
  const wrap = ensureModal()
  const body = wrap.querySelector('#bcvBody')
  wrap.querySelector('#bcvTitle').textContent = 'Case #' + no
  wrap.querySelector('#bcvSub').textContent = ''
  body.innerHTML = `<div style="text-align:center;color:var(--dim,#94a3b8);font-size:13px;padding:32px">⏳ Loading case from Bloom…</div>`
  wrap.style.display = 'flex'

  let c, als = [], snaps = []
  try {
    const [cRes, aRes, sRes] = await Promise.all([
      sb.from('bloom_cases').select('*').eq('case_id', no).maybeSingle(),
      sb.from('bloom_aligner_details').select('*').eq('case_number', no),
      sb.from('bloom_case_snapshots').select('*').eq('case_id', no).order('synced_at', { ascending: false }).limit(100),
    ])
    c = cRes.data; als = aRes.data || []; snaps = sRes.data || []
  } catch (e) {
    body.innerHTML = `<div style="text-align:center;color:var(--red,#dc2626);font-size:13px;padding:28px">Could not load case: ${_esc(e.message || e)}</div>`
    return
  }
  if (!c) {
    body.innerHTML = `<div style="text-align:center;color:var(--mu,#64748b);font-size:13px;padding:28px;line-height:1.6">
      🔍 <strong>Case #${_esc(no)}</strong> isn't in Bloom Import yet.<br>
      <span style="color:var(--dim,#94a3b8)">It hasn't been synced from Bloom, or the number doesn't match.</span></div>`
    return
  }

  wrap.querySelector('#bcvSub').textContent = (c.patient_name || '') + (c.doctor ? ' · ' + c.doctor : '')
  const evo = dedupeSnaps(snaps)
  const color = sc(c.current_status)
  body.innerHTML = `
    <div style="background:${color}15;border:1px solid ${color}40;border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></div>
      <div style="font-size:13px;font-weight:700;color:${color}">${_esc(cl(c.current_status))}</div>
      ${c.status_change_date ? `<div style="font-size:11px;color:var(--amber,#d97706);background:var(--a50,#fffbeb);padding:3px 10px;border-radius:999px">📅 ${_esc(fmtD(c.status_change_date))}</div>` : ''}
      ${c.action_required_for ? `<div style="font-size:11px;font-weight:700;color:var(--red,#dc2626);background:var(--r50,#fef2f2);padding:3px 10px;border-radius:999px;margin-left:auto">⚠️ ${_esc(c.action_required_for)}</div>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
      ${[['Patient', c.patient_name], ['Doctor', c.doctor], ['Clinic', c.clinic], ['Distributor', c.distributor],
         ['Status Changed', fmtD(c.status_change_date)], ['Last Synced', fdt(c.last_synced_at)]]
        .map(([k, v]) => `<div style="background:var(--bg,#f0f4f8);border-radius:10px;padding:10px 12px">
          <div style="font-size:10px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.5px">${k}</div>
          <div style="font-size:13px;font-weight:600;margin-top:3px">${_esc(v || '—')}</div></div>`).join('')}
      ${c.number_of_extra_refinements ? `<div style="background:var(--bg,#f0f4f8);border-radius:10px;padding:10px 12px"><div style="font-size:10px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.5px">Extra Refinements</div><div style="font-size:13px;font-weight:600;margin-top:3px">${_esc(c.number_of_extra_refinements)}</div></div>` : ''}
      ${c.overdue_for ? `<div style="background:var(--r50,#fef2f2);border:1px solid var(--r100,#fee2e2);border-radius:10px;padding:10px 12px"><div style="font-size:10px;font-weight:700;color:var(--red,#dc2626);text-transform:uppercase;letter-spacing:.5px">Overdue</div><div style="font-size:13px;font-weight:600;margin-top:3px;color:var(--red,#dc2626)">${_esc(c.overdue_for)}</div></div>` : ''}
    </div>
    ${als.length ? `<div style="font-size:12px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">🦷 Aligner Orders (${als.length})</div>` + als.map(alignerCard).join('') : '<div style="color:var(--dim,#94a3b8);font-size:12px;text-align:center;padding:16px;background:var(--bg,#f0f4f8);border-radius:10px">No aligner records yet</div>'}
    ${evo.length ? `<div style="font-size:12px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.5px;margin:16px 0 10px">📸 Case Evolution (${evo.length} change${evo.length === 1 ? '' : 's'})</div>
      <div style="display:flex;flex-direction:column;gap:8px">
      ${evo.map((s, i) => { const col = sc(s.current_status); return `<div style="border:1px solid var(--bdr,#e2e8f0);border-left:3px solid ${col};border-radius:10px;padding:10px 12px;${i === 0 ? 'background:var(--bg,#f0f4f8)' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <span style="background:${col}22;color:${col};font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${_esc((s.current_status || '').replace(/_/g, ' '))}</span>
          <span style="font-size:11px;color:var(--mu,#64748b)">${_esc(fmtDT(s.synced_at))}</span>
        </div>
        <div style="display:flex;gap:16px;margin-top:6px;font-size:11px;color:var(--mu,#64748b);flex-wrap:wrap">
          ${s.status_change_date ? `<span>📅 Changed: <strong style="color:var(--amber,#d97706)">${_esc(fmtD(s.status_change_date))}</strong></span>` : ''}
          ${s.total_aligners ? `<span>🦷 <strong style="color:var(--teal,#0d9488)">${_esc(s.total_aligners)}</strong> aligners</span>` : ''}
          ${s.aligner_upper ? `<span>↑ <strong>${_esc(s.aligner_upper)}</strong> upper</span>` : ''}
          ${s.aligner_lower ? `<span>↓ <strong>${_esc(s.aligner_lower)}</strong> lower</span>` : ''}
          ${s.package_type ? `<span>📦 ${_esc(s.package_type)}</span>` : ''}
        </div>
      </div>` }).join('')}
      </div>` : `<div style="color:var(--dim,#94a3b8);font-size:12px;text-align:center;padding:12px;background:var(--bg,#f0f4f8);border-radius:10px;margin-top:16px">No evolution history yet — snapshots are saved each sync</div>`}
  `
}
