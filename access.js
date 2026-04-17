// ═══════════════════════════════════════════════════════════════
// Cedarwings SAS — Role-Based Access Control v2.0
// Include this file in every protected page BEFORE the module script
// Usage: add <script src="access.js"></script> in <head>
//        then call CW_ACCESS.guard('page_key') at top of page script
// ═══════════════════════════════════════════════════════════════

const CW_ACCESS = {
  // Session storage keys
  EK:  'cw_current_emp',
  RK:  'cw_role',
  PK:  'cw_pages',
  CRK: 'cw_custom_role',

  // All pages in the system with their display info
  ALL_PAGES: {
    manager:              { label: 'Dashboard',           icon: '📊', section: 'Operations' },
    production:           { label: 'Production',          icon: '🏭', section: 'Operations' },
    production_materials: { label: 'Materials & Lots',    icon: '📦', section: 'Operations' },
    machines:             { label: 'Machines',            icon: '⚙',  section: 'Operations' },
    maintenance_history:  { label: 'Maintenance History', icon: '🔧', section: 'Operations' },
    employees:            { label: 'Employees',           icon: '👥', section: 'Team' },
    employee_profile:     { label: 'Employee Profile',    icon: '👤', section: 'Team' },
    time_report:          { label: 'Time Report',         icon: '⏱', section: 'Team' },
    tracabilite:          { label: 'Traceability',        icon: '🔍', section: 'Quality' },
    qualite:              { label: 'Quality Control',     icon: '✅', section: 'Quality' },
    non_conformity:       { label: 'Non-Conformity',      icon: '⚠️', section: 'Quality' },
    suppliers:            { label: 'Suppliers',           icon: '🏭', section: 'Quality' },
    customer_feedback:    { label: 'Customer Feedback',   icon: '💬', section: 'Quality' },
    internal_audit:       { label: 'Internal Audits',     icon: '🔍', section: 'Quality' },
    inventory:            { label: 'Inventory',           icon: '📦', section: 'Resources' },
    requisition:          { label: 'Requisitions',        icon: '📋', section: 'Resources' },
    bloom_import:         { label: 'Bloom Import',        icon: '🔵', section: 'Orders' },
    iso_compliance:       { label: 'ISO 13485 Compliance',icon: '✅', section: 'System' },
    settings:             { label: 'Settings',            icon: '⚙',  section: 'System' },
    changelog:            { label: 'Changelog',           icon: '📝', section: 'System' },
    roles:                { label: 'Roles',               icon: '🔐', section: 'System' },
    clocking:             { label: 'Clocking Terminal',   icon: '⏲', section: 'System' },
  },

  // Section order for sidebar
  SECTIONS: ['Operations','Team','Quality','Resources','Orders','System'],
  
  // Translated section labels
  sectionLabel(sec) {
    const lang = (typeof CW_LANG !== 'undefined') ? CW_LANG.get() : 'fr';
    const labels = {
      fr: { Operations:'Opérations', Team:'Équipe', Quality:'Qualité', Resources:'Ressources', Orders:'Commandes', System:'Système' },
      en: { Operations:'Operations', Team:'Team', Quality:'Quality', Resources:'Resources', Orders:'Orders', System:'System' }
    };
    return (labels[lang] || labels.fr)[sec] || sec;
  },

  // ─── Getters ───────────────────────────────────────────────
  getPages()  { try { return JSON.parse(sessionStorage.getItem(this.PK)||'["clocking","employee_profile"]') } catch { return ['clocking','employee_profile'] } },
  getRole()   { return sessionStorage.getItem(this.RK)||'employee' },
  getCustomRole() { return sessionStorage.getItem(this.CRK)||this.getRole() },
  getName()   { return sessionStorage.getItem(this.EK)||localStorage.getItem(this.EK)||'' },
  isManager() { return this.getRole()==='manager' },

  hasAccess(page) {
    const pages = this.getPages();
    return pages.includes('all') || pages.includes(page);
  },

  // ─── Guard: redirect if not logged in or no access ─────────
  guard(thisPage) {
    const name = this.getName();
    if (!name) { window.location.href = 'index.html'; return false; }
    if (!this.hasAccess(thisPage)) {
      const pages = this.getPages();
      const home  = pages.includes('all') ? 'manager.html' :
                    pages.length ? (pages[0] + '.html') : 'clocking.html';
      window.location.href = home;
      return false;
    }
    return true;
  },

  // ─── Build dynamic sidebar based on user's page access ─────
  buildSidebar(activeKey) {
    const pages = this.getPages();
    const hasAll = pages.includes('all');
    const has = (k) => hasAll || pages.includes(k);
    const name = this.getName();
    const role = this.getCustomRole();

    // Group pages by section, only show accessible ones
    const bySection = {};
    for (const [key, info] of Object.entries(this.ALL_PAGES)) {
      if (!has(key)) continue;
      const sec = info.section;
      if (!bySection[sec]) bySection[sec] = [];
      bySection[sec].push({ key, ...info });
    }

    // Build sidebar HTML
    let nav = '';
    for (const section of this.SECTIONS) {
      const items = bySection[section];
      if (!items || !items.length) continue;
      nav += `<div class="sb-s">${this.sectionLabel(section)}</div>`;
      for (const item of items) {
        const isActive = item.key === activeKey;
        const itemLabel = (typeof CW_LANG !== 'undefined') ? (item['label_' + CW_LANG.get()] || item.label) : item.label;
      nav += `<a href="${item.key === 'employee_profile' ? 'employee_profile.html' : item.key + '.html'}" class="nl${isActive ? ' on' : ''}"><span class="ic">${item.icon}</span>${itemLabel}</a>`;
      }
    }

    // Sidebar footer: user info + logout
    const signOutText = (typeof CW_LANG !== 'undefined' && CW_LANG.isFR()) ? 'Déconnexion' : 'Sign Out';
    const roleText = (typeof CW_LANG !== 'undefined' && CW_LANG.isFR()) ? role.replace(/_/g,' ') : role.replace(/_/g,' ');
    const footer = `
      <div class="sb-foot">
        <div style="display:flex;align-items:center;gap:10px;padding:8px 8px 10px;border-top:1px solid var(--bdr);margin-bottom:6px">
          <div style="width:32px;height:32px;background:var(--b50);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">👤</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
            <div style="font-size:10px;color:var(--mu);text-transform:capitalize">${role.replace(/_/g,' ')}</div>
          </div>
        </div>
        <a href="index.html" onclick="sessionStorage.clear()" class="nl" style="color:var(--red);font-size:12px"><span class="ic">🚪</span>${signOutText}</a>
      </div>`;

    // Return full sidebar injection target content
    return { nav, footer };
  },

  // ─── Inject sidebar into existing page ─────────────────────
  injectSidebar(activeKey) {
    const { nav, footer } = this.buildSidebar(activeKey);
    // Replace the sb-nav div content
    const navEl = document.querySelector('.sb-nav');
    if (navEl) navEl.innerHTML = nav;
    // Replace or inject footer
    const footEl = document.querySelector('.sb-foot');
    if (footEl) footEl.outerHTML = footer;
    else {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) sidebar.insertAdjacentHTML('beforeend', footer);
    }
  }
};

