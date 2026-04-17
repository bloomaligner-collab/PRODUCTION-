// ═══════════════════════════════════════════════════════════════
// Cedarwings SAS — Role-Based Access Control v2.0
// ═══════════════════════════════════════════════════════════════
const CW_ACCESS = {
  pages: {
    dashboard:            { label: 'Dashboard',           icon: '📊', section: 'Main' },
    production:           { label: 'Production',          icon: '🏭', section: 'Main' },
    bloom_import:         { label: 'Bloom Import',        icon: '🌸', section: 'Main' },
    inventory:            { label: 'Inventory',           icon: '📦', section: 'Main' },
    requisition:          { label: 'Requisitions',        icon: '📋', section: 'Main' },
    machines:             { label: 'Machines',            icon: '⚙️',  section: 'Operations' },
    employees:            { label: 'Employees',           icon: '👥', section: 'Operations' },
    clocking:             { label: 'Clocking',            icon: '⏱',  section: 'Operations' },
    time_report:          { label: 'Time Report',         icon: '📅', section: 'Operations' },
    qualite:              { label: 'Quality',             icon: '✅', section: 'Quality' },
    tracabilite:          { label: 'Traceability',        icon: '🔍', section: 'Quality' },
    non_conformity:       { label: 'Non-Conformity',      icon: '⚠️',  section: 'Quality' },
    suppliers:            { label: 'Suppliers',           icon: '🏭', section: 'Quality' },
    production_materials: { label: 'Prod. Materials',     icon: '🧪', section: 'Quality' },
    roles:                { label: 'Roles',               icon: '🔐', section: 'Admin' },
    settings:             { label: 'Settings',            icon: '⚙️',  section: 'Admin' },
    changelog:            { label: 'Changelog',           icon: '📝', section: 'Admin' },
  },
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
    const home = role === 'manager' ? 'manager.html' : 'production.html';
    const pageFiles = {
      dashboard:'manager.html',production:'production.html',bloom_import:'bloom_import.html',
      inventory:'inventory.html',requisition:'requisition.html',machines:'machines.html',
      employees:'employees.html',clocking:'clocking.html',time_report:'time_report.html',
      qualite:'qualite.html',tracabilite:'tracabilite.html',non_conformity:'non_conformity.html',
      suppliers:'suppliers.html',production_materials:'production_materials.html',
      roles:'roles.html',settings:'settings.html',changelog:'changelog.html',
    };
    const sections = {};
    for (const [key, cfg] of Object.entries(this.pages)) {
      if (role !== 'manager' && access.length > 0 && !access.includes(key)) continue;
      if (!sections[cfg.section]) sections[cfg.section] = [];
      sections[cfg.section].push({ key, ...cfg, file: pageFiles[key] || '#' });
    }
    let nav = '';
    for (const [sec, items] of Object.entries(sections)) {
      nav += `<div class="sb-sec">${sec}</div>`;
      for (const item of items) {
        nav += `<a href="${item.file}" class="sb-item${item.key===activeKey?' active':''}">${item.icon} ${item.label}</a>`;
      }
    }
    const footer = `<div class="sb-foot">
      <div class="sb-user">${name} <span class="sb-role">${role}</span></div>
      <a href="${home}" class="sb-link">🏠 Home</a>
      <a href="index.html" class="sb-link" onclick="sessionStorage.clear()">🚪 Logout</a>
    </div>`;
    return { nav, footer };
  },
  injectSidebar(activeKey) {
    const { nav, footer } = this.buildSidebar(activeKey);
    const navEl = document.querySelector('.sb-nav');
    if (navEl) navEl.innerHTML = nav;
    const footEl = document.querySelector('.sb-foot');
    if (footEl) footEl.outerHTML = footer;
    else { const sb = document.querySelector('.sidebar'); if (sb) sb.insertAdjacentHTML('beforeend', footer); }
  }
};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PAGE_KEY !== 'undefined') {
    if (!CW_ACCESS.guard(PAGE_KEY)) return;
    CW_ACCESS.injectSidebar(PAGE_KEY);
  }
});

