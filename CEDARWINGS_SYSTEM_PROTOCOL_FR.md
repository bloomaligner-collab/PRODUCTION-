# Cedarwings SAS Operations — Protocole du système

*Dernière mise à jour : 2026-05-20 (rafraîchissement post-audit)*

Ce document explique, en termes simples, **comment l'application
Operations fonctionne de bout en bout** — qui fait quoi, où circulent
les données, et comment la traçabilité ISO 13485 est préservée. Il
complète l'aide intégrée (bouton 🛟 Help, EN/FR) qui décrit chaque
page champ par champ.

---

## 1. Ce qu'est le système

Une application web unique (PWA) qui pilote les opérations de
fabrication de Cedarwings SAS :

- Commandes Bloom → Production → Contrôle Qualité → Conditionnement → Expédition
- Inventaire des matières premières et consommables (FEFO)
- Fournisseurs (Liste des Fournisseurs Approuvés + certifications)
- Cluster qualité : Non-Conformités, CAPAs, Réclamations Clients, Audits Internes
- Équipe : pointage, rapport de temps, rôles, permissions
- Traçabilité continue : chaque action est signée et datée

L'application est livrée depuis GitHub Pages ; les données et
l'authentification sont chez Supabase (Postgres + Auth + Storage +
Edge Functions).

## 2. Rôles & accès

| Rôle | Utilisateur type | Ce qu'il peut faire |
|---|---|---|
| **Manager** | Direction, RQ | Tout : créer/modifier/supprimer, approuver les réquisitions, clôturer NCs/CAPAs, configurer rôles & routage. |
| **Responsable Qualité (RQ)** | RQ | Propriétaire des NCs, CAPAs, audits, investigations réclamations, évaluations fournisseurs. |
| **Responsable Production** | Chef de production | Propriétaire des lots de production, matières, machines, maintenance. |
| **Contrôleur Qualité** | Opérateur QC | Mène les inspections en 16 points, ouvre des NCs en cas de rejet. |
| **Opérateur** | Équipe de production | Pointe, avance les étapes, voit son propre travail. |
| **Magasinier** | Stock | Réceptionne les lots, ouvre les réquisitions, gère le catalogue d'articles. |
| **Service Client** | Représentant SC | Saisit les réclamations, fait les relances, marque résolu. |

Les rôles sont stockés sur `auth.users.user_metadata.role`. La page
**Roles** mappe chaque rôle aux pages et actions autorisées ;
l'accès est appliqué côté client (l'UI masque ce qui n'est pas
autorisé) **et** au niveau base via les politiques Row-Level Security +
un helper `cw_is_manager()`.

## 3. Flux opérationnel quotidien

```
Dossier Bloom  ─►  Lot de production  ─►  QC 16 points  ─►  Conditionnement  ─►  Expédition
       │                  │                     │
       │                  │                     └─► rejet ? ──► NC ─► CAPA(s)
       │                  │
       │                  └─► matière première déduite de l'inventaire (FEFO)
       │
       └─► Réclamation client (surveillance post-commercialisation)
             ├─► investigation (Lot/UDI, cause racine, résultat)
             ├─► CAPA requis ? ─► registre CAPA
             └─► Vigilance à reporter ? ─► référence régulateur enregistrée
```

Chaque étape enregistre **qui l'a fait, quand, sur quel appareil,
contre quel lot/commande** et est visible sur la page Traçabilité.

## 4. Le cluster qualité — comment les pièces s'emboîtent

Depuis l'audit du 20-05-2026, le cluster qualité est entièrement
séparé en quatre registres distincts, chacun avec sa propre page et son
propre cycle de vie. Ils se référencent mutuellement mais ne s'écrasent
pas l'un l'autre.

### 4.1 Non-Conformité (NC)
- Un rapport par défaut / écart de processus.
- Capture : détection, description, correction immédiate (quarantaine,
  rebut…), cause racine, sévérité, statut.
- Ne se clôture que quand *chaque* CAPA lié est Verified ou Closed.
- Nouvelle tuile : **🛠 Linked CAPAs** (créer en ligne ou sélectionner
  depuis le registre).

### 4.2 CAPA (Action Corrective & Préventive)
- Vit dans son propre registre (`capa.html`).
- Chaque CAPA porte : source (NC / Feedback / Audit / Other), énoncé
  du problème, cause racine, plan d'action, propriétaire, date
  d'échéance, statut, contrôle d'efficacité, vérifié par/à, clôturé
  à.
