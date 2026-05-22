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
    { key: 'chat',                 label: 'Team Chat',           icon: '💬', file: 'chat.html' },
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
    { key: 'outsourcing',          label: 'Outsourcing',         icon: '🚚', file: 'outsourcing.html' },
    { section: 'System' },
    { key: 'settings',             label: 'Settings',            icon: '⚙',  file: 'settings.html' },
    { key: 'roles',                label: 'Roles',               icon: '🔑', file: 'roles.html' },
    { key: 'audit_log',            label: 'Audit Log',           icon: '📜', file: 'audit_log.html' },
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
  // Access tiers (privilege, independent of the functional role templates
  // that drive page access): super_admin > admin > user. 'manager' is a
  // legacy synonym for an admin-level tier.
  ADMIN_TIERS: ['manager', 'admin', 'super_admin'],
  isSuperAdmin() { return this.getRole() === 'super_admin'; },
  isAdmin()      { return this.ADMIN_TIERS.includes(this.getRole()); },
  roleLabel(role) {
    const r = role || this.getRole();
    return { super_admin: 'Super Admin', admin: 'Admin', manager: 'Manager', employee: 'User' }[r]
        || (r.charAt(0).toUpperCase() + r.slice(1));
  },
  hasFullAccess() {
    const a = this.getAccess();
    return this.isAdmin() || a.includes('all');
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
      time_report: 'time_report.html', chat: 'chat.html',
      settings: 'settings.html', roles: 'roles.html', audit_log: 'audit_log.html',
      changelog: 'changelog.html', iso_compliance: 'iso_compliance.html',
      bloom_import: 'bloom_import.html', outsourcing: 'outsourcing.html', clocking: 'clocking.html'
    };
    // First real module — skip the shared Clocking Terminal and the
    // generic profile so users with real pages don't land on the kiosk.
    const skip = { clocking: 1, employee_profile: 1 };
    for (const key of a) if (map[key] && !skip[key]) return map[key];
    if (a.includes('employee_profile')) return 'employee_profile.html';
    if (a.includes('clocking')) return 'clocking.html';
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
    const roleLabel = this.roleLabel(role);
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
        <a href="manager.html#my-work" class="nl" id="cw-mywork-link" title="Open items assigned to you"><span class="ic">🎯</span>My Work <span id="cw-mywork-badge" style="margin-left:auto;background:var(--mu,#64748b);color:#fff;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:700;min-width:18px;text-align:center;display:none">—</span></a>
        <a href="#" class="nl" onclick="event.preventDefault();CW_ACCESS.openPasswordModal()"><span class="ic">🔑</span>Change password</a>
        <a href="#" class="nl" onclick="event.preventDefault();CW_ACCESS.enableNotifications()" title="Turn on push notifications on this device"><span class="ic">🔔</span>Enable alerts</a>
        <a href="#" class="nl" onclick="event.preventDefault();CW_ACCESS.testNotification()" title="Show a test notification on this device"><span class="ic">🧪</span>Test notification</a>
        <a href="index.html" class="nl" onclick="event.preventDefault();(window.cwSignOut?window.cwSignOut():(sessionStorage.clear(),location.replace('index.html')))" style="color:var(--red,#dc2626)"><span class="ic">🚪</span>Logout</a>
      `;
    }
    CW_ACCESS._injectPasswordModal();
    // Live count of items assigned to this user across registers,
    // shown next to the My Work link. Refreshed instantly via
    // Supabase Realtime (see _subscribeMyWorkRealtime) and as a
    // fallback every 5 minutes in case the websocket silently
    // drops.
    CW_ACCESS._refreshMyWorkBadge();
    clearInterval(CW_ACCESS._myWorkTimer);
    CW_ACCESS._myWorkTimer = setInterval(() => CW_ACCESS._refreshMyWorkBadge(), 300000);
    CW_ACCESS._subscribeMyWorkRealtime();

  },

  // ── Password change modal ──────────────────────────────────────
  // Self-service. Available from every page's sidebar footer so
  // users no longer need to ask an admin to reset for them. Uses
  // sb.auth.updateUser() which only works on the currently-signed-
  // in user — can't change anyone else's password via this path.
  _injectPasswordModal() {
    if (document.getElementById('cw-pw-modal')) return;
    const m = document.createElement('div');
    m.id = 'cw-pw-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:9998;display:none;align-items:center;justify-content:center;padding:20px;font-family:var(--f,"DM Sans",sans-serif)';
    m.innerHTML = `
      <div style="background:var(--card,#fff);border-radius:16px;padding:24px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.2)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="font-size:16px;font-weight:800">🔑 Change password</div>
          <button type="button" id="cw-pw-close" style="background:transparent;border:none;font-size:18px;cursor:pointer;color:var(--mu,#64748b)">✕</button>
        </div>
        <div id="cw-pw-msg" style="display:none;padding:10px 12px;border-radius:8px;font-size:12px;font-weight:600;margin-bottom:12px"></div>
        <label style="font-size:11px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:4px">New password</label>
        <input type="password" id="cw-pw-new" placeholder="At least 8 characters" autocomplete="new-password" style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr,#e2e8f0);border-radius:9px;font-family:inherit;font-size:13px;margin-bottom:12px;outline:none"/>
        <label style="font-size:11px;font-weight:700;color:var(--mu,#64748b);text-transform:uppercase;letter-spacing:.4px;display:block;margin-bottom:4px">Confirm new password</label>
        <input type="password" id="cw-pw-conf" placeholder="Retype the new password" autocomplete="new-password" style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr,#e2e8f0);border-radius:9px;font-family:inherit;font-size:13px;margin-bottom:16px;outline:none"/>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button type="button" id="cw-pw-cancel" style="padding:8px 14px;background:transparent;border:1.5px solid var(--bdr,#e2e8f0);color:var(--mu,#64748b);border-radius:9px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer">Cancel</button>
          <button type="button" id="cw-pw-save" style="padding:8px 16px;background:var(--blue,#3b5fe2);color:#fff;border:none;border-radius:9px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer">Update password</button>
        </div>
        <div style="font-size:10px;color:var(--dim,#94a3b8);text-align:center;margin-top:12px">Password is hashed server-side (bcrypt). Supabase checks it against a compromised-password list.</div>
      </div>
    `;
    document.body.appendChild(m);
    const close = () => {
      m.style.display = 'none';
      document.getElementById('cw-pw-new').value = '';
      document.getElementById('cw-pw-conf').value = '';
      CW_ACCESS._pwMsg('');
    };
    document.getElementById('cw-pw-close').addEventListener('click', close);
    document.getElementById('cw-pw-cancel').addEventListener('click', close);
    m.addEventListener('click', e => { if (e.target === m) close(); });
    document.getElementById('cw-pw-save').addEventListener('click', () => CW_ACCESS._pwSave());
    document.getElementById('cw-pw-conf').addEventListener('keydown', e => {
      if (e.key === 'Enter') CW_ACCESS._pwSave();
    });
  },
  _pwMsg(text, type) {
    const el = document.getElementById('cw-pw-msg'); if (!el) return;
    if (!text) { el.style.display = 'none'; el.textContent = ''; return; }
    el.textContent = text;
    el.style.display = 'block';
    if (type === 'err') { el.style.background = 'var(--r50,#fef2f2)'; el.style.color = 'var(--red,#dc2626)'; el.style.border = '1px solid var(--r100,#fee2e2)'; }
    else if (type === 'ok') { el.style.background = 'var(--g50,#f0fdf4)'; el.style.color = '#15803d'; el.style.border = '1px solid var(--g100,#dcfce7)'; }
    else { el.style.background = 'var(--b50,#eef2ff)'; el.style.color = 'var(--blue,#3b5fe2)'; el.style.border = '1px solid var(--b100,#e0e7ff)'; }
  },
  async _pwSave() {
    const np = document.getElementById('cw-pw-new').value;
    const cp = document.getElementById('cw-pw-conf').value;
    if (!np || np.length < 8) { this._pwMsg('Password must be at least 8 characters.', 'err'); return; }
    if (np !== cp)            { this._pwMsg('The two passwords do not match.', 'err'); return; }
    const btn = document.getElementById('cw-pw-save');
    btn.disabled = true; const originalText = btn.textContent; btn.textContent = 'Updating…';
    this._pwMsg('Contacting Supabase…', 'info');
    try {
      // Supabase client is page-local; load it lazily so access.js
      // stays a plain script that works on any page.
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const { SUPABASE_CONFIG } = await import('./config.js');
      const sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      const { error } = await sb.auth.updateUser({ password: np });
      if (error) {
        // Supabase returns specific codes for leaked / too-short / same-as-old
        const m = /pwned|leaked|compromised/i.test(error.message) ? 'This password appears in known-breach lists. Pick a different one.'
                : /too short|at least/i.test(error.message)       ? 'Password must be at least 8 characters.'
                : /same|reuse|unchanged/i.test(error.message)     ? 'New password must be different from the current one.'
                : error.message;
        this._pwMsg(m, 'err');
        btn.disabled = false; btn.textContent = originalText;
        return;
      }
      this._pwMsg('✅ Password updated. You can keep working.', 'ok');
      document.getElementById('cw-pw-new').value = '';
      document.getElementById('cw-pw-conf').value = '';
      setTimeout(() => { document.getElementById('cw-pw-modal').style.display = 'none'; this._pwMsg(''); }, 1800);
    } catch (e) {
      this._pwMsg('Unexpected error: ' + (e.message || e), 'err');
    } finally {
      btn.disabled = false; btn.textContent = originalText;
    }
  },
  openPasswordModal() {
    this._injectPasswordModal();
    const m = document.getElementById('cw-pw-modal');
    if (m) { m.style.display = 'flex'; setTimeout(() => document.getElementById('cw-pw-new')?.focus(), 50); }
  },

  // ── Toast stack (realtime notifications) ──────────────────────
  _toastContainer: null,
  _showToast({ icon, title, subtitle, href, ttl = 9000 }) {
    // Lazy-create the stack container the first time we toast.
    if (!this._toastContainer) {
      const c = document.createElement('div');
      c.id = 'cw-toast-stack';
      c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;font-family:var(--f,"DM Sans",sans-serif);pointer-events:none';
      document.body.appendChild(c);
      this._toastContainer = c;
    }
    const wrap = document.createElement('a');
    if (href) wrap.href = href;
    wrap.style.cssText = 'pointer-events:auto;text-decoration:none;color:var(--txt,#0f172a);background:var(--card,#fff);border:1px solid var(--bdr,#e2e8f0);border-left:4px solid var(--blue,#3b5fe2);border-radius:10px;padding:12px 14px;min-width:280px;max-width:360px;box-shadow:0 10px 24px rgba(15,23,42,.12);display:flex;gap:10px;align-items:flex-start;animation:cwSlideIn .25s ease-out;cursor:' + (href ? 'pointer' : 'default');
    wrap.innerHTML = `
      <div style="font-size:22px;line-height:1;flex-shrink:0">${icon || '🔔'}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:800;line-height:1.3;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${String(title||'').replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</div>
        ${subtitle ? `<div style="font-size:11px;color:var(--mu,#64748b);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${String(subtitle).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</div>` : ''}
      </div>
      <button type="button" aria-label="Dismiss" style="background:transparent;border:none;color:var(--dim,#94a3b8);font-size:16px;cursor:pointer;padding:0 2px;line-height:1;flex-shrink:0">✕</button>`;
    // Inject the keyframes once.
    if (!document.getElementById('cw-toast-kf')) {
      const st = document.createElement('style');
      st.id = 'cw-toast-kf';
      st.textContent = '@keyframes cwSlideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}@keyframes cwSlideOut{to{opacity:0;transform:translateX(16px)}}';
      document.head.appendChild(st);
    }
    const dismiss = (e) => {
      if (e) e.preventDefault(), e.stopPropagation();
      wrap.style.animation = 'cwSlideOut .2s ease-in forwards';
      setTimeout(() => wrap.remove(), 220);
    };
    wrap.querySelector('button').addEventListener('click', dismiss);
    this._toastContainer.appendChild(wrap);
    // Cap the stack at 4 — oldest drop.
    while (this._toastContainer.children.length > 4) this._toastContainer.firstChild.remove();
    setTimeout(dismiss, ttl);
  },

  // ── My Work badge ──────────────────────────────────────────────
  // Shows the number of items currently assigned to this user
  // across customer_feedback, non_conformity and internal_audits.
  // Red when there's work to do. Lazily loads the Supabase client
  // so access.js stays a plain script.
  _myWorkTimer: null,
  async _refreshMyWorkBadge() {
    const badge = document.getElementById('cw-mywork-badge');
    if (!badge) return;
    const me = (sessionStorage.getItem('cw_current_emp') || localStorage.getItem('cw_current_emp') || '').trim();
    const primaryRole = (sessionStorage.getItem('cw_custom_role') || sessionStorage.getItem('cw_role') || '').toLowerCase();
    if (!me) { badge.style.display = 'none'; return; }
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const { SUPABASE_CONFIG } = await import('./config.js');
      const sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

      // Resolve extra_roles once so "role:xxx" assignments match
      let extraRoles = [];
      try {
        const { data: emp } = await sb.from('employees')
          .select('extra_roles').ilike('name', me).maybeSingle();
        if (emp) {
          let ex = [];
          try { ex = typeof emp.extra_roles === 'string' ? JSON.parse(emp.extra_roles) : (emp.extra_roles || []); } catch {}
          extraRoles = (Array.isArray(ex) ? ex : []).map(s => String(s).toLowerCase());
        }
      } catch {}
      const isMine = v => {
        if (!v) return false;
        if (String(v).startsWith('role:')) {
          const r = String(v).slice(5).toLowerCase();
          return r === primaryRole || extraRoles.includes(r);
        }
        return v === me;
      };

      const [fbRes, ncRes, iaRes] = await Promise.all([
        sb.from('customer_feedback').select('assigned_to, follow_up_assignee, follow_up_date, follow_up_done_at, status').in('status', ['open','in_progress']).limit(500),
        sb.from('non_conformity_reports').select('assigned_to, status').neq('status', 'closed').limit(500),
        sb.from('internal_audits').select('auditor, status').neq('status', 'completed').limit(500),
      ]);
      const fbAll = fbRes.data || [];
      const count =
        fbAll.filter(r => isMine(r.assigned_to)).length +
        (ncRes.data || []).filter(r => isMine(r.assigned_to)).length +
        (iaRes.data || []).filter(r => r.auditor && r.auditor.toLowerCase() === me.toLowerCase()).length +
        fbAll.filter(r => r.follow_up_date && !r.follow_up_done_at && isMine(r.follow_up_assignee)).length;

      if (count > 0) {
        badge.textContent = String(count);
        badge.style.display = 'inline-block';
        badge.style.background = 'var(--red,#dc2626)';
      } else {
        badge.textContent = '0';
        badge.style.display = 'inline-block';
        badge.style.background = 'var(--mu,#64748b)';
      }
    } catch (e) {
      // Silent — never block the page for a badge
      badge.style.display = 'none';
    }
  },

  // ── Realtime subscription for instant badge updates ────────
  // Subscribes to INSERT / UPDATE / DELETE events on the three
  // tables that feed the My Work count. On any event we debounce
  // a refresh of the badge so the count mirrors reality within
  // ~1s of someone else editing a record. One channel per tab.
  _myWorkChannel: null,
  _myWorkDebounce: null,
  async _subscribeMyWorkRealtime() {
    const me = (sessionStorage.getItem('cw_current_emp') || localStorage.getItem('cw_current_emp') || '').trim();
    if (!me) return;
    if (CW_ACCESS._myWorkChannel) return; // already subscribed this tab
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const { SUPABASE_CONFIG } = await import('./config.js');
      const sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      const debouncedRefresh = () => {
        clearTimeout(CW_ACCESS._myWorkDebounce);
        CW_ACCESS._myWorkDebounce = setTimeout(() => CW_ACCESS._refreshMyWorkBadge(), 800);
      };
      // Resolve current user's roles once so we can match "role:xxx"
      // assignment against them inside the realtime handler.
      const primaryRole = (sessionStorage.getItem('cw_custom_role') || sessionStorage.getItem('cw_role') || '').toLowerCase();
      let extraRoles = [];
      try {
        const { data: emp } = await sb.from('employees').select('extra_roles').ilike('name', me).maybeSingle();
        if (emp) {
          let ex = [];
          try { ex = typeof emp.extra_roles === 'string' ? JSON.parse(emp.extra_roles) : (emp.extra_roles || []); } catch {}
          extraRoles = (Array.isArray(ex) ? ex : []).map(s => String(s).toLowerCase());
        }
      } catch {}
      const isMine = v => {
        if (!v) return false;
        if (String(v).startsWith('role:')) {
          const r = String(v).slice(5).toLowerCase();
          return r === primaryRole || extraRoles.includes(r);
        }
        return v === me;
      };
      // Ignore changes the current user just made themselves.
      // Supabase doesn't carry "who updated" in the payload, so we
      // piggyback on the audit_log: if the most recent audit row
      // for this record has actor_email = my user, skip the toast.
      // Cheap heuristic that avoids self-toasts in the common case
      // (single-tab editing) without an extra round-trip.
      const notifySelf = row => {
        // Light heuristic: if assigned_to equals me and last_viewed_by
        // or last_edited_by is me, it's probably my own edit.
        return row && (row.last_edited_by === me || row.last_viewed_by === me);
      };
      const handler = (payload) => {
        debouncedRefresh();
        const { eventType, new: nw, old } = payload;
        if (!nw) return;
        const table = payload.table;
        // Build toast if this event made the row newly mine
        const key = table === 'internal_audits' ? 'auditor' : 'assigned_to';
        const newMine = isMine(nw[key]);
        const oldMine = old ? isMine(old[key]) : false;
        // INSERT + assigned-to-me, OR UPDATE where assignment just became me
        const justAssigned = (eventType === 'INSERT' && newMine) || (eventType === 'UPDATE' && newMine && !oldMine);
        // Follow-up assignment on customer_feedback, separately
        const fuNow   = table === 'customer_feedback' && isMine(nw.follow_up_assignee) && nw.follow_up_date && !nw.follow_up_done_at;
        const fuBefore= table === 'customer_feedback' && old ? isMine(old.follow_up_assignee) : false;
        const fuJustAssigned = fuNow && (eventType === 'INSERT' || !fuBefore);

        if (justAssigned && !notifySelf(nw)) {
          const titles = {
            customer_feedback:     { icon: '💬', name: 'Complaint / Feedback',    href: `customer_feedback.html?open=${nw.id}` },
            non_conformity_reports:{ icon: '⚠️', name: 'Non-Conformity Report', href: `non_conformity.html` },
            internal_audits:       { icon: '📋', name: 'Internal Audit',        href: `internal_audit.html` },
          };
          const meta = titles[table]; if (!meta) return;
          const sub = table === 'customer_feedback' ? (nw.customer_name || nw.feedback_no || '')
                    : table === 'non_conformity_reports' ? (nw.nc_number || nw.description || '')
                    : (nw.audit_number || nw.audit_scope || '');
          CW_ACCESS._showToast({
            icon: meta.icon,
            title: `Assigned to you: ${meta.name}`,
            subtitle: String(sub).slice(0, 80),
            href: meta.href,
          });
        } else if (fuJustAssigned && !notifySelf(nw)) {
          CW_ACCESS._showToast({
            icon: '⏰',
            title: `New follow-up assigned to you`,
            subtitle: `${nw.customer_name || nw.feedback_no || ''} · due ${nw.follow_up_date}`,
            href: `customer_feedback.html?open=${nw.id}`,
          });
        }
      };
      CW_ACCESS._myWorkChannel = sb.channel('my_work_' + Math.random().toString(36).slice(2, 8))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_feedback'      }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'non_conformity_reports' }, handler)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'internal_audits'        }, handler)
        .subscribe();
    } catch (e) {
      // Silent fail — the 5-minute polling fallback still works
    }
  },

  // ── Chat prefs + read-state (per device, localStorage) ─────────
  // Shared by access.js (badge + notifier), chat.html and the
  // per-case chat so "seen"/"muted" mean the same thing everywhere.
  chat: {
    muteSound() { return localStorage.getItem('cw_chat_mute_sound') === '1'; },
    muteToast() { return localStorage.getItem('cw_chat_mute_toast') === '1'; },
    setMuteSound(v) { localStorage.setItem('cw_chat_mute_sound', v ? '1' : '0'); try { window.dispatchEvent(new CustomEvent('cw-chat-pref')); } catch {} },
    setMuteToast(v) { localStorage.setItem('cw_chat_mute_toast', v ? '1' : '0'); try { window.dispatchEvent(new CustomEvent('cw-chat-pref')); } catch {} },
    // One-time baseline so pre-existing history isn't all "unread".
    baseline() {
      let b = localStorage.getItem('cw_chat_baseline');
      if (!b) { b = new Date().toISOString(); localStorage.setItem('cw_chat_baseline', b); }
      return b;
    },
    _key(kind, id) { return 'cw_chat_seen:' + kind + (id ? (':' + id) : ''); },
    _ms(v) { const t = Date.parse(v); return isNaN(t) ? 0 : t; },
    getSeen(kind, id) {
      const s = localStorage.getItem(this._key(kind, id)) || '';
      const b = this.baseline();
      return this._ms(s) > this._ms(b) ? s : b;
    },
    isNewer(iso, kind, id) { return this._ms(iso) > this._ms(this.getSeen(kind, id)); },
    markSeen(kind, id, iso) {
      const cur = localStorage.getItem(this._key(kind, id)) || '';
      const t = iso || new Date().toISOString();
      if (!cur || this._ms(t) > this._ms(cur)) localStorage.setItem(this._key(kind, id), t);
      try { window.dispatchEvent(new CustomEvent('cw-chat-seen', { detail: { kind, id: id || null } })); } catch {}
    },
  },

  // ── Global mobile layout ───────────────────────────────────────
  // The app is desktop-first (fixed 240px sidebar, wide tables,
  // big modals). This injects one responsive layer on every page:
  // off-canvas sidebar + hamburger, scrollable tables, full-width
  // modals, no iOS input zoom. Skips chat.html (already responsive).
  _initMobile() {
    try {
      if (document.querySelector('meta[name="cw-page"][content="chat"]')) return;
      if (document.getElementById('cw-m-css')) return;
      // Ensure a sane viewport.
      if (!document.querySelector('meta[name="viewport"]')) {
        const v = document.createElement('meta');
        v.name = 'viewport';
        v.content = 'width=device-width,initial-scale=1,viewport-fit=cover';
        (document.head || document.documentElement).appendChild(v);
      }
      const css = document.createElement('style');
      css.id = 'cw-m-css';
      css.textContent = `
@media (max-width:860px){
  .sb,.sidebar{position:fixed!important;top:0;bottom:0;left:0;width:min(84vw,290px)!important;
    transform:translateX(-100%);transition:transform .25s ease;z-index:1200;overflow-y:auto;
    -webkit-overflow-scrolling:touch}
  body.cw-nav-open .sb,body.cw-nav-open .sidebar{transform:none;box-shadow:0 0 40px rgba(0,0,0,.35)}
  .content,.main{margin-left:0!important;width:100%!important}
  .topbar{padding-left:56px!important;flex-wrap:wrap;row-gap:6px}
  #cw-mnav{display:flex!important}
  .modal-bg{padding:10px!important;align-items:flex-start!important}
  .modal{width:100%!important;max-width:100%!important;max-height:92vh!important;
    padding:18px!important;border-radius:14px!important}
  table{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;white-space:nowrap}
  thead,tbody,tr{width:100%}
  td,th{white-space:nowrap}
  img{max-width:100%;height:auto}
  input,select,textarea,.fi{font-size:16px!important}
  .kpi-row,.cards,.grid{grid-template-columns:1fr!important}
}
#cw-mnav{display:none;position:fixed;top:calc(env(safe-area-inset-top) + 84px);left:12px;
  z-index:100001;width:44px;height:44px;align-items:center;justify-content:center;border-radius:12px;
  background:#3b5fe2;border:none;box-shadow:0 4px 14px rgba(15,23,42,.3);font-size:20px;cursor:pointer;
  font-family:inherit;color:#fff;padding:0;line-height:1;-webkit-tap-highlight-color:transparent;
  touch-action:manipulation}