// Auto-run: inject sidebar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Guard is called explicitly per page — sidebar injection uses PAGE_KEY
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});

// ═══════════════════════════════════════════════════════════════
// INVENTORY PAGE PATCH — items list + suppliers + locations + edit
// Loaded by access.js which is included on every page
// Works regardless of what version of inventory.html is live
// ═══════════════════════════════════════════════════════════════
(function() {
  const API = 'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/get-inventory-data';
  const SB_URL = 'https://cvrmadmzzualqukxxlro.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm1hZG16enVhbHF1a3h4bHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTc3MTksImV4cCI6MjA2MDQ5MzcxOX0.5tDCEMtzGMNFBfmXNMPkHGMgIw-l5XCMjIcCHXtHRF4';

  let _items = [], _suppliers = [], _locations = [];

  // ── Fetch all data from edge function ──────────────────────
  async function loadData() {
    try {
      const res = await fetch(API);
      const d = await res.json();
      _items = d.items || [];
      _suppliers = d.suppliers || [];
      _locations = d.locations || [];
    } catch(e) {
      console.warn('inv patch load:', e.message);
    }
  }

  // ── Render Items tab table ──────────────────────────────────
  function renderItems() {
    const tbl = document.getElementById('tItems');
    if (!tbl) return;
    if (!_items.length) {
      tbl.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:20px;color:#888">No items yet. Click + Add Item above.</td></tr>';
    } else {
      tbl.innerHTML = _items.map(it => {
        const nm  = it.item_name || it.name || '—';
        const cat = it.category_name || it.category || '—';
        const u   = it.unit_of_measure || it.unit || '—';
        return `<tr>
          <td><strong>${nm}</strong></td>
          <td style="font-size:12px">${cat}</td>
          <td style="font-family:monospace">${u}</td>
          <td style="font-family:monospace">${it.min_qty||0}</td>
          <td style="font-family:monospace">${it.max_qty||0}</td>
          <td style="font-family:monospace">${it.monthly_consumption||0}</td>
          <td style="font-family:monospace">${it.lead_time_days||0}d</td>
          <td>${it.auto_requisition_enabled
            ? '<span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700">On</span>'
            : '<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700">Off</span>'}</td>
          <td style="font-family:monospace">—</td>
          <td><div style="display:flex;gap:5px">
            <button class="btn b-gho b-sm" onclick="__editItem('${it.id}')">✏ Edit</button>
            <button class="btn b-grn b-sm" onclick="__openLot('${it.id}')">+ Lot</button>
          </div></td>
        </tr>`;
      }).join('');
    }
    const k = document.getElementById('kItems');
    if (k) k.textContent = _items.length;
    // fill item dropdowns
    ['lIt','fItem'].forEach(id => {
      const s = document.getElementById(id);
      if (!s) return;
      const cv = s.value;
      s.innerHTML = '<option value="">— Select item —</option>' +
        _items.map(it => {
          const nm = it.item_name||it.name||'?';
          const u  = it.unit_of_measure||it.unit||'';
          return `<option value="${it.id}" data-unit="${u}">${nm}${u?' ('+u+')':''}</option>`;
        }).join('');
      if (cv) s.value = cv;
    });
  }

  // ── Fill supplier dropdowns ─────────────────────────────────
  function fillSuppliers() {
    const opts = '<option value="">— Select Supplier —</option>' +
      _suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    ['iSup','lSup'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = opts;
    });
  }

  // ── Fill location dropdown ──────────────────────────────────
  function fillLocations() {
    const opts = '<option value="">— Select Location —</option>' +
      _locations.map(l => `<option value="${l.id}">${l.location_name}</option>`).join('');
    const el = document.getElementById('lLoc');
    if (el) el.innerHTML = opts;
  }

  // ── Edit Item modal ─────────────────────────────────────────
  window.__editItem = function(id) {
    const it = _items.find(x => x.id === id);
    if (!it) return;
    const $ = i => document.getElementById(i);
    if (!$('mItem')) return;
    fillSuppliers();
    $('eiId') && ($('eiId').value = id);
    $('mItemT') && ($('mItemT').textContent = 'Edit Item');
    $('iN') && ($('iN').value = it.item_name||it.name||'');
    $('iC') && ($('iC').value = it.category_name||it.category||'');
    $('iU') && ($('iU').value = it.unit_of_measure||it.unit||'');
    $('iSK') && ($('iSK').value = it.sku||'');
    $('iMn') && ($('iMn').value = it.min_qty||0);
    $('iMx') && ($('iMx').value = it.max_qty||0);
    $('iMC') && ($('iMC').value = it.monthly_consumption||0);
    $('iLT') && ($('iLT').value = it.lead_time_days||0);
    $('iNt') && ($('iNt').value = it.notes||'');
    $('iAR') && ($('iAR').value = it.auto_requisition_enabled ? 'true' : 'false');
    $('eItem') && ($('eItem').textContent = '');
    if (it.preferred_supplier_id) setTimeout(() => {
      if ($('iSup')) $('iSup').value = it.preferred_supplier_id;
    }, 50);
    $('mItem').classList.add('on');
  };

  // ── Open Add Lot modal for specific item ────────────────────
  window.__openLot = function(itemId) {
    const $ = i => document.getElementById(i);
    if (!$('mLot')) return;
    fillSuppliers();
    fillLocations();
    // reset fields
    ['lSN','lQT','lUC','lED','lMS','lRP','lNt'].forEach(id => { if ($(id)) $(id).value = ''; });
    if ($('lLN')) $('lLN').value = 'LOT-' + Date.now().toString().slice(-6);
    if ($('lPD')) $('lPD').value = new Date().toISOString().slice(0, 10);
    if ($('lSup')) $('lSup').value = '';
    if ($('lLoc')) $('lLoc').value = '';
    if ($('lIt')) $('lIt').value = itemId;
    $('mLot').classList.add('on');
  };

  // ── Patch Add Item button ───────────────────────────────────
  function patchAddItemBtn() {
    const btn = document.getElementById('btnAI');
    if (!btn || btn._patched) return;
    btn._patched = true;
    btn.addEventListener('click', () => {
      const $ = i => document.getElementById(i);
      if (!$('mItem')) return;
      fillSuppliers();
      if ($('eiId')) $('eiId').value = '';
      if ($('mItemT')) $('mItemT').textContent = 'Add New Item';
      ['iN','iC','iU','iSK','iMn','iMx','iMC','iLT','iNt'].forEach(id => { if ($(id)) $(id).value = ''; });
      if ($('iSup')) $('iSup').value = '';
      if ($('iAR')) $('iAR').value = 'true';
      if ($('eItem')) $('eItem').textContent = '';
      $('mItem').classList.add('on');
    });
  }

  // ── Patch Add Stock Lot button ──────────────────────────────
  function patchAddLotBtn() {
    const btn = document.getElementById('btnAL');
    if (!btn || btn._patched) return;
    btn._patched = true;
    btn.addEventListener('click', () => {
      const $ = i => document.getElementById(i);
      if (!$('mLot')) return;
      fillSuppliers();
      fillLocations();
      ['lIt','lSN','lQT','lUC','lED','lSup','lLoc','lMS','lRP','lNt'].forEach(id => { if ($(id)) $(id).value = ''; });
      if ($('lLN')) $('lLN').value = 'LOT-' + Date.now().toString().slice(-6);
      if ($('lPD')) $('lPD').value = new Date().toISOString().slice(0, 10);
      $('mLot').classList.add('on');
    });
  }

  // ── Main init ───────────────────────────────────────────────
  async function init() {
    if (!document.getElementById('tItems') &&
        !document.getElementById('btnAI') &&
        !document.getElementById('btnAL')) return; // not inventory page

    await loadData();
    renderItems();
    fillSuppliers();
    fillLocations();
    patchAddItemBtn();
    patchAddLotBtn();

    // Re-render when Items tab clicked
    document.addEventListener('click', e => {
      if (e.target && e.target.dataset && e.target.dataset.t === 'items') {
        setTimeout(() => { renderItems(); fillSuppliers(); fillLocations(); }, 150);
      }
      // Also repatch buttons when any tab opens (modal buttons may not exist yet)
      if (e.target && e.target.dataset && e.target.dataset.t) {
        setTimeout(() => { patchAddItemBtn(); patchAddLotBtn(); }, 200);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 600));
  } else {
    setTimeout(init, 600);
  }
})();