// ═══════════════════════════════════════════════════════════════
// INVENTORY PAGE COMPLETE PATCH v3
// Fixes ALL tabs: Stock, Items, Alerts, Activity
// Fixes: Supplier dropdown, Location dropdown, Edit Item
// ═══════════════════════════════════════════════════════════════
(function () {
  const API = 'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/get-inventory-data';
  const SB  = 'https://cvrmadmzzualqukxxlro.supabase.co/rest/v1';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm1hZG16enVhbHF1a3h4bHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTc3MTksImV4cCI6MjA2MDQ5MzcxOX0.5tDCEMtzGMNFBfmXNMPkHGMgIw-l5XCMjIcCHXtHRF4';
  const H   = { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY };

  let _items=[], _suppliers=[], _locations=[], _lots=[], _activity=[];
  const $  = id => document.getElementById(id);
  const fd = v => v ? new Date(v).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const mn = n => Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});

  function lotSt(r) {
    const q=Number(r.available_qty||0),m=Number(r.min_qty||r.min_stock||0);
    const d=r.expiry_date?Math.round((new Date(r.expiry_date)-new Date())/86400000):null;
    if(q<=0)return'out';if(d!==null&&d<0)return'expired';
    if(d!==null&&d<=30)return'near_expiry';if(m>0&&q<=m)return'low';return'available';
  }
  function stBdg(s){
    return{available:'<span class="bdg bg">✓ Available</span>',low:'<span class="bdg ba">⚠ Low</span>',
    out:'<span class="bdg br">🚫 Out</span>',near_expiry:'<span class="bdg bp">⏰ Near Expiry</span>',
    expired:'<span class="bdg br">Expired</span>'}[s]||`<span class="bdg bgy">${s}</span>`;
  }

  async function loadData() {
    try {
      const r = await fetch(API);
      const d = await r.json();
      _items=d.items||[]; _suppliers=d.suppliers||[]; _locations=d.locations||[];
    } catch(e){console.warn('inv api:',e.message);}
    try {
      const r = await fetch(`${SB}/inventory_lots_enriched_view?select=*&order=created_at.desc`,{headers:H});
      const d = await r.json(); _lots=Array.isArray(d)?d:[];
    } catch(e){console.warn('inv lots:',e.message); _lots=[];}
    try {
      const r = await fetch(`${SB}/inventory_stock_history?select=action_type,quantity,created_at,note&order=created_at.desc&limit=8`,{headers:H});
      const d = await r.json(); _activity=Array.isArray(d)?d:[];
    } catch(e){console.warn('inv act:',e.message); _activity=[];}
  }

  function renderStock() {
    const tbl=$('tStock'); if(!tbl)return;
    const term=($('sSearch')||{}).value||'', sf=($('sStatus')||{}).value||'all', cf=($('sCat')||{}).value||'all';
    const fl=_lots.filter(r=>{
      const st=lotSt(r),hay=`${r.item_name||''} ${r.lot_no||''} ${r.supplier_name||''} ${r.location_name||''} ${r.category_name||''}`.toLowerCase();
      return(!term||hay.includes(term.toLowerCase()))&&(sf==='all'||st===sf)&&(cf==='all'||r.category_name===cf);
    });
    tbl.innerHTML=fl.length?fl.map(r=>{
      const st=lotSt(r),q=Number(r.available_qty||0),mx=Number(r.max_qty||0),pct=mx>0?Math.min(100,Math.round(q/mx*100)):0;
      const col=q<=0?'#dc2626':pct<30?'#d97706':'#16a34a';
      const d=r.expiry_date?Math.round((new Date(r.expiry_date)-new Date())/86400000):null;
      return`<tr>
        <td><strong>${r.item_name||'—'}</strong><div style="font-size:10px;color:var(--muted,#94a3b8)">${r.category_name||''}</div></td>
        <td class="mono">${r.lot_no||'—'}</td><td>${stBdg(st)}</td>
        <td><div style="display:flex;align-items:center;gap:6px">
          <span class="mono" style="font-weight:700;color:${col};min-width:30px">${q}</span>
          <div style="flex:1;height:6px;background:#e2e8f0;border-radius:3px;min-width:60px">
            <div style="width:${pct}%;height:100%;background:${col};border-radius:3px"></div>
          </div><span style="font-size:10px;color:var(--muted,#94a3b8)">${pct}%</span></div></td>
        <td class="mono">$${mn(r.unit_cost)}</td>
        <td style="font-size:12px">${r.supplier_name||'—'}</td>
        <td style="font-size:12px">${r.location_name||'—'}</td>
        <td style="font-size:12px">${fd(r.expiry_date)}${d!==null?`<div style="font-size:10px;color:${d<0?'#dc2626':d<=30?'#d97706':'#94a3b8'}">${d<0?'Expired':d+'d left'}</div>`:''}</td>
        <td style="font-size:12px">${fd(r.received_date)}</td></tr>`;
    }).join(''):'<tr><td colspan="9" style="text-align:center;padding:20px;color:#94a3b8">No stock lots found.</td></tr>';
    // KPIs
    let tv=0,lc=0,ec=0;
    _lots.forEach(r=>{tv+=Number(r.available_qty||0)*Number(r.unit_cost||0);const s=lotSt(r);if(s==='low'||s==='out')lc++;if(s==='near_expiry'||s==='expired')ec++;});
    if($('kLots'))$('kLots').textContent=_lots.length;
    if($('kVal'))$('kVal').textContent='$'+mn(tv);
    if($('kLow'))$('kLow').textContent=lc;
    if($('kExp'))$('kExp').textContent=ec;
    const cats=[...new Set(_lots.map(r=>r.category_name).filter(Boolean))],sel=$('sCat');
    if(sel){const ex=[...sel.options].map(o=>o.value);cats.forEach(c=>{if(!ex.includes(c)){const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o);}});}
  }

  function renderItems() {
    const tbl=$('tItems'); if(!tbl)return;
    tbl.innerHTML=_items.length?_items.map(it=>{
      const nm=it.item_name||it.name||'—',cat=it.category_name||it.category||'—',u=it.unit_of_measure||it.unit||'—';
      return`<tr>
        <td><strong>${nm}</strong></td><td style="font-size:12px">${cat}</td>
        <td class="mono">${u}</td><td class="mono">${it.min_qty||0}</td><td class="mono">${it.max_qty||0}</td>
        <td class="mono">${it.monthly_consumption||0}</td><td class="mono">${it.lead_time_days||0}d</td>
        <td>${it.auto_requisition_enabled?'<span class="bdg bg">On</span>':'<span class="bdg br">Off</span>'}</td>
        <td class="mono">—</td>
        <td><div style="display:flex;gap:5px">
          <button class="btn b-gho b-sm" onclick="__cwEdit('${it.id}')">✏ Edit</button>
          <button class="btn b-grn b-sm" onclick="__cwLot('${it.id}')">+ Lot</button>
        </div></td></tr>`;
    }).join(''):'<tr><td colspan="10" style="text-align:center;padding:20px;color:#94a3b8">No items yet. Click + Add Item above.</td></tr>';
    if($('kItems'))$('kItems').textContent=_items.length;
    ['lIt','fItem'].forEach(id=>{
      const s=$(id);if(!s)return;const cv=s.value;
      s.innerHTML='<option value="">— Select item —</option>'+_items.map(it=>{
        const nm=it.item_name||it.name||'?',u=it.unit_of_measure||it.unit||'';
        return`<option value="${it.id}" data-unit="${u}">${nm}${u?' ('+u+')':''}</option>`;
      }).join('');
      if(cv)s.value=cv;
    });
  }

  function renderActivity() {
    const el=$('dActivity');if(!el)return;
    el.innerHTML=_activity.length?_activity.map(x=>{
      const icon=x.action_type==='purchase'?'📥':x.action_type==='usage'?'📤':'⚙';
      const bg=x.action_type==='purchase'?'#dcfce7':x.action_type==='usage'?'#fef3c7':'#f1f5f9';
      return`<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--border,#e2e8f0)">
        <div style="width:28px;height:28px;border-radius:8px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">${icon}</div>
        <div><div style="font-size:12px;font-weight:600">${x.action_type} · ${x.quantity}</div>
        <div style="font-size:11px;color:#94a3b8">${fd(x.created_at)}${x.note?' · '+x.note:''}</div></div></div>`;
    }).join(''):'<div style="color:#94a3b8;font-size:13px">No recent activity.</div>';
  }

  function renderAlerts() {
    const el=$('dAlerts');if(!el)return;
    const al=_lots.filter(r=>{const s=lotSt(r);return s==='low'||s==='out'||s==='near_expiry'||s==='expired';});
    el.innerHTML=al.length?al.map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border,#e2e8f0)">
      <div><div style="font-size:13px;font-weight:600">${r.item_name||'—'}</div>
      <div style="font-size:11px;color:#94a3b8">Lot: ${r.lot_no||'—'} · Qty: ${r.available_qty||0}</div></div>
      ${stBdg(lotSt(r))}</div>`).join(''):'<div style="color:#94a3b8;font-size:13px">No alerts.</div>';
  }

  function fillSuppliers(){
    const opts='<option value="">— Select Supplier —</option>'+_suppliers.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
    ['iSup','lSup'].forEach(id=>{const el=$(id);if(el)el.innerHTML=opts;});
  }
  function fillLocations(){
    const el=$('lLoc');if(!el)return;
    el.innerHTML='<option value="">— Select Location —</option>'+_locations.map(l=>`<option value="${l.id}">${l.location_name}</option>`).join('');
  }

  window.__cwEdit=function(id){
    const it=_items.find(x=>x.id===id);if(!it||!$('mItem'))return;
    fillSuppliers();
    if($('eiId'))$('eiId').value=id;
    if($('mItemT'))$('mItemT').textContent='Edit Item';
    if($('iN'))$('iN').value=it.item_name||it.name||'';
    if($('iC'))$('iC').value=it.category_name||it.category||'';
    if($('iU'))$('iU').value=it.unit_of_measure||it.unit||'';
    if($('iSK'))$('iSK').value=it.sku||'';
    if($('iMn'))$('iMn').value=it.min_qty||0;
    if($('iMx'))$('iMx').value=it.max_qty||0;
    if($('iMC'))$('iMC').value=it.monthly_consumption||0;
    if($('iLT'))$('iLT').value=it.lead_time_days||0;
    if($('iNt'))$('iNt').value=it.notes||'';
    if($('iAR'))$('iAR').value=it.auto_requisition_enabled?'true':'false';
    if($('eItem'))$('eItem').textContent='';
    if(it.preferred_supplier_id)setTimeout(()=>{if($('iSup'))$('iSup').value=it.preferred_supplier_id;},60);
    $('mItem').classList.add('on');
  };

  window.__cwLot=function(itemId){
    if(!$('mLot'))return;
    fillSuppliers();fillLocations();
    ['lSN','lQT','lUC','lED','lMS','lRP','lNt'].forEach(id=>{if($(id))$(id).value='';});
    if($('lLN'))$('lLN').value='LOT-'+Date.now().toString().slice(-6);
    if($('lPD'))$('lPD').value=new Date().toISOString().slice(0,10);
    if($('lSup'))$('lSup').value='';if($('lLoc'))$('lLoc').value='';
    if($('lIt'))$('lIt').value=itemId;
    $('mLot').classList.add('on');
  };

  function patchButtons(){
    const ai=$('btnAI');
    if(ai&&!ai._cw){ai._cw=true;ai.addEventListener('click',()=>{
      fillSuppliers();
      if($('eiId'))$('eiId').value='';if($('mItemT'))$('mItemT').textContent='Add New Item';
      ['iN','iC','iU','iSK','iMn','iMx','iMC','iLT','iNt'].forEach(id=>{if($(id))$(id).value='';});
      if($('iSup'))$('iSup').value='';if($('iAR'))$('iAR').value='true';
      if($('eItem'))$('eItem').textContent='';if($('mItem'))$('mItem').classList.add('on');
    });}
    const al=$('btnAL');
    if(al&&!al._cw){al._cw=true;al.addEventListener('click',()=>{
      fillSuppliers();fillLocations();
      ['lIt','lSN','lQT','lUC','lED','lSup','lLoc','lMS','lRP','lNt'].forEach(id=>{if($(id))$(id).value='';});
      if($('lLN'))$('lLN').value='LOT-'+Date.now().toString().slice(-6);
      if($('lPD'))$('lPD').value=new Date().toISOString().slice(0,10);
      if($('mLot'))$('mLot').classList.add('on');
    });}
    const rb=$('btnR');
    if(rb&&!rb._cw){rb._cw=true;rb.addEventListener('click',async()=>{await loadData();renderAll();});}
  }

  function wireFilters(){
    ['sSearch','sStatus','sCat'].forEach(id=>{
      const el=$(id);if(el&&!el._cw){el._cw=true;el.addEventListener('input',renderStock);el.addEventListener('change',renderStock);}
    });
  }

  function renderAll(){renderStock();renderItems();renderActivity();renderAlerts();fillSuppliers();fillLocations();}

  document.addEventListener('click',e=>{
    if(!e.target||!e.target.dataset)return;
    if(e.target.dataset.t==='items')setTimeout(()=>{renderItems();fillSuppliers();},100);
    if(e.target.dataset.t==='stock')setTimeout(renderStock,100);
  });

  async function init(){
    if(!$('tStock')&&!$('tItems')&&!$('btnAI'))return;
    await loadData();
    renderAll();
    patchButtons();
    wireFilters();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(init,700));
  } else {
    setTimeout(init,700);
  }
})();
