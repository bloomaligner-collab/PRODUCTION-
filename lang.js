// ═══════════════════════════════════════════════════════════════════════
// Cedarwings SAS — Bilingual Language System (FR / EN)
// Usage: include <script src="lang.js"></script> in every page
//        call CW_LANG.apply() after DOM loads
//        add data-i18n="key" to any element to auto-translate
// ═══════════════════════════════════════════════════════════════════════

const CW_LANG = {
  // ─── Storage ────────────────────────────────────────────────
  STORAGE_KEY: 'cw_lang',
  
  get() { return localStorage.getItem(this.STORAGE_KEY) || 'fr'; },
  set(lang) { localStorage.setItem(this.STORAGE_KEY, lang); },
  isFR() { return this.get() === 'fr'; },

  // ─── Translation dictionary ──────────────────────────────────
  T: {
    // === GLOBAL ===
    'nav.dashboard':        { fr: 'Tableau de bord',    en: 'Dashboard' },
    'nav.production':       { fr: 'Production',          en: 'Production' },
    'nav.materials':        { fr: 'Matières & Lots',     en: 'Materials & Lots' },
    'nav.machines':         { fr: 'Machines',            en: 'Machines' },
    'nav.maintenance':      { fr: 'Historique Maintenance', en: 'Maintenance History' },
    'nav.employees':        { fr: 'Employés',            en: 'Employees' },
    'nav.profile':          { fr: 'Profil Employé',      en: 'Employee Profile' },
    'nav.timereport':       { fr: 'Rapport de Temps',    en: 'Time Report' },
    'nav.traceability':     { fr: 'Traçabilité',         en: 'Traceability' },
    'nav.quality':          { fr: 'Contrôle Qualité',    en: 'Quality Control' },
    'nav.nc':               { fr: 'Non-Conformités',     en: 'Non-Conformity' },
    'nav.suppliers':        { fr: 'Fournisseurs',        en: 'Suppliers' },
    'nav.feedback':         { fr: 'Retour Client',       en: 'Customer Feedback' },
    'nav.audit':            { fr: 'Audits Internes',     en: 'Internal Audits' },
    'nav.inventory':        { fr: 'Inventaire',          en: 'Inventory' },
    'nav.bloom':            { fr: 'Import Bloom',        en: 'Bloom Import' },
    'nav.iso':              { fr: 'Conformité ISO 13485',en: 'ISO 13485 Compliance' },
    'nav.settings':         { fr: 'Paramètres',          en: 'Settings' },
    'nav.changelog':        { fr: 'Journal des modifications', en: 'Changelog' },
    'nav.roles':            { fr: 'Rôles',               en: 'Roles' },
    'nav.clocking':         { fr: 'Terminal de Pointage',en: 'Clocking Terminal' },
    'nav.signout':          { fr: 'Déconnexion',         en: 'Sign Out' },
    // Sidebar sections
    'section.operations':   { fr: 'Opérations',          en: 'Operations' },
    'section.team':         { fr: 'Équipe',               en: 'Team' },
    'section.quality':      { fr: 'Qualité',              en: 'Quality' },
    'section.resources':    { fr: 'Ressources',           en: 'Resources' },
    'section.orders':       { fr: 'Commandes',            en: 'Orders' },
    'section.system':       { fr: 'Système',              en: 'System' },
    // Common buttons
    'btn.save':             { fr: 'Enregistrer',          en: 'Save' },
    'btn.cancel':           { fr: 'Annuler',              en: 'Cancel' },
    'btn.add':              { fr: '+ Ajouter',            en: '+ Add' },
    'btn.edit':             { fr: 'Modifier',             en: 'Edit' },
    'btn.delete':           { fr: 'Supprimer',            en: 'Delete' },
    'btn.view':             { fr: 'Voir',                 en: 'View' },
    'btn.print':            { fr: '🖨️ Imprimer',          en: '🖨️ Print' },
    'btn.export':           { fr: '⬇ Exporter CSV',       en: '⬇ Export CSV' },
    'btn.refresh':          { fr: '↻ Actualiser',         en: '↻ Refresh' },
    'btn.close':            { fr: '✕ Fermer',             en: '✕ Close' },
    'btn.new_nc':           { fr: '+ Nouveau RC',         en: '+ New NC Report' },
    'btn.new_supplier':     { fr: '+ Ajouter Fournisseur',en: '+ Add Supplier' },
    'btn.new_feedback':     { fr: '+ Enregistrer Retour', en: '+ Log Feedback' },
    'btn.new_audit':        { fr: '+ Planifier Audit',    en: '+ Schedule Audit' },
    'btn.new_maintenance':  { fr: '+ Enregistrer Maintenance', en: '+ Log Maintenance' },
    'btn.log_production':   { fr: '🦷 + Enregistrer Production', en: '🦷 + Log Production' },
    // Common table headers
    'th.date':              { fr: 'Date',                 en: 'Date' },
    'th.status':            { fr: 'Statut',               en: 'Status' },
    'th.actions':           { fr: 'Actions',              en: 'Actions' },
    'th.description':       { fr: 'Description',          en: 'Description' },
    'th.employee':          { fr: 'Employé',              en: 'Employee' },
    'th.machine':           { fr: 'Machine',              en: 'Machine' },
    'th.order':             { fr: 'Commande',             en: 'Order' },
    'th.type':              { fr: 'Type',                 en: 'Type' },
    'th.name':              { fr: 'Nom',                  en: 'Name' },
    // Common form labels
    'lbl.date':             { fr: 'Date *',               en: 'Date *' },
    'lbl.description':      { fr: 'Description *',        en: 'Description *' },
    'lbl.status':           { fr: 'Statut',               en: 'Status' },
    'lbl.notes':            { fr: 'Notes / Remarques',    en: 'Notes / Remarks' },
    'lbl.root_cause':       { fr: 'Analyse des causes',   en: 'Root Cause Analysis' },
    'lbl.corrective':       { fr: 'Action corrective',    en: 'Corrective Action' },
    'lbl.severity':         { fr: 'Sévérité *',           en: 'Severity *' },
    'lbl.category':         { fr: 'Catégorie *',          en: 'Category *' },
    'lbl.closed_date':      { fr: 'Date de clôture',      en: 'Closed Date' },
    // Status values
    'status.open':          { fr: 'Ouvert',               en: 'Open' },
    'status.in_progress':   { fr: 'En cours',             en: 'In Progress' },
    'status.closed':        { fr: 'Clôturé',              en: 'Closed' },
    'status.resolved':      { fr: 'Résolu',               en: 'Resolved' },
    'status.approved':      { fr: 'Approuvé',             en: 'Approved' },
    'status.pending':       { fr: 'En attente',           en: 'Pending' },
    'status.completed':     { fr: 'Terminé',              en: 'Completed' },
    'status.planned':       { fr: 'Planifié',             en: 'Planned' },
    'status.operational':   { fr: 'Opérationnel',         en: 'Operational' },
    'status.suspended':     { fr: 'Suspendu',             en: 'Suspended' },
    // Severity
    'sev.low':              { fr: 'Faible',               en: 'Low' },
    'sev.medium':           { fr: 'Moyen',                en: 'Medium' },
    'sev.high':             { fr: 'Élevé',                en: 'High' },
    'sev.critical':         { fr: 'Critique',             en: 'Critical' },
    // KPIs
    'kpi.sessions':         { fr: 'Sessions totales',     en: 'Total Sessions' },
    'kpi.efficiency':       { fr: 'Efficacité',           en: 'Efficiency' },
    'kpi.aligners':         { fr: 'Aligneurs produits',   en: 'Aligners Produced' },
    'kpi.cases':            { fr: 'Dossiers terminés',    en: 'Cases Completed' },
    'kpi.stock_alerts':     { fr: 'Alertes stock',        en: 'Stock Alerts' },
    'kpi.requisitions':     { fr: 'Réquisitions ouvertes',en: 'Open Requisitions' },
    'kpi.bloom_cases':      { fr: 'Dossiers Bloom',       en: 'Bloom Cases' },
    'kpi.bloom_aligners':   { fr: 'Aligneurs Bloom Auj.', en: 'Bloom Aligners Today' },
    // Page titles
    'page.dashboard':       { fr: 'Tableau de bord des opérations', en: 'Operations Dashboard' },
    'page.production':      { fr: 'Gestion de la production',       en: 'Production Management' },
    'page.bloom':           { fr: 'Import Bloom — Dossiers patients',en: 'Bloom Import — Patient Cases' },
    'page.maintenance':     { fr: 'Historique de maintenance',      en: 'Maintenance History' },
    'page.nc':              { fr: 'Rapports de Non-Conformité',     en: 'Non-Conformity Reports' },
    'page.suppliers':       { fr: 'Gestion des fournisseurs',       en: 'Supplier Management' },
    'page.feedback':        { fr: 'Retours clients',                en: 'Customer Feedback' },
    'page.audit':           { fr: 'Audits internes',                en: 'Internal Audits' },
    'page.iso':             { fr: 'Tableau de conformité ISO 13485',en: 'ISO 13485 Compliance Dashboard' },
    'page.timereport':      { fr: 'Rapport de gestion du temps',    en: 'Time Management Report' },
    'page.inventory':       { fr: 'Gestion des stocks',             en: 'Inventory Management' },
    'page.roles':           { fr: 'Rôles & Permissions',            en: 'Roles & Permissions' },
    // Footer
    'footer.copy':          { fr: '© 2026 Cedarwings SAS — Plateforme de fabrication d\'aligneurs dentaires', en: '© 2026 Cedarwings SAS — Dental Aligner Manufacturing Platform' },
    'footer.version':       { fr: 'v2.0 · Conforme ISO 13485 · Tous droits réservés', en: 'v2.0 · ISO 13485 Compliant · All rights reserved' },
    // Empty states
    'empty.no_data':        { fr: 'Aucune donnée trouvée.',         en: 'No data found.' },
    'empty.loading':        { fr: 'Chargement…',                    en: 'Loading…' },
    // Login page
    'login.title':          { fr: 'Bienvenue',                      en: 'Welcome back' },
    'login.subtitle':       { fr: 'Connectez-vous à votre espace',  en: 'Sign in to your workspace' },
    'login.username':       { fr: 'Nom d\'utilisateur',             en: 'Username' },
    'login.password':       { fr: 'Mot de passe',                   en: 'Password' },
    'login.btn':            { fr: 'Se connecter →',                 en: 'Sign In →' },
    // Help panel titles
    'help.title':           { fr: 'Aide — ',                        en: 'Help — ' },
    'help.role':            { fr: 'Rôle : ',                        en: 'Role: ' },
    'help.purpose':         { fr: 'Objectif',                       en: 'Purpose' },
    'help.process':         { fr: 'Flux de processus',              en: 'Process Flow' },
    'help.buttons':         { fr: 'Boutons & Contrôles',            en: 'Buttons & Controls' },
    'help.close':           { fr: '✕ Fermer',                       en: '✕ Close' },
  },

  // ─── Translate a key ────────────────────────────────────────
  t(key) {
    const entry = this.T[key];
    if (!entry) return key;
    return entry[this.get()] || entry['en'] || key;
  },

  // ─── Apply translations to all data-i18n elements ───────────
  apply() {
    const lang = this.get();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
    // Update lang toggle button
    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français';
      btn.title = lang === 'fr' ? 'Switch to English' : 'Passer en Français';
    }
    // Update html lang attribute
    document.documentElement.lang = lang;
  },

  // ─── Toggle language ────────────────────────────────────────
  toggle() {
    const newLang = this.isFR() ? 'en' : 'fr';
    this.set(newLang);
    // Update toggle button text immediately
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = newLang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français';
    // Apply all data-i18n translations
    this.apply();
    // Re-render dynamic content if page has functions
    if (typeof window.renderPage === 'function') window.renderPage();
    if (typeof window.applyFilter === 'function') window.applyFilter();
    if (typeof window.render === 'function') window.render();
  },

  // ─── Render the language toggle button ──────────────────────
  renderToggle() {
    const lang = this.get();
    return `<button id="langToggle" onclick="CW_LANG.toggle()" 
      style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;
             background:var(--card);border:1.5px solid var(--bdr);border-radius:8px;
             font-family:var(--f);font-size:12px;font-weight:600;color:var(--txt);
             cursor:pointer;transition:all .12s;white-space:nowrap"
      onmouseover="this.style.borderColor='var(--blue)';this.style.color='var(--blue)'"
      onmouseout="this.style.borderColor='var(--bdr)';this.style.color='var(--txt)'"
      title="${lang === 'fr' ? 'Switch to English' : 'Passer en Français'}">
      ${lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
    </button>`;
  },

  // ─── Inject toggle into topbar ──────────────────────────────
  injectToggle() {
    // Only inject if no langToggle exists yet
    if (document.getElementById('langToggle')) {
      this.apply(); // Just update the label
      return;
    }
    const lang = this.get();
    const btn = document.createElement('button');
    btn.id = 'langToggle';
    btn.textContent = lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français';
    btn.title = lang === 'fr' ? 'Switch to English' : 'Passer en Français';
    btn.onclick = () => this.toggle();
    Object.assign(btn.style, {
      display:'inline-flex', alignItems:'center', gap:'5px',
      padding:'5px 11px', background:'var(--card)',
      border:'1.5px solid var(--bdr)', borderRadius:'8px',
      fontFamily:'var(--f)', fontSize:'12px', fontWeight:'600',
      color:'var(--txt)', cursor:'pointer', whiteSpace:'nowrap'
    });
    // Insert into topbar top-right
    const topRight = document.querySelector('.top-right');
    if (topRight) { topRight.prepend(btn); return; }
    const topbar = document.querySelector('.topbar');
    if (topbar) { topbar.appendChild(btn); }
  }
};

