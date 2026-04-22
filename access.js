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

// ── Global button hover / focus affordance ───────────────────────
// Injected once per page. Acts as a baseline: any page-specific
// :hover rule with higher specificity still wins. Keyboard users
// get a visible focus ring too (WCAG 2.1 §2.4.7). Nav links (.nl)
// and the help ? button already have their own treatments and are
// excluded with :not() so we don't double up.
CW_ACCESS.injectButtonStyles = function () {
  if (document.getElementById('cw-btn-hover-styles')) return;
  const s = document.createElement('style');
  s.id = 'cw-btn-hover-styles';
  s.textContent = `
    button:not(.nl):not(#helpBtn):not(#cw-help-btn),
    .btn, a.btn, input[type="submit"], input[type="button"] {
      transition: transform .15s cubic-bezier(.4,0,.2,1),
                  box-shadow .15s ease,
                  filter .15s ease,
                  background-color .15s ease,
                  letter-spacing .15s ease;
      transform-origin: center;
    }
    /* HOVER — the whole button scales up, text visually grows, shadow
       lifts it off the surface. 1.06 on a 14px button ≈ +0.8px text,
       visible but not layout-breaking. */
    button:not(.nl):not(#helpBtn):not(#cw-help-btn):not(:disabled):hover,
    .btn:not(:disabled):hover,
    a.btn:hover,
    input[type="submit"]:not(:disabled):hover,
    input[type="button"]:not(:disabled):hover {
      transform: translateY(-2px) scale(1.06);
      filter: brightness(1.08) saturate(1.08);
      box-shadow: 0 12px 28px rgba(15, 23, 42, .18),
                  0 4px 10px rgba(15, 23, 42, .08);
      letter-spacing: .15px;
      cursor: pointer;
      z-index: 1;
    }
    /* ACTIVE (pressed) — quick "sink" then back, with tight shadow. */
    button:not(.nl):not(#helpBtn):not(#cw-help-btn):not(:disabled):active,
    .btn:not(:disabled):active,
    a.btn:active,
    input[type="submit"]:not(:disabled):active,
    input[type="button"]:not(:disabled):active {
      transform: translateY(1px) scale(1.01);
      filter: brightness(.94);
      box-shadow: 0 2px 6px rgba(15, 23, 42, .14) inset,
                  0 1px 3px rgba(15, 23, 42, .12);
      transition-duration: .06s;
    }
    button:disabled, .btn:disabled,
    input[type="submit"]:disabled, input[type="button"]:disabled {
      cursor: not-allowed;
      opacity: .55;
      filter: grayscale(.2);
    }
    /* Keyboard focus — always visible for WCAG 2.1 §2.4.7. */
    button:focus-visible,
    .btn:focus-visible,
    a.btn:focus-visible,
    input[type="submit"]:focus-visible,
    input[type="button"]:focus-visible {
      outline: 2px solid #3b5fe2;
      outline-offset: 3px;
      box-shadow: 0 0 0 4px rgba(59,95,226,.18),
                  0 8px 20px rgba(15,23,42,.15);
    }
    /* Sidebar nav items — subtler bump (no scale, just weight + shadow)
       because scaling a fixed-width sidebar entry looks jittery. */
    .nl {
      transition: background-color .15s ease, color .15s ease,
                  box-shadow .15s ease, font-weight .15s ease;
    }
    .nl:hover {
      box-shadow: 0 2px 8px rgba(15,23,42,.08);
      font-weight: 600;
    }
  `;
  document.head.appendChild(s);
};

// ── Auto-run ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  CW_ACCESS.injectButtonStyles();
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});
