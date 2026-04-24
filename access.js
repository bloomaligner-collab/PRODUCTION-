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
      settings: 'settings.html', roles: 'roles.html', audit_log: 'audit_log.html',
      changelog: 'changelog.html', iso_compliance: 'iso_compliance.html',
      bloom_import: 'bloom_import.html', outsourcing: 'outsourcing.html', clocking: 'clocking.html'
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
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
    CW_ACCESS.injectFeedbackBanner();
  }
});
