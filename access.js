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
