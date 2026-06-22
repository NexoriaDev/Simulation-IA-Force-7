-- ============================================================
-- Force 7 Plateforme — Migration 002 : Communication
-- Tables : etapes_process, templates_email, relances
-- + peuplement initial (13 étapes + 13 templates)
-- ============================================================

-- ─── Type énuméré ────────────────────────────────────────────────────────────

create type mode_email as enum ('automatique', 'a_valider');

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table etapes_process (
  id          uuid        primary key default gen_random_uuid(),
  ordre       integer     not null,
  nom         text        not null,
  branche     text,
  created_at  timestamptz not null default now()
);

create table templates_email (
  id          uuid        primary key default gen_random_uuid(),
  etape_id    uuid        not null references etapes_process(id) on delete cascade,
  objet       text        not null,
  corps       text        not null,
  mode        mode_email  not null default 'automatique',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table relances (
  id                  uuid        primary key default gen_random_uuid(),
  template_email_id   uuid        not null references templates_email(id) on delete cascade,
  ordre               integer     not null,
  objet               text        not null,
  corps               text        not null,
  delai_jours         integer     not null,
  created_at          timestamptz not null default now()
);

-- ─── Trigger updated_at ──────────────────────────────────────────────────────

create trigger templates_email_updated_at
  before update on templates_email
  for each row execute function update_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table etapes_process  enable row level security;
alter table templates_email enable row level security;
alter table relances        enable row level security;

create policy "admins_full_access" on etapes_process
  for all using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));

create policy "admins_full_access" on templates_email
  for all using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));

create policy "admins_full_access" on relances
  for all using (exists (select 1 from user_profiles where id = auth.uid() and role = 'admin'));

-- ─── Données initiales ───────────────────────────────────────────────────────

do $$
declare v uuid;
begin

-- 1 · Profil créé — a_valider (premier contact, personnalisation requise)
insert into etapes_process(ordre, nom) values (1, 'Profil créé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Votre demande de formation a bien été reçue',
  'Bonjour [Prénom],

Nous avons bien reçu votre demande concernant la formation « [Intitulé formation] ».

Notre équipe va analyser votre dossier et vous contactera dans les 48h pour finaliser votre devis personnalisé.

N''hésitez pas à nous contacter pour toute question.

Cordialement,
L''équipe Force 7 Formation',
  'a_valider');

-- 2 · Devis en attente — a_valider (relance/qualification prospect)
insert into etapes_process(ordre, nom) values (2, 'Devis en attente') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Informations complémentaires pour établir votre devis',
  'Bonjour [Prénom],

Afin d''établir votre devis pour la formation « [Intitulé formation] » dans les meilleures conditions, nous aurions besoin des informations suivantes :

- Nombre de stagiaires envisagé
- Dates souhaitées
- Lieu de formation (vos locaux ou nos salles au Havre)
- Modalités de financement (OPCO, autofinancement, autre)

Pourriez-vous nous les communiquer dans les prochains jours ?

Cordialement,
L''équipe Force 7 Formation',
  'a_valider');

-- 3 · Devis généré — a_valider (envoi d'un document commercial, validation Iliès)
insert into etapes_process(ordre, nom) values (3, 'Devis généré') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Votre devis — Formation [Intitulé formation]',
  'Bonjour [Prénom],

Nous avons le plaisir de vous faire parvenir votre devis pour la formation « [Intitulé formation] » (réf. [Numéro devis]).

Vous trouverez en pièce jointe le détail de notre proposition comprenant :
- Le programme pédagogique complet
- Les modalités pratiques (dates, lieu, effectif)
- Le tarif et les conditions de financement

Ce devis est valable 30 jours à compter de la date d''envoi. N''hésitez pas à revenir vers nous pour toute adaptation.

Cordialement,
L''équipe Force 7 Formation',
  'a_valider');

-- 4 · Devis envoyé — a_valider (relance de négociation)
insert into etapes_process(ordre, nom) values (4, 'Devis envoyé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Relance — Devis formation [Intitulé formation]',
  'Bonjour [Prénom],

Nous revenons vers vous concernant le devis que nous vous avons transmis le [Date d''envoi] pour la formation « [Intitulé formation] ».

Avez-vous eu l''occasion d''en prendre connaissance ? Nous sommes disponibles pour répondre à vos questions ou adapter notre proposition à vos besoins spécifiques.

N''hésitez pas à nous contacter directement par téléphone ou par email.

Cordialement,
L''équipe Force 7 Formation',
  'a_valider');

