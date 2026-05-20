# 📧 Email — Suivi de l'audit SMQ (20-05-2026)

> Copier-coller la version qui convient. Les deux sont rédigées pour
> qu'un lecteur non technique trouve les nouveaux champs sans qu'on ait
> à le guider.

---

## ✉️ Version courte — pour un partage rapide

**Objet :** Audit SMQ — les 6 changements sont en ligne, voici où les trouver

Bonjour à toutes et à tous,

Suite à l'audit du 20 mai, nous avons mis en production les changements
demandés dans l'application Operations. Rien n'a été supprimé ;
tout ce qui suit est **additif**, donc les dossiers existants
continuent de fonctionner comme avant.

| # | Module | Ce qui a changé | Où le trouver |
|---|---|---|---|
| 1 | **Réclamations Clients** | Nouveaux champs : Lot / UDI, Investigation démarrée, Cause racine, Résultat d'investigation, CAPA Oui/Non + CAPA lié, Vigilance Oui/Non + référence | Log Feedback → déplier **🔍 Investigation & Compliance**. Les mêmes champs apparaissent sur la vue lecture seule. |
| 2 | **Traçabilité** | Aucun changement requis (déjà complet). | — |
| 3 | **Contrôle Qualité** | Le lot rejeté peut maintenant être lié à sa NC ; on enregistre aussi la référence de procédure suivie et les mesures prises. | Quality Control → Nouvelle inspection / Édition → bas du formulaire. |
| 4 | **Non-Conformités** | Les CAPAs sont désormais séparés des corrections NC. Chaque NC peut générer plusieurs CAPAs, et chaque CAPA vit dans son propre registre. | À l'intérieur d'une NC → tuile **🛠 Linked CAPAs**. Vue autonome : **Quality → CAPAs** dans la barre de navigation (nouvelle page). |
| 5 | **Fournisseurs** | Certifications et contrats avec date d'expiration, plus pièces jointes PDF / image (privées). Badges automatiques **EXPIRED / SOON / VALID**. | Suppliers → modifier un fournisseur → **📜 Certifications & contracts**. Cliquer 📎 pour joindre un PDF ; cliquer PDF dans la liste pour l'ouvrir. |
| 6 | **Inventaire** | Les conditions de stockage sont maintenant une vraie colonne du catalogue des articles (texte long tronqué, survoler pour voir la chaîne complète). | Inventory → Items Catalogue → colonne **Storage**. |
| 7 | **🆕 Registre CAPA** | Nouvelle page listant tous les CAPAs avec KPI par statut (Open / In Progress / Verified / Closed), filtres par source et propriétaire, colonnes triables, export CSV et liens profonds. | Barre de navigation → **🛠 CAPAs**. Chaque numéro CAPA cité dans NC ou Réclamations renvoie vers cette page. |

Merci de tester sur votre appareil habituel — les changements sont déjà
en production, aucune action n'est requise de votre côté pour
l'installation.

Cordialement,
*[nom]*

---

## ✉️ Version détaillée — pour le dossier SMQ / classeur d'audit

**Objet :** Application Cedarwings Operations — Pack de clôture d'audit SMQ (20 mai 2026)

Bonjour à toutes et à tous,

Vous trouverez ci-dessous la liste complète des modifications apportées
à l'application Operations pour clôturer les points soulevés lors de
l'audit du 20 mai 2026. Tout est **en production** et a été enregistré
dans l'historique des migrations.

### 1. Réclamations Clients (Customer Feedback)

Le formulaire de saisie d'une réclamation comprend désormais une
section **Investigation & Compliance**. Ouvrir une réclamation →
déplier la section → renseigner au besoin :

- **Lot / UDI** — texte libre (numéro de lot, chaîne UDI, ou les deux).
- **Investigation démarrée** — date/heure de début de l'investigation.
- **Cause racine** — champ dédié (n'est plus mélangé avec les notes de
  résolution).