- Cycle : **Open → In Progress → Verified → Closed** (ou *Cancelled*).
- Export CSV, liens profonds, KPIs par statut, filtres source +
  propriétaire.

### 4.3 Réclamations Clients (Customer Feedback)
- Chaque réclamation, retour, demande de garantie, suggestion, retour
  positif.
- Nouvelle section **Investigation & Compliance** : Lot/UDI, début
  d'investigation, résultat d'investigation, cause racine, indicateur
  CAPA + CAPA lié, vigilance à reporter + référence régulateur.
- Routage automatique par catégorie (ex. *Product Quality* → rôle RQ).
- Accusés de lecture (📧/📬), rappels de suivi (rouge/ambre/vert),
  score de satisfaction du tableau de bord sur les dossiers clôturés
  (30 derniers jours glissants).

### 4.4 Audit Interne
- Planifier et enregistrer les audits qualité internes.
- Chaque audit peut générer un ou plusieurs CAPAs (via source = audit).

## 5. Production & Contrôle Qualité

1. **Bloom Import** récupère les dossiers depuis bloomaligner.fr (CSV /
   Excel / API).
2. **Production** enregistre le lot : commande, machine, lot matière
   (sélectionné automatiquement FEFO), opérateur, quantités sup/inf,
   statut pending → in progress → completed.
3. **Clocking** fait avancer le dossier étape par étape (Printing →
   Thermoforming → Trimming → Packaging …). Chaque transition est
   horodatée et attribuée.
4. **Quality Control** mène l'inspection ISO en 16 points. Le
   contrôleur signe (nom + login), soumet, puis :
   - ✅ Approuve → lot libéré pour expédition
   - ❌ Rejette → étape réinitialisée, bannière NC avec lien
     pré-rempli
   - ⏸ Met en attente pour re-vérification
5. Nouveaux champs QC (audit 2026-05) : **NC liée**, **Référence de
   procédure**, **Mesures prises** — pour que le certificat QC documente
   non seulement *ce qui a été vérifié* mais aussi *quelle SOP a été
   suivie* et *ce qui a été fait du lot rejeté*.

## 6. Fournisseurs & Inventaire

### 6.1 Liste des Fournisseurs Approuvés (ISO 13485 §7.4)
- Aucun achat en dehors de la LFA.
- Statut : Approuvé / Conditionnel / Suspendu / Disqualifié.
- Réévaluation annuelle ; la LFA signale en rouge les évaluations
  de plus de 12 mois.
- **Certifications & contrats** avec date d'expiration — badges
  automatiques :
  - 🟢 VALID (> 30 jours)
  - 🟡 SOON (≤ 30 jours)
  - 🔴 EXPIRED (date passée)
- Pièces jointes PDF / image stockées dans un bucket **privé**
  (`supplier-docs`) ; l'application les ouvre via une **URL signée à
  courte durée de vie** (5 min). Seul l'auteur du téléversement ou
  un manager peut supprimer un fichier.

