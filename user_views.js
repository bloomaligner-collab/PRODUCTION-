// user_views.js — shared per-user saved-filter-views control.
// Rows live in public.user_views (RLS: owner-only). Each page
// that wants saved views calls mountSavedViews(config) once,
// after its filter inputs and mount container exist in the DOM.
//
// Example:
//   import { mountSavedViews } from './user_views.js'
//   mountSavedViews({
//     sb,                              // authenticated supabase client
//     page:        'customer_feedback',
//     mountEl:     document.getElementById('savedViewsMount'),
//     filterIds:   ['typeFilter','statusFilter','assignedFilter','searchInput'],
//     applyFilter: () => applyFilter(),   // called after fields are written
//     ntf:         (msg,type) => ntf(msg,type), // optional toast helper
//     currentUser: currentUser,
//   })

let _cssInjected = false
function _injectCssOnce() {
  if (_cssInjected) return
  _cssInjected = true
  const css = `
  .sv-wrap{position:relative}
  .sv-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1.5px solid var(--bdr);border-radius:8px;background:var(--card);color:var(--txt);font-family:var(--f);font-size:12px;font-weight:600;cursor:pointer;transition:all .12s;line-height:1}
  .sv-btn:hover{border-color:var(--blue);color:var(--blue)}
  .sv-btn.unsaved .sv-label::after{content:' *';color:var(--red,#dc2626)}
  .sv-chev{color:var(--mu);font-size:10px}
  .sv-menu{display:none;position:absolute;top:calc(100% + 4px);left:0;background:var(--card);border:1px solid var(--bdr);border-radius:10px;box-shadow:var(--sh2,0 6px 24px rgba(0,0,0,.09));min-width:300px;z-index:200;padding:4px;font-size:12px}
  .sv-menu.on{display:block}
  .sv-list{max-height:260px;overflow-y:auto}
  .sv-row{display:flex;align-items:center;gap:4px;padding:8px 10px;border-radius:7px;cursor:pointer;color:var(--txt)}
  .sv-row:hover{background:var(--bg)}
  .sv-row.active{background:var(--b50,#eef2ff);color:var(--blue,#3b5fe2);font-weight:700}
  .sv-row .sv-name{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sv-row .sv-icon{width:14px;text-align:center;color:var(--mu);font-size:11px}
  .sv-action{padding:4px 7px;border-radius:5px;background:transparent;border:none;font-size:12px;cursor:pointer;color:var(--mu)}
  .sv-action:hover{background:var(--card);color:var(--txt)}
  .sv-action.del:hover{color:var(--red,#dc2626);background:var(--r50,#fef2f2)}
  .sv-empty{padding:14px;text-align:center;color:var(--dim);font-size:11px}
  .sv-foot{border-top:1px solid var(--bdr);margin-top:4px;padding:7px}
  `
  const tag = document.createElement('style')
  tag.textContent = css
  document.head.appendChild(tag)
}