- **Résultat d'investigation** — ce que l'investigation a conclu.
- **CAPA requis ?** Oui / Non. Si **Oui**, un sélecteur de CAPA
  apparaît, permettant de lier la réclamation à un CAPA existant (ou
  d'en créer un nouveau depuis le registre CAPA puis le relier ici).
- **Vigilance à reporter ?** Oui / Non. Si **Oui**, un champ Référence
  de vigilance apparaît (référence régulateur, n° de rapport
  interne…).

Ces mêmes champs sont en lecture seule sur la **vue** détaillée — toute
personne ayant accès au dossier peut les consulter sans passer en mode
édition.

### 2. Traçabilité

Aucune modification — le module existant couvre déjà la liaison lot ⇄
commande ⇄ patient avec journal d'audit complet.

### 3. Contrôle Qualité

Le formulaire d'inspection QC enregistre maintenant :

- **Non-Conformité liée** — liste déroulante des NC ouvertes ; utile
  quand un lot rejeté déclenche une NC, pour que les deux dossiers se
  référencent mutuellement.
- **Référence de procédure** — le n° de SOP / WI suivi lors de
  l'inspection.
- **Mesures prises** — ce qui a été fait du lot rejeté (quarantaine,
  retravail, mise au rebut…).

### 4. Non-Conformités — CAPAs séparés

À l'intérieur du formulaire NC, une tuile **🛠 Linked CAPAs** est
maintenant disponible. Chaque NC peut avoir un nombre quelconque de
CAPAs ; chaque CAPA a son propre statut (Open → In Progress →
Verified → Closed). Les anciens champs texte `root_cause` et
`corrective_action` existent toujours, mais corrections et CAPAs ne
sont plus la même chose.

### 5. Fournisseurs — certifications & contrats avec PDF

Ouvrir un fournisseur dans la liste → la fiche contient une section
**📜 Certifications & contracts** avec :

- Type (Certification / Contrat / Autre), Titre, Référence, Date
  d'expiration.
- Une **pièce jointe PDF / image** optionnelle, stockée dans un bucket
  privé. Cliquer 📎 pour joindre, puis **+ Add document**. Le lien PDF
  dans la liste ouvre une URL signée à courte durée de vie — le bucket
  n'est pas public.
- Badge de statut par document : **EXPIRED** (date dépassée), **SOON**
  (≤ 30 jours), **VALID** (au-delà de 30 jours).

La suppression d'un document supprime aussi le fichier sous-jacent.

### 6. Inventaire — conditions de stockage

Le tableau Items Catalogue comporte désormais une colonne **Storage**.
C'était déjà un champ du formulaire ; on le remonte au niveau du
tableau pour une revue d'un seul coup d'œil. Le texte long est tronqué
avec la chaîne complète disponible au survol (info-bulle title).

### 7. Nouveau — Registre CAPA autonome

Une page **CAPAs** dédiée se trouve désormais dans la barre de
navigation (rubrique Quality, à côté de Non-Conformity). Elle
centralise tous les CAPAs, quelle qu'en soit l'origine :

- Tuiles du haut : compteurs par statut (Open, In Progress, Verified,
  Closed, Cancelled). Cliquer une tuile pour filtrer.
- Filtres : recherche libre, source (NC / Feedback / Audit / Other),
  propriétaire.
- Colonnes triables : CAPA #, Titre, Source, Owner, Due date, Status,
  Opened.
- Les dates en retard / proches de l'échéance sont surlignées
  automatiquement.
- **Export CSV** — exporte la vue filtrée courante, prêt pour le
  classeur SMQ.
- Liens profonds : `capa.html?id=<uuid>` ouvre un CAPA spécifique,
  utilisé par les pages NC et Réclamations.

### Tracer les modifications dans le système

Chaque modification ci-dessus est auditable :

- **Schéma** — capturé dans deux fichiers de migration :
  `20260520140000_audit_module_extensions.sql` et
  `20260520150000_supplier_docs_storage.sql`. Les deux se trouvent dans
  `supabase/migrations/` du dépôt.
- **Interface** — les commits correspondants sont sur la branche
  `claude/add-case-category-layout-AMA0d` (puis sur `main` au moment
  du déploiement). Le diff complet par modification est visible sur le
  dépôt GitHub.
- **Historique par dossier** — Réclamations Clients enregistrent déjà
  *created_by*, *last_edited_by* et *last_viewed_by* sur chaque
  enregistrement ; les CAPAs enregistrent *created_by*, *opened_at*,
  *closed_at*, *verified_by / verified_at* ; les documents
  fournisseurs enregistrent *created_by* et *created_at*. Tout cela
  est visible sur la vue détaillée de chaque dossier.
- **Stockage** — les pièces jointes fournisseur résident dans le bucket
  privé `supplier-docs` ; l'accès requiert une authentification et
  les URLs expirent au bout de 5 minutes.

N'hésitez pas si quelque chose n'est pas clair, ou si une capture
d'écran serait utile pour le dossier SMQ.

Cordialement,
*[nom]*
