// Cedarwings SAS — Shared Sidebar Navigation
// Usage: document.getElementById("sidebar").innerHTML = CW_Sidebar("manager")

export function CW_Sidebar(activePage){
  const link=(href,ic,label,key)=>`<a href="${href}" class="nl${key===activePage?" on":""}" ><span class="ic">${ic}</span>${label}</a>`
  return`
    <div class="sb-top">
      <div class="logo">⚙</div>
      <div>
        <div class="sb-nm">Cedarwings SAS</div>
        <div class="sb-role" id="sb-role-badge">Manager</div>
      </div>
    </div>
    <nav class="sb-nav">
      <div class="sb-s">Operations</div>
      ${link("manager.html","📊","Dashboard","manager")}
      ${link("production.html","🏭","Production","production")}
      ${link("production_materials.html","🧪","Materials & Lots","production_materials")}
      ${link("machines.html","⚙","Machines","machines")}
      <div class="sb-s">Team</div>
      ${link("employees.html","👥","Employees","employees")}
      ${link("employee_profile.html","👤","Employee Profile","employee_profile")}
      ${link("time_report.html","📈","Time Report","time_report")}
      <div class="sb-s">Quality</div>
      ${link("tracabilite.html","🔖","Traceability","tracabilite")}
      ${link("qualite.html","✅","Quality Control","qualite")}
      <div class="sb-s">Resources</div>
      ${link("inventory.html","📦","Inventory","inventory")}
      <div class="sb-s">System</div>
      ${link("settings.html","⚙","Settings","settings")}
      ${link("roles.html","🔑","Roles","roles")}
      ${link("clocking.html","⏱","Clocking Terminal","clocking")}
    </nav>
    <div class="sb-foot">
      <a href="index.html" class="nl"><span class="ic">←</span>Switch Role</a>
    </div>`
}
