// ═══════════════════════════════════════════════════════════════
// Cedarwings SAS — Role-Based Access Control v3.2
// Includes floating Help button with per-page guides
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

  // ── Per-page help guides ───────────────────────────────────────
  helpGuides: {
    dashboard: {
      title: '📊 Operations Dashboard',
      role: 'Manager only — real-time overview of the entire factory.',
      sections: [
        { heading: 'KPI Cards', text: 'Top row shows live counts: active sessions, productive hours, aligners produced today, efficiency %, and open stock alerts. These update automatically every 30 seconds.' },
        { heading: 'Range Buttons (Today / This Week / This Month)', text: 'Filter all charts and tables to the selected time period. Click any button to switch range instantly.' },
        { heading: '📈 Charts', text: 'Productivity Trend shows daily productive vs non-productive hours. Session Types shows the distribution. Employee Efficiency ranks staff by productive time.' },
        { heading: '🟢 Active Sessions', text: 'Shows who is currently clocked in, what they are doing, and for how long. Sessions over 1 hour are highlighted in red as a warning.' },
        { heading: '⚠ Stock Alerts', text: 'Automatically shows items that are out of stock, below minimum level, near expiry, or already expired. Click any alert to go to Inventory.' },
        { heading: '📋 Open Requisitions', text: 'Lists pending and approved material requests. Click Manage to go to Inventory and process them.' },
        { heading: '🦷 + Log Production button', text: 'Quick entry to record aligners produced for an order without going to the Production page.' },
        { heading: '⬇ Export CSV', text: 'Downloads the full session log for the selected period as a spreadsheet.' },
      ]
    },
    production: {
      title: '🏭 Production',
      role: 'Managers create orders. Employees mark completions.',
      sections: [
        { heading: 'What this page does', text: 'Tracks every dental aligner production order from assignment to completion. Each order is linked to a Bloom case number.' },
        { heading: '+ New Order button', text: 'Creates a new production order. Enter the Bloom case number — patient name, doctor, and aligner count are filled automatically from Bloom data. Assign to an employee and set priority.' },
        { heading: '🏁 Complete button', text: 'Opens the completion flow for an order. First confirm YES (all aligners done) or NO (partial). If partial, enter how many were produced, the reason, and optionally schedule a reminder for the remaining aligners.' },
        { heading: '🔔 Reminder button', text: 'Sets a follow-up reminder for any order without marking it complete. Useful for scheduling future production sessions.' },
        { heading: '✅ Completion Records tab', text: 'Full history of all production sessions — complete and partial. Shows planned vs produced vs remaining.' },
        { heading: '⚠️ Incomplete Cases tab', text: 'Cases where some aligners were produced but not all. Shows the progress bar and how many are still missing.' },
        { heading: '🔔 Reminders tab', text: 'All scheduled reminders. Overdue reminders appear in red. Click ✅ Done to close a reminder once completed.' },
      ]
    },
    production_materials: {
      title: '🧪 Materials & Lots',
      role: 'Manager and quality team — tracks raw material lots used in production.',
      sections: [
        { heading: 'What this page does', text: 'Records which material lots (resin, film, etc.) were used for which production runs, enabling full traceability.' },
        { heading: 'Adding a material lot', text: 'Click + Add Lot. Enter the lot number, material type, quantity, supplier, and expiry date. This creates a traceable record linked to production.' },
        { heading: 'Linking to production', text: 'When a lot is consumed during production, associate it to the order so auditors can trace every aligner back to its raw material batch.' },
      ]
    },
    machines: {
      title: '⚙ Machines',
      role: 'Manager — register and monitor production equipment.',
      sections: [
        { heading: 'What this page does', text: 'Central registry of all 3D printers, washers, curing units, and other production machines.' },
        { heading: '+ Add Machine button', text: 'Register a new machine with its name, type, serial number, and purchase date.' },
        { heading: 'Status badges', text: 'Each machine shows its current status: Active (green), Maintenance (amber), or Out of Service (red). Update the status when a machine is taken offline.' },
        { heading: 'Machine cards', text: 'Click a machine to see its details and link to its maintenance history.' },
      ]
    },
    maintenance_history: {
      title: '🔧 Maintenance History',
      role: 'Manager and technicians — log all maintenance interventions.',
      sections: [
        { heading: 'What this page does', text: 'Keeps a complete log of every maintenance event on every machine — planned servicing, repairs, and breakdowns.' },
        { heading: '+ Log Maintenance button', text: 'Record a new maintenance event. Select the machine, type (preventive / corrective), description, technician, and date.' },
        { heading: 'ISO 13485 requirement', text: 'Regular maintenance logs are mandatory for medical device manufacturing compliance. All records here serve as audit evidence.' },
      ]
    },
    employees: {
      title: '👥 Employees',
      role: 'Manager only — manage all staff accounts.',
      sections: [
        { heading: 'What this page does', text: 'Lists all employees with their role, username, and active/inactive status.' },
        { heading: '+ Add Employee button', text: 'Create a new employee account. Set their name, username, password, and role (Manager or Employee).' },
        { heading: 'Edit button', text: 'Update employee details, change password, or deactivate an account.' },
        { heading: 'Access Control', text: 'For employees, you can restrict which pages they can access. Leave the access list empty to allow all pages.' },
        { heading: 'Active toggle', text: 'Deactivating an employee prevents them from logging in without deleting their records.' },
      ]
    },
    employee_profile: {
      title: '👤 Employee Profile',
      role: 'Manager — detailed view of one employee\'s activity.',
      sections: [
        { heading: 'What this page does', text: 'Shows a complete productivity profile for a single employee: total hours, efficiency rate, session history, and production records.' },
        { heading: 'How to open a profile', text: 'Click any employee name in the Dashboard active sessions list, or in the Employee Summary table, to open their profile directly.' },
        { heading: 'Productivity chart', text: 'Shows the employee\'s daily productive vs non-productive hours over the last 30 days.' },
        { heading: 'Session history', text: 'Complete list of every clocking session — start time, end time, work type, machine, and duration.' },
      ]
    },
    time_report: {
      title: '📈 Time Report',
      role: 'Manager — detailed analysis of working hours.',
      sections: [
        { heading: 'What this page does', text: 'Generates productivity reports for all employees or a selected period. Used for payroll verification and performance tracking.' },
        { heading: 'Date range filter', text: 'Select a custom date range to generate a report for any period.' },
        { heading: 'Employee filter', text: 'View the report for all employees combined, or select one employee.' },
        { heading: 'Export button', text: 'Download the full report as a CSV file for payroll or HR systems.' },
        { heading: 'Efficiency %', text: 'Calculated as productive hours ÷ (productive + non-productive hours). Target is 70% or above.' },
      ]
    },
    tracabilite: {
      title: '🔖 Traceability',
      role: 'Manager and quality team — trace every case through production.',
      sections: [
        { heading: 'What this page does', text: 'Links a Bloom case number to every step: which employee produced it, which machine was used, which material lots were consumed, and when.' },
        { heading: 'Search by case number', text: 'Enter any Bloom case number to see its complete production history from raw material to finished aligners.' },
        { heading: 'Why it matters', text: 'ISO 13485 requires full traceability for medical devices. In case of a quality recall, you can identify exactly which patients received aligners from a specific material lot.' },
      ]
    },
    qualite: {
      title: '✅ Quality Control',
      role: 'Quality team — record inspection results.',
      sections: [
        { heading: 'What this page does', text: 'Records quality control checks on finished aligners before they are shipped to clinics.' },
        { heading: '+ New Check button', text: 'Log a quality inspection. Select the case, record pass/fail for each criterion, and note any defects.' },
        { heading: 'Status badges', text: 'PASS (green) = aligners approved for shipping. FAIL (red) = must be reprinted. PENDING (amber) = awaiting inspection.' },
        { heading: 'Defect log', text: 'Failed inspections automatically create a non-conformity record for corrective action tracking.' },
      ]
    },
    non_conformity: {
      title: '⚠️ Non-Conformity',
      role: 'Quality team and managers — manage quality problems.',
      sections: [
        { heading: 'What this page does', text: 'Tracks every quality deviation: defective aligners, process failures, material issues, or equipment problems.' },
        { heading: '+ New NC button', text: 'Open a non-conformity report. Describe the problem, severity, root cause, and assign corrective actions.' },
        { heading: 'Corrective Action (CAPA)', text: 'Each NC must have a corrective action plan with a deadline and responsible person. Close the NC once the action is verified.' },
        { heading: 'ISO requirement', text: 'All non-conformities must be recorded, investigated, and closed. This log is reviewed during ISO 13485 audits.' },
      ]
    },
    internal_audit: {
      title: '📋 Internal Audit',
      role: 'Quality manager — plan and record internal audits.',
      sections: [
        { heading: 'What this page does', text: 'Manages the internal audit programme required by ISO 13485. Audits verify that procedures are being followed correctly.' },
        { heading: '+ Schedule Audit button', text: 'Plan a new audit. Define the scope (which department/process), the auditor, and the planned date.' },
        { heading: 'Findings', text: 'Record findings from each audit: conformities, non-conformities, and observations. Each finding generates a CAPA if needed.' },
        { heading: 'Audit cycle', text: 'All critical processes must be audited at least once per year. The system tracks overdue audits automatically.' },
      ]
    },
    customer_feedback: {
      title: '💬 Customer Feedback',
      role: 'Manager and quality team — collect and track clinic feedback.',
      sections: [
        { heading: 'What this page does', text: 'Records feedback received from dental clinics about aligner quality, delivery, and service.' },
        { heading: '+ Log Feedback button', text: 'Enter feedback from a clinic. Link it to a specific case if relevant, rate satisfaction (1–5), and categorise the feedback type.' },
        { heading: 'Complaint vs Feedback', text: 'Complaints (rating 1–2) automatically trigger a non-conformity investigation. General feedback (3–5) is logged for quality improvement.' },
        { heading: 'Trends', text: 'The summary chart shows customer satisfaction trends over time. A drop in ratings is a signal to investigate production quality.' },
      ]
    },
    inventory: {
      title: '📦 Inventory',
      role: 'Manager and production team — manage all raw materials and consumables.',
      sections: [
        { heading: '📦 Stock tab', text: 'Shows all current stock lots with quantity, expiry date, and status. FEFO (First Expired First Out) — always use the lot expiring soonest.' },
        { heading: '🗂 Items tab', text: 'The catalogue of all material types registered in the system. Add new material types here before adding stock lots.' },
        { heading: '+ Add Item button', text: 'Register a new material type (e.g. "Resin 1L Bottle"). Set minimum stock, unit, and auto-requisition rules.' },
        { heading: '+ Add Lot button / + Add Stock Lot button', text: 'Add a physical batch of stock. Enter the lot number, quantity, supplier, purchase date, and expiry date.' },
        { heading: 'Adjust button', text: 'Manually correct the quantity of a lot (e.g. after a physical stock count). Always add a note explaining the adjustment.' },
        { heading: '📋 Requisitions tab', text: 'Material purchase requests. Pending = submitted, Approved = manager approved, Fulfilled = stock received.' },
        { heading: '⚗️ BOM tab', text: 'Bill of Materials — defines how much of each material is consumed per aligner produced. Used by the auto-requisition calculator.' },
        { heading: '🧮 Auto-Requisition tab', text: 'Automatically calculates how much material to order based on active Bloom cases × BOM formula − current stock. Click Calculate Now to generate a proforma purchase order.' },
      ]
    },
    suppliers: {
      title: '🏭 Suppliers',
      role: 'Manager — manage approved supplier list.',
      sections: [
        { heading: 'What this page does', text: 'Maintains the list of approved suppliers for raw materials and consumables.' },
        { heading: '+ Add Supplier button', text: 'Register a new supplier with contact details, lead time, and the materials they supply.' },
        { heading: 'Approved supplier list', text: 'ISO 13485 requires purchasing only from qualified suppliers. The approved list here serves as evidence of supplier qualification.' },
        { heading: 'Linking to inventory', text: 'When adding stock lots, select the supplier from this list to maintain a complete audit trail.' },
      ]
    },
    bloom_import: {
      title: '🌸 Bloom Import',
      role: 'Manager — synchronise data from the Bloom Aligner platform.',
      sections: [
        { heading: 'What this page does', text: 'Fetches the latest case data from bloomaligner.fr and updates the local database with new cases, status changes, and aligner counts.' },
        { heading: 'Sync Now button', text: 'Triggers a manual sync with the Bloom API. This updates all case statuses, patient names, doctor names, and aligner counts.' },
        { heading: 'Auto-sync', text: 'The system syncs automatically every 6 hours. Only cases with real status changes create new snapshot records to save storage.' },
        { heading: 'Why it matters', text: 'Production orders, auto-requisition calculations, and traceability all depend on accurate Bloom data. Run a sync before creating new production orders.' },
      ]
    },
    settings: {
      title: '⚙ Settings',
      role: 'Manager only — system configuration.',
      sections: [
        { heading: 'What this page does', text: 'Configures system-wide settings: company name, Bloom API credentials, notification thresholds, and language.' },
        { heading: 'Bloom API token', text: 'The authentication token used to connect to bloomaligner.fr. Contact Bloom support if the sync stops working — the token may need renewal.' },
        { heading: 'Stock alert thresholds', text: 'Set the number of days before expiry that triggers an alert, and the minimum stock percentage that triggers a low-stock warning.' },
        { heading: 'Language', text: 'Switch the interface between French and English. This setting applies to all users.' },
      ]
    },
    roles: {
      title: '🔑 Roles & Access',
      role: 'Manager only — control what each employee can access.',
      sections: [
        { heading: 'What this page does', text: 'Defines which pages each employee can access. Managers always have full access.' },
        { heading: 'Employee access', text: 'For each employee, select which pages they are allowed to see. If no pages are selected, the employee can access all pages.' },
        { heading: 'Manager role', text: 'Managers can access everything including Roles, Settings, and all reports. This cannot be restricted.' },
        { heading: 'Security tip', text: 'Give employees access only to what they need for their daily work. Restrict Settings and Roles to managers only.' },
      ]
    },
    changelog: {
      title: '📝 Changelog',
      role: 'All users — see what has changed in the system.',
      sections: [
        { heading: 'What this page does', text: 'Lists all updates, bug fixes, and new features added to the Cedarwings platform, with dates and descriptions.' },
        { heading: 'Version history', text: 'Each entry shows the version number, date, and a description of what changed. Useful for understanding new features after an update.' },
      ]
    },
    iso_compliance: {
      title: '🏅 ISO Compliance',
      role: 'Manager and quality team — track ISO 13485 compliance status.',
      sections: [
        { heading: 'What this page does', text: 'Provides a real-time compliance dashboard showing the status of all ISO 13485 requirements across the quality management system.' },
        { heading: 'Compliance indicators', text: 'Each clause shows its current status: compliant (green), partially compliant (amber), or non-compliant (red). Click any clause to see the evidence and open items.' },
        { heading: 'Audit readiness', text: 'This page is the starting point for ISO 13485 certification audits. It links to NC reports, internal audits, maintenance logs, and traceability records.' },
        { heading: 'Action items', text: 'Open action items required to achieve or maintain compliance are listed with responsible owners and due dates.' },
      ]
    },
    clocking: {
      title: '⏱ Clocking Terminal',
      role: 'All employees — clock in and out for work sessions.',
      sections: [
        { heading: 'What this page does', text: 'The daily time tracking terminal. Employees use this at the start and end of every work session.' },
        { heading: 'Clock In — Productive', text: 'Use this when doing direct production work: printing, washing, curing aligners. Select the machine you are using and the order number.' },
        { heading: 'Clock In — Non-Productive', text: 'Use this for indirect work: cleaning, maintenance, training, meetings. Select the waste category that best describes the activity.' },
        { heading: 'Clock Out button', text: 'Always clock out at the end of a session or when changing activity. Forgotten clock-outs create inaccurate time records.' },
        { heading: 'Active session display', text: 'While clocked in, the live timer shows your elapsed time. Sessions over 1 hour trigger a manager alert on the dashboard.' },
      ]
    },
  },

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

  // ── Inject help button + panel into page ──────────────────────
  injectHelp(pageKey) {
    const guide = this.helpGuides[pageKey];
    if (!guide) return;

    // Build sections HTML
    const sectionsHtml = guide.sections.map(s => `
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:700;color:#3b5fe2;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">${s.heading}</div>
        <div style="font-size:13px;color:#374151;line-height:1.6">${s.text}</div>
      </div>`).join('');

    // Inject styles + help panel + floating button
    const el = document.createElement('div');
    el.id = 'cw-help-root';
    el.innerHTML = `
      <style>
        #cw-help-btn{
          position:fixed;bottom:28px;left:256px;width:40px;height:40px;
          background:#3b5fe2;border-radius:50%;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 14px rgba(59,95,226,.45);z-index:900;
          font-size:18px;font-weight:800;color:#fff;font-family:Georgia,serif;
          transition:transform .15s,box-shadow .15s;
        }
        #cw-help-btn:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(59,95,226,.55)}
        #cw-help-overlay{
          display:none;position:fixed;inset:0;background:rgba(15,23,42,.45);
          backdrop-filter:blur(3px);z-index:901;
        }
        #cw-help-panel{
          position:fixed;top:0;right:-420px;bottom:0;width:400px;
          background:#fff;box-shadow:-8px 0 32px rgba(0,0,0,.12);
          z-index:902;display:flex;flex-direction:column;
          transition:right .25s cubic-bezier(.4,0,.2,1);
          font-family:'DM Sans',sans-serif;
        }
        #cw-help-panel.open{right:0}
        #cw-help-head{
          padding:22px 24px 18px;border-bottom:1px solid #e2e8f0;
          display:flex;justify-content:space-between;align-items:flex-start;flex-shrink:0;
        }
        #cw-help-title{font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-.3px}
        #cw-help-role{
          font-size:11px;font-weight:600;color:#3b5fe2;background:#eef2ff;
          padding:3px 10px;border-radius:999px;margin-top:6px;display:inline-flex;
        }
        #cw-help-close{
          width:32px;height:32px;border:1px solid #e2e8f0;background:#f8fafc;
          border-radius:8px;cursor:pointer;font-size:16px;display:flex;
          align-items:center;justify-content:center;flex-shrink:0;
        }
        #cw-help-body{padding:20px 24px;overflow-y:auto;flex:1}
        @media(max-width:768px){
          #cw-help-btn{left:16px}
          #cw-help-panel{width:100%;right:-100%}
        }
      </style>

      <button id="cw-help-btn" title="Page Guide">?</button>

      <div id="cw-help-overlay"></div>

      <div id="cw-help-panel">
        <div id="cw-help-head">
          <div>
            <div id="cw-help-title">${guide.title}</div>
            <div id="cw-help-role">${guide.role}</div>
          </div>
          <button id="cw-help-close">✕</button>
        </div>
        <div id="cw-help-body">${sectionsHtml}</div>
      </div>
    `;
    document.body.appendChild(el);

    const btn     = document.getElementById('cw-help-btn');
    const panel   = document.getElementById('cw-help-panel');
    const overlay = document.getElementById('cw-help-overlay');
    const close   = document.getElementById('cw-help-close');

    function openHelp()  { panel.classList.add('open'); overlay.style.display='block'; }
    function closeHelp() { panel.classList.remove('open'); overlay.style.display='none'; }

    btn.addEventListener('click', openHelp);
    close.addEventListener('click', closeHelp);
    overlay.addEventListener('click', closeHelp);
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

    this.injectHelp(activeKey);
  }
};

// ── Auto-run ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});
