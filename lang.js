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
        ['5. Historique d\'achats', 'Chaque fournisseur affiche ses commandes passées via Réquisitions — nombre de lots livrés, litiges, défauts remontés dans Non-Conformité.'],
        ['6. Suppression', 'La suppression est à éviter — préférer Disqualifié pour conserver la traçabilité historique des achats.'],
      ],
      buttons: [
        ['+ Ajouter Fournisseur', 'Formulaire de création + évaluation initiale.'],
        ['✏️ Modifier', 'Mettre à jour contact, statut, score, dates d\'évaluation.'],
        ['🗑 Supprimer', 'Supprimer définitivement (déconseillé si historique d\'achats).'],
        ['💾 Enregistrer', 'Sauvegarder les modifications du formulaire.'],
        ['Annuler', 'Fermer le formulaire sans enregistrer.'],
      ]
    },
    en: {
      role: 'Purchasing Manager / Quality Manager',
      purpose: 'ISO 13485 Clause 7.4 — Approved Supplier List (ASL). No purchase may be made outside this list. Every supplier must be evaluated before first order (qualification score), then re-evaluated annually. Feeds the Requisitions page: supplier dropdowns only show Approved/Conditional statuses.',
      process: [
        ['1. Add a supplier', 'Click + Add Supplier. Enter legal name, contact (name/email/phone), address, tax ID, category (raw material, sub-contractor, consumable…).'],
        ['2. Initial evaluation', 'Before any first order: score 0-100 on: quality, delivery reliability, certificates (ISO 9001, 13485, CE), responsiveness. Attach certificates.'],
        ['3. Status', 'Approved (all orders allowed) · Conditional (tracked purchases, probation) · Suspended (no new orders) · Disqualified (archived, not selectable).'],
        ['4. Annual re-evaluation', 'Mandatory. The ASL shows in red any supplier whose last evaluation is >12 months old. Re-run the evaluation to reset the counter.'],
        ['5. Purchase history', 'Each supplier shows their past orders via Requisitions — number of lots delivered, disputes, defects routed to Non-Conformity.'],
        ['6. Deletion', 'Avoid — prefer Disqualified to keep purchase history traceable.'],
      ],
      buttons: [
        ['+ Add Supplier', 'Create-and-evaluate form.'],
        ['✏️ Edit', 'Update contact, status, score, evaluation dates.'],
        ['🗑 Delete', 'Hard-delete (discouraged if purchase history exists).'],
        ['💾 Save', 'Persist form changes.'],
        ['Cancel', 'Close the form without saving.'],
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
