# PRD — Plateforme Force 7 (Simulation R2)

**Projet :** Démo interactive pour R2 Force 7 — 27 juin 2026
**Client :** Force 7 Formation (Le Havre) — Frédéric Liberge & Frédéric Gullin
**Réalisé par :** Nexoria (Jonatan Hamel)
**Stack :** Next.js + Supabase, déploiement Vercel
**Objectif du document :** Référence unique pour le développement avec Claude Code. Ce PRD décrit la plateforme cible qui remplace l'ERP Access de Force 7, automatisant 90-100% du processus administratif actuel (5h/jour, ~26 400€/an).

---

## 1. Contexte produit

Force 7 gère aujourd'hui l'intégralité de son administratif (devis, conventions, convocations, suivi pédagogique, facturation) via un ERP Access vieillissant développé par une personne de 78 ans, couplé à des échanges manuels par email. La plateforme à construire centralise et automatise ce processus de bout en bout, en restant connectée à :

- **Outlook** (réception/envoi d'emails, via Microsoft Graph API)
- **EduSign** (émargement, questionnaires de satisfaction)
- **Keypredict** (tests d'évaluation des apprenants en amont)
- **OneDrive** (stockage documentaire en doublon)
- **Anthropic API (Claude)** (analyse, classification, génération de contenu)

**Principe directeur non négociable :** chaque communication générée par l'IA et destinée à un prospect/client externe passe par une validation humaine d'Iliès depuis la plateforme avant envoi. Ce n'est pas une limitation technique mais un choix produit — Force 7 (M. Gullin) a explicitement insisté en R1 sur le fait de ne pas bouleverser sa culture de travail ni le rôle d'Iliès. L'IA prépare, l'humain valide.

Les communications purement techniques entre systèmes (création de profils Keypredict/EduSign, par exemple) ne nécessitent pas de validation, car elles ne contiennent aucun contenu rédactionnel adressé à un tiers.

---

## 2. Utilisateurs et rôles

| Rôle | Accès | Usage principal |
|---|---|---|
| **Iliès** (administration des ventes) | Accès complet | Pilotage quotidien : validation des emails/documents générés par l'IA, suivi des dossiers, assignation des formateurs |
| **Frédéric Liberge / Frédéric Gullin** (dirigeants) | Accès complet ou lecture-pilotage | Vue d'ensemble, supervision, pas d'action opérationnelle quotidienne attendue |
| **Formateurs** (~50, indépendants) | Accès restreint à leur espace | Consultent leurs sessions assignées, complètent le déroulé pédagogique et le Bilan d'évaluation (BEX) en ligne |

Les formateurs créent eux-mêmes leur compte (auto-inscription), centralisés dans l'onglet "Formateurs". Pas de gestion de calendrier de disponibilité formateur dans cette V1 — l'assignation reste manuelle, basée sur la connaissance du réseau par Iliès.

---

## 3. Entités de données (modèle conceptuel)

Distinction importante actée pendant la construction du processus : un **prospect/client** (l'entreprise ou la personne qui demande et paie la formation) n'est pas la même entité qu'un **apprenant/stagiaire** (la personne qui suit physiquement la formation). Une entreprise peut avoir plusieurs apprenants ; en formation INTER, plusieurs entreprises différentes participent à une même session.

### 3.1 `prospects_clients`
Entreprise ou particulier à l'origine de la demande.

- `id`
- `nom_entreprise` (ou nom/prénom si particulier)
- `siret` (si entreprise)
- `contact_nom`, `contact_prenom`, `contact_email`, `contact_telephone`, `contact_fonction`
- `statut` : voir §5 Machine à états — Dossier
- `type_financement` : Direct / OPCO / Publique-Parapublique (Chorus) / Plateforme privée (ex. Training Square)
- `type_formation` : INTER / INTRA
- `nombre_stagiaires_estime`
- `formation_souhaitee` (lien vers `catalogue_formations`)
- `created_at`, `updated_at`

### 3.2 `sessions_formation`
Une session = une instance programmée d'une formation, liée à un ou plusieurs `prospects_clients` (plusieurs en INTER, un seul en INTRA).

- `id`
- `formation_id` (lien `catalogue_formations`)
- `type_formation` : INTER / INTRA
- `date_debut`, `date_fin`
- `formateur_id` (lien `formateurs`, peut être multiple)
- `statut_session`
- `dossier_onedrive_path`

### 3.3 `session_entreprises` (table de liaison, pertinente surtout en INTER)
Lie une session à chaque entreprise participante, avec un suivi individualisé.

- `id`
- `session_id`
- `prospect_client_id`
- `statut_collecte_infos` : En attente / Demande envoyée / Relance envoyée / Infos reçues
- `historique_echange_id`

### 3.4 `apprenants`
- `id`
- `session_id`
- `prospect_client_id` (l'entreprise de rattachement)
- `nom`, `prenom`, `email`, `fonction`
- `statut` : voir §5 Machine à états — Apprenant
- `profil_keypredict_id`, `profil_edusign_id`

### 3.5 `formateurs`
- `id`
- `nom`, `prenom`, `email`, `specialites`
- `compte_cree_le`

### 3.6 `catalogue_formations`
- `id`
- `intitule`, `duree`, `prix_standard`
- `programme_formation` (texte/template)
- `trame_ppt_url`

### 3.7 `documents`
Document générique (devis, convention, convocation, attestation, facture, feuille d'émargement, questionnaire, PDF BEX).

- `id`
- `type_document` : enum
- `session_id` ou `apprenant_id` ou `prospect_client_id` (selon le type)
- `statut` : Généré / En attente de validation / Validé / Envoyé
- `url_stockage_plateforme`
- `url_onedrive`
- `created_at`

### 3.8 `historique_conversations`
Fil chronologique complet (pas de résumé IA) des échanges email avec un prospect/client/entreprise.

- `id`
- `prospect_client_id` (ou `session_entreprise_id` en INTER)
- `sens` : Entrant / Sortant
- `contenu`
- `statut_validation` (si sortant généré par IA) : En attente / Validé / Modifié et validé
- `date`

### 3.9 `bex_evaluations`
Le tableau interactif de Bilan d'évaluation par session.

- `id`
- `session_id`
- `bilan_formateur` (texte : points forts, pistes d'amélioration, ressenti)
- `checklist_salle` (structure à définir — en attente de retour Force 7)
- `statut_completion` : En attente / Complété

### 3.10 `bex_evaluations_apprenants`
- `id`
- `bex_evaluation_id`
- `apprenant_id`
- `objectifs_acquis` (acquis / non-acquis / en cours)
- `modalites_evaluation`
- `commentaire`

### 3.11 `notifications`
- `id`
- `destinataire_type` : Iliès / Formateur
- `destinataire_id`
- `type` : À valider / Réponse reçue / Relance / Action requise
- `lien_objet` (session, prospect, document concerné)
- `lu` (bool)

---

## 4. Arborescence documentaire OneDrive

Chaque document généré par la plateforme est stocké nativement sur la plateforme puis dupliqué automatiquement sur OneDrive, selon l'arborescence suivante :

```
[Nom Entreprise ou Prospect]
  [Nom Formation] - [Date session]
    Devis
    Convention signée
    Émargement/
      Feuille émargement S1, S2, ...
      Questionnaire de satisfaction (groupé en INTRA, par apprenant en INTER)
    Apprenants/
      [Nom Prénom Apprenant]/
        Convocation
        Attestation de fin de formation
        PDF récapitulatif BEX (bilan formateur + checklist + évaluation individuelle)
        Questionnaire de satisfaction (copie individuelle)
    Bilan Excel (BEX) — vue session
    Facture
```

**Point en suspens (à confirmer avec Force 7) :** pour les sessions INTER avec plusieurs entreprises, l'arrangement exact du dossier racine (par session transverse vs réparti sous chaque dossier entreprise) reste à valider. La V1 peut partir sur un dossier par session, avec les apprenants répartis dedans indépendamment de leur entreprise d'origine.

---

## 5. Machines à états

### 5.1 Statut du dossier prospect/client

```
Devis en attente
  → Devis généré
  → Devis envoyé
  → Devis signé
  → Prospect gagné
  → Validé (convention signée / prise en charge / bon de commande reçu)
  --- (branche parallèle) ---
  → Prospect perdu (relances épuisées sans réponse, ou refus explicite)
```

### 5.2 Statut de l'apprenant

```
Profil créé
  → Profil Keypredict créé
  → Tests envoyés
  → Tests soumis
  → Profil EduSign créé
  → Attestation de fin de formation générée
  → Attestation de fin de formation envoyée
  → Dossier complété
```

### 5.3 Statut de collecte par entreprise (INTER uniquement)

```
En attente
  → Demande envoyée
  → Relance envoyée (peut se répéter)
  → Infos reçues
```

---

## 6. Spécification fonctionnelle détaillée — Processus automatisé

### Tronc commun (avant branchement INTER/INTRA)

**Étape 1 — Réception et tri automatique des emails**
Webhook Microsoft Graph en temps réel sur la boîte Outlook. L'email est lu et analysé par l'IA (Anthropic API), qui détermine le type de demande et le déplace automatiquement dans le dossier correspondant : Demande de devis, Convention à traiter, Affaires, Clients, Formateurs, Veille Qualiopi, ou Autres (catégorie fourre-tout pour tout email non classifié avec confiance suffisante). L'IA pose un drapeau rouge + importance haute si elle détecte un caractère urgent (deadline, relance, OPCO, etc.).

*Aucune validation requise — action de classement interne, pas de communication externe générée.*

**Étape 2 — Qualification automatique du prospect**
L'IA prépare une réponse email au prospect (questions, identification de la formation souhaitée), alimentée par les données Force 7. Soumise à Iliès pour validation sur la plateforme (valider en un clic / modifier / rédiger soi-même) avant envoi. Iliès est notifié dès que le prospect répond. Cycle répété jusqu'à confirmation d'intérêt et demande de devis. Historique complet conservé (pas de résumé).

**Étape 3 — Centralisation automatique du profil prospect**
L'IA prépare un email pour récupérer les informations manquantes à la constitution du profil (notamment : type de formation INTER/INTRA, nombre de stagiaires). Validation Iliès avant envoi. Une fois la réponse reçue (Iliès notifié), l'IA extrait les informations et crée le profil complet dans `prospects_clients`, incluant le type de formation. Historique conservé.

**Étape 4 — Mise à jour du statut prospect**
Passage automatique à "Devis en attente", déclenchant l'étape 5.

**Étape 5 — Génération automatique du devis**
Génération à partir du profil. Validation Iliès obligatoire (vérification/correction possible). Passage à "Devis généré" après validation.

**Étape 6 — Envoi automatique du devis**
Envoi par email depuis la boîte Outlook d'Iliès. Passage à "Devis envoyé".

**Étape 7 — Surveillance, relance et récupération du devis signé**
L'IA surveille la boîte Outlook. Relances automatiques à délai défini si pas de réponse (cycle répété). Iliès notifié à chaque réponse. À réception du devis signé : récupération automatique, vérification de signature par l'IA, stockage PDF dans l'espace documentaire, passage à "Devis signé" puis "Prospect gagné". En l'absence de réponse après relances ou en cas de refus explicite : passage à "Prospect perdu". Historique conservé pour chaque échange.

**Étape 8 — Génération automatique de la convention**
Génération à partir du profil apprenant/prospect. Validation Iliès obligatoire (vérification, personnalisation possible). Envoi automatique par email après validation. Surveillance + relances automatiques jusqu'à retour signé (ou réception prise en charge/bon de commande). Iliès notifié à chaque réponse. Passage du statut de "Prospect gagné" à "Validé".

**Étape 9 — Détermination automatique du type de formation**
La plateforme lit le champ type de formation déjà renseigné à l'étape 3 (INTER ou INTRA) et déclenche automatiquement le chemin correspondant. Aucune action ni validation requise — c'est un aiguillage interne.

---

### Branche INTER (9A) — Plusieurs entreprises, gestion individuelle

**Étape 10 (INTER) — Demande automatique des informations stagiaires, par entreprise**
Pour **chaque entreprise participante** à la session, l'IA prépare un email séparé de demande d'informations stagiaires. Chaque envoi est validé individuellement par Iliès. Suivi individualisé par entreprise via `session_entreprises` (statut propre : En attente / Demande envoyée / Relance envoyée / Infos reçues). L'IA effectue des relances automatiques par entreprise n'ayant pas répondu. Une fois la réponse d'une entreprise reçue, extraction automatique des informations de ses stagiaires et centralisation des profils apprenants correspondants, liés à la session et à leur entreprise d'origine. Historique conservé par entreprise.

**Étape 11 (INTER) — Assignation du formateur**
Depuis la plateforme, Iliès assigne manuellement le ou les formateurs (déjà inscrits, centralisés dans l'onglet "Formateurs") en fonction de leur disponibilité et spécialité.

**Étape 12 (INTER) — Mise à disposition des supports formateur et complétion du déroulé pédagogique**
Dès l'assignation, le formateur est notifié sur la plateforme. Dans son espace : informations apprenants/entreprises, programme de formation (pré-rempli depuis le catalogue), trame PPT Force 7 téléchargeable, formulaire structuré de déroulé pédagogique. Complétion en ligne, statut visible en temps réel par Iliès. Relance automatique sur la plateforme (et email si inactif) si non complété avant la date de formation.

**Étape 13 (INTER) — Création des profils Keypredict et envoi automatique des tests**
Création automatique des profils Keypredict pour chaque apprenant dès centralisation des infos. Génération et envoi automatique des tests par Keypredict. Aucune validation requise. Statut apprenant → "Profil Keypredict créé".

**Étape 14 (INTER) — Email automatique d'accompagnement et consentement de test**
En parallèle, email automatique (sans validation, modèle fixe) informant l'apprenant de l'email Keypredict reçu, avec consentement de test en copie. Relance automatique après une semaine sans réponse. Statuts apprenant → "Tests envoyés" puis "Tests soumis".

**Étape 15 (INTER) — Création automatique des comptes apprenants sur EduSign**
Création automatique (Nom, Prénom, Entreprise) dès centralisation des infos. Statut apprenant → "Profil EduSign créé".

**Étape 16 (INTER) — Génération des feuilles d'émargement, questionnaire de satisfaction, stockage**
Génération automatique des feuilles d'émargement EduSign par semaine. QR code affiché en salle par le formateur, scanné par les apprenants. Questionnaire de satisfaction : mécanisme séparé, envoi automatique d'un lien par email à la date de fin de formation, relance si non-réponse. Une fois la semaine/feuille signée : récupération automatique du PDF, stockage plateforme, duplication OneDrive dans le sous-dossier "Émargement". Questionnaire stocké et dupliqué dans le sous-dossier de chaque apprenant.

**Étape 17 (INTER) — Génération et envoi automatique de l'attestation de fin de formation**
Génération automatique. Statut apprenant → "Attestation de fin de formation générée". Envoi automatique par email. Statut → "Attestation de fin de formation envoyée". Stockage plateforme + duplication OneDrive (sous-dossier apprenant). Aucune validation requise.

**Étape 18 (INTER) — Mise à disposition et complétion du Bilan d'évaluation (BEX) en ligne**
Une semaine avant la fin de formation, formateur notifié sur la plateforme. Tableau interactif natif (remplace l'Excel) : Bilan du formateur (session entière), Checklist de contrôle salle (session entière), Évaluation par stagiaire (par apprenant — acquis/non-acquis/en cours, modalités, commentaire). Saisie en ligne, sauvegarde automatique à chaque modification. Statut de complétion visible en temps réel par Iliès. Relance automatique si non complété après la fin de formation. Une fois complété : PDF récapitulatif généré automatiquement par apprenant (bilan formateur + checklist + évaluation individuelle), téléchargeable, dupliqué sur OneDrive (sous-dossier apprenant). Statut apprenant final → "Dossier complété". Aucune validation Iliès requise (seul le formateur agit).

**Étape 19 (INTER) — Envoi automatique des documents au responsable de formation**
Une fois disponibles, envoi par email au responsable de formation de l'entreprise : PDF d'évaluation par apprenant, attestation, feuille d'émargement, questionnaire de satisfaction. Validation Iliès obligatoire avant envoi. L'apprenant ne reçoit aucun document à ce stade.

**Étape 20 (INTER) — Génération et envoi de la facture selon le statut de l'entreprise**
Génération automatique de la facture PDF à partir des informations du dossier. Validation Iliès obligatoire. Stockage plateforme + duplication OneDrive après validation. Aiguillage automatique selon le statut de l'entreprise :
- Facturation directe → envoi automatique par email
- OPCO → dépôt manuel par Iliès (pas d'API publique exploitable)
- Structure publique/parapublique (Chorus) → dépôt manuel par Iliès
- Plateforme privée (ex. Training Square) → dépôt manuel par Iliès, documents + facture

---

### Branche INTRA (9B) — Une seule entreprise, gestion par groupe

Identique à la branche INTER pour toutes les étapes, à deux différences près :

**Étape 10 (INTRA) — Demande automatique des informations stagiaires**
Une seule entreprise concernée → un seul email de demande, une seule relance, un seul suivi (pas de table `session_entreprises` à boucler, gestion directe sur `prospects_clients`).

**Étape 17 (INTRA) — Génération des feuilles d'émargement par groupe**
La plateforme crée un groupe d'apprenants sur EduSign (tous les stagiaires de l'entreprise), avec une architecture spécifique : un groupe contenant tous les apprenants, un dossier par apprenant au sein du groupe, un dossier dédié pour les feuilles d'émargement. EduSign génère nativement un PDF unique regroupant toutes les signatures (plutôt qu'un PDF par apprenant comme en INTER). Le reste du mécanisme (QR code, questionnaire, stockage, duplication OneDrive dans le sous-dossier "Émargement" du groupe) est identique à l'INTER.

Toutes les autres étapes (11 à 21 en INTRA, correspondant à 11-20 en INTER) suivent exactement la même logique que la branche INTER, appliquée à une seule entreprise au lieu de plusieurs.

---

## 7. Écrans principaux de la plateforme

1. **Tableau de bord / Liste des dossiers** — vue d'ensemble de tous les prospects/clients et sessions en cours, filtrable par statut, type de formation, urgence
2. **Fiche dossier (prospect/client)** — profil, historique de conversation complet, documents liés, statut, actions disponibles
3. **Espace "À valider"** — file d'attente centralisée de tout ce qui attend une action d'Iliès (emails IA, devis, conventions, factures, envois de documents)
4. **Fiche session de formation** — vue du dossier de formation : apprenants liés, formateur assigné, statuts EduSign/Keypredict, documents générés, avancement BEX
5. **Espace formateur** (accès restreint) — sessions assignées, déroulé pédagogique à compléter, BEX à compléter, supports téléchargeables
6. **Onglet "Formateurs"** — liste et fiches des formateurs inscrits
7. **Onglet "Catalogue formations"** — gestion des formations types (intitulé, durée, prix, programme, trame PPT)
8. **Notifications** — centralisées, visibles depuis n'importe quel écran

---

## 8. Hors périmètre V1 / Limites connues

- Pas de calendrier de disponibilité formateur (assignation manuelle basée sur la connaissance du réseau)
- Pas d'intégration API pour le dépôt sur plateformes OPCO, Chorus, ou plateformes privées (aucune API publique exploitable) — ces dépôts restent manuels
- L'option Webservice Keypredict (payante) doit être confirmée et activée côté Force 7 avant la mise en production réelle
- La structure exacte des champs du devis, de la convention, du BEX (compétences/modules), et le contenu précis du déroulé pédagogique restent à valider avec Force 7 (voir §9)
- Gestion des formations annulées/reportées non spécifiée à ce stade
- Gestion multi-formateurs sur une même session non spécifiée à ce stade

---

## 9. Points à confirmer avec Force 7 (avant développement de la version livrée)

1. Champs exacts du devis (intitulé, durée, tarif, dates, lieu, nombre de places...)
2. Existence d'un catalogue figé de formations avec prix/durée/programme standard, ou sur-mesure systématique
3. Structure exacte du Bilan Excel (BEX) actuel — compétences/modules par type de formation
4. Format exact des documents existants (devis, convention, convocation, attestation, facture) — exemplaires anonymisés
5. Le déroulé pédagogique Excel revient-il complété pour archivage Qualiopi, ou reste-t-il à l'usage du formateur uniquement ?
6. Délais de relance précis par type de document (devis, convention, convocation)
7. Gestion du statut "Prospect perdu" — action de suivi après ce statut ?
8. Gestion des formations annulées/reportées après signature de convention
9. Possibilité de plusieurs formateurs sur une même session
10. Arborescence OneDrive définitive — confirmation, en particulier pour le cas multi-entreprises en INTER
11. Volumétrie de sessions actives en parallèle (calibrage dashboard)
12. Confirmation d'activation de l'option payante Webservice Keypredict
13. Liste des accès souhaités (Iliès, dirigeants, formateurs) et niveaux de droits

---

## 10. Pour la démo du 27 juin — périmètre suggéré

Vu le format validé (appli web cliquable, dashboard ERP simulé avec données fictives Force 7, tunnel complet devis → facture en vue d'ensemble accélérée), la démo doit permettre de montrer, sur un cas concret :

1. Un email entrant simulé qui se classe automatiquement (Étape 1) — effet "vivant" recherché
2. Le fil de qualification avec validation d'Iliès en un clic (Étapes 2-3)
3. La cascade de statuts jusqu'au devis signé (Étapes 4-7)
4. La bascule visuelle vers la fiche session avec apprenants, formateur assigné, statuts EduSign/Keypredict en temps réel (Étapes 11-17)
5. L'espace "À valider" comme pièce maîtresse visuelle (montre la philosophie "Iliès garde la main")
6. La génération finale de facture et son aiguillage automatique selon le statut de l'entreprise (Étape 20)

Ce périmètre couvre la totalité du tunnel sans nécessiter de développer en profondeur l'espace formateur (qui peut être montré en aperçu/mockup plutôt qu'en interaction complète) ni la gestion documentaire OneDrive réelle (simulable par un visuel d'arborescence).
