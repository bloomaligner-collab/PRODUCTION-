// ═══════════════════════════════════════════════════════════════
// Cedarwings SAS — Role-Based Access Control v3.2
// (Help panel lives in lang.js as CW_HELP — single source of truth,
//  one floating ? button per page, bilingual FR/EN.)
// ═══════════════════════════════════════════════════════════════
const CW_ACCESS = {

  // ── Navigation structure ───────────────────────────────────────
  nav: [
    { section: 'Operations' },
    { key: 'dashboard',            label: 'Dashboard',           icon: '📊', file: 'manager.html' },
    { key: 'production',           label: 'Production',          icon: '🏭', file: 'production.html' },
    { key: 'production_materials', label: 'Materials & Lots',    icon: '🧪', file: 'production_materials.html' },
    { key: 'machines',             label: 'Machines',            icon: '⚙',  file: 'machines.html' },
    { key: 'maintenance_history',  label: 'Maintenance History', icon: '🔧', file: 'maintenance_history.html' },
    { section: 'Team' },
    { key: 'employees',            label: 'Employees',           icon: '👥', file: 'employees.html' },
    { key: 'employee_profile',     label: 'Employee Profile',    icon: '👤', file: 'employee_profile.html' },
    { key: 'time_report',          label: 'Time Report',         icon: '📈', file: 'time_report.html' },
    { section: 'Quality' },
    { key: 'tracabilite',          label: 'Traceability',        icon: '🔖', file: 'tracabilite.html' },
    { key: 'qualite',              label: 'Quality Control',     icon: '✅', file: 'qualite.html' },
    { key: 'non_conformity',       label: 'Non-Conformity',      icon: '⚠️', file: 'non_conformity.html' },
    { key: 'internal_audit',       label: 'Internal Audit',      icon: '📋', file: 'internal_audit.html' },
    { key: 'customer_feedback',    label: 'Customer Feedback',   icon: '💬', file: 'customer_feedback.html' },
    { section: 'Resources' },
    { key: 'inventory',            label: 'Inventory',           icon: '📦', file: 'inventory.html' },
    { key: 'suppliers',            label: 'Suppliers',           icon: '🏭', file: 'suppliers.html' },
    { section: 'Integrations' },
    { key: 'bloom_import',         label: 'Bloom Import',        icon: '🌸', file: 'bloom_import.html' },
    { section: 'System' },
    { key: 'settings',             label: 'Settings',            icon: '⚙',  file: 'settings.html' },
    { key: 'roles',                label: 'Roles',               icon: '🔑', file: 'roles.html' },
    { key: 'changelog',            label: 'Changelog',           icon: '📝', file: 'changelog.html' },
    { key: 'iso_compliance',       label: 'ISO Compliance',      icon: '🏅', file: 'iso_compliance.html' },
    { section: 'Terminal' },
    { key: 'clocking',             label: 'Clocking Terminal',   icon: '⏱', file: 'clocking.html' },
  ],


  // ── Helpers ────────────────────────────────────────────────────
  getName() { return sessionStorage.getItem('cw_name') || 'User'; },
  getRole()  { return sessionStorage.getItem('cw_role') || 'employee'; },
  getAccess() {
    // Login (index.html doLogin) stores the array under cw_pages. Older
    // builds also wrote cw_access — read either, prefer cw_pages.
    try {
      const raw = sessionStorage.getItem('cw_pages') || sessionStorage.getItem('cw_access') || '[]';
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  },
  hasFullAccess() {
    const a = this.getAccess();
    return this.getRole() === 'manager' || a.includes('all');
  },
  homePage() {
    if (this.hasFullAccess()) return 'manager.html';
    const a = this.getAccess();
    const map = {
      manager: 'manager.html', dashboard: 'manager.html',
      inventory: 'inventory.html', suppliers: 'suppliers.html',
      production_materials: 'production_materials.html',
      requisition: 'requisition.html',
      tracabilite: 'tracabilite.html', qualite: 'qualite.html',
      non_conformity: 'non_conformity.html', internal_audit: 'internal_audit.html',
      customer_feedback: 'customer_feedback.html',
      production: 'production.html', machines: 'machines.html',
      maintenance_history: 'maintenance_history.html',
      employees: 'employees.html', employee_profile: 'employee_profile.html',
      time_report: 'time_report.html',
      settings: 'settings.html', roles: 'roles.html',
      changelog: 'changelog.html', iso_compliance: 'iso_compliance.html',
      bloom_import: 'bloom_import.html', clocking: 'clocking.html'
    };
    for (const key of a) if (map[key]) return map[key];
    return 'employee_profile.html';
  },

  // ── Guard ──────────────────────────────────────────────────────
  guard(pageKey) {
    const name = sessionStorage.getItem('cw_name');
    if (!name) { window.location.href = 'index.html'; return false; }
    if (this.hasFullAccess()) return true;
    const access = this.getAccess();
    if (!access.includes(pageKey)) {
      window.location.href = this.homePage(); return false;
    }
    return true;
  },

  // ── Build nav HTML ─────────────────────────────────────────────
  buildNav(activeKey) {
    const fullAccess = this.hasFullAccess();
    const access = this.getAccess();
    let html = '';
    for (const item of this.nav) {
      if (item.section) { html += `<div class="sb-s">${item.section}</div>`; continue; }
      if (!fullAccess && !access.includes(item.key)) continue;
      const active = item.key === activeKey ? ' on' : '';
      html += `<a href="${item.file}" class="nl${active}"><span class="ic">${item.icon}</span>${item.label}</a>`;
    }
    return html;
  },


  // ── Inject sidebar ─────────────────────────────────────────────
  injectSidebar(activeKey) {
    const name = this.getName();
    const role = this.getRole();
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
    const home = this.homePage();

    const navEl = document.querySelector('.sb-nav');
    if (navEl) navEl.innerHTML = this.buildNav(activeKey);

    const roleLbl = document.getElementById('sb-role-lbl')
                 || document.querySelector('.sb-badge')
                 || document.querySelector('.rb');
    if (roleLbl) roleLbl.textContent = roleLabel;

    const footEl = document.querySelector('.sb-foot');
    if (footEl) {
      footEl.innerHTML = `
        <div style="font-size:12px;font-weight:700;color:var(--mu,#64748b);padding:2px 10px 8px;letter-spacing:-.1px">
          👤 ${name} <span style="font-weight:500;opacity:.7">— ${roleLabel}</span>
        </div>
        <a href="${home}" class="nl"><span class="ic">🏠</span>Home</a>
        <a href="index.html" class="nl" onclick="event.preventDefault();(window.cwSignOut?window.cwSignOut():(sessionStorage.clear(),location.replace('index.html')))" style="color:var(--red,#dc2626)"><span class="ic">🚪</span>Logout</a>
      `;
    }

  }
};

// ── Auto-run ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});