function _esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export async function mountSavedViews(opts) {
  const { sb, page, mountEl, filterIds, applyFilter, currentUser } = opts
  if (!sb || !page || !mountEl || !filterIds || !applyFilter) {
    console.warn('[user_views] missing required option'); return
  }
  const ntf = typeof opts.ntf === 'function' ? opts.ntf : (() => {})
  const currentViewKey = `cw_sv_current_${page}_${currentUser || 'anon'}`
  const legacyKey      = `cw_fb_views_${currentUser || 'anon'}`  // pre-module localStorage
  let currentViewId    = localStorage.getItem(currentViewKey) || ''
  let cache            = []

  _injectCssOnce()

  // Build the UI inside the caller-supplied mount element.
  mountEl.innerHTML = `
    <div class="sv-wrap">
      <button type="button" class="sv-btn">
        <span>👁</span>
        <span class="sv-label">Default</span>
        <span class="sv-chev">▾</span>
      </button>
      <div class="sv-menu">
        <div class="sv-list"></div>
        <div class="sv-foot">
          <button type="button" class="btn bb sv-save-new" style="width:100%;padding:7px 10px;font-size:12px">💾 Save current filters as new view…</button>
        </div>
      </div>
    </div>
  `
  const wrap   = mountEl.querySelector('.sv-wrap')
  const btn    = mountEl.querySelector('.sv-btn')
  const label  = mountEl.querySelector('.sv-label')
  const menu   = mountEl.querySelector('.sv-menu')
  const list   = mountEl.querySelector('.sv-list')
  const saveNew = mountEl.querySelector('.sv-save-new')

  function readFilters() {
    const out = {}
    for (const id of filterIds) {
      const el = document.getElementById(id)
      out[id] = el ? el.value : ''
    }
    return out
  }
  function writeFilters(f) {
    f = f || {}
    for (const id of filterIds) {
      const el = document.getElementById(id)
      if (el) el.value = f[id] || ''
    }
    applyFilter()
  }
  function filtersEqual(a, b) {
    return filterIds.every(k => (a?.[k] || '') === (b?.[k] || ''))
  }

  async function loadFromDB() {
    const { data, error } = await sb.from('user_views')
      .select('id, name, filters')
      .eq('page', page)
      .order('created_at', { ascending: true })
    if (error) { console.warn('[user_views] load failed:', error.message); return }
    cache = (data || []).map(r => ({ id: r.id, name: r.name, filters: r.filters || {} }))
  }

  async function migrateLegacy() {
    // Only migrates views from the customer_feedback page —
    // that's the only place the old localStorage key ever lived.
    if (page !== 'customer_feedback') return
    let legacy
    try { legacy = JSON.parse(localStorage.getItem(legacyKey) || '[]') } catch { legacy = [] }
    if (!Array.isArray(legacy) || !legacy.length) return
    if (cache.length) { localStorage.removeItem(legacyKey); return }
    const rows = legacy.map(v => ({ page, name: v.name || 'Untitled view', filters: v.filters || {} }))
    const { error } = await sb.from('user_views').insert(rows)
    if (error) { console.warn('[user_views] legacy migration failed:', error.message); return }
    localStorage.removeItem(legacyKey)
    await loadFromDB()
    if (currentViewId && !cache.some(v => v.id === currentViewId)) {
      currentViewId = ''; localStorage.setItem(currentViewKey, '')
    }
  }

  function render() {
    const active = cache.find(v => v.id === currentViewId)
    label.textContent = active ? active.name : 'Default'
    const unsaved = active ? !filtersEqual(readFilters(), active.filters) : false
    btn.classList.toggle('unsaved', unsaved)

    let html = ''
    const isDefault = !active
    html += `<div class="sv-row ${isDefault ? 'active' : ''}" data-action="apply" data-id="">
      <span class="sv-icon">${isDefault ? '●' : '○'}</span>
      <span class="sv-name">Default <span style="color:var(--dim);font-weight:400">· no filters</span></span>
    </div>`
    if (!cache.length) {
      html += `<div class="sv-empty">No saved views yet — set filters and click “Save current filters…” below.</div>`
    } else {
      for (const v of cache) {
        const isOn = v.id === currentViewId
        html += `<div class="sv-row ${isOn ? 'active' : ''}" data-action="apply" data-id="${v.id}">
          <span class="sv-icon">${isOn ? '●' : '○'}</span>
          <span class="sv-name">${_esc(v.name)}</span>
          <button type="button" class="sv-action" data-action="rename" data-id="${v.id}" title="Rename">✏️</button>
          <button type="button" class="sv-action del" data-action="delete" data-id="${v.id}" title="Delete">🗑️</button>
        </div>`
      }
    }
    list.innerHTML = html
  }

  async function apply(id) {
    menu.classList.remove('on')
    currentViewId = id
    localStorage.setItem(currentViewKey, id)
    if (!id) writeFilters({})
    else {
      const v = cache.find(x => x.id === id)
      if (v) writeFilters(v.filters)
    }
    render()
  }

  async function saveCurrentAsNew() {
    const name = prompt('Name for this view:')
    if (!name || !name.trim()) return
    const { data, error } = await sb.from('user_views')
      .insert({ page, name: name.trim(), filters: readFilters() })
      .select('id, name, filters').single()
    if (error) { ntf('Save failed: ' + error.message, 'err'); return }
    cache.push({ id: data.id, name: data.name, filters: data.filters || {} })
    currentViewId = data.id
    localStorage.setItem(currentViewKey, data.id)
    render()
    menu.classList.add('on')
  }

  async function renameView(id) {
    const v = cache.find(x => x.id === id); if (!v) return
    const newName = prompt('Rename view:', v.name)
    if (!newName || !newName.trim() || newName.trim() === v.name) return
    const { error } = await sb.from('user_views').update({ name: newName.trim() }).eq('id', id)
    if (error) { ntf('Rename failed: ' + error.message, 'err'); return }
    v.name = newName.trim()
    render()
  }

  async function deleteView(id) {
    const v = cache.find(x => x.id === id); if (!v) return
    if (!confirm(`Delete view "${v.name}"?`)) return
    const { error } = await sb.from('user_views').delete().eq('id', id)
    if (error) { ntf('Delete failed: ' + error.message, 'err'); return }
    cache = cache.filter(x => x.id !== id)
    if (currentViewId === id) { currentViewId = ''; localStorage.setItem(currentViewKey, '') }
    render()
  }

  // Event wiring
  btn.addEventListener('click', e => {
    e.stopPropagation()
    const was = menu.classList.contains('on')
    menu.classList.toggle('on', !was)
    if (!was) render()
  })
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) menu.classList.remove('on')
  })
  list.addEventListener('click', e => {
    const el = e.target.closest('[data-action]'); if (!el) return
    const action = el.dataset.action
    const id     = el.dataset.id || ''
    if (action === 'apply')  { apply(id) }
    else if (action === 'rename') { e.stopPropagation(); renameView(id) }
    else if (action === 'delete') { e.stopPropagation(); deleteView(id) }
  })
  saveNew.addEventListener('click', saveCurrentAsNew)

  // Keep unsaved indicator in sync
  for (const id of filterIds) {
    const el = document.getElementById(id); if (!el) continue
    el.addEventListener('change', render)
    el.addEventListener('input',  render)
  }

  // Initial fetch + restore-last-view
  await loadFromDB()
  await migrateLegacy()
  if (currentViewId) {
    const v = cache.find(x => x.id === currentViewId)
    if (v) writeFilters(v.filters)
    else { currentViewId = ''; localStorage.setItem(currentViewKey, '') }
  }
  render()

  // Return a small api so callers can re-render if they add new
  // views through some custom path later.
  return { refresh: async () => { await loadFromDB(); render() } }
}