#cw-mnav:active{transform:scale(.92)}
#cw-mnav-bd{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:1150;opacity:0;
  pointer-events:none;transition:opacity .2s}
body.cw-nav-open #cw-mnav-bd{opacity:1;pointer-events:auto}
`;
      (document.head || document.documentElement).appendChild(css);

      const btn = document.createElement('button');
      btn.id = 'cw-mnav';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Menu');
      btn.textContent = '☰';
      const bd = document.createElement('div');
      bd.id = 'cw-mnav-bd';
      // After the drawer opens, the full-screen backdrop becomes
      // clickable directly under the finger. On iOS the same tap can
      // produce a delayed "ghost" click that lands on the backdrop (or a
      // nav link) and instantly closes the drawer again — open/close =
      // the flicker. Ignore any close that arrives within this window of
      // an open so a single tap can only ever open it.
      let lockUntil = 0;
      const isOpen = () => document.body.classList.contains('cw-nav-open');
      const open  = () => { document.body.classList.add('cw-nav-open'); lockUntil = Date.now() + 450; };
      const close = () => document.body.classList.remove('cw-nav-open');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen()) { if (Date.now() >= lockUntil) close(); }
        else open();
      });
      bd.addEventListener('click', (e) => {
        e.preventDefault();
        if (Date.now() < lockUntil) return;   // ignore ghost-click passthrough
        close();
      });
      const mount = () => {
        if (!document.body) return;
        document.body.appendChild(bd);
        document.body.appendChild(btn);
        // Close the drawer when a nav link is tapped (but not from the
        // same gesture that just opened it).
        document.addEventListener('click', (e) => {
          if (Date.now() < lockUntil) return;
          const a = e.target.closest && e.target.closest('.sb a, .sidebar a, .nl, .nav-link');
          if (a) close();
        });
        window.addEventListener('resize', () => { if (innerWidth > 860) close(); });
      };
      if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
    } catch (e) { /* never block the page on mobile setup */ }
  },

  // ── PWA: make the app installable on every page ────────────────
  // Injects the manifest / theme-color / apple-touch-icon if absent
  // and registers the service worker. Safe to call on every page.
  _initPWA() {
    try {
      const head = document.head || document.getElementsByTagName('head')[0];
      if (head && !document.querySelector('link[rel="manifest"]')) {
        const m = document.createElement('link');
        m.rel = 'manifest'; m.href = 'manifest.webmanifest';
        head.appendChild(m);
      }
      if (head && !document.querySelector('meta[name="theme-color"]')) {
        const t = document.createElement('meta');
        t.name = 'theme-color'; t.content = '#3b5fe2';
        head.appendChild(t);
      }
      if (head && !document.querySelector('link[rel="apple-touch-icon"]')) {
        const a = document.createElement('link');
        a.rel = 'apple-touch-icon'; a.href = 'icon.svg';
        head.appendChild(a);
      }
      if ('serviceWorker' in navigator && location.protocol === 'https:') {
        // NOTE: we deliberately do NOT auto-reload on `controllerchange`.
        // The service worker is network-first for HTML/JS (it fetches
        // fresh with cache:'reload'), so a new worker taking control does
        // not require an immediate page reload to pick up new code — the
        // next navigation already does. Auto-reloading here caused the
        // "flashing ☰" loop on iOS PWAs, where the rate-limit counter
        // (stored in localStorage) could be cleared between swaps, so the
        // loop never self-terminated. Letting the new SW claim silently
        // is invisible to the user and avoids the flicker entirely.

        // Best-effort: drop any older SW (sw.js / sw-v2.js, now
        // self-destruct shims) so the fresh sw-v3.js can take over.
        (async () => {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of (regs || [])) {
              try {
                const url = r.active && r.active.scriptURL ? r.active.scriptURL : '';
                if (url && !/\/sw-v3\.js(\?|$)/.test(url)) await r.unregister();
              } catch (e) {}
            }
          } catch (e) {}
        })();
        navigator.serviceWorker.register('sw-v3.js').then((reg) => {
          const promote = (w) => { if (w) w.postMessage('skipWaiting'); };
          if (reg.waiting) promote(reg.waiting);
          reg.addEventListener('updatefound', () => {
            const nw = reg.installing;
            if (nw) nw.addEventListener('statechange', () => {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) promote(nw);
            });
          });
          try { reg.update(); } catch (e) {}
        }).catch(() => {});
      }
    } catch (e) { /* never block the page on PWA setup */ }
  },

  // ── Global chat notifications ──────────────────────────────────
  // On EVERY authenticated page: a sound + on-screen toast the moment
  // a chat message arrives for this user — the team feed, a direct
  // message to them, or a case they're assigned. Degrades silently
  // if the chat_messages table / realtime isn't set up yet.
  _chatChannel: null,
  _actx: null,
  _audioArmed: false,
  _armAudio() {
    if (CW_ACCESS._audioArmed) return;
    CW_ACCESS._audioArmed = true;
    const arm = () => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
          CW_ACCESS._actx = CW_ACCESS._actx || new Ctx();
          if (CW_ACCESS._actx.state === 'suspended') CW_ACCESS._actx.resume();
        }
      } catch {}
      // First gesture is also the right moment to (once) ask for
      // OS notification permission, so background tabs can alert too.
      // If granted now, subscribe to push immediately instead of
      // waiting for the next page load.
      try {
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission().then((p) => {
            const c = CW_ACCESS._pushCtx;
            if (p === 'granted' && c) CW_ACCESS._subscribePush(c.sb, c.empId, c.vapid);
          }).catch(() => {});
        }
      } catch {}
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
    };
    window.addEventListener('pointerdown', arm, { once: true });
    window.addEventListener('keydown', arm, { once: true });
  },
  _urlB64ToU8(b64) {
    const pad = '='.repeat((4 - (b64.length % 4)) % 4);
    const s = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(s);
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  },
  async _subscribePush(sb, empId, vapidKey) {
    const D = m => { CW_ACCESS._pushDiag = m; return false; };
    try {
      const key = String(vapidKey || '').trim();
      if (!key || !empId) return D('not signed in / no VAPID key');
      if (!('serviceWorker' in navigator) || !('PushManager' in window))
        return D('this browser has no Push support (on iPhone: Add to Home Screen, iOS 16.4+, open from the icon)');
      if (!('Notification' in window)) return D('Notifications API unavailable');
      if (Notification.permission !== 'granted') return D('permission not granted (' + Notification.permission + ')');
      const reg = await navigator.serviceWorker.ready;
      const wantKey = CW_ACCESS._urlB64ToU8(key);
      let sub = await reg.pushManager.getSubscription();
      if (sub) {
        let same = false;
        try {
          const cur = sub.options && sub.options.applicationServerKey;
          if (cur) {
            const a = new Uint8Array(cur);
            same = a.length === wantKey.length && a.every((v, i) => v === wantKey[i]);
          }
        } catch { same = false; }
        if (!same) { try { await sub.unsubscribe(); } catch (e) {} sub = null; }
      }
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: wantKey,
        });
      }
      const j = sub.toJSON();
      if (!j || !j.endpoint || !j.keys) return D('subscription has no endpoint/keys');
      const { error: upErr } = await sb.from('push_subscriptions').upsert({
        employee_id: empId,
        endpoint: j.endpoint,
        p256dh: j.keys.p256dh,
        auth: j.keys.auth,
        user_agent: navigator.userAgent.slice(0, 200),
      }, { onConflict: 'endpoint' });
      if (upErr) return D('could not save subscription: ' + (upErr.message || upErr));
      // NOTE: do NOT delete this user's other endpoints — a person can
      // be subscribed on several devices (phone + PC) and must receive
      // push on all of them. Truly dead endpoints are pruned on send
      // (404/410) by the Edge Functions.
      CW_ACCESS._pushDiag = 'OK';
      console.info('[push] subscribed OK');
      return true;
    } catch (e) { return D('subscribe failed: ' + ((e && e.message) || e)); }
  },
  // Persistent on-screen banner (alert() is unreliable in an iOS
  // installed PWA). Stays until tapped so it can be read/screenshotted.
  _pushBanner(msg, ok) {
    try {
      let el = document.getElementById('cw-push-banner');
      if (!el) {
        el = document.createElement('div');
        el.id = 'cw-push-banner';
        el.onclick = () => { document.body.classList.remove('cw-banner-on'); el.remove(); };
        document.body.appendChild(el);
      }
      document.body.classList.add('cw-banner-on');   // pushes ☰ below the alert
      el.textContent = msg;
      el.style.cssText =
        'position:fixed;left:8px;right:8px;top:calc(8px + env(safe-area-inset-top));z-index:99999;' +
        'padding:14px 16px;border-radius:12px;font:600 14px/1.45 -apple-system,system-ui,sans-serif;' +
        'color:#fff;white-space:pre-wrap;box-shadow:0 6px 24px rgba(0,0,0,.3);' +
        'background:' + (ok ? '#16a34a' : '#dc2626') + ';';
    } catch (e) { /* ignore */ }
  },
  // Explicit, user-initiated enable with on-screen feedback — the
  // reliable path on iPhone (no console; auto-prompt is unreliable).
  async enableNotifications() {
    const say = (m, ok) => { CW_ACCESS._pushBanner(m, !!ok); try { alert(m); } catch (e) {} };
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      say(isIOS
        ? 'iPhone push needs: iOS 16.4+, opened from the Home-Screen icon (not Safari/bookmark). PushManager missing here → likely iOS < 16.4 OR not opened as the installed app.'
        : 'This browser does not support web push notifications.', false);
      return;
    }
    if (isIOS && !standalone) {
      say('Not running as the installed app. On iPhone: Safari → Share → Add to Home Screen, then open it from THAT icon (full screen, no Safari bar), then tap Enable alerts.', false);
      return;
    }
    let perm = Notification.permission;
    if (perm === 'default') { try { perm = await Notification.requestPermission(); } catch (e) {} }
    if (perm === 'denied') {
      say('Notifications are BLOCKED for this app. iPhone: Settings → Notifications → (this app) → Allow. Then tap Enable alerts again.', false);
      return;
    }
    if (perm !== 'granted') { say('Permission was not granted (' + perm + '). Tap Enable alerts and choose Allow.', false); return; }
    if (!CW_ACCESS._pushCtx) { try { await CW_ACCESS._initChatNotifications(); } catch (e) {} }
    const c = CW_ACCESS._pushCtx;
    if (!c) { say('Permission OK, but your login is not linked to an employee record so the subscription cannot be saved. Tell the admin.', false); return; }
    const ok = await CW_ACCESS._subscribePush(c.sb, c.empId, c.vapid);
    say(ok ? '✅ Notifications enabled on THIS device. Now tap “Test notification”.'
           : '⚠️ Could not enable: ' + (CW_ACCESS._pushDiag || 'unknown error'), ok);
  },
  // Shows a notification LOCALLY (no server). Isolates the cause when
  // pushes "don't arrive": if even this doesn't pop, the OS/browser is
  // blocking notifications — not the push pipeline.
  async testNotification() {
    const say = (m, ok) => { CW_ACCESS._pushBanner(m, !!ok); try { alert(m); } catch (e) {} };
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      say('Cannot show notifications here. iPhone: open the app from the Home-Screen icon (not a bookmark/Safari tab), iOS 16.4+.', false);
      return;
    }
    if (Notification.permission !== 'granted') {
      await CW_ACCESS.enableNotifications();
      if (Notification.permission !== 'granted') return;
    }
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification('Cedarwings ✓ test', {
        body: 'If you SEE this, notifications work on this device.',
        icon: './icon.svg', badge: './icon.svg', tag: 'cw-selftest',
        data: { url: './chat.html' },
      });
      say('Test notification fired. If you SAW the banner → it works. If NOT → the OS is blocking it (iPhone: Settings → Notifications → this app = Allow; turn off Focus/Do-Not-Disturb).', true);
    } catch (e) {
      say('Could not show a local notification: ' + ((e && e.message) || e) + ' — that means the OS/app is blocking it, not the server.', false);
    }
  },
  _chatBeep() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      CW_ACCESS._actx = CW_ACCESS._actx || new Ctx();
      const ctx = CW_ACCESS._actx;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      // Friendly two-note "ding-dong".
      [[880, 0], [1175, 0.13]].forEach(([f, t]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.exponentialRampToValueAtTime(0.22, now + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.18);
        o.connect(g).connect(ctx.destination);
        o.start(now + t); o.stop(now + t + 0.2);
      });
    } catch {}
  },
  async _initChatNotifications() {
    if (CW_ACCESS._chatChannel) return;
    const myName = (sessionStorage.getItem('cw_current_emp') || localStorage.getItem('cw_current_emp') || '').trim();
    if (!myName) return;
    CW_ACCESS._armAudio();
    try {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const { SUPABASE_CONFIG } = await import('./config.js');
      const sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      let user = null;
      try { user = (await sb.auth.getUser()).data.user; } catch {}
      const { data: emps } = await sb.from('employees')
        .select('id,name,auth_user_id,custom_role,role,extra_roles');
      const list = emps || [];
      const meRow = (user && list.find(e => e.auth_user_id === user.id))
                 || list.find(e => (e.name || '').toLowerCase() === myName.toLowerCase());
      if (!meRow) return;
      const myId = meRow.id;
      CW_ACCESS._pushCtx = { sb, empId: myId, vapid: SUPABASE_CONFIG.vapidPublicKey };
      CW_ACCESS._subscribePush(sb, myId, SUPABASE_CONFIG.vapidPublicKey);
      const nameById = new Map(list.map(e => [e.id, e.name]));
      const primaryRole = String(meRow.custom_role || meRow.role || '').toLowerCase();
      let extraRoles = [];
      try {
        const ex = typeof meRow.extra_roles === 'string' ? JSON.parse(meRow.extra_roles) : (meRow.extra_roles || []);
        extraRoles = (Array.isArray(ex) ? ex : []).map(s => String(s).toLowerCase());
      } catch {}
      const isFull = !!(CW_ACCESS.hasFullAccess && CW_ACCESS.hasFullAccess());
      const mineAssignee = v => {
        if (!v) return false;
        if (String(v).startsWith('role:')) {
          const r = String(v).slice(5).toLowerCase();
          return r === primaryRole || extraRoles.includes(r);
        }
        return v === myName;
      };
      const caseAssignCache = new Map();

      // ── Sidebar "Team Chat" unread badge ──────────────────────
      const badgeEl = () => {
        const link = document.querySelector('.sb-nav a[href="chat.html"]');
        if (!link) return null;
        let b = link.querySelector('#cw-chat-badge');
        if (!b) {
          b = document.createElement('span');
          b.id = 'cw-chat-badge';
          b.style.cssText = 'margin-left:auto;background:var(--red,#dc2626);color:#fff;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:700;min-width:18px;text-align:center;display:none';
          link.appendChild(b);
        }
        return b;
      };
      let badgeTimer = null;
      const refreshBadge = async () => {
        try {
          const { data } = await sb.from('chat_messages')
            .select('id,sender_id,recipient_id,case_id,created_at')
            .or(`and(recipient_id.is.null,case_id.is.null),recipient_id.eq.${myId}`)
            .order('created_at', { ascending: false })
            .limit(500);
          let n = 0;
          for (const m of (data || [])) {
            if (m.sender_id === myId) continue;
            if (m.recipient_id == null) {
              if (CW_ACCESS.chat.isNewer(m.created_at, 'group')) n++;
            } else if (m.recipient_id === myId) {
              if (CW_ACCESS.chat.isNewer(m.created_at, 'dm', m.sender_id)) n++;
            }
          }
          const b = badgeEl();
          if (b) {
            if (n > 0) { b.textContent = n > 99 ? '99+' : String(n); b.style.display = ''; }
            else { b.style.display = 'none'; }
          }
        } catch {}
      };
      CW_ACCESS._refreshChatBadge = refreshBadge;
      const badgeSoon = () => { clearTimeout(badgeTimer); badgeTimer = setTimeout(refreshBadge, 600); };
      window.addEventListener('cw-chat-seen', badgeSoon);
      window.addEventListener('cw-chat-pref', badgeSoon);
      window.addEventListener('storage', e => { if (e.key && e.key.indexOf('cw_chat_seen') === 0) badgeSoon(); });
      refreshBadge();

      const onMsg = async (m) => {
        if (!m || m.sender_id === myId) return;
        const onChatPage = /(^|\/)chat\.html/.test(location.pathname);
        let relevant = false, href = 'chat.html';
        if (m.case_id) {
          let assignedTo = caseAssignCache.get(m.case_id);
          if (assignedTo === undefined) {
            try {
              const { data: c } = await sb.from('customer_feedback')
                .select('assigned_to').eq('id', m.case_id).maybeSingle();
              assignedTo = c ? c.assigned_to : null;
            } catch { assignedTo = null; }
            caseAssignCache.set(m.case_id, assignedTo);
          }
          relevant = isFull || mineAssignee(assignedTo);
          href = `customer_feedback.html?open=${m.case_id}`;
        } else if (m.recipient_id == null) {
          relevant = true;                       // team / all
          badgeSoon();
          if (onChatPage && document.visibilityState === 'visible') return;
        } else if (m.recipient_id === myId) {
          relevant = true;                       // direct message to me
          href = `chat.html?convo=dm&partner=${m.sender_id}`;
          badgeSoon();
          if (onChatPage && document.visibilityState === 'visible') return;
        }
        if (!relevant) return;
        const from = nameById.get(m.sender_id) || 'Teammate';
        const where = m.case_id ? ' · case discussion'
                    : (m.recipient_id ? ' · direct message' : ' · team chat');
        if (!CW_ACCESS.chat.muteSound()) CW_ACCESS._chatBeep();
        if (!CW_ACCESS.chat.muteToast()) {
          CW_ACCESS._showToast({
            icon: '💬',
            title: `New message from ${from}`,
            subtitle: String(m.body || '').slice(0, 90) + where,
            href,
            ttl: 8000,
          });
          try {
            if ('Notification' in window && Notification.permission === 'granted'
                && document.visibilityState !== 'visible') {
              new Notification(`💬 ${from}`, {
                body: String(m.body || '').slice(0, 120),
                tag: 'cw-chat-' + m.id,
              });
            }
          } catch {}
        }
      };
      CW_ACCESS._chatChannel = sb.channel('chat_notify_' + Math.random().toString(36).slice(2, 8))
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' },
            p => onMsg(p.new))
        .subscribe();
    } catch (e) {
      // chat_messages not set up yet, or offline — silent.
    }
  },
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
    /* HOVER — punchier per user request: 3px lift, stronger shadow,
       outline-ring accent so even ghost buttons read as hoverable. */
    button:not(.nl):not(#helpBtn):not(#cw-help-btn):not(:disabled):hover,
    .btn:not(:disabled):hover,
    a.btn:hover,
    input[type="submit"]:not(:disabled):hover,
    input[type="button"]:not(:disabled):hover {
      transform: translateY(-3px) scale(1.07);
      filter: brightness(1.12) saturate(1.14);
      box-shadow: 0 16px 34px rgba(15, 23, 42, .26),
                  0 6px 14px rgba(15, 23, 42, .12),
                  0 0 0 3px rgba(59, 95, 226, .18);
      letter-spacing: .2px;
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

// ══════════════════════════════════════════════════════════════════
// Complaint-assignment notification banner.
// Renders at the top of every authenticated page when the current user
// has open customer_feedback rows assigned to them personally OR via
// a role they hold. "View now" opens the complaint detail directly.
// "Later" hides the banner for the current tab session only.
// ══════════════════════════════════════════════════════════════════
CW_ACCESS.injectFeedbackBanner = async function () {
  if (window.__cwFeedbackBannerRan) return;
  window.__cwFeedbackBannerRan = true;
  if (typeof PAGE_KEY === 'undefined') return;                      // login / unauth pages
  if (PAGE_KEY === 'customer_feedback') return;                     // already on the page

  const name = this.getName();
  if (!name || name === 'User') return;

  try {
    const cfgMod = await import('./config.js');
    const sbMod  = await import('https://esm.sh/@supabase/supabase-js@2');
    const sb     = sbMod.createClient(cfgMod.SUPABASE_CONFIG.url, cfgMod.SUPABASE_CONFIG.anonKey);

    // Figure out this user's role memberships
    const { data: meRow } = await sb.from('employees')
      .select('custom_role,role,extra_roles')
      .ilike('name', name).maybeSingle();
    const primaryRole = meRow?.custom_role || meRow?.role || '';
    let extra = [];
    try { extra = Array.isArray(meRow?.extra_roles) ? meRow.extra_roles
           : JSON.parse(meRow?.extra_roles || '[]'); } catch {}
    const myRoles = new Set([primaryRole, ...extra].filter(Boolean));
    const directValues = [name];
    const roleValues = [...myRoles].map(r => 'role:' + r);

    // Two queries run in parallel:
    //  1. Open complaints assigned to me (personal or via role) and not yet
    //     stamped notification_seen_at.
    //  2. Follow-up reminders I own whose follow_up_date is today or
     //    earlier and that haven't been marked done.
    const today = new Date().toISOString().slice(0, 10);
    const [asgnRes, fuRes] = await Promise.all([
      sb.from('customer_feedback')
        .select('id,feedback_no,customer_name,description,type,severity,category,assigned_to,status,notification_seen_at,received_date,follow_up_date,follow_up_note,follow_up_assignee,follow_up_done_at')
        .in('status', ['open', 'in_progress'])
        .in('assigned_to', [...directValues, ...roleValues])
        .order('severity', { ascending: false })
        .order('received_date', { ascending: false }),
      sb.from('customer_feedback')
        .select('id,feedback_no,customer_name,description,type,severity,category,assigned_to,status,notification_seen_at,received_date,follow_up_date,follow_up_note,follow_up_assignee,follow_up_done_at')
        .is('follow_up_done_at', null)
        .lte('follow_up_date', today)
        .in('follow_up_assignee', [...directValues, ...roleValues])
    ]);
    const seen = new Map();
    for (const r of [...(asgnRes.data || []), ...(fuRes.data || [])]) seen.set(r.id, r);
    // 'unseen' criteria: a new assignment that hasn't been opened OR a due follow-up
    const unseen = [...seen.values()].filter(r => {
      const isNewAssignment = !r.notification_seen_at;
      const fuDue = r.follow_up_assignee && !r.follow_up_done_at && r.follow_up_date && r.follow_up_date <= today;
      return isNewAssignment || fuDue;
    });
    if (!unseen.length) return;

    const TYPE_LABELS = {complaint:'🚫 Complaint',feedback:'👍 Feedback',suggestion:'💡 Suggestion',warranty:'🛡️ Warranty',inquiry:'❓ Inquiry',return:'📦 Return',service_request:'🛠️ Service'};
    const SEV_COLOR = {critical:'#dc2626',high:'#d97706',medium:'#1d4ed8',low:'#64748b'};

    // The TOP BANNER is always shown when there are unseen complaints.
    // It persists on every page until the user actually opens a complaint
    // (which stamps notification_seen_at). There is no "hide this session"
    // flag for the banner — the user wanted it to keep showing after Skip.
    // Sort so overdue follow-ups surface first, then due-today, then newly
    // assigned. Overdue is the most urgent class.
    unseen.sort((a, b) => {
      const aOver = a.follow_up_date && !a.follow_up_done_at && a.follow_up_date < today ? 0 :
                    a.follow_up_date && !a.follow_up_done_at && a.follow_up_date === today ? 1 : 2;
      const bOver = b.follow_up_date && !b.follow_up_done_at && b.follow_up_date < today ? 0 :
                    b.follow_up_date && !b.follow_up_done_at && b.follow_up_date === today ? 1 : 2;
      return aOver - bOver;
    });
    const first = unseen[0];
    const firstFuDue = first.follow_up_date && !first.follow_up_done_at && first.follow_up_date <= today;
    const firstFuOver = firstFuDue && first.follow_up_date < today;
    const firstNote = firstFuDue ? (first.follow_up_note || 'Follow-up reminder') : (first.description || '').slice(0, 90);
    const firstPrefix = firstFuOver ? '⚠️ OVERDUE — ' : firstFuDue ? '⏰ Due today — ' : '';
    const overdueCount = unseen.filter(r => r.follow_up_date && !r.follow_up_done_at && r.follow_up_date < today).length;
    const todayCount = unseen.filter(r => r.follow_up_date && !r.follow_up_done_at && r.follow_up_date === today).length;
    const suffix = (overdueCount || todayCount) ? ` (${overdueCount?overdueCount+' overdue':''}${overdueCount&&todayCount?' · ':''}${todayCount?todayCount+' today':''})` : '';
    const topBar = document.createElement('div');
    topBar.id = 'cw-feedback-banner';
    const bgGradient = firstFuOver ? 'linear-gradient(135deg,#b91c1c,#dc2626)' : 'linear-gradient(135deg,#1d4ed8,#3b5fe2)';
    topBar.style.cssText = `position:fixed;top:0;left:0;right:0;z-index:2000;background:${bgGradient};color:#fff;padding:10px 18px;display:flex;align-items:center;gap:14px;font-family:"DM Sans",sans-serif;font-size:13px;box-shadow:0 2px 10px rgba(15,23,42,.25)`;
    topBar.innerHTML = `
      <span style="font-size:18px">🔔</span>
      <div style="flex:1;min-width:0">
        <strong>You have ${unseen.length} item${unseen.length>1?'s':''} to handle${suffix}.</strong>
        <span style="opacity:.85;margin-left:8px">${firstPrefix}<em>${(first.customer_name||'—')}</em> — ${firstNote}${firstNote.length>=90?'…':''}</span>
      </div>
      <a href="customer_feedback.html?open=${encodeURIComponent(first.id)}" style="background:#fff;color:#1d4ed8;padding:6px 14px;border-radius:8px;font-weight:700;text-decoration:none;white-space:nowrap">View now →</a>
    `;
    document.body.prepend(topBar);
    document.body.style.paddingTop = (topBar.offsetHeight || 48) + 'px';

    // LOGIN MODAL — big, deliberate, only shown ONCE per tab session.
    // After the user clicks Skip (or clicks outside / Esc), the modal
    // is gone for this session but the top banner above stays visible
    // so they can come back to it any time.
    if (sessionStorage.getItem('cw_feedback_modal_seen') === '1') return;
    sessionStorage.setItem('cw_feedback_modal_seen', '1');

    const top = unseen.slice(0, 5);
    const more = unseen.length - top.length;
    const wrap = document.createElement('div');
    wrap.id = 'cw-fb-modal';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:3000;background:rgba(15,23,42,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px;font-family:"DM Sans",sans-serif';
    wrap.innerHTML = `
      <div style="background:#fff;border-radius:18px;max-width:640px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 30px 80px rgba(15,23,42,.35);animation:cwPop .18s ease">
        <div style="padding:22px 24px 14px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:14px">
          <div style="font-size:30px">🔔</div>
          <div style="flex:1">
            <div style="font-size:17px;font-weight:800;letter-spacing:-.3px">You have ${unseen.length} complaint${unseen.length>1?'s':''} waiting for you</div>
            <div style="font-size:12px;color:#64748b;margin-top:2px">Welcome back, ${name}. Pick one to handle now, or skip and come back later — a banner will stay at the top until you handle it.</div>
          </div>
        </div>
        <div style="padding:14px 18px 10px;display:flex;flex-direction:column;gap:10px">
          ${top.map(r=>{
            const descShort = (r.description||'').slice(0,140);
            const ellip = (r.description||'').length>140 ? '…' : '';
            const sevColor = SEV_COLOR[r.severity] || '#64748b';
            return `<a href="customer_feedback.html?open=${encodeURIComponent(r.id)}" style="display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border:1px solid #e2e8f0;border-radius:12px;text-decoration:none;color:inherit;transition:all .12s" onmouseover="this.style.borderColor='#3b5fe2';this.style.background='#eef6ff'" onmouseout="this.style.borderColor='#e2e8f0';this.style.background='#fff'">
              <div style="width:6px;align-self:stretch;background:${sevColor};border-radius:3px;flex-shrink:0"></div>
              <div style="flex:1;min-width:0">
                <div style="font-size:12px;color:#64748b;margin-bottom:2px">${r.feedback_no||''} · ${TYPE_LABELS[r.type]||r.type||'—'} · <span style="color:${sevColor};font-weight:700">${r.severity||'—'}</span></div>
                <div style="font-size:14px;font-weight:700;margin-bottom:3px">${r.customer_name||'(no customer)'}</div>
                <div style="font-size:12px;color:#334155;line-height:1.4">${descShort}${ellip}</div>
              </div>
              <div style="color:#3b5fe2;font-weight:800;font-size:18px;align-self:center">›</div>
            </a>`;
          }).join('')}
          ${more>0?`<div style="text-align:center;color:#64748b;font-size:12px;padding:4px 0">+ ${more} more — visit Customer Feedback to see all</div>`:''}
        </div>
        <div style="padding:14px 20px 20px;display:flex;gap:10px;justify-content:flex-end;border-top:1px solid #f1f5f9">
          <button id="cw-fb-skip" style="background:#fff;border:1.5px solid #e2e8f0;color:#64748b;padding:9px 20px;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px">Later</button>
          <a href="customer_feedback.html?filter=mine" style="background:#3b5fe2;color:#fff;padding:9px 20px;border-radius:10px;font-weight:700;text-decoration:none;font-family:inherit;font-size:13px;display:inline-flex;align-items:center;gap:6px">View all my cases →</a>
        </div>
      </div>
      <style>
        @keyframes cwPop { from { transform: translateY(10px) scale(.98); opacity: 0 } to { transform: none; opacity: 1 } }
      </style>
    `;
    document.body.appendChild(wrap);

    const dismissModal = () => { wrap.remove(); };
    document.getElementById('cw-fb-skip').addEventListener('click', dismissModal);
    wrap.addEventListener('click', (e) => { if (e.target === wrap) dismissModal(); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { dismissModal(); document.removeEventListener('keydown', onEsc); }
    });
  } catch (e) { /* best-effort — never block the page */ }
};

// ── Auto-run ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  CW_ACCESS.injectButtonStyles();
  CW_ACCESS._initPWA();
  CW_ACCESS._initMobile();
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
    CW_ACCESS.injectFeedbackBanner();
    CW_ACCESS._initChatNotifications();
  }
});