// ─── Help content translations ─────────────────────────────────────────
const CW_HELP = {
  manager: {
    fr: {
      role: 'Manager / Directeur',
      purpose: 'Votre centre de commande quotidien. Affiche les KPIs en temps réel, l\'activité de l\'équipe et le statut qualité ISO. Se rafraîchit toutes les 30 secondes.',
      process: [
        ['1. Sélectionner la période', 'Onglets Aujourd\'hui / Cette semaine / Ce mois — tous les KPIs et graphiques se mettent à jour instantanément.'],
        ['2. Lire les KPIs', 'Sessions, Efficacité, Aligneurs, Dossiers, Alertes stock, Réquisitions ouvertes, Dossiers Bloom.'],
        ['3. Vérifier le panneau ISO', 'NC ouvertes, Fournisseurs approuvés, Audits planifiés, Score ISO — cliquez pour naviguer.'],
        ['4. Analyser les graphiques', 'Tendance production, types de sessions, efficacité par employé, matières consommées.'],
        ['5. Journal des sessions', 'Rechercher ou filtrer toutes les sessions pointées.'],
      ],
      buttons: [
        ['🦷 + Enregistrer Production', 'Saisie rapide de la production d\'aligneurs depuis les données Bloom.'],
        ['⬇ Exporter CSV', 'Télécharge toutes les sessions de la période sélectionnée.'],
        ['↻ Actualiser', 'Rafraîchit manuellement toutes les données.'],
      ]
    },
    en: {
      role: 'Manager / Director',
      purpose: 'Your daily command centre. Shows real-time KPIs, team activity, and ISO quality status. Refreshes every 30 seconds automatically.',
      process: [
        ['1. Select period', 'Today / This Week / This Month tabs — all KPIs and charts update instantly.'],
        ['2. Read KPIs', 'Sessions, Efficiency, Aligners, Cases, Stock Alerts, Open Requisitions, Bloom Cases.'],
        ['3. Check ISO panel', 'Open NCs, Approved Suppliers, Planned Audits, ISO Score — click any card to navigate.'],
        ['4. Review charts', 'Production trend, session types, efficiency by employee, materials consumed.'],
        ['5. Session log', 'Search or filter all clocked sessions.'],
      ],
      buttons: [
        ['🦷 + Log Production', 'Quick-enter aligner production from Bloom data.'],
        ['⬇ Export CSV', 'Downloads all session data for selected period.'],
        ['↻ Refresh', 'Manually refresh all data immediately.'],
      ]
    }
  },
  production: {
    fr: {
      role: 'Responsable Production / Opérateur',
      purpose: 'Enregistrer chaque lot de production d\'aligneurs. Chaque lot est lié à une commande, une machine, un lot de matière et un employé. Le système déduit les matières automatiquement (FEFO).',
      process: [
        ['1. Sélectionner la commande', 'Saisir ou sélectionner le numéro de dossier/commande Bloom.'],
        ['2. Choisir la machine', 'Sélectionner la machine utilisée pour ce lot.'],
        ['3. Matière auto-sélectionnée', 'Le système choisit le lot de matière le plus ancien valide (FEFO).'],
        ['4. Saisir les quantités', 'Entrer les quantités d\'aligneurs supérieurs et inférieurs séparément.'],
        ['5. Mettre à jour le statut', 'en attente → en cours → terminé au fil de la production.'],
        ['6. Contrôle qualité', 'Après completion, effectuer le contrôle qualité en 16 points dans la page QC.'],
      ],
      buttons: [
        ['+ Nouveau Lot', 'Créer un nouveau lot de production pour une commande.'],
        ['✏️ Modifier', 'Mettre à jour les quantités, le statut ou la machine.'],
        ['🔍 Voir', 'Consulter les détails complets du lot.'],
      ]
    },
    en: {
      role: 'Production Manager / Operator',
      purpose: 'Log every aligner production batch. Each batch is linked to an order, machine, material lot, and employee. System deducts materials automatically using FEFO.',
      process: [
        ['1. Select order', 'Enter or select the Bloom case/order number.'],
        ['2. Choose machine', 'Select which machine is being used for this batch.'],
        ['3. Material auto-selected', 'System picks the oldest valid material lot (FEFO).'],
        ['4. Enter aligner counts', 'Enter upper and lower aligner counts separately.'],
        ['5. Set status', 'pending → in_progress → completed as production progresses.'],
        ['6. Quality result', 'After completion, perform the 16-point QC check.'],
      ],
      buttons: [
        ['+ New Lot', 'Create a new production batch for an order.'],
        ['✏️ Edit', 'Update counts, status, or machine.'],
        ['🔍 View', 'See full lot details.'],
      ]
    }
  },
  maintenance_history: {
    fr: {
      role: 'Technicien de maintenance / Responsable qualité',
      purpose: 'ISO 13485 Clause 6.3 — Journal obligatoire de toutes les maintenances. Chaque intervention, réparation, étalonnage et inspection doit être enregistré ici pour la conformité réglementaire.',
      process: [
        ['1. Après chaque maintenance', 'Immédiatement après l\'intervention, cliquer sur "+ Enregistrer Maintenance".'],
        ['2. Sélectionner la machine', 'Choisir quelle machine a été entretenue.'],
        ['3. Sélectionner le type', 'Préventive, corrective, étalonnage ou inspection.'],
        ['4. Remplir les détails', 'Date, technicien, description, pièces remplacées, coût, statut après.'],
        ['5. Définir la prochaine date', 'Toujours définir la prochaine date planifiée — le système signale les retards.'],
      ],
      buttons: [
        ['+ Enregistrer Maintenance', 'Ouvrir le formulaire pour enregistrer une nouvelle intervention.'],
        ['👁 Voir', 'Consulter les détails complets.'],
        ['✏️ Modifier', 'Corriger ou mettre à jour un enregistrement.'],
      ]
    },
    en: {
      role: 'Maintenance Technician / Quality Manager',
      purpose: 'ISO 13485 Clause 6.3 — Mandatory log of all equipment maintenance. Every service, repair, calibration, and inspection must be recorded here for regulatory compliance.',
      process: [
        ['1. After any maintenance', 'Immediately after performing maintenance, click "+ Log Maintenance".'],
        ['2. Select machine', 'Choose which machine was serviced.'],
        ['3. Select type', 'Preventive, corrective, calibration, or inspection.'],
        ['4. Fill details', 'Date, technician, description, parts replaced, cost, status after.'],
        ['5. Set next due date', 'Always set the next scheduled date — system flags when overdue.'],
      ],
      buttons: [
        ['+ Log Maintenance', 'Open the form to record a new maintenance event.'],
        ['👁 View', 'See full details of a record.'],
        ['✏️ Edit', 'Correct or update a maintenance record.'],
      ]
    }
  },
  non_conformity: {
    fr: {
      role: 'Responsable qualité / Responsable production',
      purpose: 'ISO 13485 Clause 8.3 — Documenter chaque défaut produit, écart de processus ou manquement. Obligatoire par la loi. Chaque défaillance doit être analysée avec une analyse des causes et une action corrective (CAPA).',
      process: [
        ['1. Détecter la non-conformité', 'Tout employé qui trouve un défaut doit le signaler immédiatement.'],
        ['2. Créer le rapport', 'Cliquer sur "+ Nouveau RC". Saisir date, commande/lot, catégorie, sévérité, étape.'],
        ['3. Décrire le problème', 'Description détaillée de ce qui a été trouvé.'],
        ['4. Analyse des causes', 'POURQUOI cela s\'est-il produit ? (erreur machine, matière, humaine, processus...)'],
        ['5. Action corrective (CAPA)', 'QUE faire pour corriger et éviter la récurrence ?'],
        ['6. Clôturer quand résolu', 'Mettre le statut à Clôturé avec une date de clôture.'],
      ],
      buttons: [
        ['+ Nouveau RC', 'Ouvrir le formulaire pour documenter une non-conformité.'],
        ['👁 Voir', 'Lire le rapport complet.'],
        ['✏️ Modifier', 'Mettre à jour, ajouter la CAPA ou clôturer.'],
        ['🖨️ Imprimer', 'Imprimer le rapport NC formel pour le dossier qualité.'],
      ]
    },
    en: {
      role: 'Quality Manager / Production Manager',
      purpose: 'ISO 13485 Clause 8.3 — Document every product defect, process deviation, or compliance failure. Required by law. Every failure must be investigated with root cause analysis and corrective action (CAPA).',
      process: [
        ['1. Detect non-conformity', 'Any employee who finds a defect must report it immediately.'],
        ['2. Create NC report', 'Click "+ New NC Report". Enter date, order/lot, category, severity, step.'],
        ['3. Describe the problem', 'Detailed description of what was found wrong.'],
        ['4. Root cause analysis', 'WHY did it happen? (machine, material, human error, process gap...)'],
        ['5. Corrective action (CAPA)', 'WHAT was done or will be done to fix it and prevent recurrence?'],
        ['6. Close when resolved', 'Set status to Closed with a closed date.'],
      ],
      buttons: [
        ['+ New NC Report', 'Open the form to document a new non-conformity.'],
        ['👁 View', 'Read the full NC report.'],
        ['✏️ Edit', 'Update the NC report or close it.'],
        ['🖨️ Print', 'Print the formal NC report for the quality file.'],
      ]
    }
  },
  suppliers: {
    fr: {
      role: 'Responsable achats / Responsable qualité',
      purpose: 'ISO 13485 Clause 7.4 — Maintenir la Liste des Fournisseurs Approuvés (LFA). Vous ne pouvez commander QU\'auprès de fournisseurs approuvés. Chaque fournisseur doit être évalué avant la première commande et réévalué annuellement.',
      process: [
        ['1. Ajouter un fournisseur', 'Avant de commander chez un nouveau fournisseur — l\'ajouter ici et conduire l\'évaluation initiale.'],
        ['2. Évaluation', 'Score 0–100 basé sur : qualité, fiabilité livraison, certifications, réactivité.'],
        ['3. Définir le statut', 'Approuvé / Conditionnel / Suspendu / Disqualifié.'],
        ['4. Réévaluation annuelle', 'Requise par ISO 13485. Le système signale les évaluations en retard.'],
      ],
      buttons: [
        ['+ Ajouter Fournisseur', 'Enregistrer un nouveau fournisseur et conduire l\'évaluation initiale.'],
        ['👁 Voir', 'Consulter le profil complet.'],
        ['✏️ Modifier', 'Mettre à jour le statut, score ou dates.'],
      ]
    },
    en: {
      role: 'Purchasing Manager / Quality Manager',
      purpose: 'ISO 13485 Clause 7.4 — Maintain the Approved Supplier List (ASL). You may ONLY purchase from approved suppliers. Every supplier must be evaluated before first order and re-evaluated annually.',
      process: [
        ['1. Add new supplier', 'Before ordering from any new supplier — add them here and conduct initial evaluation.'],
        ['2. Conduct evaluation', 'Score 0–100 based on: quality, delivery reliability, certificates, responsiveness.'],
        ['3. Set status', 'Approved / Conditional / Suspended / Disqualified.'],
        ['4. Annual re-evaluation', 'Required by ISO 13485. System flags overdue evaluations in red.'],
      ],
      buttons: [
        ['+ Add Supplier', 'Register a new supplier and conduct initial evaluation.'],
        ['👁 View', 'See full supplier profile.'],
        ['✏️ Edit', 'Update status, score, or evaluation dates.'],
      ]
    }
  },
  customer_feedback: {
    fr: {
      role: 'Responsable qualité / Service client',
      purpose: 'ISO 13485 Clause 8.2.1 — Enregistrer et suivre toutes les réclamations, retours et demandes de garantie. Obligatoire pour la surveillance post-commercialisation. Chaque réclamation doit être investiguée.',
      process: [
        ['1. Recevoir la réclamation', 'Quand un distributeur ou médecin contacte pour un problème — l\'enregistrer immédiatement.'],
        ['2. Créer l\'enregistrement', 'Date, client, type (réclamation/retour/garantie), numéro de commande, priorité.'],
        ['3. Décrire le problème', 'Description complète de ce que le client a signalé.'],
        ['4. Investiguer la cause', 'Qu\'est-ce qui a causé ce problème ? Lier à un rapport NC si défaut produit.'],
        ['5. Enregistrer l\'action', 'Ce qui a été fait pour résoudre et satisfaire le client.'],
        ['6. Clôturer l\'enregistrement', 'Statut Résolu ou Clôturé avec date de clôture.'],
      ],
      buttons: [
        ['+ Enregistrer Retour', 'Créer un nouvel enregistrement de réclamation ou retour.'],
        ['👁 Voir', 'Lire l\'enregistrement complet.'],
        ['✏️ Modifier', 'Mettre à jour ou clôturer.'],
        ['🖨️ Imprimer', 'Imprimer le document formel pour le dossier qualité.'],
      ]
    },
    en: {
      role: 'Quality Manager / Customer Service',
      purpose: 'ISO 13485 Clause 8.2.1 — Register and track all complaints, feedback, and warranty claims. Required for post-market surveillance. Every complaint must be investigated.',
      process: [
        ['1. Receive complaint', 'When a distributor or doctor contacts you — log it immediately.'],
        ['2. Create record', 'Date, customer name, type, order number, priority.'],
        ['3. Describe the issue', 'Full description of what the customer reported.'],
        ['4. Investigate root cause', 'What caused this? Link to a Non-Conformity report if product defect.'],
        ['5. Record action taken', 'What was done to resolve the complaint.'],
        ['6. Close the record', 'Set status to Resolved or Closed with a closed date.'],
      ],
      buttons: [
        ['+ Log Feedback', 'Create a new complaint or feedback record.'],
        ['👁 View', 'Read the full record.'],
        ['✏️ Edit', 'Update or close the record.'],
        ['🖨️ Print', 'Print the formal record for the quality file.'],
      ]
    }
  },
  internal_audit: {
    fr: {
      role: 'Responsable qualité / Direction',
      purpose: 'ISO 13485 Clause 8.2.2 — Planifier et enregistrer les audits qualité internes. Obligatoires par ISO 13485. Les audits vérifient que les processus fonctionnent correctement et identifient les opportunités d\'amélioration.',
      process: [
        ['1. Planifier l\'audit', 'Programmer des audits couvrant tous les processus QMS au moins une fois par an.'],
        ['2. Désigner l\'auditeur', 'L\'auditeur doit être indépendant — ne peut pas auditer son propre secteur.'],
        ['3. Définir le périmètre', 'Production, QC, Fournisseurs, Maintenance, Traçabilité, QMS complet...'],
        ['4. Conduire l\'audit', 'À la date planifiée, examiner les enregistrements, observer les processus.'],
        ['5. Enregistrer les constatations', 'Documenter les bonnes pratiques, problèmes mineurs, non-conformités.'],
        ['6. Définir le résultat', 'Satisfaisant / Constatations mineures / Majeures / Critique.'],
      ],
      buttons: [
        ['+ Planifier Audit', 'Créer un audit planifié avec périmètre, auditeur et date.'],
        ['👁 Voir', 'Lire le rapport d\'audit complet.'],
        ['✏️ Modifier', 'Mettre à jour avec date réelle, constatations et résultat.'],
      ]
    },
    en: {
      role: 'Quality Manager / Management',
      purpose: 'ISO 13485 Clause 8.2.2 — Plan and conduct regular internal QMS audits. Required by ISO 13485. Audits verify that processes work as designed and identify improvement opportunities.',
      process: [
        ['1. Schedule audit', 'Plan audits covering all QMS processes at least once per year.'],
        ['2. Assign auditor', 'Auditor must be independent — cannot audit their own work area.'],
        ['3. Set scope', 'Production, QC, Suppliers, Maintenance, Traceability, Full QMS...'],
        ['4. Conduct the audit', 'On the planned date, review records, observe processes, interview staff.'],
        ['5. Record findings', 'Document what was found — good practices, minor issues, major non-conformities.'],
        ['6. Set result', 'Satisfactory / Minor Findings / Major Findings / Critical.'],
      ],
      buttons: [
        ['+ Schedule Audit', 'Create a new planned audit with scope, auditor, and date.'],
        ['👁 View', 'Read the full audit report.'],
        ['✏️ Edit', 'Update audit with actual date, findings, and result.'],
      ]
    }
  },
  iso_compliance: {
    fr: {
      role: 'Responsable qualité / Direction / Organisme notifié',
      purpose: 'Tableau de bord interactif de toutes les exigences ISO 13485:2016. Utilisez-le pour suivre votre préparation à la certification, préparer les audits et démontrer la conformité à votre organisme notifié.',
      process: [
        ['1. Examiner chaque clause', 'Développer chaque section pour voir les exigences individuelles.'],
        ['2. Cliquer pour mettre à jour', 'Cliquer sur une case pour cycler : ✓ Conforme → ~ Partiel → ✕ Manquant → N/A.'],
        ['3. Suivre les liens', 'Chaque exigence affiche un lien → vers la page du système qui la satisfait.'],
        ['4. Suivre le score global', 'La barre de progression et le % se mettent à jour en temps réel.'],
        ['5. Imprimer pour l\'auditeur', 'Cliquer sur 🖨️ pour générer un document d\'évaluation formel.'],
      ],
      buttons: [
        ['🖨️ Imprimer le rapport', 'Imprimer la liste de conformité complète comme document d\'audit.'],
        ['Développer/Réduire', 'Cliquer sur un en-tête de clause pour afficher/masquer ses exigences.'],
        ['Cases à cocher', 'Cliquer pour cycler le statut : Conforme → Partiel → Manquant → N/A.'],
      ]
    },
    en: {
      role: 'Quality Manager / Management / Certification Body',
      purpose: 'Interactive checklist of ALL ISO 13485:2016 requirements. Use this to track your certification readiness, prepare for audits, and demonstrate compliance to your notified body.',
      process: [
        ['1. Review each clause', 'Expand each clause section to see individual requirements.'],
        ['2. Click to update status', 'Click any checkbox to cycle: ✓ Compliant → ~ Partial → ✕ Missing → N/A.'],
        ['3. Follow page links', 'Each requirement shows a → link to the page that satisfies it.'],
        ['4. Track overall score', 'The progress bar and % score updates in real time.'],
        ['5. Print for auditor', 'Click 🖨️ Print Report to generate a formal compliance assessment document.'],
      ],
      buttons: [
        ['🖨️ Print Report', 'Print the full compliance checklist as a formal audit-ready document.'],
        ['Expand/Collapse', 'Click any clause header to show/hide its requirements.'],
        ['Requirement checkboxes', 'Click to cycle status: Compliant → Partial → Missing → N/A.'],
      ]
    }
  },
  time_report: {
    fr: {
      role: 'Manager / RH',
      purpose: 'Analyser la productivité de l\'équipe sur toute période. Voir le temps productif vs perdu, comparer les employés, exporter les données pour la paie ou les évaluations.',
      process: [
        ['1. Sélectionner la période', 'Aujourd\'hui / Cette semaine / Ce mois — met à jour tous les KPIs et graphiques.'],
        ['2. Vérifier l\'efficacité', 'Temps productif ÷ Temps total = Efficacité %. Objectif > 70%.'],
        ['3. Résumé par employé', 'Tableau classé montrant le temps productif/non-productif de chaque employé.'],
        ['4. Filtrer les sessions', 'Rechercher par nom ou numéro de commande. Filtrer par type de session.'],
        ['5. Exporter', 'Télécharger le journal complet en CSV pour la paie ou les RH.'],
      ],
      buttons: [
        ['⬇ Exporter CSV', 'Télécharge toutes les sessions de la période en tableur.'],
        ['🖨️ Imprimer', 'Vue adaptée à l\'impression — barre latérale masquée automatiquement.'],
        ['↻ Actualiser', 'Recharger les données depuis la base de données.'],
      ]
    },
    en: {
      role: 'Manager / HR',
      purpose: 'Analyse team productivity across any period. See how much time is productive vs wasted, compare employees, and export data for payroll or performance reviews.',
      process: [
        ['1. Select period', 'Today / This Week / This Month — updates all KPIs and charts.'],
        ['2. Check efficiency KPI', 'Productive time ÷ Total time = Efficiency %. Target above 70%.'],
        ['3. Employee summary', 'Ranked table showing each employee\'s productive/non-productive split.'],
        ['4. Filter sessions', 'Search by employee name or order number. Filter by session type.'],
        ['5. Export', 'Download full session log as CSV for payroll or HR records.'],
      ],
      buttons: [
        ['⬇ Export CSV', 'Downloads all sessions for the period as a spreadsheet.'],
        ['🖨️ Print', 'Print-friendly view — sidebar hidden automatically.'],
        ['↻ Refresh', 'Reload data from database.'],
      ]
    }
  },
  clocking: {
    fr: {
      role: 'Opérateur production / Tous les employés',
      purpose: 'Terminal de pointage du temps en atelier. Les employés pointent en entrée/sortie des étapes de production, pauses et temps perdus. Conçu pour utilisation tactile sur le sol de production.',
      process: [
        ['1. Saisir le nom', 'Taper votre nom ou sélectionner dans la liste.'],
        ['2. Saisir la commande', 'Taper le numéro de dossier/commande Bloom à travailler.'],
        ['3. Sélectionner l\'étape', 'Impression, Nettoyage, Thermoformage, Découpe, Marquage laser, Emballage.'],
        ['4. Pointer en entrée', 'Appuyer sur le grand bouton. Le minuteur démarre.'],
        ['5. Passer à l\'étape suivante', 'Appuyer sur ▶ Étape suivante pour avancer sans pointer en sortie.'],
        ['6. Pointer en sortie', 'Appuyer sur le bouton de sortie quand terminé. Session sauvegardée.'],
      ],
      buttons: [
        ['▶ Étape suivante', 'Avancer à l\'étape de production suivante instantanément.'],
        ['Pointer en entrée', 'Démarrer une session minutée pour l\'étape sélectionnée.'],
        ['Pointer en sortie', 'Terminer la session et sauvegarder l\'enregistrement de temps.'],
      ]
    },
    en: {
      role: 'Production Operator / All Employees',
      purpose: 'Shop floor time tracking terminal. Employees clock in when starting a task and clock out when done. Designed for touchscreen use on the production floor.',
      process: [
        ['1. Enter name', 'Type your name or select from the list.'],
        ['2. Enter order number', 'Type the Bloom case/order number you are working on.'],
        ['3. Select step', 'Printing, Cleaning, Thermoforming, Line Cut, Laser Marking, Packaging.'],
        ['4. Clock In', 'Press the large clock-in button. Timer starts.'],
        ['5. Move to next step', 'Press ▶ Move to Next Step to advance without clocking out.'],
        ['6. Clock Out', 'Press clock-out when done. Session is saved automatically.'],
      ],
      buttons: [
        ['▶ Move to Next Step', 'Advance to the next production step instantly.'],
        ['Clock In', 'Start a new timed session for the selected step.'],
        ['Clock Out', 'End the current session and save the time record.'],
      ]
    }
  },
  inventory: {
    fr: {
      role: 'Magasinier / Responsable production',
      purpose: 'Gérer toutes les matières premières avec suivi FEFO (Premier Périmé Premier Sorti). Alerte automatique quand le stock passe sous le seuil minimum. Supporte le flux de réquisition.',
      process: [
        ['1. Ajouter des matières', 'Enregistrer chaque type de matière avec un seuil de stock minimum.'],
        ['2. Réceptionner les livraisons', 'Créer un lot pour chaque livraison : quantité, date de péremption, fournisseur.'],
        ['3. Consommation FEFO', 'Le système déduit automatiquement du lot le plus ancien en premier.'],
        ['4. Surveiller les alertes', 'Le tableau de bord affiche les alertes stock pour les articles sous le seuil.'],
        ['5. Demander un réapprovisionnement', 'Créer une réquisition pour demander l\'approbation d\'achat.'],
      ],
      buttons: [
        ['+ Ajouter Matière', 'Enregistrer un nouveau type de matière.'],
        ['+ Réceptionner Lot', 'Enregistrer une nouvelle livraison comme lot daté.'],
        ['📋 Réquisitions', 'Soumettre une demande de réapprovisionnement.'],
      ]
    },
    en: {
      role: 'Warehouse / Production Manager',
      purpose: 'Manage all raw materials using FEFO (First Expired First Out) lot tracking. Automatically alerts when stock falls below minimum. Supports purchase requisition workflow.',
      process: [
        ['1. Add materials', 'Register each material type with a minimum stock threshold.'],
        ['2. Receive deliveries', 'Create a lot for each delivery: quantity, expiry date, supplier.'],
        ['3. FEFO consumption', 'System automatically deducts from the oldest lot first.'],
        ['4. Monitor alerts', 'Dashboard shows stock alerts for items below minimum threshold.'],
        ['5. Request restock', 'Create a requisition to request purchasing approval.'],
      ],
      buttons: [
        ['+ Add Material', 'Register a new material type.'],
        ['+ Receive Lot', 'Record a new delivery as a dated lot.'],
        ['📋 Requisitions', 'Submit a restock request to management.'],
      ]
    }
  },
  bloom_import: {
    fr: {
      role: 'Responsable production / Responsable commandes',
      purpose: 'Synchroniser les dossiers patients d\'aligneurs depuis bloomaligner.fr. Deux formats : CSV pour les mises à jour de statut, Excel pour les détails d\'aligneurs et d\'expédition.',
      process: [
        ['Import CSV', 'Exporter depuis bloomaligner.fr → importer ici → met à jour statuts, retards, médecin/distributeur.'],
        ['Import Excel', 'Importer le fichier Excel Bloom → lit la feuille SHIPPING (boîtes, dates) et ALIGNER (quantités).'],
        ['Onglet Dossiers', 'Liste complète triable/filtrable de tous les dossiers.'],
        ['Onglet Aligneurs', 'Toutes les commandes d\'aligneurs avec quantités supérieur/inférieur.'],
        ['Onglet Analytique', 'Graphiques : dossiers par statut, aligneurs par type de commande.'],
      ],
      buttons: [
        ['📂 Importer CSV', 'Télécharger un export CSV de bloomaligner.fr.'],
        ['📊 Importer Excel', 'Télécharger le fichier Excel Bloom.'],
        ['↻ Actualiser', 'Recharger toutes les données.'],
      ]
    },
    en: {
      role: 'Production Manager / Order Manager',
      purpose: 'Sync patient aligner cases from bloomaligner.fr. Two import formats: CSV for case status updates, Excel for aligner and shipping details.',
      process: [
        ['CSV Import', 'Export from bloomaligner.fr → import here → updates case statuses, overdue flags, doctor info.'],
        ['Excel Import', 'Import Bloom Excel file → reads SHIPPING sheet + ALIGNER sheet.'],
        ['Cases tab', 'Full sortable/filterable list of all cases.'],
        ['Aligners tab', 'All aligner orders with upper/lower counts.'],
        ['Analytics tab', 'Charts: cases by status, aligners by order type.'],
      ],
      buttons: [
        ['📂 Import CSV', 'Upload a CSV export from bloomaligner.fr.'],
        ['📊 Import Excel', 'Upload the Bloom Excel file.'],
        ['↻ Refresh', 'Reload all data from the database.'],
      ]
    }
  },
  qualite: {
    fr: {
      role: 'Contrôleur qualité / Responsable qualité',
      purpose: 'ISO 13485 Clause 8.2.4 — Effectuer le contrôle qualité en 16 points pour chaque lot de production avant la libération. Chaque lot doit passer le QC avant d\'être expédié au patient.',
      process: [
        ['1. Sélectionner le lot', 'Choisir le lot dans le menu déroulant. Les lots apparaissent après création dans Production.'],
        ['2. Sélectionner le contrôleur', 'Entrer le nom de l\'employé effectuant le QC.'],
        ['3. Compléter les 16 points', 'Chaque point est Réussi / Échoué / N/A. Couvre : dimensions, surface, ajustement, étiquetage, emballage.'],
        ['4. Soumettre le QC', 'Tous les points doivent être réussis. Le statut du lot est mis à jour automatiquement.'],
        ['5. Lot échoué', 'Si échoué → créer immédiatement un rapport de Non-Conformité.'],
      ],
      buttons: [
        ['Soumettre QC', 'Sauvegarder les résultats du contrôle qualité pour ce lot.'],
        ['🖨️ Imprimer Certificat', 'Imprimer le certificat QC pour le dossier de lot.'],
      ]
    },
    en: {
      role: 'Quality Controller / Quality Manager',
      purpose: 'ISO 13485 Clause 8.2.4 — Perform 16-point quality inspection for each production lot before release. Every aligner batch must pass QC before shipping to the patient.',
      process: [
        ['1. Select production lot', 'Choose the lot from the dropdown. Lots appear after being created in Production.'],
        ['2. Select controller', 'Enter the name of the employee performing QC.'],
        ['3. Complete 16 checkpoints', 'Each checkpoint is Pass / Fail / N/A. Cover: dimensions, surface, fit, labelling, packaging.'],
        ['4. Submit QC', 'All checkpoints must pass. Lot status updates automatically.'],
        ['5. Failed lot action', 'If failed → immediately create a Non-Conformity report.'],
      ],
      buttons: [
        ['Submit QC', 'Save the quality control results for this lot.'],
        ['🖨️ Print Certificate', 'Print the QC certificate for the batch record.'],
      ]
    }
  },
  tracabilite: {
    fr: {
      role: 'Responsable qualité / Responsable production',
      purpose: 'ISO 13485 Clause 7.5.9 — Traçabilité complète de la commande. Pour toute commande, voir chaque étape de production, lot de matière utilisé, résultat QC et employé impliqué.',
      process: [
        ['1. Rechercher la commande', 'Saisir le numéro de dossier ou commande Bloom.'],
        ['2. Voir les étapes', 'Chaque étape complétée avec horodatage et nom d\'employé.'],
        ['3. Vérifier les matières', 'Lots de matières consommés avec numéros de lot et quantités.'],
        ['4. Voir les résultats QC', 'Résultats du contrôle qualité liés à ce lot.'],
        ['5. Imprimer la fiche', 'Générer le document de traçabilité pour le dossier de lot.'],
      ],
      buttons: [
        ['🔍 Rechercher', 'Trouver une commande par numéro.'],
        ['🖨️ Imprimer Fiche de Traçabilité', 'Imprimer le document formel pour le dossier de lot.'],
      ]
    },
    en: {
      role: 'Quality Manager / Production Manager',
      purpose: 'ISO 13485 Clause 7.5.9 — Complete order traceability. For any order, see every production step, material lot used, QC result, and employee involved.',
      process: [
        ['1. Search order', 'Enter the Bloom case or order number.'],
        ['2. View steps', 'Every production step completed with timestamp and employee name.'],
        ['3. Check materials', 'Material lots consumed with lot numbers and quantities.'],
        ['4. See QC result', 'Quality control results linked to this order.'],
        ['5. Print sheet', 'Generate a formal traceability document for the batch record.'],
      ],
      buttons: [
        ['🔍 Search', 'Find an order by case or order number.'],
        ['🖨️ Print Traceability Sheet', 'Print the formal document for the batch record.'],
      ]
    }
  },
  employees: {
    fr: {
      role: 'RH / Administrateur système',
      purpose: 'Gérer tous les membres de l\'équipe. Contrôler qui peut se connecter, quel rôle ils ont, et quelles pages ils peuvent accéder.',
      process: [
        ['1. Ajouter un employé', 'Nom, PIN, rôle et permissions d\'accès aux pages.'],
        ['2. Assigner un rôle', 'Manager = tout. Opérateur = production/pointage. Rôles personnalisés dans la page Rôles.'],
        ['3. Définir l\'accès aux pages', 'Cocher les pages auxquelles cet employé peut accéder.'],
        ['4. Actif / Inactif', 'Les employés inactifs ne peuvent pas se connecter mais leur historique est conservé.'],
      ],
      buttons: [
        ['+ Ajouter Employé', 'Créer un nouveau compte membre de l\'équipe.'],
        ['✏️ Modifier', 'Mettre à jour nom, PIN, rôle ou accès.'],
        ['👤 Profil', 'Voir l\'historique complet et la productivité.'],
      ]
    },
    en: {
      role: 'HR Manager / System Administrator',
      purpose: 'Manage all team members. Control who can log in, what role they have, and which pages they can access.',
      process: [
        ['1. Add employee', 'Name, PIN, role, and page access permissions.'],
        ['2. Assign role', 'Manager = all pages. Operator = production/clocking. Custom roles defined in Roles page.'],
        ['3. Set page access', 'Toggle which sidebar pages this employee can see.'],
        ['4. Active/Inactive', 'Inactive employees cannot log in but their history is preserved.'],
      ],
      buttons: [
        ['+ Add Employee', 'Create a new team member account.'],
        ['✏️ Edit', 'Update name, PIN, role, or page access.'],
        ['👤 Profile', 'View full session history and productivity.'],
      ]
    }
  },
  machines: {
    fr: {
      role: 'Responsable production / Technicien de maintenance',
      purpose: 'Enregistrer et gérer tout l\'équipement de production. Suivre quelle machine est assignée à quelle étape, son statut actuel, et lier à l\'historique de maintenance complet.',
      process: [
        ['1. Ajouter une machine', 'Enregistrer avec nom, type et étapes de production assignées.'],
        ['2. Définir le statut', 'Actif = prête. Maintenance = en service. Hors service = indisponible.'],
        ['3. Surveiller l\'utilisation', 'Voir combien de lots et sessions chaque machine a traités.'],
        ['4. Enregistrer la maintenance', 'Cliquer sur "Maintenance" pour aller au journal de maintenance.'],
      ],
      buttons: [
        ['+ Ajouter Machine', 'Enregistrer un nouvel équipement.'],
        ['✏️ Modifier', 'Mettre à jour les détails ou le statut.'],
        ['🔧 Maintenance', 'Voir l\'historique complet de maintenance.'],
      ]
    },
    en: {
      role: 'Production Manager / Maintenance Technician',
      purpose: 'Register and manage all production equipment. Track which machine is assigned to which step, its current status, and link to full maintenance history.',
      process: [
        ['1. Add machine', 'Register machine with name, type, and assigned production step(s).'],
        ['2. Set status', 'Active = ready. Maintenance = under service. Out of Service = unavailable.'],
        ['3. Monitor utilisation', 'See how many lots and sessions each machine has processed.'],
        ['4. Log maintenance', 'Click "Maintenance" to go to the maintenance log for this machine.'],
      ],
      buttons: [
        ['+ Add Machine', 'Register a new piece of equipment.'],
        ['✏️ Edit', 'Update machine details or status.'],
        ['🔧 Maintenance', 'View the full maintenance history.'],
      ]
    }
  },
  settings: {
    fr: {
      role: 'Administrateur système / Manager',
      purpose: 'Configurer les notifications système et les intégrations. Paramétrer les alertes email Brevo pour les événements clés : stock bas, échecs QC, rapports NC et résumés quotidiens.',
      process: [
        ['1. Saisir la clé API Brevo', 'Obtenir la clé depuis brevo.com et la coller ici.'],
        ['2. Définir les destinataires', 'Saisir les adresses email pour les notifications.'],
        ['3. Choisir les événements', 'Sélectionner quels événements déclenchent des emails.'],
        ['4. Tester la notification', 'Envoyer un email test pour vérifier l\'intégration.'],
        ['5. Sauvegarder', 'Les paramètres sont stockés en base de données et appliqués immédiatement.'],
      ],
      buttons: [
        ['Sauvegarder', 'Enregistrer toute la configuration en base de données.'],
        ['Test Email', 'Envoyer une notification test pour vérifier Brevo.'],
      ]
    },
    en: {
      role: 'System Administrator / Manager',
      purpose: 'Configure system notifications and integrations. Set up Brevo email alerts for key events: low stock, QC failures, NC reports, and daily production summaries.',
      process: [
        ['1. Enter Brevo API key', 'Obtain your API key from brevo.com and paste it here.'],
        ['2. Set recipient emails', 'Enter email addresses to receive notifications.'],
        ['3. Choose notification events', 'Select which events trigger emails.'],
        ['4. Test notification', 'Send a test email to verify the integration works.'],
        ['5. Save settings', 'All settings are stored in the database and applied immediately.'],
      ],
      buttons: [
        ['Save Settings', 'Store all notification configuration to the database.'],
        ['Test Email', 'Send a test notification to verify Brevo is connected.'],
      ]
    }
  },
  roles: {
    fr: {
      role: 'Administrateur système',
      purpose: 'Définir des rôles personnalisés et contrôler l\'accès aux pages. Chaque employé est assigné à un rôle — ils ne voient que les pages que leur rôle autorise.',
      process: [
        ['1. Créer un rôle', 'Nom, étiquette, puis sélectionner les pages accessibles.'],
        ['2. Assigner aux employés', 'Aller dans la page Employés pour assigner le rôle.'],
        ['3. Matrice d\'accès', 'Le tableau en bas montre tous les rôles vs toutes les pages.'],
        ['4. Rôles système', 'Manager et Employé sont des rôles système non modifiables.'],
      ],
      buttons: [
        ['+ Créer Rôle', 'Créer un rôle personnalisé avec accès spécifique aux pages.'],
        ['✏️ Modifier', 'Modifier quelles pages un rôle peut accéder.'],
        ['Tout sélectionner', 'Donner accès à toutes les pages.'],
        ['Tout effacer', 'Retirer tous les accès aux pages.'],
      ]
    },
    en: {
      role: 'System Administrator',
      purpose: 'Define custom roles and control page access. Every employee is assigned a role — they can only see pages their role allows.',
      process: [
        ['1. Create a role', 'Name it, label it, then select which pages are accessible.'],
        ['2. Assign to employees', 'Go to Employees page to assign the role to team members.'],
        ['3. Permission matrix', 'The table shows all roles vs all pages at a glance.'],
        ['4. System roles', 'Manager and Employee are system roles and cannot be deleted.'],
      ],
      buttons: [
        ['+ Create Role', 'Create a custom role with specific page access.'],
        ['✏️ Edit', 'Modify which pages a role can access.'],
        ['Select All', 'Grant access to all pages.'],
        ['Clear All', 'Remove all page access.'],
      ]
    }
  },
  changelog: {
    fr: {
      role: 'Tous les utilisateurs / Direction',
      purpose: 'Historique complet de chaque changement apporté à la plateforme de la v1.0 à la version actuelle. Utilisez ceci pour comprendre ce qui a été ajouté, corrigé ou amélioré.',
      process: [
        ['Lire l\'historique des versions', 'Chaque carte affiche une version avec : nouvelles fonctionnalités, corrections, améliorations.'],
        ['Vérifier le statut ISO', 'La carte d\'évaluation ISO 13485 montre quelles clauses sont satisfaites.'],
        ['Consulter la feuille de route v3.0', 'Les fonctionnalités prévues pour la prochaine version majeure.'],
      ],
      buttons: [
        ['Cartes de version', 'Chaque carte correspond à une version — faire défiler pour lire la liste complète.'],
        ['Carte de conformité ISO', 'Affiche le statut de conformité ISO 13485 actuel par clause.'],
      ]
    },
    en: {
      role: 'All Users / Management',
      purpose: 'Complete history of every change made to the platform. Use this to understand what was added, fixed, or improved — and what is planned next.',
      process: [
        ['Read version history', 'Each card shows one version with: new features, bug fixes, improvements.'],
        ['Check ISO compliance status', 'The ISO 13485 assessment card shows which clauses are met.'],
        ['Review v3.0 roadmap', 'See what features are planned in the next major release.'],
      ],
      buttons: [
        ['Version cards', 'Each card is one release — scroll to read the full change list.'],
        ['ISO compliance card', 'Shows current ISO 13485 compliance status per clause.'],
      ]
    }
  },
  employee_profile: {
    fr: {
      role: 'Manager / RH',
      purpose: 'Profil détaillé pour chaque employé. Consulter l\'historique complet des sessions, les graphiques de productivité et les informations personnelles.',
      process: [
        ['1. Sélectionner la période', 'Changer Aujourd\'hui/Semaine/Mois pour voir les performances.'],
        ['2. Lire le graphique', 'Graphique en barres : heures productives (vert) vs non-productives (orange).'],
        ['3. Consulter les sessions', 'Liste complète de chaque session pointée.'],
        ['4. Modifier le profil', 'Mettre à jour les informations de l\'employé directement.'],
      ],
      buttons: [
        ['← Retour', 'Retourner à la liste des employés.'],
        ['✏️ Modifier le profil', 'Mettre à jour nom, PIN ou rôle.'],
        ['⬇ Exporter', 'Télécharger l\'historique des sessions en CSV.'],
      ]
    },
    en: {
      role: 'Manager / HR',
      purpose: 'Detailed profile page for each employee. View their complete session history, productivity charts, and personal information.',
      process: [
        ['1. Select period', 'Change Today/Week/Month to see performance over different timeframes.'],
        ['2. Read productivity chart', 'Bar chart shows productive (green) vs non-productive (amber) hours per day.'],
        ['3. Review sessions', 'Full list of every clocked session — step, machine, order, duration.'],
        ['4. Edit profile', 'Update employee details directly from this page.'],
      ],
      buttons: [
        ['← Back', 'Return to the full employees list.'],
        ['✏️ Edit Profile', 'Update employee name, PIN, or role.'],
        ['⬇ Export', 'Download this employee\'s session history as CSV.'],
      ]
    }
  },
  production_materials: {
    fr: {
      role: 'Responsable production / Magasinier',
      purpose: 'Suivre les lots de matières par machine de production en utilisant FEFO (Premier Périmé Premier Sorti). Le système déduit du lot le plus ancien lors de l\'enregistrement de production.',
      process: [
        ['1. Réceptionner une livraison', 'Créer un lot : type matière, quantité, date expiration, fournisseur, numéro lot.'],
        ['2. Assigner à une machine', 'Lier le lot à la machine de production qui va le consommer.'],
        ['3. Déduction automatique', 'Lors d\'un lot de production, la matière est déduite du lot le plus ancien.'],
        ['4. Surveiller les niveaux', 'Les lots épuisés sont signalés. Les lots proches de l\'expiration en orange.'],
      ],
      buttons: [
        ['+ Ajouter Lot', 'Enregistrer une nouvelle livraison de matière.'],
        ['Assigner à Machine', 'Lier un lot à une machine spécifique.'],
        ['📋 Journal de consommation', 'Voir chaque déduction effectuée depuis ce lot.'],
      ]
    },
    en: {
      role: 'Production Manager / Warehouse',
      purpose: 'Track material lots loaded on each machine using FEFO (First Expired First Out). When production is logged, the system deducts from the oldest lot on that machine first.',
      process: [
        ['1. Receive delivery', 'Create a lot: material type, quantity, expiry date, supplier, lot number.'],
        ['2. Assign to machine', 'Link the lot to the machine that will consume it.'],
        ['3. Production deducts automatically', 'When a production batch is logged, material is deducted from the oldest lot.'],
        ['4. Monitor levels', 'Depleted lots are flagged. Near-expiry lots shown in amber.'],
      ],
      buttons: [
        ['+ Add Lot', 'Register a new material delivery as a lot.'],
        ['Assign to Machine', 'Link a lot to a specific production machine.'],
        ['📋 Consumption Log', 'See every deduction made from this lot.'],
      ]
    }
  },
};