-- 5 · Devis signé — automatique (confirmation standardisée)
insert into etapes_process(ordre, nom) values (5, 'Devis signé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Confirmation — Votre devis signé a bien été reçu',
  'Bonjour [Prénom],

Nous vous confirmons la bonne réception de votre devis signé pour la formation « [Intitulé formation] ».

Votre dossier est maintenant en cours de traitement. Nous allons préparer les documents contractuels (convention de formation, convocations) et vous les ferons parvenir prochainement.

Merci de votre confiance.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 6 · Prospect gagné — automatique (accueil client standardisé)
insert into etapes_process(ordre, nom) values (6, 'Prospect gagné') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Bienvenue chez Force 7 Formation — Prochaines étapes',
  'Bonjour [Prénom],

Nous sommes ravis de vous compter parmi nos clients pour la formation « [Intitulé formation] ».

Voici les prochaines étapes de votre parcours :
1. Finalisation et envoi de la convention de formation
2. Envoi des convocations aux participants
3. Réalisation des tests de positionnement (plateforme Keypredict)
4. Démarrage de la formation

Nous reviendrons vers vous très prochainement avec tous les détails pratiques.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 7 · Validé — automatique (confirmation administrative)
insert into etapes_process(ordre, nom) values (7, 'Validé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Confirmation officielle — Session de formation [Intitulé formation]',
  'Bonjour [Prénom],

Nous avons le plaisir de vous confirmer officiellement votre session de formation :

Formation : [Intitulé formation]
Dates : du [Date début] au [Date fin]
Lieu : [Lieu de formation]
Formateur : [Nom formateur]
Nombre de participants : [Nombre]

Vous trouverez en pièce jointe la convention de formation à nous retourner signée dans les meilleurs délais.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 8 · Profil Keypredict créé — automatique (notification accès plateforme)
insert into etapes_process(ordre, nom) values (8, 'Profil Keypredict créé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Accès à votre espace Keypredict — Tests de positionnement',
  'Bonjour [Prénom],

Dans le cadre de votre prochaine formation « [Intitulé formation] », votre profil sur la plateforme Keypredict a été créé.

Vous allez recevoir sous peu vos identifiants de connexion pour réaliser votre évaluation de positionnement. Ces tests permettent à votre formateur d''adapter le contenu pédagogique à votre niveau et à vos objectifs professionnels.

Durée estimée : 20 à 30 minutes.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 9 · Tests générés — automatique (information technique)
insert into etapes_process(ordre, nom) values (9, 'Tests générés') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Vos tests de positionnement sont en cours d''envoi',
  'Bonjour [Prénom],

Vos tests de positionnement pour la formation « [Intitulé formation] » ont été générés sur la plateforme Keypredict.

Vous allez recevoir très prochainement un email avec votre lien d''accès personnel. Merci de les compléter au minimum 48h avant le début de la formation pour permettre à votre formateur de préparer votre session.

Pour toute difficulté de connexion, contactez-nous directement.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 10 · Tests envoyés — automatique (appel à l'action standardisé)
insert into etapes_process(ordre, nom) values (10, 'Tests envoyés') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Action requise — Complétez vos tests avant le [Date limite]',
  'Bonjour [Prénom],

Vos tests de positionnement pour la formation « [Intitulé formation] » vous ont été envoyés par la plateforme Keypredict.

Merci de les compléter avant le [Date limite] afin de permettre à votre formateur de préparer au mieux votre session et d''adapter le contenu à votre profil.

Accédez à vos tests directement depuis votre espace Keypredict via le lien reçu par email.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 11 · Profil Edusign créé — automatique (notification accès émargement)
insert into etapes_process(ordre, nom) values (11, 'Profil Edusign créé') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Votre espace d''émargement numérique Edusign est prêt',
  'Bonjour [Prénom],

Votre profil Edusign a été créé pour gérer votre émargement numérique tout au long de la formation « [Intitulé formation] ».

Le jour de la formation, vous recevrez un SMS avec un code d''accès vous permettant de signer numériquement vos feuilles d''émargement à chaque demi-journée. Aucune installation n''est requise de votre part.

En cas de question, n''hésitez pas à vous rapprocher de votre formateur sur place.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 12 · Attestation générée — automatique (information administrative)
insert into etapes_process(ordre, nom) values (12, 'Attestation de fin de formation générée') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Votre attestation de fin de formation est prête',
  'Bonjour [Prénom],

Suite à votre participation à la formation « [Intitulé formation] », nous avons le plaisir de vous informer que votre attestation de fin de formation a été générée.

Elle vous sera transmise par email dans les prochaines 24h.

Nous vous remercions pour votre participation et espérons que cette formation a pleinement répondu à vos attentes professionnelles.

Cordialement,
L''équipe Force 7 Formation',
  'automatique');

-- 13 · Attestation envoyée — automatique (clôture du dossier)
insert into etapes_process(ordre, nom) values (13, 'Attestation de fin de formation envoyée') returning id into v;
insert into templates_email(etape_id, objet, corps, mode) values (v,
  'Votre attestation de fin de formation — [Intitulé formation]',
  'Bonjour [Prénom],

Vous trouverez ci-joint votre attestation de fin de formation « [Intitulé formation] » validant votre participation du [Date début] au [Date fin].

Ce document officiel certifie votre suivi de la formation dispensée par Force 7 Formation, organisme de formation certifié Qualiopi.

Nous vous remercions de votre confiance et espérons avoir le plaisir de vous accueillir à nouveau très prochainement.

Très cordialement,
L''équipe Force 7 Formation
Force 7 Formation — Organisme certifié Qualiopi
contact@force7-formation.fr',
  'automatique');

end $$;
