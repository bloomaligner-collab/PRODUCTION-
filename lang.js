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
  dashboard: {
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
      purpose: 'ISO 13485 Clause 7.4 — Liste des Fournisseurs Approuvés (LFA). Aucun achat ne peut être passé en dehors de cette liste. Chaque fournisseur doit être évalué avant la première commande (score de qualification), puis réévalué annuellement. Le système alimente la page Réquisitions : les dropdowns fournisseur n\'affichent que les statuts Approuvé/Conditionnel.',
      process: [
        ['1. Ajouter un fournisseur', 'Cliquer + Ajouter Fournisseur. Saisir raison sociale, contact (nom/email/téléphone), adresse, SIRET/TVA, catégorie (matière première, sous-traitance, consommable…).'],
        ['2. Évaluation initiale', 'Avant toute première commande : noter de 0 à 100 les critères : qualité, fiabilité de livraison, certifications (ISO 9001, 13485, CE), réactivité. Joindre les certificats.'],
        ['3. Statut', 'Approuvé (toutes commandes autorisées) · Conditionnel (achats suivis, période probatoire) · Suspendu (aucune nouvelle commande) · Disqualifié (archivé, non sélectionnable).'],
        ['4. Réévaluation annuelle', 'Obligatoire. La LFA montre en rouge les fournisseurs dont la dernière évaluation remonte à plus de 12 mois. Refaire l\'évaluation pour réinitialiser le compteur.'],
        ['5. Paramétrage Outsourcing', 'Pour les sous-traitants aligneurs : cocher « ★ Set as default distributor » et renseigner le Prix par défaut / aligneur + devise. Ces valeurs remplissent automatiquement le formulaire Outsourcing → Prepared List Order — pas besoin de les resaisir à chaque commande.'],
        ['6. Historique d\'achats', 'Chaque fournisseur affiche ses commandes passées via Réquisitions — nombre de lots livrés, litiges, défauts remontés dans Non-Conformité.'],
        ['7. Suppression', 'La suppression est à éviter — préférer Disqualifié pour conserver la traçabilité historique des achats.'],
      ],
      buttons: [
        ['+ Ajouter Fournisseur', 'Formulaire de création + évaluation initiale.'],
        ['✏️ Modifier', 'Mettre à jour contact, statut, score, dates d\'évaluation, distributeur par défaut, prix par défaut.'],
        ['🗑 Supprimer', 'Supprimer définitivement (déconseillé si historique d\'achats).'],
        ['💾 Enregistrer', 'Sauvegarder les modifications du formulaire.'],
        ['Annuler', 'Fermer le formulaire sans enregistrer.'],
        ['🦷 Prix par défaut / aligneur', 'Prix unitaire en EUR/USD/GBP utilisé comme valeur de départ sur la page Outsourcing → Prepared List Order. Modifiable par commande.'],
        ['★ Set as default distributor', 'Case à cocher. Un seul fournisseur à la fois — contrainte en base. Ce fournisseur est pré-sélectionné dans le formulaire de bon de commande Outsourcing.'],
        ['★ Default (badge violet sur la carte)', 'Indique visuellement le fournisseur marqué comme distributeur par défaut.'],
      ]
    },
    en: {
      role: 'Purchasing Manager / Quality Manager',
      purpose: 'ISO 13485 Clause 7.4 — Approved Supplier List (ASL). No purchase may be made outside this list. Every supplier must be evaluated before first order (qualification score), then re-evaluated annually. Feeds the Requisitions page: supplier dropdowns only show Approved/Conditional statuses. Also holds the default distributor + default €/aligner used by Outsourcing.',
      process: [
        ['1. Add a supplier', 'Click + Add Supplier. Enter legal name, contact (name/email/phone), address, tax ID, category (raw material, sub-contractor, consumable…).'],
        ['2. Initial evaluation', 'Before any first order: score 0-100 on: quality, delivery reliability, certificates (ISO 9001, 13485, CE), responsiveness. Attach certificates.'],
        ['3. Status', 'Approved (all orders allowed) · Conditional (tracked purchases, probation) · Suspended (no new orders) · Disqualified (archived, not selectable).'],
        ['4. Annual re-evaluation', 'Mandatory. The ASL shows in red any supplier whose last evaluation is >12 months old. Re-run the evaluation to reset the counter.'],
        ['5. Outsourcing defaults', 'For aligner sub-contractors: tick "Set as default distributor" and set Default Price / Aligner + currency. These values auto-fill the Outsourcing → Prepared List Order form so you don\'t retype them every time.'],
        ['6. Purchase history', 'Each supplier shows their past orders via Requisitions — number of lots delivered, disputes, defects routed to Non-Conformity.'],
        ['7. Deletion', 'Avoid — prefer Disqualified to keep purchase history traceable.'],
      ],
      buttons: [
        ['+ Add Supplier', 'Create-and-evaluate form.'],
        ['✏️ Edit', 'Update contact, status, score, evaluation dates, default-distributor flag, default price.'],
        ['🗑 Delete', 'Hard-delete (discouraged if purchase history exists).'],
        ['💾 Save', 'Persist form changes.'],
        ['Cancel', 'Close the form without saving.'],
        ['🦷 Default Price / Aligner', 'Unit price in EUR/USD/GBP used as the starting value on Outsourcing → Prepared List Order. Overridable per order.'],
        ['★ Set as default distributor', 'Checkbox. Only one supplier can hold this flag (enforced at the DB). That supplier is auto-selected when you prepare an outsourced order.'],
        ['★ Default (purple badge on the card)', 'Visual marker that identifies the current default distributor.'],
      ]
    }
  },

  outsourcing: {
    fr: {
      role: 'Responsable Production / Responsable Achats · Consultation : Responsable Qualité',
      purpose: 'Gérer la sous-traitance de la fabrication d\'aligneurs : sélectionner des cas à confier, générer un bon de commande groupé (PO), suivre la réception, l\'enregistrement de la facture et le paiement. Indicateurs mensuels (In-House vs Outsourced), suivi des retours en retard, relance facture. La page lit les cas directement depuis la base Bloom et ne duplique rien.',
      process: [
        ['1. Configurer le distributeur par défaut', 'Page Suppliers → éditer le sous-traitant aligneurs → cocher ★ Set as default distributor + renseigner le Prix par défaut / aligneur. Ces valeurs pré-rempliront le bon de commande.'],
        ['2. Choisir les cas à sous-traiter (onglet Cases)', 'Cliquer l\'icône ＋ sur chaque cas « In-House ». Il devient ✓ violet. Multi-sélection possible. Le compteur en haut de page affiche : nombre de cas · aligneurs totaux · ↑ upper · ↓ lower · montant estimé. Cliquer le compteur ouvre l\'onglet suivant.'],
        ['3. Préparer le bon de commande (onglet Prepared List Order)', 'Distributeur = le fournisseur par défaut (modifiable) · Prix = le prix par défaut (modifiable par ligne si besoin) · Expected Return Date (obligatoire) · Expected Invoice Date (optionnel). Un PO# unique est généré automatiquement (PO-YYYYMMDD-XXXX).'],
        ['4. Enregistrer le PO', 'Bouton 💾 Save & Create Orders. Une ligne outsourced_orders est créée par cas, toutes partageant le même batch_ref (PO#). Le tableau de bord affiche alors le compteur « jours restants » par commande.'],
        ['5. Réception (onglet Orders)', 'À l\'arrivée des aligneurs, cliquer 📦 sur la ligne (ou ouvrir le PO # et utiliser « Mark All Received » pour tout le lot). Saisir Received Date et, si connu, Expected Invoice Date.'],
        ['6. Enregistrement facture', 'À réception de la facture du fournisseur, cliquer 🧾 (ou « Record PO Invoice » dans la modale PO). Saisir Invoice #, Invoice Received Date, montant et statut (pending / approved / disputed).'],
        ['7. Règlement', 'Après paiement, cliquer 💰 Mark Paid (ou « Mark All Paid » pour tout le PO). Le dossier passe en statut « paid » et disparaît des compteurs « à payer ».'],
        ['8. Suivi permanent', 'Le Tableau de Bord montre en permanence : Outsourced Orders Awaiting Return (jours restants), Outsourced Invoices Awaiting. Les 7 KPIs sur la page Outsourcing sont cliquables — ils pré-filtrent l\'onglet Orders.'],
      ],
      buttons: [
        ['＋ Pick (colonne Cases)', 'Sélectionner un cas In-House pour le prochain bon de commande. Cliquer à nouveau pour désélectionner.'],
        ['✓ (violet)', 'Cas actuellement sélectionné dans le brouillon de PO.'],
        ['Compteur d\'en-tête (🦷)', 'Apparaît dès qu\'un cas est sélectionné. Affiche cases · aligneurs · ↑ upper · ↓ lower · montant estimé. Cliquer = ouvrir l\'onglet Prepared Order.'],
        ['📝 Prepared List Order', 'Onglet / bouton pour finaliser le PO : distributeur, prix, dates attendues. 💾 Save & Create Orders crée les lignes.'],
        ['PO # violet souligné', 'Cliquer le numéro ouvre la modale détail PO : toutes les lignes du même lot, pipeline, actions groupées (Mark All Received, Record PO Invoice, Mark All Paid).'],
        ['📦 Mark Received', 'Enregistre la date de réception physique du lot aligneurs. Ferme le compteur « jours restants ».'],
        ['🧾 Record Invoice', 'Saisir numéro de facture + date reçue + montant + statut. N\'apparaît qu\'après réception.'],
        ['💰 Mark Paid', 'Passe la ligne en payé. N\'apparaît qu\'après enregistrement de la facture.'],
        ['✏️ Edit', 'Rouvrir la ligne pour corriger supplier/prix/dates/notes.'],
        ['↩ Undo (Cases)', 'Supprime la ligne outsourced_orders et renvoie le cas en In-House.'],
        ['Pipeline (4 points)', '① Outsourced · ② Received · ③ Invoiced · ④ Paid. Vert = fait · Ambre pulsant = étape en cours · Rouge = retour en retard.'],
        ['Filtre « Lifecycle »', 'Awaiting return · Received — no invoice · Invoiced — unpaid · Paid. Raccourcis depuis les KPIs.'],
        ['KPIs en haut de page', 'Tous cliquables. Outsourced (month) · Aligners (month) · Awaiting Return · Awaiting Invoice · To Pay (month) · Overdue Returns · In-House (month).'],
        ['Tri ↕ / ▲ / ▼', 'Cliquer n\'importe quelle entête de colonne pour trier A→Z. Re-cliquer inverse le tri.'],
        ['⬇ Export CSV', 'Export de la liste courante (Cases, Orders, ou Supplier Breakdown).'],
        ['Report : chart « In-House vs Outsourced »', 'Aligneurs internes (issus des validations Packaging × Bloom aligners) vs sous-traités. La courbe orange de droite = % sous-traité.'],
        ['Report : chart « Outsourced € spend »', 'Dépense sous-traitance par mois.'],
        ['Supplier Breakdown', 'Récap fournisseur du mois : cas, aligneurs, prix moyen/aligneur, total, pending, paid.'],
      ]
    },
    en: {
      role: 'Production Manager / Purchasing Manager · Read-only for Quality Manager',
      purpose: 'Manage the sub-contracting of aligner production: select cases to outsource, generate a grouped Purchase Order (PO), track return, invoice registration and payment. Monthly In-House vs Outsourced reporting, overdue-return watch, invoice follow-up. The page reads cases straight from the Bloom database — it never duplicates them.',
      process: [
        ['1. Set your default distributor', 'Suppliers page → edit your aligner sub-contractor → tick ★ Set as default distributor and fill the Default Price / Aligner. These pre-fill the PO form so you don\'t retype them.'],
        ['2. Pick cases to outsource (Cases tab)', 'Click the ＋ icon on any In-House case. It flips to ✓ purple. Multi-select. The header counter shows: cases · total aligners · ↑ upper · ↓ lower · estimated amount. Clicking the counter opens the next tab.'],
        ['3. Prepare the PO (Prepared List Order tab)', 'Distributor auto-set to the default (changeable) · Price auto-filled (per-row overridable) · Expected Return Date (required) · Expected Invoice Date (optional). A unique PO# is generated (PO-YYYYMMDD-XXXX).'],
        ['4. Save the PO', '💾 Save & Create Orders creates one outsourced_orders row per case, all sharing the same batch_ref (PO#). The dashboard starts counting the days until expected return.'],
        ['5. Receive (Orders tab)', 'When aligners physically arrive, click 📦 on the row — or open the PO # and use "Mark All Received" for the whole batch. Enter the Received Date and, if known, the Expected Invoice Date.'],
        ['6. Record the invoice', 'When the supplier invoice lands, click 🧾 (or "Record PO Invoice" inside the PO modal). Enter Invoice #, Invoice Received Date, amount, and status (pending / approved / disputed).'],
        ['7. Pay', 'Once paid, click 💰 Mark Paid (or "Mark All Paid" on the whole PO). The row flips to paid and disappears from the to-pay counters.'],
        ['8. Standing watch', 'The Dashboard constantly shows Outsourced Orders Awaiting Return (days-left counter) and Outsourced Invoices Awaiting. All 7 KPIs on the Outsourcing page are clickable — each pre-filters the Orders tab.'],
      ],
      buttons: [
        ['＋ Pick (Cases column)', 'Select an In-House case for the next PO. Click again to unpick.'],
        ['✓ (purple)', 'Case currently selected in the PO draft.'],
        ['Header counter (🦷)', 'Shows up as soon as a case is picked. Displays cases · aligners · ↑ upper · ↓ lower · estimated amount. Click = jump to Prepared Order tab.'],
        ['📝 Prepared List Order', 'Tab / button to finalise the PO: distributor, price, expected dates. 💾 Save & Create Orders writes the rows.'],
        ['PO # (purple, underlined)', 'Click the number to open the PO Detail modal: every case in the same batch, XL pipeline, bulk actions (Mark All Received · Record PO Invoice · Mark All Paid).'],
        ['📦 Mark Received', 'Records the physical receipt date of the aligner batch. Stops the "days left" countdown.'],
        ['🧾 Record Invoice', 'Invoice #, received date, amount, status. Only appears after receipt.'],
        ['💰 Mark Paid', 'Flips the row to paid. Only appears after invoice recording.'],
        ['✏️ Edit', 'Re-open the row to correct supplier/price/dates/notes.'],
        ['↩ Undo (Cases)', 'Deletes the outsourced_orders row and sends the case back to In-House.'],
        ['Pipeline (4 dots)', '① Outsourced · ② Received · ③ Invoiced · ④ Paid. Green = done · Amber pulsing = current · Red = overdue return.'],
        ['Lifecycle filter', 'Awaiting return · Received — no invoice · Invoiced — unpaid · Paid. Used by the KPI shortcuts.'],
        ['KPIs at the top', 'All clickable. Outsourced (month) · Aligners (month) · Awaiting Return · Awaiting Invoice · To Pay (month) · Overdue Returns · In-House (month).'],
        ['Sort ↕ / ▲ / ▼', 'Click any column header to sort A→Z. Click again to reverse.'],
        ['⬇ Export CSV', 'Export the current list (Cases, Orders, or Supplier Breakdown).'],
        ['Report: "In-House vs Outsourced" chart', 'In-house aligners (Packaging completions × Bloom aligner counts) vs outsourced. The orange line on the right-hand axis is the % outsourced.'],
        ['Report: "Outsourced € spend" chart', 'Monthly outsourcing € spend.'],
        ['Supplier Breakdown', 'This-month recap per supplier: cases, aligners, average €/aligner, total, pending, paid.'],
      ]
    }
  },
  customer_feedback: {
    fr: {
      role: 'Responsable Qualité / Service Client · Tout rôle peut recevoir une affectation par catégorie',
      purpose: 'ISO 13485 §8.2.1 — Enregistrer et suivre toutes les réclamations, retours, demandes de garantie, suggestions et retours positifs. Obligatoire pour la surveillance post-commercialisation (PMS). Chaque réclamation produit doit être investiguée et, si défaut, liée à un rapport de Non-Conformité.',
      process: [
        ['1. Enregistrer (+ Log Feedback)', 'Saisir : Type, Client/Distributeur, Docteur (optionnel), Commande/Cas, Priorité, Description. Obligatoire pour toute réclamation externe.'],
        ['2. Catégoriser (réclamations uniquement)', 'Pour les Types Complaint / Warranty / Return, choisir une catégorie : Product Quality · Delivery · Fitting · Packaging · Communication · Documentation · Billing · Other.'],
        ['3. Routage automatique par catégorie → rôle', 'Si aucun assigné n\'est choisi, le système envoie la réclamation au rôle configuré pour cette catégorie (Paramètres → Routage catégorie / rôle). Ex : « Product Quality » → Responsable Qualité. L\'assigné stocké est alors `role:<nom>` — tout employé de ce rôle verra la notification.'],
        ['4. Notification & accusé de lecture', 'Le destinataire voit un 🔔 toast à l\'ouverture de l\'application + une bannière persistante dans toutes les pages. Ouvrir le dossier (👁 View) le marque automatiquement « seen » : l\'icône enveloppe passe de 📧 à 📬.'],
        ['5. Rappel de suivi (Follow-up)', 'Renseigner Follow-up Date + Follow-up Assignee. Le dossier apparaît sur le Tableau de Bord avec un compteur « jours restants » : rouge si en retard, ambre ≤3 jours. Bouton ✓ Mark Follow-up Done pour clôturer uniquement le rappel (sans clôturer le dossier).'],
        ['6. Enquête cause racine', 'Renseigner Root Cause : pourquoi c\'est arrivé. Si défaut produit, créer un rapport Non-Conformité — la page NC pré-remplit le même Case # / numéro de commande.'],
        ['7. Action corrective (Resolution)', 'Renseigner Resolution / Response : ce qui a été fait pour satisfaire le client ET prévenir la récidive. Obligatoire pour passer en Resolved.'],
        ['8. Clôture du dossier', 'Statut Resolved → Closed avec Resolved Date. Le Tableau de Bord calcule la satisfaction client sur les 30 derniers jours à partir des dossiers clôturés.'],
      ],
      buttons: [
        ['+ Log Feedback', 'Ouvre le formulaire de création. Date, type, client, docteur, Case #, catégorie (si applicable), priorité, description.'],
        ['👁 View', 'Ouvrir le dossier en lecture seule. Si le dossier vous est assigné et non vu, il est automatiquement marqué « seen » et la bannière disparaît.'],
        ['✏️ Edit', 'Ouvrir le formulaire en édition : mettre à jour statut, assigné, Root Cause, Resolution, Resolved Date, suivi.'],
        ['🖨️ Print', 'Imprimer le dossier formel pour le dossier qualité ISO 13485.'],
        ['💾 Save Record', 'Enregistrer le dossier. Si une catégorie est renseignée et aucun assigné choisi, le routage automatique s\'applique.'],
        ['✓ Mark Follow-up Done', 'Clôturer uniquement le rappel de suivi — le dossier reste ouvert tant que le statut n\'est pas Resolved/Closed.'],
        ['Cancel / ✕', 'Fermer le formulaire ou la vue sans enregistrer.'],
        ['📧 Enveloppe (liste)', 'Dossier ouvert, non lu (jamais consulté par l\'assigné).'],
        ['📬 Enveloppe (liste)', 'Dossier ouvert, déjà vu par l\'assigné au moins une fois.'],
        ['✅ Enveloppe (liste)', 'Dossier Resolved ou Closed.'],
        ['⏰ Colonne Follow-up', 'Date du rappel. Rouge = en retard. Ambre = ≤3 jours. Gris = plus tard. Non affiché si Mark Done.'],
        ['🔔 Toast / Bannière', 'Notification affichée sur toutes les pages quand ≥1 dossier vous est (ré)assigné et non vu. Cliquer ouvre Customer Feedback filtré.'],
        ['Filtre « Open · unread »', 'N\'affiche que les dossiers qui vous sont assignés ET encore non vus ET non clôturés — votre liste de travail du jour.'],
        ['Type : Complaint', 'Problème produit ou service (obligatoire → catégorie).'],
        ['Type : Positive Feedback', 'Compliment. Utilisé pour les rapports satisfaction mais pas pour NC.'],
        ['Type : Suggestion', 'Idée d\'amélioration (pas de catégorie).'],
        ['Type : Warranty', 'Défaut sous garantie (→ catégorie obligatoire, souvent Product Quality).'],
        ['Type : Return', 'Retour physique du produit (→ catégorie obligatoire).'],
        ['Priority : Critical', 'Action immédiate — escalade manager dans la journée.'],
        ['Priority : High', 'Réponse client sous 24 h.'],
        ['Priority : Medium', 'Réponse client sous 3 jours ouvrés.'],
        ['Priority : Low', 'Traitement standard selon file d\'attente.'],
        ['Statut : open', 'Nouveau dossier, aucune action encore prise.'],
        ['Statut : in_progress', 'Enquête en cours ou action corrective appliquée.'],
        ['Statut : resolved', 'Solution validée avec le client — Resolution renseignée, date de résolution posée.'],
        ['Statut : closed', 'Dossier définitivement clos après résolution (CAPA terminé s\'il y en a eu).'],
      ]
    },
    en: {
      role: 'Quality Manager / Customer Service · Any role may receive a category-routed assignment',
      purpose: 'ISO 13485 §8.2.1 — Register and track every complaint, return, warranty claim, suggestion and positive feedback. Required for post-market surveillance (PMS). Every product complaint must be investigated and, if a defect, linked to a Non-Conformity report.',
      process: [
        ['1. Log it (+ Log Feedback)', 'Enter: Type, Customer/Distributor, Doctor (optional), Case/Order #, Priority, Description. Mandatory for every external complaint.'],
        ['2. Pick a Category (complaints only)', 'For Complaint / Warranty / Return, pick a category: Product Quality · Delivery · Fitting · Packaging · Communication · Documentation · Billing · Other.'],
        ['3. Auto-routing by category → role', 'If no assignee is picked, the system routes the record to the role configured for that category (Settings → Category / Role routing). Example: "Product Quality" → Quality Manager. The stored assignee becomes `role:<name>` — every employee in that role sees the notification.'],
        ['4. Notification & read receipt', 'The assignee gets a 🔔 toast on app open + a persistent banner across all pages. Opening the record (👁 View) marks it "seen" automatically — the envelope icon flips from 📧 to 📬.'],
        ['5. Follow-up reminder', 'Fill Follow-up Date + Follow-up Assignee. The record shows up on the Dashboard with a "days remaining" counter: red if overdue, amber ≤3 days. Use ✓ Mark Follow-up Done to close only the reminder (without closing the record).'],
        ['6. Root-cause investigation', 'Fill Root Cause: why did this happen. If it\'s a product defect, create a Non-Conformity report — the NC page prefills the same Case # / order number.'],
        ['7. Corrective action (Resolution)', 'Fill Resolution / Response: what was done to satisfy the customer AND prevent recurrence. Required before moving to Resolved.'],
        ['8. Close the record', 'Status Resolved → Closed with a Resolved Date. The Dashboard computes customer satisfaction (last 30 days) from closed records.'],
      ],
      buttons: [
        ['+ Log Feedback', 'Opens the create form: date, type, customer, doctor, Case #, category (if applicable), priority, description.'],
        ['👁 View', 'Read-only view. If the record is assigned to you and unseen, opening it auto-marks it "seen" and the banner disappears.'],
        ['✏️ Edit', 'Full edit form: update status, assignee, Root Cause, Resolution, Resolved Date, follow-up.'],
        ['🖨️ Print', 'Print the formal record for the ISO 13485 quality file.'],
        ['💾 Save Record', 'Persist the record. If a category is set and no assignee is chosen, auto-routing kicks in.'],
        ['✓ Mark Follow-up Done', 'Close only the follow-up reminder — the record stays open until status is Resolved/Closed.'],
        ['Cancel / ✕', 'Close the form or viewer without saving.'],
        ['📧 Envelope (list)', 'Record is open and unread (assignee has never opened it).'],
        ['📬 Envelope (list)', 'Record is open and has been seen by the assignee at least once.'],
        ['✅ Envelope (list)', 'Record is Resolved or Closed.'],
        ['⏰ Follow-up column', 'Reminder date. Red = overdue · Amber = within 3 days · Grey = later. Hidden after Mark Done.'],
        ['🔔 Toast / Banner', 'Notification shown on every page when one or more records are (re)assigned to you and still unseen. Click to open Customer Feedback filtered.'],
        ['"Open · unread" filter', 'Shows only records assigned to you AND still unseen AND not closed — your work-of-the-day list.'],
        ['Type: Complaint', 'Product or service problem (category required).'],
        ['Type: Positive Feedback', 'Compliment. Used for satisfaction reporting — does not create an NC.'],
        ['Type: Suggestion', 'Improvement idea (no category required).'],
        ['Type: Warranty', 'Warranty defect claim (category required, typically Product Quality).'],
        ['Type: Return', 'Physical return of the product (category required).'],
        ['Priority: Critical', 'Immediate action — same-day manager escalation.'],
        ['Priority: High', 'Customer response within 24 h.'],
        ['Priority: Medium', 'Customer response within 3 business days.'],
        ['Priority: Low', 'Standard queue handling.'],
        ['Status: open', 'New record, no action yet.'],
        ['Status: in_progress', 'Investigation running or corrective action applied.'],
        ['Status: resolved', 'Customer-agreed fix in place — Resolution filled and Resolved Date set.'],
        ['Status: closed', 'Record formally closed after resolution (and CAPA, if any, completed).'],
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
      purpose: 'ISO 13485 §8.2.4 — Inspection qualité en 16 points pour chaque lot avant libération. Le contrôleur coche chaque point Conforme / Non-conforme / N/A, soumet avec son nom (= signature), et le résultat remonte automatiquement vers la Traçabilité et le DHR. Si rejeté, la page propose de créer un rapport de Non-Conformité et réinitialise l\'étape à reprendre dans le pipeline de pointage.',
      process: [
        ['1. Choisir la commande', 'Menu déroulant "Sélectionner commande" — liste = dossiers Bloom actifs dont Packaging est terminé OU qui n\'ont pas encore de QC approuvé (filtrée par Paramètres → Bloom Active Production).'],
        ['2. Contrôleur (signature)', 'Pré-rempli avec l\'utilisateur connecté. Les managers peuvent choisir un autre contrôleur dans la liste. Ce nom est enregistré comme performed_by — apparaît dans la Traçabilité comme signature QC.'],
        ['3. Les 16 points ISO', '4 groupes : Aspect/Dimension (8 points : visuel, surface, teinte, marquage, adaptation, trimline, épaisseur, conformité dim.) · Matière (4 : conformité matière, traçabilité lot, péremption, propreté) · Conditionnement (4 : emballage, étiquette, documentation, quantité).'],
        ['4. Soumettre', 'Bouton ✅ Approuver (libération pour expédition) · ❌ Rejeter (quarantaine + NC obligatoire) · ⏸ Mettre en attente (vérification supplémentaire).'],
        ['5. Si rejeté', 'Sélectionner l\'étape à reprendre (Printing/Thermoforming/etc.) — le pipeline clocking.html remet cette étape en "pending" pour le prochain opérateur. Une bannière NC s\'affiche avec un lien pré-rempli vers non_conformity.html.'],
        ['6. Hand-off automatique', 'Arrivée depuis la Traçabilité avec ?order=&lot= : la commande et le lot sont pré-sélectionnés, le formulaire s\'ouvre, on scrolle dessus. Rejet → NC → source=qc automatiquement tracé.'],
        ['7. Historique & certificat', 'Tableau en bas : chaque QC passé avec contrôleur, date, compteurs passed/failed, verdict. Cliquer 🖨 Rapport pour réimprimer un certificat ancien.'],
      ],
      buttons: [
        ['+ New QC Check', 'Ouvrir le formulaire de contrôle.'],
        ['✓ Conforme / ✗ Non-conforme / — N/A', 'Boutons de statut pour chaque point.'],
        ['✅ Approuver', 'Soumettre avec verdict approved — libération pour expédition.'],
        ['❌ Rejeter', 'Soumettre avec verdict rejected — quarantaine, NC requise, étape réinitialisée.'],
        ['⏸ Mettre en attente', 'Soumettre avec verdict on_hold — ni approuvé ni rejeté, vérification ultérieure.'],
        ['🖨 Rapport', 'Réimprimer le certificat QC formel (QC-FR-001) pour un enregistrement historique.'],
        ['⚠️ Create NC Report →', 'Bannière affichée après rejet. Crée un NC avec source=qc et le cas pré-rempli.'],
      ]
    },
    en: {
      role: 'Quality Controller / Quality Manager',
      purpose: 'ISO 13485 §8.2.4 — 16-point quality inspection for every batch before release. The controller ticks each point Pass / Fail / N/A, submits with their name (= signature), and the verdict auto-propagates to Traceability and the DHR. On rejection, the page offers to raise a Non-Conformity report and resets the selected step in the clocking pipeline.',
      process: [
        ['1. Pick the order', '"Select order" dropdown — list = active Bloom cases whose Packaging is complete OR that don\'t yet have an approved QC (filtered by Settings → Bloom Active Production).'],
        ['2. Controller (signature)', 'Pre-filled with the logged-in user. Managers can pick another controller from the list. This name is stored as performed_by — appears in Traceability as the QC signature.'],
        ['3. The 16 ISO checkpoints', '4 groups: Appearance/Dimensional (8: visual, surface, colour, marking, fit, trimline, thickness, dimensional) · Material (4: material conformity, lot traceability, expiry, cleanliness) · Packaging (4: packaging, label, documentation, quantity).'],
        ['4. Submit', '✅ Approve (release for shipment) · ❌ Reject (quarantine + NC required) · ⏸ On hold (extra verification).'],
        ['5. On rejection', 'Pick the step to redo (Printing/Thermoforming/etc.) — the clocking.html pipeline flips that step back to "pending" for the next operator. NC banner appears with a pre-filled link to non_conformity.html.'],
        ['6. Auto hand-off', 'Arriving from Traceability with ?order=&lot=: the order and lot are pre-selected, the form opens, we scroll to it. Reject → NC → source=qc is tracked automatically.'],
        ['7. History & certificate', 'Table at the bottom: every past QC with controller, date, pass/fail counters, verdict. Click 🖨 Report to re-print an old certificate.'],
      ],
      buttons: [
        ['+ New QC Check', 'Open the inspection form.'],
        ['✓ Pass / ✗ Fail / — N/A', 'Per-checkpoint status buttons.'],
        ['✅ Approve', 'Submit with verdict approved — release for shipment.'],
        ['❌ Reject', 'Submit with verdict rejected — quarantine, NC required, step reset.'],
        ['⏸ On hold', 'Submit with verdict on_hold — neither approved nor rejected, needs follow-up.'],
        ['🖨 Report', 'Re-print the formal QC certificate (QC-FR-001) for a past record.'],
        ['⚠️ Create NC Report →', 'Banner shown after a reject. Creates an NC with source=qc and the case pre-filled.'],
      ]
    }
  },
  tracabilite: {
    fr: {
      role: 'Responsable qualité / Responsable production',
      purpose: 'ISO 13485 §7.5.9 + §4.2.5 — Traçabilité complète commande-par-commande et Device History Record (DHR). Chaque dossier Bloom actif apparaît ici avec son lot canonique (LOT-YYYYMMDD-CASE, persisté dès le premier pointage), ses 6 étapes de production, ses matières consommées avec numéros de lot fournisseur, son résultat QC, ses signataires et deux documents imprimables officiels. Source unique de vérité pour l\'audit : tout aligneur livré remonte à son patient en une vue.',
      process: [
        ['1. Trouver le dossier', 'Liste de gauche filtrée par recherche (n° commande, patient, praticien) + filtres Statut et QC. Les dossiers Bloom jamais pointés apparaissent avec la bannière "⏳ En file d\'attente".'],
        ['2. Lire la fiche', 'Panneau de droite : identification, 6 étapes avec opérateurs/machines/durées, matières premières avec lots, aligneurs produits (Max/Mand), résultat QC, signatures.'],
        ['3. Signatures authentiques', 'Opérateur principal = celui qui a fermé la dernière étape (Packaging.completed_by, écrit par clocking). Responsable qualité = performed_by du QC. Aucune signature rétroactive possible — les signatures sont capturées au moment de l\'action.'],
        ['4. Lancer le QC', 'Bouton ✅ Launch Quality Control quand aucun QC approuvé n\'existe. Ouvre qualite.html avec ?order= et ?lot= pré-remplis.'],
        ['5. Imprimer le DHR (Fiche de lot)', '📄 Imprimer DHR → document A4 formel (DHR-FR-001) couvrant identification, étapes, matières, aligneurs, QC, signatures. Archivé dans le dossier de lot. ISO 13485 §4.2.5.'],
        ['6. Déclaration MDR Annexe XIII', '📜 Déclaration MDR → document per-dispositif requis par le Règlement UE 2017/745 pour tout dispositif sur mesure. Expédié avec l\'aligneur au patient. Pré-rempli à partir de Paramètres → Informations Réglementaires MDR.'],
      ],
      buttons: [
        ['🔍 Recherche', 'Filtrer la liste par n° de commande, patient ou praticien.'],
        ['Filtre Statut', 'Tout / ✅ Terminé / 🔄 En cours.'],
        ['Filtre QC', 'Tout / ✅ QC fait / ⏳ QC en attente.'],
        ['📄 Imprimer DHR (Fiche de lot)', 'Ouvre le Device History Record A4 formel (DHR-FR-001 Rev.1).'],
        ['📜 Déclaration MDR (Annexe XIII)', 'Ouvre la Déclaration de Conformité per-dispositif (STAT-XIII-BLOOMaligner-01). Ship avec l\'aligneur.'],
        ['🖨 Aperçu écran', 'Impression navigateur rapide de la fiche à l\'écran (pas un document formel).'],
        ['✅ Launch Quality Control', 'Si aucun QC approuvé : ouvre qualite.html avec commande + lot pré-sélectionnés.'],
        ['✅ QC Réalisé', 'Badge lecture-seule qui apparaît quand un QC approuvé existe pour cette commande.'],
      ]
    },
    en: {
      role: 'Quality Manager / Production Manager',
      purpose: 'ISO 13485 §7.5.9 + §4.2.5 — Full per-order traceability and Device History Record (DHR). Every active Bloom case appears here with its canonical lot (LOT-YYYYMMDD-CASE, persisted on first clocking), its 6 production steps, materials consumed with supplier lot numbers, QC verdict, signers, and two formal printable documents. Single source of truth for audit: every shipped aligner walks back to its patient in one view.',
      process: [
        ['1. Find the case', 'Left list filtered by search (order no, patient, doctor) + Status and QC filters. Bloom cases never clocked appear with a "⏳ En file d\'attente" banner.'],
        ['2. Read the record', 'Right panel: identification, 6 steps with operators/machines/durations, raw materials with lots, aligners produced (Upper/Lower), QC verdict, signatures.'],
        ['3. Authentic signatures', 'Main operator = who closed the last step (Packaging.completed_by, written by clocking). QC controller = QC.performed_by. No retroactive signing — signatures are captured at the moment of the action.'],
        ['4. Launch QC', '✅ Launch Quality Control button when no approved QC exists. Opens qualite.html with ?order= and ?lot= pre-filled.'],
        ['5. Print the DHR (Batch Record)', '📄 Print DHR → formal A4 document (DHR-FR-001) covering identification, steps, materials, aligners, QC, signatures. Filed in the batch record. ISO 13485 §4.2.5.'],
        ['6. MDR Annex XIII Declaration', '📜 MDR Declaration → per-device document required by EU Regulation 2017/745 for any custom-made device. Ships with the aligner to the patient. Pre-filled from Settings → MDR Regulatory Info.'],
      ],
      buttons: [
        ['🔍 Search', 'Filter the list by order no, patient, or doctor.'],
        ['Status filter', 'All / ✅ Done / 🔄 In progress.'],
        ['QC filter', 'All / ✅ QC done / ⏳ QC pending.'],
        ['📄 Print DHR (Batch Record)', 'Opens the formal A4 Device History Record (DHR-FR-001 Rev.1).'],
        ['📜 MDR Declaration (Annex XIII)', 'Opens the per-device Declaration of Conformity (STAT-XIII-BLOOMaligner-01). Ships with the aligner.'],
        ['🖨 Screen preview', 'Quick browser print of the on-screen card (not a formal document).'],
        ['✅ Launch Quality Control', 'If no approved QC yet: opens qualite.html with order + lot pre-selected.'],
        ['✅ QC Done', 'Read-only badge that appears once an approved QC exists for the order.'],
      ]
    }
  },
  employees: {
    fr: {
      role: 'RH / Administrateur système',
      purpose: 'ISO 13485 §6.2 — Registre des compétences et accès du personnel. Créer/bloquer les comptes, attribuer un rôle principal + rôles secondaires, définir les pages accessibles. Obligatoire : chaque opérateur doit avoir un compte traçable dans ce registre pour que toute action (pointage, QC, NC) soit attribuable.',
      process: [
        ['1. Créer un employé', 'Cliquer sur + Ajouter Employé. Saisir nom complet, email (identifiant de connexion), téléphone, PIN (4-6 chiffres pour le terminal de pointage), rôle principal.'],
        ['2. Rôles multiples', 'Un opérateur peut être à la fois Production + Qualité (ex : contrôleur QC qui peut aussi pointer). Cliquer sur + Ajouter Rôle et cocher les rôles secondaires.'],
        ['3. Accès aux pages', 'Cocher individuellement chaque page du menu. Manager = tout. Opérateur = production/pointage. Rôles personnalisés définis dans la page Rôles.'],
        ['4. Bloquer / Débloquer', 'Bloquer désactive la connexion sans supprimer — l\'historique de pointage, QC, NC de cet employé reste intact pour l\'audit. À utiliser au départ d\'un employé.'],
        ['5. Cliquer sur une ligne', 'Ouvre le Profil de l\'employé : historique complet de sessions, productivité, calendrier, édition administrative.'],
        ['6. Supprimer définitivement', 'À éviter — préférer Bloquer pour garder la traçabilité. La suppression n\'est autorisée que si l\'employé n\'a jamais pointé.'],
      ],
      buttons: [
        ['+ Ajouter Employé', 'Ouvrir le formulaire de création d\'un nouveau compte.'],
        ['+ Ajouter Rôle', 'Attribuer un rôle secondaire (ex : QC + Production) dans le formulaire employé.'],
        ['✏️ Modifier', 'Mettre à jour nom, email, PIN, rôles ou accès aux pages.'],
        ['👤 Profil', 'Ouvrir l\'historique complet, productivité, calendrier.'],
        ['✅ Débloquer', 'Réactiver la connexion d\'un employé bloqué.'],
        ['🚫 Bloquer', 'Désactiver la connexion sans supprimer (conserve l\'historique).'],
        ['🗑 Supprimer', 'Supprimer définitivement — déconseillé si l\'employé a de l\'historique.'],
        ['↻ Rafraîchir', 'Recharger la liste depuis la base de données.'],
      ]
    },
    en: {
      role: 'HR Manager / System Administrator',
      purpose: 'ISO 13485 §6.2 — Personnel competence & access register. Create/block accounts, assign primary + secondary roles, define accessible pages. Mandatory: every operator must have a traceable account here so every action (clocking, QC, NC) is attributable.',
      process: [
        ['1. Create employee', 'Click + Add Employee. Enter full name, email (login), phone, PIN (4-6 digits for the clocking terminal), primary role.'],
        ['2. Multiple roles', 'An operator can be Production + Quality at once (e.g. a QC controller who also clocks). Click + Add Role and tick secondary roles.'],
        ['3. Page access', 'Tick each sidebar page individually. Manager = all pages. Operator = production/clocking. Custom roles defined in Roles page.'],
        ['4. Block / Unblock', 'Block disables login without deleting — the employee\'s clocking, QC and NC history remains intact for audit. Use on leave/termination.'],
        ['5. Click a row', 'Opens the Employee Profile: full session history, productivity, calendar, admin edit.'],
        ['6. Delete permanently', 'Avoid — prefer Block to keep traceability. Delete only allowed if the employee never clocked.'],
      ],
      buttons: [
        ['+ Add Employee', 'Open the create-account form.'],
        ['+ Add Role', 'Assign a secondary role (e.g. QC + Production) inside the employee form.'],
        ['✏️ Edit', 'Update name, email, PIN, roles, or page access.'],
        ['👤 Profile', 'Open full history, productivity, and calendar.'],
        ['✅ Unblock', 'Re-enable login for a blocked employee.'],
        ['🚫 Block', 'Disable login without deleting (keeps history).'],
        ['🗑 Delete', 'Hard-delete — discouraged if the employee has history.'],
        ['↻ Refresh', 'Reload the list from the database.'],
      ]
    }
  },
  machines: {
    fr: {
      role: 'Responsable production / Technicien de maintenance',
      purpose: 'ISO 13485 §6.3 — Registre des infrastructures de production. Chaque imprimante 3D, thermoformeuse, station de nettoyage, etc. doit être identifiée ici avec son statut en temps réel, son plan de maintenance préventive et le lot de matière actuellement chargé. Relie directement à Maintenance History, aux sessions de pointage et au DHR (Fiche de lot).',
      process: [
        ['1. Enregistrer une machine', 'Cliquer + Ajouter Machine. Saisir nom (ex : "3D Printing Machine 1"), type, numéro de série, date d\'achat, étape(s) de production assignée(s).'],
        ['2. Cycle de statut', 'Pendant la journée, cliquer sur le badge de statut pour basculer : 🟢 Running (en production) · ⏸ Idle (disponible) · 🔧 Maint. (en maintenance) · ⛔ Offline (hors service).'],
        ['3. Charger un lot matière', 'Cliquer "📦 Load Lot" pour associer un lot d\'inventaire à la machine. Le stock est automatiquement déduit par clocking.html à chaque aligneur produit (voir Production Materials pour les règles de consommation).'],
        ['4. Maintenance préventive', 'Date de prochaine maintenance visible sur chaque carte. Le dashboard signale les retards. Après intervention, cliquer "✓ Mark Done" pour mettre à jour la date.'],
        ['5. Historique complet', 'Cliquer "🔧 Maintenance" (ou sur la carte) pour ouvrir l\'historique complet de la machine : toutes interventions, pièces remplacées, coûts, techniciens.'],
        ['6. Traçabilité', 'Chaque session de pointage enregistre la machine utilisée. Chaque déduction de matière enregistre la machine et le lot. Tout remonte dans le DHR de chaque commande.'],
      ],
      buttons: [
        ['+ Ajouter Machine', 'Enregistrer un nouvel équipement.'],
        ['✏️ Modifier', 'Mettre à jour nom, type, étape, date de maintenance.'],
        ['🟢 Running', 'Statut = en production active.'],
        ['⏸ Idle', 'Statut = disponible mais non utilisée.'],
        ['🔧 Maint.', 'Statut = en intervention de maintenance.'],
        ['⛔ Offline', 'Statut = indisponible (panne, arrêt programmé).'],
        ['✓ Mark Done', 'Fermer une intervention et recalculer la prochaine maintenance.'],
        ['📦 Load Lot', 'Charger un lot d\'inventaire sur la machine (déduction automatique en production).'],
        ['↻ Refresh', 'Recharger statut et historique.'],
      ]
    },
    en: {
      role: 'Production Manager / Maintenance Technician',
      purpose: 'ISO 13485 §6.3 — Production infrastructure register. Every 3D printer, thermoformer, washing station, etc. must be identified here with real-time status, preventive maintenance schedule, and the currently-loaded material lot. Feeds directly into Maintenance History, clocking sessions, and the DHR (batch record).',
      process: [
        ['1. Register a machine', 'Click + Add Machine. Enter name (e.g. "3D Printing Machine 1"), type, serial number, purchase date, assigned production step(s).'],
        ['2. Status cycle', 'Through the day, click the status badge to switch: 🟢 Running (in production) · ⏸ Idle (available) · 🔧 Maint. (under maintenance) · ⛔ Offline (out of service).'],
        ['3. Load a material lot', 'Click "📦 Load Lot" to bind an inventory lot to this machine. Stock is auto-deducted by clocking.html on every aligner produced (see Production Materials for the consumption rules).'],
        ['4. Preventive maintenance', 'Next-maintenance date is on each card; the dashboard flags overdue ones. After a service, click "✓ Mark Done" to roll the due date forward.'],
        ['5. Full history', 'Click "🔧 Maintenance" (or the card) to open the machine\'s complete service log: every intervention, parts replaced, costs, technicians.'],
        ['6. Traceability', 'Every clocking session logs the machine used. Every material deduction logs machine + lot. All of it lands in the per-order DHR.'],
      ],
      buttons: [
        ['+ Add Machine', 'Register a new piece of equipment.'],
        ['✏️ Edit', 'Update name, type, assigned step, maintenance date.'],
        ['🟢 Running', 'Status = in active production.'],
        ['⏸ Idle', 'Status = available but not in use.'],
        ['🔧 Maint.', 'Status = under maintenance.'],
        ['⛔ Offline', 'Status = unavailable (breakdown, scheduled stop).'],
        ['✓ Mark Done', 'Close a maintenance event and recompute next due date.'],
        ['📦 Load Lot', 'Load an inventory lot onto the machine (auto-deduction during production).'],
        ['↻ Refresh', 'Reload status and history.'],
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
      purpose: 'Dossier individuel de chaque employé : productivité, historique de pointage par étape, calendrier de présence (congés/maladie/fériés) et édition administrative rétroactive. Base de l\'entretien annuel, de la paie et de l\'auditabilité du temps de travail (ISO 13485 §6.2.2 formation/compétence + preuve de présence).',
      process: [
        ['1. Sélectionner la période', 'Onglets Cette semaine / Ce mois / 3 mois / Tout. Tous les graphiques et totaux se recalculent.'],
        ['2. Historique de travail', 'Onglet 📋 Work History — liste chronologique de chaque session de pointage avec étape, machine, commande, durée, type (productif/gaspillage).'],
        ['3. Par étape', 'Onglet ⚙ By Step — agrégation par étape de production (Impression, Thermoformage, etc.) : total heures, moyenne, vitesse.'],
        ['4. Calendrier de présence', 'Onglet 📅 Schedule — calendrier mensuel. Cliquer un jour pour marquer Working / Off / Vacation / Sick / Holiday / Half Day. Base de calcul des congés.'],
        ['5. Édition administrative', 'Onglet 🔧 Admin Edit — ajouter rétroactivement une session oubliée, corriger un horaire, supprimer une erreur de pointage. Toutes modifs tracées.'],
        ['6. Navigation rapide', 'Boutons Prev / Next pour passer à l\'employé précédent/suivant sans revenir à la liste.'],
      ],
      buttons: [
        ['← All Employees', 'Retour à la grille de tous les employés.'],
        ['← Prev / Next →', 'Passer à l\'employé précédent ou suivant.'],
        ['⬇ Export CSV', 'Télécharger l\'historique de sessions filtré.'],
        ['📋 Work History', 'Onglet historique brut de pointage.'],
        ['⚙ By Step', 'Onglet agrégé par étape de production.'],
        ['📅 Schedule', 'Onglet calendrier de présence.'],
        ['🔧 Admin Edit', 'Onglet édition rétroactive (manager uniquement).'],
        ['Fill Month as Working', 'Pré-remplir tous les jours ouvrés du mois comme Working (puis corriger les exceptions).'],
        ['+ Add Manual Session', 'Ajouter rétroactivement une session oubliée.'],
        ['Working / Off / Vacation / Sick / Holiday / Half Day', 'Types de journée à appliquer sur la case du calendrier sélectionnée.'],
        ['Save Changes / Delete', 'Enregistrer ou supprimer une session existante dans l\'éditeur.'],
      ]
    },
    en: {
      role: 'Manager / HR',
      purpose: 'Per-employee dossier: productivity, clocking history per production step, attendance calendar (leave/sick/holiday) and retroactive admin edit. Basis for annual reviews, payroll, and auditable time-of-work evidence (ISO 13485 §6.2.2 competence + attendance proof).',
      process: [
        ['1. Select period', 'Tabs This Week / This Month / 3 Months / All Time. All charts and totals recompute.'],
        ['2. Work history', '📋 Work History tab — chronological list of every clocked session with step, machine, order, duration, type (productive/waste).'],
        ['3. By step', '⚙ By Step tab — aggregated per production step (Printing, Thermoforming, etc.): total hours, average, throughput.'],
        ['4. Attendance calendar', '📅 Schedule tab — monthly calendar. Click a day to mark it Working / Off / Vacation / Sick / Holiday / Half Day. Basis for leave tracking.'],
        ['5. Admin edit', '🔧 Admin Edit tab — retroactively add a missed session, correct a timestamp, delete a bad clocking. All edits are audit-logged.'],
        ['6. Fast navigation', 'Prev / Next buttons jump to the adjacent employee without returning to the grid.'],
      ],
      buttons: [
        ['← All Employees', 'Back to the full employee grid.'],
        ['← Prev / Next →', 'Jump to the previous or next employee.'],
        ['⬇ Export CSV', 'Download the filtered session history.'],
        ['📋 Work History', 'Raw clocking log tab.'],
        ['⚙ By Step', 'Aggregated-by-step tab.'],
        ['📅 Schedule', 'Attendance calendar tab.'],
        ['🔧 Admin Edit', 'Retroactive-edit tab (manager only).'],
        ['Fill Month as Working', 'Bulk-mark every business day of the month Working, then correct exceptions.'],
        ['+ Add Manual Session', 'Retroactively add a missed session.'],
        ['Working / Off / Vacation / Sick / Holiday / Half Day', 'Day types applied to the selected calendar cell.'],
        ['Save Changes / Delete', 'Save or remove an existing session in the editor.'],
      ]
    }
  },
  production_materials: {
    fr: {
      role: 'Responsable production / Magasinier',
      purpose: 'ISO 13485 §7.5.9 / FEFO — Lots de matières chargés sur chaque machine, règles de rendement (BOM) et journal complet de consommation. À chaque aligneur produit, clocking.html déduit automatiquement la quantité appropriée du lot le plus ancien en vigueur sur la machine, via une règle de rendement définie ici. Les consommations alimentent le DHR (Fiche de lot) et permettent la traçabilité matière → aligneur → patient.',
      process: [
        ['1. Onglet Overview', 'Vue d\'ensemble : stock par matière, alertes péremption, matières les plus consommées.'],
        ['2. Onglet Lots', 'Les lots actuellement chargés sur chaque machine. Cliquer Unload pour libérer un lot. Cliquer − Deduct pour une déduction manuelle (exceptionnelle).'],
        ['3. Règles de rendement (BOM)', 'Cliquer ⚙ Rules pour ouvrir le modal. Définir "X unité de matière par aligneur" pour chaque matière. Exemple : 0.2 L de résine par aligneur, 1 feuille de film par aligneur.'],
        ['4. Onglet Journal', 'Chaque enregistrement de production saisi manuellement (Save & Deduct Materials). Utilisé si la consommation n\'est pas liée au pointage.'],
        ['5. Onglet Consumption', 'Journal horodaté de toutes les déductions automatiques faites par clocking.html : par commande, matière, quantité, machine, employé.'],
        ['6. Traçabilité inverse', 'Pour une commande donnée, le DHR montre chaque lot matière consommé avec son numéro de lot fournisseur — remonter du patient au fournisseur en une vue.'],
      ],
      buttons: [
        ['📊 Overview / 📦 Lots / 📋 Journal / 🔬 Consumption', 'Les 4 onglets principaux de la page.'],
        ['⚙ Rules', 'Ouvrir le modal de règles de rendement (BOM matière → aligneur).'],
        ['+ Add Rule', 'Créer une règle de consommation pour une matière.'],
        ['🗑 (règle)', 'Supprimer une règle de rendement.'],
        ['Save & Deduct Materials', 'Enregistrer un lot de production manuel et déduire la matière immédiatement.'],
        ['Unload', 'Libérer un lot d\'une machine (le lot retourne au stock disponible).'],
        ['− Deduct', 'Déduction manuelle d\'une quantité d\'un lot (à éviter — préférer l\'auto-déduction via pointage).'],
        ['← Prod', 'Retour vers la page Production.'],
      ]
    },
    en: {
      role: 'Production Manager / Warehouse',
      purpose: 'ISO 13485 §7.5.9 / FEFO — Material lots loaded on each machine, yield rules (BOM), and the full consumption journal. On every aligner produced, clocking.html auto-deducts the right amount from the oldest active lot on the machine, using a yield rule defined here. Consumptions feed the DHR (batch record) and trace every aligner back to the raw-material batch that made it.',
      process: [
        ['1. Overview tab', 'Dashboard: stock per material, expiry alerts, top-consumed items.'],
        ['2. Lots tab', 'Lots currently loaded on each machine. Click Unload to release a lot, − Deduct for a manual (exceptional) deduction.'],
        ['3. Yield rules (BOM)', 'Click ⚙ Rules to open the modal. Define "X units of material per aligner" per item. Example: 0.2 L of resin per aligner, 1 film sheet per aligner.'],
        ['4. Journal tab', 'Manually-entered production logs (Save & Deduct Materials). Used if consumption isn\'t tied to clocking.'],
        ['5. Consumption tab', 'Timestamped log of every auto-deduction done by clocking.html: per order, material, quantity, machine, operator.'],
        ['6. Reverse traceability', 'For a given order, the DHR shows each material lot consumed with its supplier lot number — walk back from patient to supplier in one view.'],
      ],
      buttons: [
        ['📊 Overview / 📦 Lots / 📋 Journal / 🔬 Consumption', 'The 4 page tabs.'],
        ['⚙ Rules', 'Open the yield-rules modal (BOM material → aligner).'],
        ['+ Add Rule', 'Create a consumption rule for a material.'],
        ['🗑 (rule)', 'Delete a yield rule.'],
        ['Save & Deduct Materials', 'Log a manual production batch and deduct material immediately.'],
        ['Unload', 'Release a lot from a machine (returns it to available stock).'],
        ['− Deduct', 'Manual deduction of a quantity from a lot (avoid — prefer auto-deduction via clocking).'],
        ['← Prod', 'Back to the Production page.'],
      ]
    }
  },
  requisition: {
    fr: {
      role: 'Responsable production / Responsable achats',
      purpose: 'ISO 13485 Clause 7.4.1 — Gérer les réquisitions internes de matières pour la production. Chaque demande est liée à une commande Bloom ou à un réapprovisionnement de stock. Le système calcule automatiquement les quantités à commander à partir de la nomenclature (BOM) et du niveau de stock minimum.',
      process: [
        ['1. Créer une réquisition', 'Cliquer sur + Nouvelle Réquisition. Choisir le type : Production (liée à un dossier Bloom) ou Réapprovisionnement (stock minimum atteint).'],
        ['2. Sélectionner les matières', 'Pour une réquisition de production, le système pré-remplit les matières à partir de la nomenclature (BOM) et du nombre d\'aligneurs. Les quantités sont calculées automatiquement.'],
        ['3. Vérifier le fournisseur', 'Chaque ligne affiche le fournisseur approuvé. Seuls les fournisseurs avec statut Approuvé dans la LFA peuvent être sélectionnés.'],
        ['4. Soumettre pour approbation', 'La réquisition passe au statut En attente → le manager valide → Approuvée → envoyée au fournisseur.'],
        ['5. Réception', 'À la réception des matières, marquer la réquisition Reçue — un lot d\'inventaire est créé automatiquement avec le numéro de lot fournisseur.'],
      ],
      buttons: [
        ['+ Nouvelle Réquisition', 'Ouvrir le formulaire de création.'],
        ['✅ Approuver', 'Valider la demande (manager uniquement).'],
        ['📦 Marquer Reçue', 'Enregistrer la réception et créer automatiquement les lots d\'inventaire.'],
        ['❌ Rejeter', 'Refuser la demande avec motif.'],
        ['🖨 Imprimer Bon', 'Imprimer le bon de commande pour le fournisseur.'],
      ]
    },
    en: {
      role: 'Production Manager / Purchasing Manager',
      purpose: 'ISO 13485 Clause 7.4.1 — Manage internal material requisitions for production. Every request is linked either to a Bloom case or to a stock replenishment. The system auto-computes quantities from the Bill of Materials (BOM) and minimum stock levels.',
      process: [
        ['1. Create requisition', 'Click + New Requisition. Pick the type: Production (linked to a Bloom case) or Replenishment (minimum stock hit).'],
        ['2. Pick materials', 'For a production requisition, the system pre-fills materials from the BOM and aligner count. Quantities are computed automatically.'],
        ['3. Verify supplier', 'Each line shows the approved supplier. Only suppliers with Approved status in the ASL can be selected.'],
        ['4. Submit for approval', 'Status goes Pending → manager approves → Approved → sent to supplier.'],
        ['5. Receive goods', 'On receipt, mark the requisition Received — an inventory lot is auto-created with the supplier lot number.'],
      ],
      buttons: [
        ['+ New Requisition', 'Open the create form.'],
        ['✅ Approve', 'Validate the request (manager only).'],
        ['📦 Mark Received', 'Record receipt and auto-create inventory lots.'],
        ['❌ Reject', 'Deny the request with a reason.'],
        ['🖨 Print PO', 'Print the purchase order for the supplier.'],
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