// ─── Build bilingual help panel HTML ───────────────────────────────────
CW_HELP.buildPanel = function(pageKey, iconEmoji, pageTitleFR, pageTitleEN) {
  const data = this[pageKey];
  if (!data) return '';

  const buildContent = (lang) => {
    const d = data[lang];
    if (!d) return '';
    const processHtml = d.process.map(([ step, desc ], i) =>
      `<div style="display:flex;gap:10px;margin-bottom:8px;align-items:flex-start">
        <span style="background:var(--blue);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;margin-top:1px">${i+1}</span>
        <div><div style="font-size:12px;font-weight:700;color:var(--txt)">${step}</div>
        <div style="font-size:11px;color:var(--mu);margin-top:1px">${desc}</div></div></div>`
    ).join('');
    const buttonsHtml = d.buttons.map(([ btn, desc ]) =>
      `<div style="display:flex;gap:8px;margin-bottom:6px;align-items:flex-start">
        <span style="font-family:var(--mono);font-size:10px;background:#f1f5f9;border:1px solid var(--bdr);border-radius:5px;padding:2px 7px;white-space:nowrap;color:var(--blue);font-weight:700;flex-shrink:0">${btn}</span>
        <span style="font-size:11px;color:var(--mu)">${desc}</span></div>`
    ).join('');
    return `
      <div style="padding:14px 22px 10px">
        <div style="background:var(--b50);border-left:3px solid var(--blue);border-radius:0 8px 8px 0;padding:10px 14px;font-size:12px;color:var(--blue);font-weight:500;line-height:1.5">${d.purpose}</div>
      </div>
      <div style="padding:4px 22px 10px">
        <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">${lang === 'fr' ? 'Flux de processus' : 'Process Flow'}</div>
        ${processHtml}
      </div>
      <div style="padding:4px 22px 16px">
        <div style="font-size:11px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">${lang === 'fr' ? 'Boutons & Contrôles' : 'Buttons & Controls'}</div>
        ${buttonsHtml}
      </div>`;
  };

  return `
<button id="helpBtn" onclick="document.getElementById('helpPanel').style.display='flex'"
  style="position:fixed;bottom:50px;right:20px;width:42px;height:42px;border-radius:50%;
         background:var(--blue);color:#fff;border:none;font-size:20px;font-weight:800;
         cursor:pointer;box-shadow:0 4px 20px rgba(59,95,226,.5);z-index:9000;
         display:flex;align-items:center;justify-content:center;font-family:var(--f);
         transition:transform .15s,box-shadow .15s"
  onmouseover="this.style.transform='scale(1.1)'"
  onmouseout="this.style.transform='scale(1)'">?</button>

<div id="helpPanel" style="position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:9001;
     display:none;align-items:center;justify-content:center;padding:20px">
  <div style="background:var(--card);border-radius:18px;width:100%;max-width:580px;
              max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)">
    <!-- Header -->
    <div id="helpHeader" style="padding:18px 22px 14px;border-bottom:1px solid var(--bdr);
         display:flex;align-items:center;gap:12px;position:sticky;top:0;
         background:var(--card);border-radius:18px 18px 0 0;z-index:1">
      <div style="width:40px;height:40px;background:var(--b50);border-radius:10px;
           display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">${iconEmoji}</div>
      <div style="flex:1">
        <div id="helpTitle" style="font-size:15px;font-weight:800;color:var(--txt)"></div>
        <div id="helpRole" style="font-size:11px;color:var(--mu);margin-top:1px"></div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button id="helpLangToggle" onclick="CW_HELP.switchLang('${pageKey}')"
          style="background:var(--bg);border:1.5px solid var(--bdr);border-radius:8px;
                 padding:4px 10px;cursor:pointer;font-family:var(--f);font-size:11px;font-weight:600;color:var(--txt)"></button>
        <button onclick="document.getElementById('helpPanel').style.display='none'"
          style="background:none;border:1.5px solid var(--bdr);border-radius:8px;
                 padding:5px 12px;cursor:pointer;font-family:var(--f);font-size:12px;color:var(--mu)">✕</button>
      </div>
    </div>
    <!-- Content FR -->
    <div id="helpContentFR">${buildContent('fr')}</div>
    <!-- Content EN -->
    <div id="helpContentEN" style="display:none">${buildContent('en')}</div>
    <!-- Footer -->
    <div style="padding:10px 22px;border-top:1px solid var(--bdr);background:#f8fafc;border-radius:0 0 18px 18px">
      <div style="font-size:10px;color:var(--dim);text-align:center">© 2026 Cedarwings SAS · ISO 13485 Platform v2.0</div>
    </div>
  </div>
</div>`;
};

