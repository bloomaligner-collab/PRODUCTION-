// ═══════════════════════════════════════════════════════════════
// Cedarwings SAS — Role-Based Access Control v2.0
// ═══════════════════════════════════════════════════════════════
const CW_ACCESS = {
  pages: {
    dashboard:            { label: 'Dashboard',           icon: '📊', section: 'Operations' },
    production:           { label: 'Production',          icon: '🏭', section: 'Operations' },
    bloom_import:         { label: 'Bloom Import',        icon: '🌸', section: 'Operations' },
    inventory:            { label: 'Inventory',           icon: '📦', section: 'Operations' },
    machines:             { label: 'Machines',            icon: '⚙️',  section: 'Operations' },
    employees:            { label: 'Employees',           icon: '👥', section: 'Team' },
    clocking:             { label: 'Clocking',            icon: '⏱',  section: 'Team' },
    time_report:          { label: 'Time Report',         icon: '📅', section: 'Team' },
    qualite:              { label: 'Quality',             icon: '✅', section: 'Quality' },
    tracabilite:          { label: 'Traceability',        icon: '🔍', section: 'Quality' },
    non_conformity:       { label: 'Non-Conformity',      icon: '⚠️',  section: 'Quality' },
    suppliers:            { label: 'Suppliers',           icon: '🏭', section: 'Quality' },
    production_materials: { label: 'Prod. Materials',     icon: '🧪', section: 'Quality' },
    roles:                { label: 'Roles',               icon: '🔐', section: 'Admin' },
    settings:             { label: 'Settings',            icon: '⚙️',  section: 'Admin' },
    changelog:            { label: 'Changelog',           icon: '📝', section: 'Admin' },
  },
  getName() { return sessionStorage.getItem('cw_name') || 'User'; },
  getRole()  { return sessionStorage.getItem('cw_role')  || 'employee'; },
  guard(pageKey) {
    const name = sessionStorage.getItem('cw_name');
    const role = sessionStorage.getItem('cw_role');
    if (!name) { window.location.href = 'index.html'; return false; }
    const home = role === 'manager' ? 'manager.html' : 'production.html';
    const access = JSON.parse(sessionStorage.getItem('cw_access') || '[]');
    if (role !== 'manager' && access.length > 0 && !access.includes(pageKey)) {
      window.location.href = home; return false;
    }
    return true;
  },
  buildSidebar(activeKey) {
    const name = sessionStorage.getItem('cw_name') || 'User';
    const role = sessionStorage.getItem('cw_role') || 'employee';
    const access = JSON.parse(sessionStorage.getItem('cw_access') || '[]');
    const pageFiles = {
      dashboard:'manager.html', production:'production.html', bloom_import:'bloom_import.html',
      inventory:'inventory.html', machines:'machines.html',
      employees:'employees.html', clocking:'clocking.html', time_report:'time_report.html',
      qualite:'qualite.html', tracabilite:'tracabilite.html', non_conformity:'non_conformity.html',
      suppliers:'suppliers.html', production_materials:'production_materials.html',
      roles:'roles.html', settings:'settings.html', changelog:'changelog.html',
    };
    const sections = {};
    for (const [key, cfg] of Object.entries(this.pages)) {
      if (role !== 'manager' && access.length > 0 && !access.includes(key)) continue;
      if (!sections[cfg.section]) sections[cfg.section] = [];
      sections[cfg.section].push({ key, ...cfg, file: pageFiles[key] || '#' });
    }
    // .sb-s = section header, .nl = nav link, .on = active — all defined in page CSS
    let nav = '';
    for (const [sec, items] of Object.entries(sections)) {
      nav += `<div class="sb-s">${sec}</div>`;
      for (const item of items) {
        nav += `<a href="${item.file}" class="nl${item.key===activeKey?' on':''}"><span class="ic">${item.icon}</span>${item.label}</a>`;
      }
    }
    // Logout in footer
    const logoutHtml = `<a href="index.html" class="nl" onclick="sessionStorage.clear()" style="color:var(--red,#dc2626)"><span class="ic">🚪</span>${name} — Logout</a>`;
    return { nav, logoutHtml };
  },
  injectSidebar(activeKey) {
    const { nav, logoutHtml } = this.buildSidebar(activeKey);
    const navEl = document.querySelector('.sb-nav');
    if (navEl) navEl.innerHTML = nav;
    const footEl = document.querySelector('.sb-foot');
    if (footEl) footEl.innerHTML = logoutHtml;
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});
