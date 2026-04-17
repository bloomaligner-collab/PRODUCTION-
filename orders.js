// ══════════════════════════════════════════════════════════════════════
// orders.js — Shared order dropdown module for all Cedarwings pages
// Source of truth: bloom_cases + bloom_aligner_details
// Usage: await CW.orders.init(sb)  →  CW.orders.build(inputId, ddId, listId, onSelect)
// ══════════════════════════════════════════════════════════════════════

window.CW = window.CW || {}

CW.orders = {
  _cases: [],      // from bloom_cases
  _aligners: {},   // case_number → {upper, lower, total, order_type}
  _loaded: false,

  // Load all active cases + aligner details
  async init(sb) {
    if (this._loaded) return
    try {
      const [casesRes, alignersRes] = await Promise.all([
        sb.from('bloom_cases')
          .select('case_id,patient_name,doctor,current_status,distributor,creation_date')
          .order('case_id', { ascending: false })
          .limit(10000),
        sb.from('bloom_aligner_details')
          .select('case_number,aligner_upper,aligner_lower,number_of_aligners,order_type')
          .limit(20000)
      ])

      this._cases = casesRes.data || []

      // Build aligner lookup (sum all orders per case)
      ;(alignersRes.data || []).forEach(r => {
        const k = String(r.case_number)
        if (!this._aligners[k]) this._aligners[k] = { upper: 0, lower: 0, total: 0, order_type: null }
        this._aligners[k].upper += Number(r.aligner_upper) || 0
        this._aligners[k].lower += Number(r.aligner_lower) || 0
        this._aligners[k].total += Number(r.number_of_aligners) || 0
        if (r.order_type) this._aligners[k].order_type = r.order_type
      })

      // Add from order_step_tracking
      try {
        const { data: tracked } = await sb.from('order_step_tracking')
          .select('order_no').order('order_no', { ascending: false }).limit(300)
        const seen = new Set(this._cases.map(c => String(c.case_id)))
        ;(tracked || []).filter(t => t.order_no && !seen.has(String(t.order_no))).forEach(t => {
          seen.add(String(t.order_no))
          this._cases.push({ case_id: t.order_no, patient_name: '', doctor: '', current_status: 'In Production' })
        })
      } catch (e) { /* order_step_tracking may not exist */ }

      // Add from time_sessions — catches ALL orders ever clocked (most reliable fallback)
      try {
        const { data: sessions } = await sb.from('time_sessions')
          .select('order_no').not('order_no', 'is', null)
          .order('started_at', { ascending: false }).limit(500)
        const seen2 = new Set(this._cases.map(c => String(c.case_id)))
        ;(sessions || []).filter(s => s.order_no && !seen2.has(String(s.order_no))).forEach(s => {
          seen2.add(String(s.order_no))
          this._cases.push({ case_id: s.order_no, patient_name: '', doctor: '', current_status: 'In Production' })
        })
      } catch (e) { /* time_sessions may not exist */ }

      this._loaded = true
    } catch (e) {
      console.warn('[CW.orders] init error:', e)
    }
  },

  // Get aligner data for a case
  getAligners(caseId) {
    return this._aligners[String(caseId)] || null
  },

  // Build a searchable dropdown attached to an input field
  // inputId: the <input> element id
  // ddContainerId: the <div> that will show/hide as dropdown
  // listId: the <div> inside the dropdown for the list items
  // onSelect(caseId, alignerData) callback
  build(inputEl, ddEl, listEl, onSelect) {
    if (!inputEl || !ddEl || !listEl) return

    const render = (term) => {
      const filtered = term
        ? this._cases.filter(o =>
            String(o.case_id).toLowerCase().includes(term.toLowerCase()) ||
            (o.patient_name || '').toLowerCase().includes(term.toLowerCase()) ||
            (o.doctor || '').toLowerCase().includes(term.toLowerCase()))
        : this._cases.slice(0, 80)

      if (!filtered.length) {
        listEl.innerHTML = '<div style="padding:12px 14px;font-size:12px;color:#64748b;text-align:center">No orders found</div>'
        return
      }

      listEl.innerHTML = filtered.map(o => {
        const al = this._aligners[String(o.case_id)]
        const alInfo = al ? `<span style="color:#3b5fe2;font-size:10px;font-weight:700"> · ${al.total||al.upper+al.lower} aligners</span>` : ''
        const statusColor = (o.current_status||'').includes('PROD') ? '#16a34a'
          : (o.current_status||'').includes('OVERDUE') ? '#dc2626' : '#d97706'
        return `<div class="cw-order-item" onclick="window.__cwSelectOrder(this,'${o.case_id}')"
          data-case="${o.case_id}"
          style="padding:9px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;font-size:13px">
          <div style="font-weight:700;font-family:monospace;color:#3b5fe2">${o.case_id}${alInfo}</div>
          <div style="font-size:11px;color:#64748b;margin-top:1px">
            ${o.patient_name || ''}${o.doctor ? ' · ' + o.doctor : ''}${o.distributor ? ' · <span style="color:#d97706">' + o.distributor + '</span>' : ''}
            ${o.current_status ? `<span style="color:${statusColor};font-weight:600"> · ${o.current_status}</span>` : ''}
          </div>
        </div>`
      }).join('')
    }

    // Input handler
    inputEl.addEventListener('input', () => { render(inputEl.value); ddEl.style.display = 'block' })
    inputEl.addEventListener('focus', () => { render(inputEl.value); ddEl.style.display = 'block' })

    // Store callback for this dropdown
    ddEl._cwCallback = onSelect

    // Global select handler (onclick in innerHTML)
    window.__cwSelectOrder = (el, caseId) => {
      const dd = el.closest('[data-cw-dd]') || ddEl
      const inp = document.querySelector(`input[data-cw-for="${dd.id}"]`) || inputEl
      inp.value = caseId
      dd.style.display = 'none'
      if (dd._cwCallback) dd._cwCallback(caseId, CW.orders.getAligners(caseId))
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!inputEl.contains(e.target) && !ddEl.contains(e.target)) {
        ddEl.style.display = 'none'
      }
    })
  },

  // Build a <select> dropdown (for non_conformity style)
  // populates a <select> element with all active cases
  buildSelect(selectEl, includePlaceholder = '— Select Order —') {
    if (!selectEl) return
    const existing = selectEl.value
    selectEl.innerHTML = `<option value="">${includePlaceholder}</option>` +
      this._cases.map(o => {
        const al = this._aligners[String(o.case_id)]
        const alInfo = al ? ` (${al.total || al.upper + al.lower} al.)` : ''
        return `<option value="${o.case_id}">${o.case_id}${o.patient_name ? ' — ' + o.patient_name : ''}${alInfo}</option>`
      }).join('')
    if (existing) selectEl.value = existing
  }
}