CW_HELP.switchLang = function(pageKey) {
  const data = this[pageKey];
  if (!data) return;
  const frDiv = document.getElementById('helpContentFR');
  const enDiv = document.getElementById('helpContentEN');
  const langBtn = document.getElementById('helpLangToggle');
  const title = document.getElementById('helpTitle');
  const role = document.getElementById('helpRole');
  const isFR = frDiv.style.display !== 'none';
  if (isFR) {
    frDiv.style.display = 'none';
    enDiv.style.display = 'block';
    langBtn.textContent = '🇫🇷 Français';
    title.textContent = data.en ? (document.getElementById('helpPanel').getAttribute('data-title-en') || '') : '';
    role.textContent = 'Role: ' + (data.en?.role || '');
  } else {
    frDiv.style.display = 'block';
    enDiv.style.display = 'none';
    langBtn.textContent = '🇬🇧 English';
    title.textContent = document.getElementById('helpPanel').getAttribute('data-title-fr') || '';
    role.textContent = 'Rôle : ' + (data.fr?.role || '');
  }
};

CW_HELP.init = function(pageKey, icon, titleFR, titleEN) {
  const panel = document.getElementById('helpPanel');
  if (!panel) return;
  panel.setAttribute('data-title-fr', titleFR);
  panel.setAttribute('data-title-en', titleEN);
  const title = document.getElementById('helpTitle');
  const role = document.getElementById('helpRole');
  const langBtn = document.getElementById('helpLangToggle');
  const data = this[pageKey];
  if (title) title.textContent = titleFR;
  if (role && data) role.textContent = 'Rôle : ' + (data.fr?.role || '');
  if (langBtn) langBtn.textContent = '🇬🇧 English';
};

// Auto-initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  CW_LANG.injectToggle();
  CW_LANG.apply();
});