### 6.2 Inventaire
- Catalogue d'articles + Lots (consommation FEFO).
- Chaque article porte une chaîne **Storage conditions** (désormais
  remontée au niveau colonne du catalogue — texte long tronqué,
  survoler pour voir l'intégralité).
- Les alertes de stock alimentent automatiquement le Tableau de Bord
  et peuvent générer des réquisitions automatiques.

### 6.3 Réquisitions
- Flux : pending → approved (manager) → sent → received.
- À réception, un nouveau lot d'inventaire est automatiquement créé
  avec le numéro de lot fournisseur, qui pointe en retour vers la
  réquisition pour la traçabilité.

## 7. Notifications & relances

- **Réclamations Clients** : l'assigné reçoit un toast 🔔 + une
  bannière persistante sur chaque page jusqu'à ce qu'il ouvre le
  dossier (📧→📬).
- **Notifications push** (Web Push + VAPID) : affectation, mention
  dans le chat, rappels de suivi. La livraison est tracée dans
  `push_log` (Sent / Delivered / Opened).
- **Dates de suivi** affichées sur le Tableau de Bord avec un
  décompte rouge/ambre.
- **Cron de rappels** s'exécute toutes les 15 minutes (pg_cron) pour
  réveiller la fonction edge de push sur les suivis en retard.

## 8. Traçabilité par dossier (ce qui reste auditable)

Chaque enregistrement sur chaque page porte la même télémétrie —
visible sur la vue détaillée :

- `created_by`, `created_at`
- `last_edited_by`, `last_edited_at`
- `last_viewed_by`, `last_viewed_at`
- `notification_seen_at`, `notification_seen_by` (le cas échéant)
- Les changements de statut sont journalisés dans la chronologie de
  discussion du dossier

Les modifications d'une réclamation client sont restreintes en dur par
un trigger base de données (`cf_enforce_edit_owner`) à : le créateur,
l'assigné/membre du rôle courant, ou un manager. Les autres
utilisateurs reçoivent une erreur de permission directement depuis
Postgres — l'UI ne peut pas le contourner.

## 9. Stockage des données & RLS

- Toutes les tables utilisent **Row-Level Security** ; le motif du
  projet est « authentifié = de confiance » plus des restrictions
  ciblées owner/rôle sur les tables sensibles (customer_feedback,
  capa, etc.).
- Buckets de stockage privés : `chat-media` (pièces jointes de
  discussion de dossier) et `supplier-docs` (PDFs cert / contrats).
  Les deux requièrent une authentification et servent des URLs
  signées.
- Les fonctions SQL d'assistance vivent sous `public.cw_*` — elles
  sont en `SECURITY DEFINER` et utilisent un search_path verrouillé
  pour prévenir les injections.

## 10. Où regarder quand quelque chose ne va pas

| Problème | Premier endroit à vérifier |
|---|---|
| Notification manquante | Settings → statut Push · table push_log pour l'état de livraison |
| Mauvais assigné | Settings → Routage Catégorie / Rôle · champ `assigned_to` du dossier |
| Page lente | Onglet réseau des Dev Tools · Logs Supabase (`mcp__supabase__get_logs`) |
| Impossible de modifier un dossier | Assigné + créateur + votre rôle — seuls ces trois peuvent modifier une réclamation ; les managers peuvent toujours |
| Boucle de connexion sur iOS PWA | Reset complet : supprimer l'app + Réglages → Safari → Effacer historique · localStorage miroite la session pour la réouverture à froid |
| Pièce jointe storage 404 | Vérifier que l'URL signée n'a pas expiré (5 min) ; régénérer en ré-ouvrant le document |

## 11. Aide intégrée à l'application

Chaque page a un bouton flottant 🛟 dans la barre supérieure :

1. Cliquer dessus.
2. Le panneau s'ouvre avec **Rôle · Objectif · Processus · Boutons**
   pour cette page.
3. Le bouton en haut à droite bascule **FR ⇄ EN** — les deux langues
   sont maintenues synchronisées dans `lang.js`.

Après l'audit du 20-05-2026, le contenu d'aide a été mis à jour pour
couvrir :
- La nouvelle section Investigation & Compliance dans les Réclamations
  Clients
- Les nouveaux champs NC link / Procedure / Measures dans le Contrôle
  Qualité
- La tuile Linked CAPAs dans les Non-Conformités
- La section Certifications & contrats + pièces jointes PDF chez les
  Fournisseurs
- La colonne Storage dans l'Inventaire
- La toute nouvelle page registre CAPA

## 12. Historique des changements (pertinent pour ce protocole)

| Date | Ce qui a changé | Migration / commit |
|---|---|---|
| 20-05-2026 | Extensions modules audit : champs customer_feedback, champs QC, supplier_documents, table capa | `20260520140000_audit_module_extensions.sql` |
| 20-05-2026 | Bucket privé `supplier-docs` + politiques de stockage | `20260520150000_supplier_docs_storage.sql` |
| 20-05-2026 | Déploiement UI (5 pages mises à jour, capa.html ajoutée, 11 sidebars reçoivent le lien CAPA) | branche `claude/add-case-category-layout-AMA0d` |
| 20-05-2026 | Contenu d'aide rafraîchi dans lang.js (FR + EN) | ce commit |

---

*Pour les descriptions au niveau du champ, ouvrir la page dans
l'application et cliquer sur le bouton 🛟 Help — l'aide intégrée est
toujours la source unique de vérité, dans les deux langues.*
