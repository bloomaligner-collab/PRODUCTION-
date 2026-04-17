<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Cedarwings — Bloom Sync</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet"/>
<style>
:root{--bg:#f0f4f8;--card:#fff;--bdr:#e2e8f0;--txt:#0f172a;--mu:#64748b;--dim:#94a3b8;
  --blue:#3b5fe2;--b50:#eff3ff;--b100:#e0e7ff;
  --green:#16a34a;--g50:#f0fdf4;--g100:#bbf7d0;
  --red:#dc2626;--r50:#fff1f2;--r100:#fecdd3;
  --amber:#d97706;--a50:#fffbeb;--a100:#fde68a;
  --purple:#7c3aed;--p50:#f5f3ff;--p100:#ede9fe;
  --teal:#0d9488;--t50:#f0fdfa;--t100:#ccfbf1;
  --sh:0 1px 3px rgba(0,0,0,.07),0 0 0 1px rgba(0,0,0,.04);
  --sh2:0 6px 24px rgba(0,0,0,.09)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh}
.main{margin-left:240px;min-height:100vh}
.topbar{background:var(--card);border-bottom:1px solid var(--bdr);padding:14px 28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:50;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.page-title{font-size:20px;font-weight:800;letter-spacing:-.4px}
.page-sub{font-size:12px;color:var(--mu);margin-top:2px}
.body{padding:24px 28px 80px}
.kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:20px}
.kpi{background:var(--card);border-radius:14px;box-shadow:var(--sh);padding:16px;border-top:3px solid var(--bdr);cursor:default}
.kpi-ico{font-size:20px;margin-bottom:10px}
.kpi-val{font-size:26px;font-weight:800;font-family:'JetBrains Mono',monospace;letter-spacing:-1px;line-height:1}
.kpi-lbl{font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.kpi-sub{font-size:10px;color:var(--dim);margin-top:3px}
.sync-banner{background:var(--card);border-radius:14px;box-shadow:var(--sh);padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.sync-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.sync-dot.ok{background:var(--green);animation:pulse 2s infinite}
.sync-dot.running{background:var(--amber);animation:blink .8s infinite}
.sync-dot.err{background:var(--red)}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,.4)}60%{box-shadow:0 0 0 5px rgba(22,163,74,0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.stat-box{text-align:center}
.stat-val{font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace}
.stat-lbl{font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-top:3px}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.btn-blue{background:var(--blue);color:#fff}.btn-blue:hover{background:#2d4dd4}.btn-blue:disabled{background:#94a3b8;cursor:not-allowed}
.btn-ghost{background:var(--card);border:1.5px solid var(--bdr);color:var(--mu)}.btn-ghost:hover{border-color:var(--blue);color:var(--blue)}
.btn-green{background:var(--green);color:#fff}.btn-green:hover{background:#15803d}
.live-badge{display:flex;align-items:center;gap:6px;background:var(--g50);border:1px solid var(--g100);padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700;color:var(--green)}
.live-dot{width:7px;height:7px;border-radius:50%;background:var(--green);animation:pulse 2s infinite;flex-shrink:0}
.tabs{display:flex;gap:4px;background:var(--bg);border:1px solid var(--bdr);border-radius:10px;padding:3px;margin-bottom:20px;flex-wrap:wrap}
.tab{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--mu);font-family:inherit;transition:all .12s;white-space:nowrap}
.tab.active{background:var(--card);color:var(--blue);box-shadow:var(--sh)}
.card{background:var(--card);border-radius:14px;box-shadow:var(--sh);padding:20px;margin-bottom:16px}
.card-title{font-size:14px;font-weight:800;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}

/* FILTERS */
.filters-bar{background:var(--card);border-radius:12px;box-shadow:var(--sh);padding:14px 18px;margin-bottom:14px;display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap}
.fi-group{display:flex;flex-direction:column;gap:4px}
.fi-label{font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.4px}
.fi{padding:7px 11px;border:1.5px solid var(--bdr);border-radius:8px;font-size:12px;font-family:inherit;background:var(--bg);color:var(--txt);outline:none}
.fi:focus{border-color:var(--blue)}
.fi[type=date]{min-width:128px}
.fi-search{min-width:200px}
.filter-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;min-height:10px}
.ftag{display:inline-flex;align-items:center;gap:5px;background:var(--b50);color:var(--blue);border:1px solid var(--b100);border-radius:999px;padding:3px 10px;font-size:11px;font-weight:700}
.ftag button{background:none;border:none;cursor:pointer;color:var(--blue);font-size:12px;padding:0;line-height:1}

/* SORTABLE TH */
th.sortable{cursor:pointer;user-select:none}
th.sortable:hover{background:#f0f4f8;color:var(--blue)}
th.sort-asc::after{content:' ↑';color:var(--blue)}
th.sort-desc::after{content:' ↓';color:var(--blue)}

/* TABLE */
.tw{overflow-x:auto;border-radius:11px;border:1px solid var(--bdr)}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#f8fafc;padding:9px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--bdr);white-space:nowrap}
td{padding:10px 12px;border-bottom:1px solid var(--bdr);vertical-align:middle}
tr:last-child td{border:none}
tr:hover td{background:#fafbfc}
.mono{font-family:'JetBrains Mono',monospace;font-size:11px}

/* BADGE */
.bdg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700}
.b-g{background:var(--g100);color:#15803d}.b-r{background:var(--r100);color:#991b1b}
.b-a{background:var(--a100);color:#92400e}.b-b{background:var(--b100);color:#1e40af}
.b-p{background:var(--p100);color:#5b21b6}.b-gray{background:#f1f5f9;color:var(--mu)}
.b-t{background:var(--t100);color:#0f766e}

/* STATUS BARS */
.srow{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.slbl{width:190px;flex-shrink:0;font-size:11px;font-weight:600;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sbg{flex:1;height:7px;background:var(--bg);border-radius:999px;overflow:hidden;border:1px solid var(--bdr)}
.sfill{height:100%;border-radius:999px}
.scnt{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;min-width:38px;text-align:right}
.spct{font-size:10px;color:var(--dim);min-width:28px;text-align:right}

/* PAGINATION */
.pg{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:12px;color:var(--mu)}

/* MODAL */
.overlay{display:none;position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:200;align-items:center;justify-content:center}
.overlay.on{display:flex}
.modal{background:var(--card);border-radius:18px;padding:28px;width:min(720px,96vw);max-height:92vh;overflow-y:auto;box-shadow:var(--sh2)}
.mo-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.di{background:var(--bg);border-radius:9px;padding:10px 12px}
.dl{font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px}
.dv{font-size:13px;font-weight:600}

/* TIMELINE */
.timeline{position:relative;padding-left:20px}
.timeline::before{content:'';position:absolute;left:6px;top:8px;bottom:8px;width:2px;background:var(--bdr)}
.tl-item{position:relative;margin-bottom:12px;padding:10px 12px;background:var(--bg);border-radius:10px;border:1px solid var(--bdr)}
.tl-item::before{content:'';position:absolute;left:-17px;top:14px;width:10px;height:10px;border-radius:50%;border:2px solid var(--card);flex-shrink:0}
.tl-item.latest{border-color:var(--blue);background:var(--b50)}
.tl-item.latest::before{background:var(--blue)}
.tl-item:not(.latest)::before{background:var(--dim)}

/* SPINNER */
.spinner{display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:1400px){.kpi-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}.main{margin-left:0}}
</style>
<script>const PAGE_KEY='bloom_import'</script>
<script src="access.js"></script>
</head>
<body>
<div class="main">
  <div class="topbar">
    <div>
      <div class="page-title">🔵 Bloom Sync</div>
      <div class="page-sub">Automatic sync · Every minute · Full history preserved</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div class="live-badge"><div class="live-dot"></div><span id="liveTxt">Loading...</span></div>
      <button class="btn btn-ghost" style="padding:7px 14px;font-size:12px" onclick="loadAll()">↻ Refresh</button>
      <button class="btn btn-blue" id="syncBtn" onclick="triggerSync()">🔄 Sync Now</button>
    </div>
  </div>

  <div class="body">

    <!-- SYNC BANNER -->
    <div class="sync-banner">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="sync-dot ok" id="syncDot"></div>
        <div>
          <div style="font-size:15px;font-weight:800" id="syncTxt">Checking...</div>
          <div style="font-size:12px;color:var(--mu);margin-top:2px" id="syncMeta">—</div>
        </div>
      </div>
      <div style="display:flex;gap:28px;flex-wrap:wrap">
        <div class="stat-box"><div class="stat-val" id="sBTotal" style="color:var(--blue)">—</div><div class="stat-lbl">Total Cases</div></div>
        <div class="stat-box"><div class="stat-val" id="sBSnaps" style="color:var(--purple)">—</div><div class="stat-lbl">Snapshots</div></div>
        <div class="stat-box"><div class="stat-val" id="sBAligns" style="color:var(--teal)">—</div><div class="stat-lbl">Aligner Records</div></div>
        <div class="stat-box"><div class="stat-val" id="sBLast" style="color:var(--amber)">—</div><div class="stat-lbl">Last Sync</div></div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi" style="border-top-color:var(--blue)"><div class="kpi-ico">🔵</div><div class="kpi-val" id="kTotal" style="color:var(--blue)">—</div><div class="kpi-lbl">Total Cases</div></div>
      <div class="kpi" style="border-top-color:var(--green)"><div class="kpi-ico">📦</div><div class="kpi-val" id="kReceived" style="color:var(--green)">—</div><div class="kpi-lbl">Aligners Received</div></div>
      <div class="kpi" style="border-top-color:var(--amber)"><div class="kpi-ico">⚙️</div><div class="kpi-val" id="kProd" style="color:var(--amber)">—</div><div class="kpi-lbl">In Production</div></div>
      <div class="kpi" style="border-top-color:var(--purple)"><div class="kpi-ico">📋</div><div class="kpi-val" id="kPlan" style="color:var(--purple)">—</div><div class="kpi-lbl">Planning</div></div>
      <div class="kpi" style="border-top-color:var(--teal)"><div class="kpi-ico">🦷</div><div class="kpi-val" id="kAligners" style="color:var(--teal)">—</div><div class="kpi-lbl">Aligner Records</div><div class="kpi-sub" id="kAlignersTotal"></div></div>
      <div class="kpi" style="border-top-color:var(--mu)"><div class="kpi-ico">📝</div><div class="kpi-val" id="kDraft" style="color:var(--mu)">—</div><div class="kpi-lbl">Drafts</div></div>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button class="tab active" onclick="showTab('cases',this)">👥 All Cases</button>
      <button class="tab" onclick="showTab('aligners',this)">🦷 Aligner Details</button>
      <button class="tab" onclick="showTab('history',this)">📸 History / Snapshots</button>
      <button class="tab" onclick="showTab('analytics',this)">📊 Analytics</button>
      <button class="tab" onclick="showTab('synclog',this)">📜 Sync Log</button>
    </div>

    <!-- ===== TAB: CASES ===== -->
    <div id="tab-cases">
      <div class="filters-bar">
        <div class="fi-group"><div class="fi-label">🔍 Search</div><input class="fi fi-search" type="text" id="fSearch" placeholder="Case #, patient, doctor, clinic..." oninput="applyFilters()"/></div>
        <div class="fi-group"><div class="fi-label">Status</div><select class="fi" id="fStatus" onchange="applyFilters()"><option value="">All</option></select></div>
        <div class="fi-group"><div class="fi-label">📅 Status Changed From</div><input class="fi" type="date" id="fStatusFrom" onchange="applyFilters()"/></div>
        <div class="fi-group"><div class="fi-label">To</div><input class="fi" type="date" id="fStatusTo" onchange="applyFilters()"/></div>
        <div class="fi-group"><div class="fi-label">🔄 Synced From</div><input class="fi" type="date" id="fSyncFrom" onchange="applyFilters()"/></div>
        <div class="fi-group"><div class="fi-label">To</div><input class="fi" type="date" id="fSyncTo" onchange="applyFilters()"/></div>
        <div class="fi-group"><div class="fi-label">Distributor</div><select class="fi" id="fDist" onchange="applyFilters()"><option value="">All</option></select></div>
        <div class="fi-group"><div class="fi-label">Action Req.</div><select class="fi" id="fAction" onchange="applyFilters()"><option value="">All</option><option value="yes">⚠️ Yes</option><option value="no">✅ No</option></select></div>
        <button class="btn btn-ghost" style="padding:7px 12px;font-size:12px;align-self:flex-end" onclick="clearFilters('cases')">✕ Clear</button>
      </div>
      <div class="filter-tags" id="caseTags"></div>
      <div class="card">
        <div class="card-title">
          <span>👥 Cases <span style="font-size:11px;font-weight:500;color:var(--mu)" id="casesCount"></span></span>
          <button class="btn btn-green" style="padding:7px 14px;font-size:12px" onclick="exportCasesCSV()">⬇ Export CSV</button>
        </div>
        <div class="tw">
          <table id="casesTable">
            <thead><tr>
              <th class="sortable" onclick="sortCases('case_id')">Case #</th>
              <th class="sortable" onclick="sortCases('patient_name')">Patient</th>
              <th class="sortable" onclick="sortCases('doctor')">Doctor</th>
              <th>Clinic</th><th>Distributor</th>
              <th class="sortable" onclick="sortCases('current_status')">Status</th>
              <th class="sortable" onclick="sortCases('status_change_date')">Status Changed</th>
              <th class="sortable" onclick="sortCases('last_synced_at')">Last Synced</th>
              <th class="sortable" onclick="sortCases('total_aligners')">TP Total</th>
              <th class="sortable" onclick="sortCases('upper')">TP Upper</th>
              <th class="sortable" onclick="sortCases('lower')">TP Lower</th>
              <th>Package</th><th>Action Req.</th><th>Refin.</th><th></th>
            </tr></thead>
            <tbody id="casesTbl"><tr><td colspan="15" style="text-align:center;padding:30px;color:var(--dim)">Loading...</td></tr></tbody>
          </table>
        </div>
        <div class="pg">
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="pgPrev" onclick="changePage('cases',-1)">← Prev</button>
          <span id="pgInfo" style="flex:1;text-align:center"></span>
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="pgNext" onclick="changePage('cases',1)">Next →</button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: ALIGNERS ===== -->
    <div id="tab-aligners" style="display:none">
      <div class="filters-bar">
        <div class="fi-group"><div class="fi-label">🔍 Search</div><input class="fi" style="min-width:200px" type="text" id="aSearch" placeholder="Case #, patient, doctor..." oninput="applyAlignerFilters()"/></div>
        <div class="fi-group"><div class="fi-label">Order Type</div><select class="fi" id="aOrderType" onchange="applyAlignerFilters()"><option value="">All</option><option value="TreatmentPlan">Treatment Plan</option><option value="AlignersOrder">Aligners Order</option><option value="RefinementPlan">Refinement Plan</option><option value="RefinementOrder">Refinement Order</option></select></div>
        <div class="fi-group"><div class="fi-label">Package</div><select class="fi" id="aPackage" onchange="applyAlignerFilters()"><option value="">All</option></select></div>
        <button class="btn btn-ghost" style="padding:7px 12px;font-size:12px;align-self:flex-end" onclick="clearFilters('aligners')">✕ Clear</button>
      </div>
      <div class="card">
        <div class="card-title">🦷 Aligner Details <span style="font-size:11px;font-weight:500;color:var(--mu)" id="alignersCount"></span>
          <button class="btn btn-green" style="padding:7px 14px;font-size:12px" onclick="exportAlignersCSV()">⬇ Export CSV</button>
        </div>
        <div class="tw">
          <table>
            <thead><tr>
              <th class="sortable" onclick="sortAligners('case_number')">Case #</th>
              <th class="sortable" onclick="sortAligners('patient_name')">Patient</th>
              <th>Doctor</th>
              <th class="sortable" onclick="sortAligners('order_type')">Order Type</th>
              <th>Package</th>
              <th class="sortable" onclick="sortAligners('aligner_upper')">Upper</th>
              <th class="sortable" onclick="sortAligners('aligner_lower')">Lower</th>
              <th class="sortable" onclick="sortAligners('total')">Total</th>
            </tr></thead>
            <tbody id="alignersTbl"></tbody>
          </table>
        </div>
        <div class="pg">
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="alPrev" onclick="changePage('aligners',-1)">← Prev</button>
          <span id="alInfo" style="flex:1;text-align:center"></span>
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="alNext" onclick="changePage('aligners',1)">Next →</button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: HISTORY / SNAPSHOTS ===== -->
    <div id="tab-history" style="display:none">
      <div class="filters-bar">
        <div class="fi-group"><div class="fi-label">🔍 Search</div><input class="fi" type="text" id="hSearch" placeholder="Case #, patient, doctor..." oninput="applyHistoryFilters()"/></div>
        <div class="fi-group"><div class="fi-label">Status</div><select class="fi" id="hStatus" onchange="applyHistoryFilters()"><option value="">All</option></select></div>
        <div class="fi-group"><div class="fi-label">📅 Status Changed From</div><input class="fi" type="date" id="hSCFrom" onchange="applyHistoryFilters()"/></div>
        <div class="fi-group"><div class="fi-label">To</div><input class="fi" type="date" id="hSCTo" onchange="applyHistoryFilters()"/></div>
        <div class="fi-group"><div class="fi-label">🔄 Synced From</div><input class="fi" type="date" id="hFrom" onchange="applyHistoryFilters()"/></div>
        <div class="fi-group"><div class="fi-label">To</div><input class="fi" type="date" id="hTo" onchange="applyHistoryFilters()"/></div>
        <div class="fi-group"><div class="fi-label">Action Req.</div><select class="fi" id="hAction" onchange="applyHistoryFilters()"><option value="">All</option><option value="yes">⚠️ Yes</option><option value="no">✅ No</option></select></div>
        <button class="btn btn-ghost" style="padding:7px 12px;font-size:12px;align-self:flex-end" onclick="clearFilters('history')">✕ Clear</button>
      </div>
      <div class="card">
        <div class="card-title">
          <span>📸 Snapshots <span style="font-size:11px;font-weight:500;color:var(--mu)" id="histCount"></span></span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost" style="padding:7px 14px;font-size:12px" onclick="loadHistory()">↻ Load</button>
            <button class="btn btn-green" style="padding:7px 14px;font-size:12px" onclick="exportHistoryCSV()">⬇ Export CSV</button>
          </div>
        </div>
        <div style="font-size:12px;color:var(--mu);margin-bottom:12px;padding:10px 14px;background:var(--b50);border-radius:8px;border:1px solid var(--b100)">
          💡 Each row = one sync snapshot. Same case appears multiple times showing its evolution over time. Export CSV to see the full journey sorted by Case # and date.
        </div>
        <div class="tw">
          <table>
            <thead><tr>
              <th>Case #</th><th>Patient</th><th>Doctor</th><th>Clinic</th><th>Distributor</th>
              <th>Status</th><th>Status Changed</th>
              <th>Upper</th><th>Lower</th><th>Total</th><th>Package</th>
              <th>Action Req.</th><th>📅 Synced At</th>
            </tr></thead>
            <tbody id="histTbl"><tr><td colspan="13" style="text-align:center;padding:30px;color:var(--dim)">Click "↻ Load" to load snapshot history</td></tr></tbody>
          </table>
        </div>
        <div class="pg">
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="hPrev" onclick="changePage('history',-1)">← Prev</button>
          <span id="hInfo" style="flex:1;text-align:center"></span>
          <button class="btn btn-ghost" style="padding:5px 12px;font-size:11px" id="hNext" onclick="changePage('history',1)">Next →</button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: ANALYTICS ===== -->
    <div id="tab-analytics" style="display:none">
      <!-- Extra analytics KPIs -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
        <div class="kpi" style="border-top-color:var(--teal)"><div class="kpi-ico">🔢</div><div class="kpi-val" id="aTotalAl" style="color:var(--teal)">—</div><div class="kpi-lbl">Total Aligners Produced</div></div>
        <div class="kpi" style="border-top-color:var(--blue)"><div class="kpi-ico">📐</div><div class="kpi-val" id="aAvgAl" style="color:var(--blue)">—</div><div class="kpi-lbl">Avg Aligners / Case</div></div>
        <div class="kpi" style="border-top-color:var(--red)"><div class="kpi-ico">⚠️</div><div class="kpi-val" id="aAction" style="color:var(--red)">—</div><div class="kpi-lbl">Action Required</div></div>
        <div class="kpi" style="border-top-color:var(--amber)"><div class="kpi-ico">🔄</div><div class="kpi-val" id="aSnaps" style="color:var(--amber)">—</div><div class="kpi-lbl">Total Snapshots</div></div>
      </div>
      <div class="g2">
        <div class="card"><div class="card-title">📊 Status Breakdown</div><div id="statusBars"></div></div>
        <div class="card"><div class="card-title">🏥 Top Clinics</div><div id="clinicBars"></div></div>
      </div>
      <div class="g2">
        <div class="card"><div class="card-title">👨‍⚕️ Top Doctors by Cases</div><div id="doctorBars"></div></div>
        <div class="card"><div class="card-title">👨‍⚕️ Top Doctors by Aligners</div><div id="doctorAlBars"></div></div>
      </div>
      <div class="g2">
        <div class="card"><div class="card-title">📦 Package Types</div><div id="packageBars"></div></div>
        <div class="card"><div class="card-title">🌍 Distributors</div><div id="distBars"></div></div>
      </div>
      <div class="card"><div class="card-title">📅 Status Changes by Month</div><div id="monthBars"></div></div>
    </div>

    <!-- ===== TAB: SYNC LOG ===== -->
    <div id="tab-synclog" style="display:none">
      <div class="card">
        <div class="card-title">📜 Sync History <span style="font-size:11px;font-weight:500;color:var(--mu)" id="logCount"></span></div>
        <div class="tw">
          <table>
            <thead><tr>
              <th>Started</th><th>Type</th><th>Status</th>
              <th>Cases</th><th>New</th><th>Updated</th><th>Aligners</th><th>Duration</th><th>Error</th>
            </tr></thead>
            <tbody id="logTbl"></tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- CASE DETAIL MODAL -->
<div class="overlay" id="caseModal">
  <div class="modal">
    <div class="mo-hdr">
      <div><div style="font-size:18px;font-weight:800" id="moTitle">Case</div><div style="font-size:12px;color:var(--mu);margin-top:3px" id="moSub"></div></div>
      <button class="btn btn-ghost" style="padding:6px 12px" onclick="closeModal()">✕</button>
    </div>
    <div id="moBody"></div>
  </div>
</div>

<div id="notif" style="position:fixed;bottom:24px;right:24px;padding:13px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;display:none;box-shadow:var(--sh2)"></div>

<script type="module">
import{createClient}from'https://esm.sh/@supabase/supabase-js@2'
import{SUPABASE_CONFIG}from'./config.js'
const sb=createClient(SUPABASE_CONFIG.url,SUPABASE_CONFIG.anonKey)

const $=id=>document.getElementById(id)
const ntf=(msg,ok=true)=>{const e=$('notif');e.textContent=msg;e.style.cssText=`position:fixed;bottom:24px;right:24px;padding:13px 20px;border-radius:12px;font-size:13px;font-weight:600;z-index:9999;display:block;box-shadow:0 6px 24px rgba(0,0,0,.09);background:${ok?'#f0fdf4':'#fff1f2'};color:${ok?'#15803d':'#dc2626'};border:1px solid ${ok?'#bbf7d0':'#fecdd3'}`;clearTimeout(e._t);e._t=setTimeout(()=>e.style.display='none',4500)}

// Date helpers — Bloom uses DD.MM.YYYY
const parseB=s=>{if(!s)return null;const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);return m?new Date(+m[3],+m[2]-1,+m[1]):new Date(s)}
const toISO=s=>{if(!s)return null;const m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:s}
const fmtD=v=>{if(!v)return'—';const d=parseB(v)||new Date(v);if(isNaN(d))return v;return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
const fdt=v=>{if(!v)return'—';const d=new Date(v),now=new Date(),diff=Math.floor((now-d)/1000);if(diff<60)return diff+'s ago';if(diff<3600)return Math.floor(diff/60)+'m ago';if(diff<86400)return Math.floor(diff/3600)+'h ago';return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
const fmt=v=>v?new Date(v).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):'—'
const fmtDT=v=>v?new Date(v).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—'
const cl=s=>(s||'').replace(/_/g,' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())

const SC={
  ALIGNERS_RECEIVED:'#16a34a',REFINEMENT_ALIGNERS_RECEIVED:'#16a34a',RETAINER_ALIGNERS_RECEIVED:'#16a34a',REPLACEMENT_ALIGNERS_RECEIVED:'#16a34a',
  ALIGNERS_ORDER_CREATED:'#3b5fe2',REFINEMENT_ORDER_CREATED:'#3b5fe2',RETAINER_ORDER_READY_TO_PRINT:'#3b5fe2',REPLACEMENT_ORDER_READY_TO_PRINT:'#3b5fe2',
  ORDER_IS_PRINTED:'#d97706',REFINEMENT_ORDER_IS_PRINTED:'#d97706',ALIGNERS_ARE_MADE:'#d97706',RETAINER_ALIGNERS_ARE_MADE:'#d97706',
  PLAN_WITH_BLOOM_ADDED:'#7c3aed',PLAN_WITH_BLOOM_PROCESSED:'#7c3aed',PLAN_WITH_BLOOM_CONFIRMED:'#7c3aed',PLAN_WITH_BLOOM_CONFIRMATION_PROCESSED:'#7c3aed',
  REFINEMENT_PLAN_ADDED:'#7c3aed',REFINEMENT_PLAN_PROCESSED:'#7c3aed',TREATMENT_ASSESSMENT_PERFORMED:'#0d9488',DRAFT:'#94a3b8',
  TREATMENT_PLAN_DECLINED_DOCTOR:'#dc2626',TREATMENT_PLAN_DECLINED_OBSERVER:'#dc2626',
  REFINEMENT_PLAN_DECLINED_DOCTOR:'#dc2626',REFINEMENT_PLAN_DECLINED_OBSERVER:'#dc2626',
}
const sc=s=>SC[s]||'#94a3b8'

// ── STATE ──────────────────────────────────────────────────────────────
let allCases=[], allAligners=[], alignerMap={}, snapshots=[], filteredSnaps=[]
let filteredCases=[], filteredAligners=[]
let casePage=0, alPage=0, hPage=0
const PAGE=50

// Sort state
let cSort={col:'case_id',dir:'desc'}, alSort={col:'case_number',dir:'desc'}

function bars(data,total,color='var(--blue)',limit=15){
  const sorted=Object.entries(data).sort((a,b)=>b[1]-a[1]).slice(0,limit)
  const max=sorted[0]?.[1]||1
  if(!sorted.length)return'<div style="color:var(--dim);font-size:12px;padding:10px">No data</div>'
  return sorted.map(([lbl,cnt])=>`<div class="srow">
    <div class="slbl" title="${lbl}">${lbl}</div>
    <div class="sbg"><div class="sfill" style="width:${Math.round(cnt/max*100)}%;background:${color}"></div></div>
    <div class="scnt" style="color:${color}">${cnt.toLocaleString()}</div>
    <div class="spct">${Math.round(cnt/(total||1)*100)}%</div>
  </div>`).join('')
}

// ── LOAD ALL ───────────────────────────────────────────────────────────
async function loadAll(){
  try{
    const[{data:cases,count:total},{data:aligData,count:alTotal},{data:logs},{count:snapCount}]=await Promise.all([
      sb.from('bloom_cases').select('*',{count:'exact'}).order('case_id',{ascending:false}).limit(20000),
      sb.from('bloom_aligner_details').select('*',{count:'exact'}).order('case_number',{ascending:false}).limit(50000),
      sb.from('bloom_sync_log').select('*').order('started_at',{ascending:false}).limit(50),
      sb.from('bloom_case_snapshots').select('*',{count:'exact',head:true})
    ])

    allCases=cases||[]
    allAligners=aligData||[]

    // Aligner map
    alignerMap={}
    allAligners.forEach(a=>{
      const k=String(a.case_number)
      if(!alignerMap[k])alignerMap[k]=[]
      alignerMap[k].push(a)
    })

    // Populate dropdowns
    const statuses=[...new Set(allCases.map(c=>c.current_status).filter(Boolean))].sort()
    const dists=[...new Set(allCases.map(c=>c.distributor).filter(Boolean))].sort()
    $('fStatus').innerHTML='<option value="">All</option>'+statuses.map(s=>`<option value="${s}">${cl(s)}</option>`).join('')
    $('fDist').innerHTML='<option value="">All</option>'+dists.map(d=>`<option value="${d}">${d}</option>`).join('')
    $('hStatus').innerHTML='<option value="">All</option>'+statuses.map(s=>`<option value="${s}">${cl(s)}</option>`).join('')

    // KPIs
    const smap={}
    allCases.forEach(c=>{smap[c.current_status]=(smap[c.current_status]||0)+1})
    const received=['ALIGNERS_RECEIVED','REFINEMENT_ALIGNERS_RECEIVED','RETAINER_ALIGNERS_RECEIVED','REPLACEMENT_ALIGNERS_RECEIVED'].reduce((a,k)=>a+(smap[k]||0),0)
    const inProd=['ORDER_IS_PRINTED','REFINEMENT_ORDER_IS_PRINTED','ALIGNERS_ARE_MADE','ALIGNERS_ORDER_CREATED','REFINEMENT_ORDER_CREATED'].reduce((a,k)=>a+(smap[k]||0),0)
    const planning=['PLAN_WITH_BLOOM_ADDED','PLAN_WITH_BLOOM_PROCESSED','PLAN_WITH_BLOOM_CONFIRMED','REFINEMENT_PLAN_ADDED','REFINEMENT_PLAN_PROCESSED'].reduce((a,k)=>a+(smap[k]||0),0)
    $('kTotal').textContent=(total||0).toLocaleString();$('sBTotal').textContent=(total||0).toLocaleString()
    $('kReceived').textContent=received.toLocaleString();$('kProd').textContent=inProd.toLocaleString()
    $('kPlan').textContent=planning.toLocaleString();$('kDraft').textContent=(smap['DRAFT']||0).toLocaleString()
    $('kAligners').textContent=(alTotal||0).toLocaleString();$('sBAligns').textContent=(alTotal||0).toLocaleString()
    $('sBSnaps').textContent=(snapCount||0).toLocaleString()

    // Analytics extra KPIs
    let totalAlSum=0,caseAlCount=0
    allCases.forEach(c=>{
      const als=alignerMap[String(c.case_id)]||[]
      const tot=als.reduce((a,r)=>a+(Number(r.number_of_aligners)||0),0)||(als.reduce((a,r)=>a+(Number(r.aligner_upper)||0)+(Number(r.aligner_lower)||0),0))
      if(tot>0){totalAlSum+=tot;caseAlCount++}
    })
    $('aTotalAl').textContent=totalAlSum.toLocaleString()
    $('aAvgAl').textContent=caseAlCount>0?Math.round(totalAlSum/caseAlCount).toString():'—'
    $('aAction').textContent=allCases.filter(c=>c.action_required_for).length.toLocaleString()
    $('aSnaps').textContent=(snapCount||0).toLocaleString()

    // Sync status
    const lastOk=(logs||[]).find(l=>l.status==='success')
    const isRunning=(logs||[])[0]?.status==='running'
    if(isRunning){$('syncDot').className='sync-dot running';$('syncTxt').textContent='🔄 Sync running...';$('liveTxt').textContent='Syncing';$('sBLast').textContent='Now'}
    else if(lastOk){
      $('syncDot').className='sync-dot ok'
      $('syncTxt').textContent='✅ Auto-sync active — every minute'
      $('syncMeta').textContent='Last: '+fdt(lastOk.completed_at)+' · '+lastOk.cases_fetched.toLocaleString()+' cases · '+lastOk.aligners_fetched+' aligners'
      $('liveTxt').textContent='Live · '+fdt(lastOk.completed_at)
      $('sBLast').textContent=fdt(lastOk.completed_at)
    } else {$('syncDot').className='sync-dot err';$('syncTxt').textContent='⚠️ Check sync log';$('liveTxt').textContent='Error'}

    renderAnalytics(smap,total||0)
    renderLog(logs||[])
    applyFilters()
    renderAligners()
  }catch(e){console.error(e);ntf('Error: '+e.message,false)}
}

// ── FILTER CASES ───────────────────────────────────────────────────────
function applyFilters(){
  casePage=0
  const q=($('fSearch').value||'').toLowerCase().trim()
  const sf=$('fStatus').value
  const sfrom=$('fStatusFrom').value
  const sto=$('fStatusTo').value
  const syFrom=$('fSyncFrom').value
  const syTo=$('fSyncTo').value
  const dist=$('fDist').value
  const action=$('fAction').value

  filteredCases=allCases.filter(c=>{
    if(q){const hay=[c.case_id,c.patient_name,c.doctor,c.clinic,c.distributor,c.current_status].join(' ').toLowerCase();if(!hay.includes(q))return false}
    if(sf&&c.current_status!==sf)return false
    if(dist&&c.distributor!==dist)return false
    if(action==='yes'&&!c.action_required_for)return false
    if(action==='no'&&c.action_required_for)return false
    if(sfrom||sto){const iso=toISO(c.status_change_date);if(!iso)return false;if(sfrom&&iso<sfrom)return false;if(sto&&iso>sto)return false}
    if(syFrom||syTo){const d=c.last_synced_at?c.last_synced_at.substring(0,10):null;if(!d)return false;if(syFrom&&d<syFrom)return false;if(syTo&&d>syTo)return false}
    return true
  })

  // Sort
  filteredCases.sort((a,b)=>sortCompare(a,b,cSort.col,cSort.dir,'cases'))

  // Tags
  const tags=[]
  if(q)tags.push(`"${q}"`)
  if(sf)tags.push(cl(sf))
  if(sfrom||sto)tags.push(`Status: ${sfrom||'*'}→${sto||'*'}`)
  if(syFrom||syTo)tags.push(`Synced: ${syFrom||'*'}→${syTo||'*'}`)
  if(dist)tags.push(dist)
  if(action==='yes')tags.push('Action Req.')
  if(action==='no')tags.push('No Action')
  $('caseTags').innerHTML=tags.map(t=>`<div class="ftag">${t}<button onclick="clearFilters('cases')">✕</button></div>`).join('')
  renderCasesPage()
}

function sortCompare(a,b,col,dir,type){
  let va,vb
  if(type==='cases'){
    if(col==='case_id'){va=+a.case_id||0;vb=+b.case_id||0}
    else if(col==='patient_name'){va=a.patient_name||'';vb=b.patient_name||''}
    else if(col==='doctor'){va=a.doctor||'';vb=b.doctor||''}
    else if(col==='current_status'){va=a.current_status||'';vb=b.current_status||''}
    else if(col==='status_change_date'){va=toISO(a.status_change_date)||'';vb=toISO(b.status_change_date)||''}
    else if(col==='last_synced_at'){va=a.last_synced_at||'';vb=b.last_synced_at||''}
    else if(col==='total_aligners'){
      const aa=alignerMap[String(a.case_id)]||[];const ba=alignerMap[String(b.case_id)]||[]
      va=aa.reduce((x,r)=>x+(Number(r.number_of_aligners)||0),0)||(aa.reduce((x,r)=>x+(Number(r.aligner_upper)||0)+(Number(r.aligner_lower)||0),0))
      vb=ba.reduce((x,r)=>x+(Number(r.number_of_aligners)||0),0)||(ba.reduce((x,r)=>x+(Number(r.aligner_upper)||0)+(Number(r.aligner_lower)||0),0))
    }
    else if(col==='upper'){const aa=alignerMap[String(a.case_id)]||[];const ba=alignerMap[String(b.case_id)]||[];va=aa.reduce((x,r)=>x+(Number(r.aligner_upper)||0),0);vb=ba.reduce((x,r)=>x+(Number(r.aligner_upper)||0),0)}
    else if(col==='lower'){const aa=alignerMap[String(a.case_id)]||[];const ba=alignerMap[String(b.case_id)]||[];va=aa.reduce((x,r)=>x+(Number(r.aligner_lower)||0),0);vb=ba.reduce((x,r)=>x+(Number(r.aligner_lower)||0),0)}
    else{va=a[col]||'';vb=b[col]||''}
  } else {
    if(col==='case_number'){va=+a.case_number||0;vb=+b.case_number||0}
    else if(col==='aligner_upper'){va=Number(a.aligner_upper)||0;vb=Number(b.aligner_upper)||0}
    else if(col==='aligner_lower'){va=Number(a.aligner_lower)||0;vb=Number(b.aligner_lower)||0}
    else if(col==='total'){va=Number(a.number_of_aligners)||(Number(a.aligner_upper||0)+Number(a.aligner_lower||0));vb=Number(b.number_of_aligners)||(Number(b.aligner_upper||0)+Number(b.aligner_lower||0))}
    else{va=a[col]||'';vb=b[col]||''}
  }
  const cmp=typeof va==='number'?va-vb:String(va).localeCompare(String(vb))
  return dir==='asc'?cmp:-cmp
}

function updateSortHeaders(tableId,sortState){
  document.querySelectorAll(`#${tableId} th.sortable`).forEach(th=>{th.classList.remove('sort-asc','sort-desc')})
}

window.sortCases=col=>{
  if(cSort.col===col)cSort.dir=cSort.dir==='asc'?'desc':'asc';else{cSort={col,dir:col==='case_id'?'desc':'asc'}}
  // Update header arrows
  document.querySelectorAll('#casesTable th.sortable').forEach(th=>{th.classList.remove('sort-asc','sort-desc')})
  const ths=document.querySelectorAll('#casesTable th.sortable')
  const cols=['case_id','patient_name','doctor','current_status','status_change_date','last_synced_at','total_aligners','upper','lower']
  ths.forEach((th,i)=>{if(cols[i]===col)th.classList.add(cSort.dir==='asc'?'sort-asc':'sort-desc')})
  applyFilters()
}



function renderCasesPage(){
  const total=filteredCases.length
  const slice=filteredCases.slice(casePage*PAGE,(casePage+1)*PAGE)
  $('casesCount').textContent=total.toLocaleString()+' cases'
  $('pgInfo').textContent=`Page ${casePage+1}/${Math.max(1,Math.ceil(total/PAGE))} · ${total.toLocaleString()} total`
  $('pgPrev').disabled=casePage===0;$('pgNext').disabled=(casePage+1)*PAGE>=total
  $('casesTbl').innerHTML=slice.map(c=>{
    const color=sc(c.current_status)
    const als=alignerMap[String(c.case_id)]||[]
    const tp=als.find(r=>r.order_type==='TreatmentPlan')||als.find(r=>r.aligner_upper||r.aligner_lower)
    const totalU=tp?Number(tp.aligner_upper)||0:0
    const totalL=tp?Number(tp.aligner_lower)||0:0
    const totalAl=tp?(Number(tp.number_of_aligners)||((totalU+totalL)))||null:null
    const pkg=[...new Set(als.map(a=>a.package_type).filter(Boolean))].join(', ')
    return`<tr style="cursor:pointer" onclick="openCase('${c.case_id}')">
      <td class="mono" style="font-weight:700;color:var(--blue)">#${c.case_id}</td>
      <td style="font-weight:600;white-space:nowrap">${c.patient_name||'—'}</td>
      <td style="color:var(--mu);font-size:11px;white-space:nowrap">${c.doctor||'—'}</td>
      <td style="font-size:11px">${c.clinic||'—'}</td>
      <td style="font-size:11px">${c.distributor||'—'}</td>
      <td><span class="bdg" style="background:${color}22;color:${color};white-space:nowrap;font-size:9px">${(c.current_status||'').replace(/_/g,' ')}</span></td>
      <td class="mono" style="color:var(--amber);white-space:nowrap">${fmtD(c.status_change_date)}</td>
      <td style="font-size:11px;color:var(--dim);white-space:nowrap">${fdt(c.last_synced_at)}</td>
      <td class="mono" style="font-weight:800;color:var(--teal);text-align:center">${totalAl||'—'}</td>
      <td class="mono" style="color:var(--blue);text-align:center">${totalU||'—'}</td>
      <td class="mono" style="color:var(--purple);text-align:center">${totalL||'—'}</td>
      <td style="font-size:11px;color:var(--mu)">${pkg||'—'}</td>
      <td style="font-size:11px;color:${c.action_required_for?'var(--red)':'var(--dim)'}">${c.action_required_for?'⚠️ '+c.action_required_for:'—'}</td>
      <td class="mono" style="text-align:center">${c.number_of_extra_refinements||'—'}</td>
      <td><button class="btn btn-ghost" style="padding:3px 9px;font-size:11px" onclick="event.stopPropagation();openCase('${c.case_id}')">👁</button></td>
    </tr>`
  }).join('')||'<tr><td colspan="15" style="text-align:center;padding:30px;color:var(--dim)">No cases match filters</td></tr>'
}

function applyAlignerFilters(){
  alPage=0
  const q=($('aSearch').value||'').toLowerCase().trim()
  const ot=$('aOrderType').value
  const pkg=$('aPackage').value

  // Build flat list: one row per aligner record OR one row per case with no aligners
  const rows=[]
  allCases.forEach(c=>{
    const als=alignerMap[String(c.case_id)]||[]
    if(als.length===0){
      // Case with no aligner records — show as empty row
      rows.push({_case:c,_noAligners:true,case_number:String(c.case_id),order_type:'',package_type:''})
    } else {
      als.forEach(a=>rows.push({...a,_case:c,case_number:String(c.case_id)}))
    }
  })

  filteredAligners=rows.filter(a=>{
    if(q){
      const hay=[a.case_number,a._case?.patient_name||'',a._case?.doctor||'',a.order_type||'',a.package_type||''].join(' ').toLowerCase()
      if(!hay.includes(q))return false
    }
    if(ot&&a.order_type!==ot)return false
    if(pkg&&a.package_type!==pkg)return false
    return true
  })
  filteredAligners.sort((a,b)=>{
    let va=+a.case_number||0,vb=+b.case_number||0
    return alSort.dir==='asc'?va-vb:vb-va
  })
  const cases=[...new Set(filteredAligners.map(a=>a.case_number))].length
  $('alignersCount').textContent=filteredAligners.length.toLocaleString()+' records · '+cases.toLocaleString()+' cases'
  renderAlignersPage()
}

function renderAligners(){
  // Populate package dropdown
  const pkgs=[...new Set(allAligners.map(a=>a.package_type).filter(Boolean))].sort()
  $('aPackage').innerHTML='<option value="">All</option>'+pkgs.map(p=>`<option value="${p}">${p}</option>`).join('')
  filteredAligners=[...allAligners]
  filteredAligners.sort((a,b)=>{
    let va,vb
    const col=alSort.col,dir=alSort.dir
    if(col==='case_number'){va=+a.case_number||0;vb=+b.case_number||0}
    else if(col==='patient_name'){
      const ca=allCases.find(x=>String(x.case_id)===String(a.case_number))
      const cb=allCases.find(x=>String(x.case_id)===String(b.case_number))
      va=ca?.patient_name||'';vb=cb?.patient_name||''
    }
    else if(col==='order_type'){va=a.order_type||'';vb=b.order_type||''}
    else if(col==='aligner_upper'){va=Number(a.aligner_upper)||0;vb=Number(b.aligner_upper)||0}
    else if(col==='aligner_lower'){va=Number(a.aligner_lower)||0;vb=Number(b.aligner_lower)||0}
    else if(col==='total'){
      va=Number(a.number_of_aligners)||(Number(a.aligner_upper||0)+Number(a.aligner_lower||0))
      vb=Number(b.number_of_aligners)||(Number(b.aligner_upper||0)+Number(b.aligner_lower||0))
    }
    else{va=a[col]||'';vb=b[col]||''}
    const cmp=typeof va==='number'?va-vb:String(va).localeCompare(String(vb))
    return dir==='asc'?cmp:-cmp
  })
  applyAlignerFilters()
}

window.sortAligners=col=>{
  if(alSort.col===col)alSort.dir=alSort.dir==='asc'?'desc':'asc'
  else alSort={col,dir:'desc'}
  applyAlignerFilters()
}

function renderAlignersPage(){
  const total=filteredAligners.length
  const slice=filteredAligners.slice(alPage*PAGE,(alPage+1)*PAGE)
  $('alInfo').textContent=`Page ${alPage+1}/${Math.max(1,Math.ceil(total/PAGE))} · ${total.toLocaleString()} records`
  $('alPrev').disabled=alPage===0;$('alNext').disabled=(alPage+1)*PAGE>=total
  $('alignersTbl').innerHTML=slice.map(a=>{
    const c=a._case||allCases.find(x=>String(x.case_id)===String(a.case_number))
    const tot=Number(a.number_of_aligners)||(Number(a.aligner_upper||0)+Number(a.aligner_lower||0))
    const tColor=a.order_type==='TreatmentPlan'?'b-b':a.order_type==='AlignersOrder'?'b-g':a.order_type==='RefinementPlan'?'b-p':a.order_type==='RefinementOrder'?'b-a':'b-gray'
    const noData=a._noAligners
    return`<tr style="cursor:pointer;${noData?'opacity:0.6':''}" onclick="openCase('${a.case_number}')">
      <td class="mono" style="font-weight:700;color:var(--blue)">#${a.case_number}</td>
      <td style="font-weight:600;white-space:nowrap">${c?.patient_name||'—'}</td>
      <td style="color:var(--mu);font-size:11px;white-space:nowrap">${c?.doctor||'—'}</td>
      <td>${noData?'<span class="bdg b-gray">No orders yet</span>':`<span class="bdg ${tColor}">${a.order_type}</span>`}</td>
      <td style="font-size:11px;color:var(--mu)">${a.package_type||'—'}</td>
      <td class="mono" style="font-weight:700;color:var(--blue);text-align:center">${a.aligner_upper!=null?a.aligner_upper:'—'}</td>
      <td class="mono" style="font-weight:700;color:var(--purple);text-align:center">${a.aligner_lower!=null?a.aligner_lower:'—'}</td>
      <td class="mono" style="font-weight:800;color:var(--teal);text-align:center">${tot||'—'}</td>
    </tr>`
  }).join('')||'<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--dim)">No data</td></tr>'
}

// ── HISTORY / SNAPSHOTS ───────────────────────────────────────────────
async function loadHistory(){
  $('histTbl').innerHTML='<tr><td colspan="13" style="text-align:center;padding:20px;color:var(--dim)">Loading snapshots...</td></tr>'
  try{
    const{data,count}=await sb.from('bloom_case_snapshots').select('*',{count:'exact'}).order('case_id',{ascending:false}).order('synced_at',{ascending:false}).limit(5000)
    snapshots=data||[]
    $('histCount').textContent=(count||0).toLocaleString()+' snapshots'
    applyHistoryFilters()
  }catch(e){ntf('Error loading history: '+e.message,false)}
}

function applyHistoryFilters(){
  hPage=0
  const q=($('hSearch').value||'').toLowerCase().trim()
  const sf=$('hStatus').value
  const hf=$('hFrom').value
  const ht=$('hTo').value
  const scf=$('hSCFrom').value
  const sct=$('hSCTo').value
  const action=$('hAction').value
  filteredSnaps=snapshots.filter(s=>{
    if(q){const hay=[s.case_id,s.patient_name,s.doctor,s.clinic,s.distributor].join(' ').toLowerCase();if(!hay.includes(q))return false}
    if(sf&&s.current_status!==sf)return false
    if(action==='yes'&&!s.action_required_for)return false
    if(action==='no'&&s.action_required_for)return false
    if(hf||ht){const d=s.synced_at?s.synced_at.substring(0,10):null;if(!d)return false;if(hf&&d<hf)return false;if(ht&&d>ht)return false}
    if(scf||sct){const iso=toISO(s.status_change_date);if(!iso)return false;if(scf&&iso<scf)return false;if(sct&&iso>sct)return false}
    return true
  })
  renderHistoryPage()
}

function renderHistoryPage(){
  const total=filteredSnaps.length
  const slice=filteredSnaps.slice(hPage*PAGE,(hPage+1)*PAGE)
  $('histCount').textContent=total.toLocaleString()+' records'
  $('hInfo').textContent=`Page ${hPage+1}/${Math.max(1,Math.ceil(total/PAGE))} · ${total.toLocaleString()} total`
  $('hPrev').disabled=hPage===0;$('hNext').disabled=(hPage+1)*PAGE>=total
  $('histTbl').innerHTML=slice.map(s=>{
    const color=sc(s.current_status)
    return`<tr>
      <td class="mono" style="font-weight:700;color:var(--blue)">#${s.case_id}</td>
      <td style="font-weight:600;white-space:nowrap">${s.patient_name||'—'}</td>
      <td style="font-size:11px;color:var(--mu)">${s.doctor||'—'}</td>
      <td style="font-size:11px">${s.clinic||'—'}</td>
      <td style="font-size:11px">${s.distributor||'—'}</td>
      <td><span class="bdg" style="background:${color}22;color:${color};font-size:9px;white-space:nowrap">${(s.current_status||'').replace(/_/g,' ')}</span></td>
      <td class="mono" style="color:var(--amber)">${fmtD(s.status_change_date)}</td>
      <td class="mono" style="color:var(--blue);text-align:center">${s.aligner_upper!=null?s.aligner_upper:'—'}</td>
      <td class="mono" style="color:var(--purple);text-align:center">${s.aligner_lower!=null?s.aligner_lower:'—'}</td>
      <td class="mono" style="font-weight:800;color:var(--teal);text-align:center">${s.total_aligners||'—'}</td>
      <td style="font-size:11px;color:var(--mu)">${s.package_type||'—'}</td>
      <td style="font-size:11px;color:${s.action_required_for?'var(--red)':'var(--dim)'}">${s.action_required_for?'⚠️ '+s.action_required_for:'—'}</td>
      <td class="mono" style="font-size:11px;color:var(--mu);white-space:nowrap">${fmtDT(s.synced_at)}</td>
    </tr>`
  }).join('')||'<tr><td colspan="13" style="text-align:center;padding:20px;color:var(--dim)">No records found</td></tr>'
}

// ── ANALYTICS ─────────────────────────────────────────────────────────
function renderAnalytics(smap,total){
  $('statusBars').innerHTML=bars(smap,total)
  const clinicMap={};allCases.forEach(c=>{if(c.clinic)clinicMap[c.clinic]=(clinicMap[c.clinic]||0)+1})
  $('clinicBars').innerHTML=bars(clinicMap,total,'var(--teal)')
  const docMap={};allCases.forEach(c=>{if(c.doctor)docMap[c.doctor]=(docMap[c.doctor]||0)+1})
  $('doctorBars').innerHTML=bars(docMap,total,'var(--purple)')
  // Doctors by aligner count
  const docAlMap={}
  allCases.forEach(c=>{
    if(!c.doctor)return
    const als=alignerMap[String(c.case_id)]||[]
    const tot=als.reduce((a,r)=>a+(Number(r.number_of_aligners)||0),0)||(als.reduce((a,r)=>a+(Number(r.aligner_upper)||0)+(Number(r.aligner_lower)||0),0))
    docAlMap[c.doctor]=(docAlMap[c.doctor]||0)+tot
  })
  const totalDocAl=Object.values(docAlMap).reduce((a,v)=>a+v,0)
  $('doctorAlBars').innerHTML=bars(docAlMap,totalDocAl,'var(--teal)')
  const pkgMap={};allAligners.forEach(a=>{if(a.package_type)pkgMap[a.package_type]=(pkgMap[a.package_type]||0)+1})
  $('packageBars').innerHTML=bars(pkgMap,allAligners.length,'var(--blue)')
  const distMap={};allCases.forEach(c=>{if(c.distributor)distMap[c.distributor]=(distMap[c.distributor]||0)+1})
  $('distBars').innerHTML=bars(distMap,total,'var(--amber)')
  // Month from status_change_date
  const monthMap={}
  allCases.forEach(c=>{if(!c.status_change_date)return;const iso=toISO(c.status_change_date);if(!iso)return;const ym=iso.substring(0,7);monthMap[ym]=(monthMap[ym]||0)+1})
  const sortedM=Object.entries(monthMap).sort((a,b)=>a[0].localeCompare(b[0]))
  const maxM=sortedM.reduce((a,[,v])=>Math.max(a,v),1)
  $('monthBars').innerHTML=sortedM.map(([ym,cnt])=>`<div class="srow">
    <div class="slbl">${ym}</div>
    <div class="sbg"><div class="sfill" style="width:${Math.round(cnt/maxM*100)}%;background:var(--amber)"></div></div>
    <div class="scnt" style="color:var(--amber)">${cnt}</div>
    <div class="spct">${Math.round(cnt/total*100)}%</div>
  </div>`).join('')||'<div style="color:var(--dim);font-size:12px;padding:10px">No date data available</div>'
}

// ── SYNC LOG ──────────────────────────────────────────────────────────
function renderLog(logs){
  $('logCount').textContent=logs.length+' records'
  $('logTbl').innerHTML=logs.map(l=>{
    const cls=l.status==='success'?'b-g':l.status==='running'?'b-a':'b-r'
    const lbl=l.status==='success'?'✅ Success':l.status==='running'?'⏳ Running':'❌ Error'
    const dur=l.completed_at&&l.started_at?Math.round((new Date(l.completed_at)-new Date(l.started_at))/1000)+'s':'—'
    return`<tr>
      <td class="mono" style="font-size:11px">${fmt(l.started_at)}</td>
      <td><span class="bdg b-b">${l.sync_type}</span></td>
      <td><span class="bdg ${cls}">${lbl}</span></td>
      <td class="mono">${(l.cases_fetched||0).toLocaleString()}</td>
      <td class="mono" style="color:var(--green)">${l.cases_new||0}</td>
      <td class="mono" style="color:var(--blue)">${l.cases_updated||0}</td>
      <td class="mono">${l.aligners_fetched||0}</td>
      <td class="mono">${dur}</td>
      <td style="font-size:11px;color:var(--red);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${l.error_message||''}">${l.error_message||''}</td>
    </tr>`
  }).join('')||'<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--dim)">No logs</td></tr>'
}

// ── CASE DETAIL MODAL ─────────────────────────────────────────────────
window.openCase=async caseId=>{
  const c=allCases.find(x=>String(x.case_id)===String(caseId))
  if(!c)return
  const als=alignerMap[String(caseId)]||[]
  const color=sc(c.current_status)
  $('moTitle').textContent='Case #'+c.case_id
  $('moSub').textContent=(c.patient_name||'')+(c.doctor?' · '+c.doctor:'')
  // Load snapshots for this case
  const{data:snaps}=await sb.from('bloom_case_snapshots').select('*').eq('case_id',String(caseId)).order('synced_at',{ascending:false}).limit(100)
  const snapList=snaps||[]
  $('moBody').innerHTML=`
    <div style="background:${color}15;border:1px solid ${color}40;border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></div>
      <div style="font-size:13px;font-weight:700;color:${color}">${cl(c.current_status)}</div>
      ${c.status_change_date?`<div style="font-size:11px;color:var(--amber);background:var(--a50);padding:3px 10px;border-radius:999px">📅 ${fmtD(c.status_change_date)}</div>`:''}
      ${c.action_required_for?`<div style="font-size:11px;font-weight:700;color:var(--red);background:var(--r50);padding:3px 10px;border-radius:999px;margin-left:auto">⚠️ ${c.action_required_for}</div>`:''}
    </div>
    <div class="detail-grid">
      <div class="di"><div class="dl">Patient</div><div class="dv">${c.patient_name||'—'}</div></div>
      <div class="di"><div class="dl">Doctor</div><div class="dv">${c.doctor||'—'}</div></div>
      <div class="di"><div class="dl">Clinic</div><div class="dv">${c.clinic||'—'}</div></div>
      <div class="di"><div class="dl">Distributor</div><div class="dv">${c.distributor||'—'}</div></div>
      <div class="di"><div class="dl">Status Changed</div><div class="dv" style="color:var(--amber)">${fmtD(c.status_change_date)}</div></div>
      <div class="di"><div class="dl">Last Synced</div><div class="dv" style="font-size:12px">${fdt(c.last_synced_at)}</div></div>
      ${c.number_of_extra_refinements?`<div class="di"><div class="dl">Extra Refinements</div><div class="dv">${c.number_of_extra_refinements}</div></div>`:''}
      ${c.overdue_for?`<div class="di" style="border:1px solid var(--r100)"><div class="dl" style="color:var(--red)">Overdue</div><div class="dv" style="color:var(--red)">${c.overdue_for}</div></div>`:''}
    </div>
    ${als.length?`<div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">🦷 Aligner Orders (${als.length})</div>`:''}
    ${als.map(a=>{const tot=Number(a.number_of_aligners)||(Number(a.aligner_upper||0)+Number(a.aligner_lower||0));return`<div style="background:var(--b50);border:1px solid var(--b100);border-radius:10px;padding:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-weight:700;color:var(--blue)">${a.order_type||'—'}</span>
        <span style="background:#f1f5f9;color:var(--mu);font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px">${a.package_type||'—'}</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
        <div><div style="color:var(--mu);font-size:10px">UPPER</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--blue)">${a.aligner_upper!=null?a.aligner_upper:'—'}</div></div>
        <div><div style="color:var(--mu);font-size:10px">LOWER</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--purple)">${a.aligner_lower!=null?a.aligner_lower:'—'}</div></div>
        <div><div style="color:var(--mu);font-size:10px">TOTAL</div><div style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--teal)">${tot||'—'}</div></div>
      </div>
    </div>`}).join('')}
    ${als.length===0?'<div style="color:var(--dim);font-size:12px;text-align:center;padding:16px;background:var(--bg);border-radius:10px">No aligner records yet</div>':''}
    ${snapList.length>0?`
    <div style="font-size:12px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.5px;margin:16px 0 10px">📸 Case Evolution (${snapList.length} snapshots)</div>
    <div class="timeline">
      ${snapList.map((s,i)=>{const col=sc(s.current_status);return`<div class="tl-item${i===0?' latest':''}">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
          <span class="bdg" style="background:${col}22;color:${col};font-size:10px">${(s.current_status||'').replace(/_/g,' ')}</span>
          <span style="font-size:11px;color:var(--mu)">${fmtDT(s.synced_at)}</span>
        </div>
        <div style="display:flex;gap:16px;margin-top:6px;font-size:11px;color:var(--mu);flex-wrap:wrap">
          ${s.status_change_date?`<span>📅 Changed: <strong style="color:var(--amber)">${fmtD(s.status_change_date)}</strong></span>`:''}
          ${s.total_aligners?`<span>🦷 <strong style="color:var(--teal)">${s.total_aligners}</strong> aligners</span>`:''}
          ${s.aligner_upper?`<span>↑ <strong>${s.aligner_upper}</strong> upper</span>`:''}
          ${s.aligner_lower?`<span>↓ <strong>${s.aligner_lower}</strong> lower</span>`:''}
          ${s.package_type?`<span>📦 ${s.package_type}</span>`:''}
        </div>
      </div>`}).join('')}
    </div>`:`<div style="color:var(--dim);font-size:12px;text-align:center;padding:12px;background:var(--bg);border-radius:10px;margin-top:16px">No evolution history yet — snapshots are saved each sync</div>`}
  `
  $('caseModal').classList.add('on')
}
window.closeModal=()=>$('caseModal').classList.remove('on')
$('caseModal').addEventListener('click',e=>{if(e.target===$('caseModal'))closeModal()})

// ── EXPORTS ────────────────────────────────────────────────────────────
const csv=(rows,headers)=>{const r=[headers.join(','),...rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(','))].join('\n');const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(r);return a}

window.exportCasesCSV=()=>{
  const headers=['Case #','Patient','Doctor','Clinic','Distributor','Status','Status Changed','Last Synced','Total Aligners','Upper','Lower','Package','Action Required','Refinements']
  const rows=filteredCases.map(c=>{
    const als=alignerMap[String(c.case_id)]||[]
    const u=als.reduce((a,r)=>a+(Number(r.aligner_upper)||0),0)
    const l=als.reduce((a,r)=>a+(Number(r.aligner_lower)||0),0)
    const t=als.reduce((a,r)=>a+(Number(r.number_of_aligners)||0),0)||(u+l)||''
    const pkg=[...new Set(als.map(a=>a.package_type).filter(Boolean))].join('; ')
    return[c.case_id,c.patient_name||'',c.doctor||'',c.clinic||'',c.distributor||'',c.current_status||'',c.status_change_date||'',c.last_synced_at||'',t,u||'',l||'',pkg,c.action_required_for||'',c.number_of_extra_refinements||'']
  })
  const a=csv(rows,headers);a.download=`bloom_cases_${new Date().toISOString().slice(0,10)}.csv`;a.click()
  ntf(`✅ Exported ${filteredCases.length} cases`)
}

window.exportAlignersCSV=()=>{
  const headers=['Case #','Patient','Doctor','Order Type','Package','Upper','Lower','Total Aligners']
  const rows=filteredAligners.map(a=>{
    const c=allCases.find(x=>String(x.case_id)===String(a.case_number))
    const tot=Number(a.number_of_aligners)||(Number(a.aligner_upper||0)+Number(a.aligner_lower||0))
    return[a.case_number,c?.patient_name||'',c?.doctor||'',a.order_type||'',a.package_type||'',a.aligner_upper!=null?a.aligner_upper:'',a.aligner_lower!=null?a.aligner_lower:'',tot||'']
  })
  const al=csv(rows,headers);al.download=`bloom_aligners_${new Date().toISOString().slice(0,10)}.csv`;al.click()
  ntf(`✅ Exported ${rows.length} aligner records`)
}

window.exportHistoryCSV=()=>{
  const headers=['Case #','Patient','Doctor','Clinic','Distributor','Status','Status Changed','Upper','Lower','Total Aligners','Package','Order Type','Action Required','Synced At']
  const rows=filteredSnaps.map(s=>[s.case_id,s.patient_name||'',s.doctor||'',s.clinic||'',s.distributor||'',s.current_status||'',s.status_change_date||'',s.aligner_upper||'',s.aligner_lower||'',s.total_aligners||'',s.package_type||'',s.order_type||'',s.action_required_for||'',s.synced_at||''])
  const a=csv(rows,headers);a.download=`bloom_history_${new Date().toISOString().slice(0,10)}.csv`;a.click()
  ntf(`✅ Exported ${filteredSnaps.length} snapshot records`)
}

// ── NAVIGATION ─────────────────────────────────────────────────────────
window.changePage=(tab,d)=>{
  if(tab==='cases'){casePage=Math.max(0,casePage+d);renderCasesPage()}
  else if(tab==='aligners'){alPage=Math.max(0,alPage+d);renderAlignersPage()}
  else if(tab==='history'){hPage=Math.max(0,hPage+d);renderHistoryPage()}
}
window.clearFilters=tab=>{
  if(tab==='cases'){['fSearch','fStatus','fStatusFrom','fStatusTo','fSyncFrom','fSyncTo','fDist','fAction'].forEach(id=>$(`${id}`).value='');applyFilters()}
  else if(tab==='aligners'){['aSearch','aOrderType','aPackage'].forEach(id=>$(id).value='');applyAlignerFilters()}
  else{['hSearch','hStatus','hFrom','hTo','hSCFrom','hSCTo','hAction'].forEach(id=>$(id).value='');applyHistoryFilters()}
}
window.showTab=(name,btn)=>{document.querySelectorAll('[id^="tab-"]').forEach(el=>el.style.display='none');document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));$('tab-'+name).style.display='block';btn.classList.add('active');if(name==='history'&&snapshots.length===0)loadHistory()}
window.loadHistory=loadHistory
window.applyFilters=applyFilters
window.applyAlignerFilters=applyAlignerFilters
window.applyHistoryFilters=applyHistoryFilters

window.triggerSync=async()=>{
  const btn=$('syncBtn');btn.disabled=true;btn.innerHTML='<span class="spinner"></span> Syncing...'
  ntf('🔄 Sync triggered...')
  try{
    const r=await fetch(SUPABASE_CONFIG.url+'/functions/v1/bloom-sync',{method:'POST',headers:{'Content-Type':'application/json'}})
    const d=await r.json()
    if(r.ok)ntf(`✅ Done — ${(d.cases_fetched||0).toLocaleString()} cases · ${d.snapshots_saved||0} snapshots saved`)
    else ntf('⚠️ Error '+r.status,false)
  }catch(e){ntf('⚠️ '+e.message,false)}
  btn.disabled=false;btn.innerHTML='🔄 Sync Now'
  setTimeout(loadAll,2000)
}

window.loadAll=loadAll
loadAll()
setInterval(loadAll,30000)
</script>
</body>
</html>
