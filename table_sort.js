/* table_sort.js — global click-to-sort for every <table> on every page.
 *
 * Auto-discovers tables, adds ↕/▲/▼ arrow indicators on <th> cells, and
 * reorders <tr> nodes in the DOM when a header is clicked. Numeric- and
 * date-aware. Safe to include on every page.
 *
 * Opt-outs (skipped silently):
 *   <table data-sort-manual="1">   — the page already handles sorting itself
 *   thead th data-k="…"            — ditto (bespoke data-model sort wired up)
 *   thead th.no-sort               — specific column not sortable
 *   thead th with empty text       — e.g. action/icon column
 *
 * Exposes window.CW_SortableTables = { wire, wireAll } for manual re-wiring
 * after dynamic render, though the MutationObserver re-wires automatically.
 */
(function(){
  const ARROW_CLASS = 'cw-sort-arrow'

  function cellValue(tr, idx){
    const td = tr.children[idx]
    if(!td) return ''
    // Allow rows to override sort value (e.g. <td data-sort="2026-04-23">)
    if(td.dataset && td.dataset.sort!=null) return td.dataset.sort
    return (td.textContent || '').trim()
  }

  function coerce(v){
    if(v==null || v==='' || v==='—' || v==='-') return null
    const s = String(v)
    // Number-like (strip currency/percent/commas); require at least one digit
    const numMatch = s.replace(/[,\s]/g,'').match(/-?\d+(\.\d+)?/)
    if(numMatch && /^[\s€$£%+\-0-9.,]*$/.test(s.replace(/\s/g,''))){
      return { t:'num', v:Number(numMatch[0]) }
    }
    // ISO or common date
    if(/^\d{4}-\d{2}-\d{2}/.test(s) || /\d{1,2}[\/\- ]\w+[\/\- ]\d{2,4}/.test(s)){
      const d = Date.parse(s)
      if(!isNaN(d)) return { t:'date', v:d }
    }
    return { t:'str', v:s.toLowerCase() }
  }

  function cmp(a, b, dir){
    if(a===null && b===null) return 0
    if(a===null) return 1        // nulls always at the bottom
    if(b===null) return -1
    if(a.t==='num' && b.t==='num') return (a.v - b.v) * dir
    if(a.t==='date' && b.t==='date') return (a.v - b.v) * dir
    return String(a.v).localeCompare(String(b.v), undefined, { numeric:true, sensitivity:'base' }) * dir
  }

  function sortBy(tbl, thIdx, dir){
    const tbody = tbl.querySelector('tbody')
    if(!tbody) return
    // Skip empty-state rows (single cell with colspan)
    const rows = [...tbody.querySelectorAll(':scope > tr')].filter(tr => {
      const cells = tr.children
      if(cells.length <= 1) return false
      if(cells.length === 1 && cells[0].hasAttribute('colspan')) return false
      return true
    })
    if(rows.length < 2) return
    rows.sort((a, b) => cmp(coerce(cellValue(a, thIdx)), coerce(cellValue(b, thIdx)), dir))
    // Re-append keeps event listeners intact
    const frag = document.createDocumentFragment()
    rows.forEach(r => frag.appendChild(r))
    tbody.appendChild(frag)
  }

  function wire(tbl){
    if(!tbl || tbl.dataset.sortReady) return
    // Opt-outs
    if(tbl.hasAttribute('data-sort-manual')) return
    const thead = tbl.querySelector('thead')
    if(!thead) return
    // If any header declares data-k, the page already owns sorting
    if(thead.querySelector('th[data-k]')) return
    tbl.dataset.sortReady = '1'
    const ths = thead.querySelectorAll('th')
    ths.forEach((th, idx) => {
      if(th.classList.contains('no-sort')) return
      const txt = (th.textContent || '').trim()
      if(!txt) return                       // action/icon column
      if(th.querySelector('input,select,button')) return  // filter-bearing
      th.style.cursor = 'pointer'
      th.style.userSelect = 'none'
      th.title = th.title || 'Click to sort'
      // Inject arrow
      if(!th.querySelector('.'+ARROW_CLASS)){
        const s = document.createElement('span')
        s.className = ARROW_CLASS
        s.textContent = ' ↕'
        s.style.cssText = 'opacity:.28;font-size:9px;margin-left:4px;position:relative;top:-1px;display:inline-block'
        th.appendChild(s)
      }
      th.addEventListener('click', (ev) => {
        // Ignore clicks on interactive children
        if(ev.target.closest('a,button,input,select,label')) return
        const cur = th.dataset.sortDir
        const dir = cur === 'asc' ? -1 : 1
        // Reset siblings
        ths.forEach(x => {
          x.dataset.sortDir = ''
          const a = x.querySelector('.'+ARROW_CLASS)
          if(a){ a.textContent = ' ↕'; a.style.opacity = '.28'; a.style.color = '' }
        })
        th.dataset.sortDir = dir === 1 ? 'asc' : 'desc'
        const arr = th.querySelector('.'+ARROW_CLASS)
        if(arr){ arr.textContent = dir === 1 ? ' ▲' : ' ▼'; arr.style.opacity = '1'; arr.style.color = '#3b5fe2' }
        sortBy(tbl, idx, dir)
      })
    })
  }

  function wireAll(root){
    const scope = root || document
    scope.querySelectorAll('table').forEach(wire)
  }

  // Initial wiring after DOM parse
  if(document.readyState !== 'loading') wireAll()
  else document.addEventListener('DOMContentLoaded', wireAll)

  // Re-wire for tables inserted or replaced after async loads
  const mo = new MutationObserver(muts => {
    for(const m of muts){
      for(const n of m.addedNodes){
        if(!(n instanceof HTMLElement)) continue
        if(n.tagName === 'TABLE') wire(n)
        if(typeof n.querySelectorAll === 'function') n.querySelectorAll('table').forEach(wire)
      }
    }
  })
  mo.observe(document.documentElement, { childList:true, subtree:true })

  window.CW_SortableTables = { wire, wireAll }
})();
