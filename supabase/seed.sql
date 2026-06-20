-- ============================================================
-- Seed — Données fictives Force 7 pour la démo du 27 juin
-- ============================================================

-- Catalogue formations
insert into catalogue_formations (id, intitule, duree, prix_standard, programme_formation) values
  ('11111111-0000-0000-0000-000000000001', 'Travail en hauteur — Port du harnais', '1 jour (7h)', 350.00,
   'Objectifs : Identifier les risques liés au travail en hauteur. Utiliser correctement les EPI anti-chute. Contenu : réglementation, types d''EPI, inspection du matériel, mise en pratique.'),
  ('11111111-0000-0000-0000-000000000002', 'Sauveteur Secouriste du Travail (SST)', '2 jours (14h)', 280.00,
   'Objectifs : Maîtriser les gestes de premier secours. Contenu : protection, examen de la victime, alerte, gestes de secours (PLS, DAE, hémorragies).'),
  ('11111111-0000-0000-0000-000000000003', 'CACES R486 — Nacelles élévatrices', '3 jours (21h)', 520.00,
   'Objectifs : Obtenir l''autorisation de conduite nacelle. Contenu : réglementation, technologie, règles de conduite, pratique terrain.'),
  ('11111111-0000-0000-0000-000000000004', 'Habilitation électrique B0/H0 — Non-électricien', '2 jours (14h)', 380.00,
   'Objectifs : Connaître les risques électriques et les mesures de prévention. Contenu : effets du courant, zones de travail, EPI électriques, conduite à tenir en cas d''accident.');

-- Prospects / Clients
insert into prospects_clients (id, nom_entreprise, siret, contact_nom, contact_prenom, contact_email, contact_telephone, contact_fonction, statut, type_financement, type_formation, nombre_stagiaires_estime, formation_souhaitee) values
  -- Dossier démo principal (tunnel complet devis → facture)
  ('22222222-0000-0000-0000-000000000001',
   'Chantiers Maritimes de Normandie', '41234567800012',
   'Bertrand', 'Lacoste', 'b.lacoste@cmn-normandie.fr', '02 35 47 12 98', 'Responsable HSE',
   'valide', 'direct', 'INTRA', 8,
   '11111111-0000-0000-0000-000000000001'),

  -- Dossier INTER en cours (plusieurs entreprises)
  ('22222222-0000-0000-0000-000000000002',
   'BTP Atlantique', '55678901200089',
   'Moreau', 'Sandrine', 's.moreau@btp-atlantique.fr', '02 35 91 44 00', 'DRH',
   'prospect_gagne', 'opco', 'INTER', 3,
   '11111111-0000-0000-0000-000000000002'),

  ('22222222-0000-0000-0000-000000000003',
   'Duclos Industrie', '78901234500034',
   'Duclos', 'Henri', 'h.duclos@duclos-industrie.fr', '02 35 28 67 43', 'Dirigeant',
   'prospect_gagne', 'direct', 'INTER', 2,
   '11111111-0000-0000-0000-000000000002'),

  -- Prospect en qualification
  ('22222222-0000-0000-0000-000000000004',
   'Port Autonome du Havre', '12345678900056',
   'Girard', 'Isabelle', 'i.girard@port-havre.fr', '02 35 19 88 00', 'Chargée de formation',
   'devis_en_attente', 'public_parapublic', 'INTRA', 12,
   '11111111-0000-0000-0000-000000000003'),

  -- Prospect perdu
  ('22222222-0000-0000-0000-000000000005',
   'Menuiserie Lebrun & Fils', '98765432100078',
   'Lebrun', 'Patrick', 'p.lebrun@menuiserie-lebrun.fr', '02 35 56 23 11', 'Gérant',
   'prospect_perdu', 'direct', 'INTRA', 2,
   '11111111-0000-0000-0000-000000000001');

-- Formateurs
insert into formateurs (id, nom, prenom, email, specialites, compte_cree_le) values
  ('33333333-0000-0000-0000-000000000001', 'Vaillant', 'Marc', 'm.vaillant@formateurs-securite.fr',
   'Travail en hauteur, CACES, Secourisme', '2024-03-15 10:00:00+00'),
  ('33333333-0000-0000-0000-000000000002', 'Chevalier', 'Nathalie', 'n.chevalier@prevention-pro.fr',
   'Habilitation électrique, Risques chimiques, SST', '2024-05-22 09:30:00+00'),
  ('33333333-0000-0000-0000-000000000003', 'Amara', 'Karim', 'k.amara@securite-industrie.fr',
   'CACES R486, Travail en hauteur, Gestes et postures', '2025-01-08 14:00:00+00');

-- Session principale (dossier démo — INTRA CMN)
insert into sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session) values
  ('44444444-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000001',
   'INTRA', '2026-07-07', '2026-07-07',
   '33333333-0000-0000-0000-000000000001',
   'planifie');

-- Session INTER (SST — BTP Atlantique + Duclos)
insert into sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session) values
  ('44444444-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000002',
   'INTER', '2026-07-14', '2026-07-15',
   '33333333-0000-0000-0000-000000000002',
   'planifie');

-- Liaison session INTER ↔ entreprises
insert into session_entreprises (id, session_id, prospect_client_id, statut_collecte_infos) values
  ('55555555-0000-0000-0000-000000000001',
   '44444444-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000002',
   'infos_recues'),
  ('55555555-0000-0000-0000-000000000002',
   '44444444-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000003',
   'relance_envoyee');

-- Apprenants session INTRA (CMN)
insert into apprenants (id, session_id, prospect_client_id, nom, prenom, email, fonction, statut, profil_keypredict_id, profil_edusign_id) values
  ('66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Renard', 'Thomas', 't.renard@cmn-normandie.fr', 'Chef d''équipe charpente', 'profil_edusign_cree', 'KP-2847', 'ES-5541'),
  ('66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Fontaine', 'Julien', 'j.fontaine@cmn-normandie.fr', 'Technicien maintenance', 'profil_edusign_cree', 'KP-2848', 'ES-5542'),
  ('66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Perrin', 'Stéphane', 's.perrin@cmn-normandie.fr', 'Technicien maintenance', 'profil_edusign_cree', 'KP-2849', 'ES-5543'),
  ('66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Nguyen', 'Thierry', 't.nguyen@cmn-normandie.fr', 'Opérateur chantier', 'tests_soumis', 'KP-2850', null),
  ('66666666-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Garnier', 'Lucas', 'l.garnier@cmn-normandie.fr', 'Opérateur chantier', 'tests_soumis', 'KP-2851', null),
  ('66666666-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Petit', 'Florian', 'f.petit@cmn-normandie.fr', 'Opérateur chantier', 'profil_keypredict_cree', 'KP-2852', null),
  ('66666666-0000-0000-0000-000000000007', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Martin', 'Adrien', 'a.martin@cmn-normandie.fr', 'Soudeur', 'profil_cree', null, null),
  ('66666666-0000-0000-0000-000000000008', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Simon', 'Baptiste', 'b.simon@cmn-normandie.fr', 'Soudeur', 'profil_cree', null, null);

-- Apprenants session INTER (BTP Atlantique)
insert into apprenants (id, session_id, prospect_client_id, nom, prenom, email, fonction, statut) values
  ('66666666-0000-0000-0000-000000000009', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Dupont', 'Marie', 'm.dupont@btp-atlantique.fr', 'Conductrice de travaux', 'profil_edusign_cree'),
  ('66666666-0000-0000-0000-000000000010', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Lambert', 'Pierre', 'p.lambert@btp-atlantique.fr', 'Chef de chantier', 'profil_edusign_cree'),
  ('66666666-0000-0000-0000-000000000011', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Bernard', 'Sophie', 's.bernard@btp-atlantique.fr', 'Maçonne', 'tests_soumis');

-- Documents session INTRA (CMN) — état démo
insert into documents (id, type_document, session_id, prospect_client_id, statut) values
  ('77777777-0000-0000-0000-000000000001', 'devis', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'envoye'),
  ('77777777-0000-0000-0000-000000000002', 'convention', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'valide'),
  ('77777777-0000-0000-0000-000000000003', 'facture', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'en_attente_validation');

-- Historique conversations (CMN)
insert into historique_conversations (id, prospect_client_id, sens, contenu, statut_validation, date) values
  ('88888888-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Bonjour, nous cherchons une formation travail en hauteur pour 8 de nos techniciens, idéalement courant juillet. Pouvez-vous nous faire une proposition ?',
   null, '2026-06-02 09:14:00+00'),
  ('88888888-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001',
   'sortant', 'Bonjour M. Lacoste, merci pour votre demande. Afin de préparer une proposition adaptée, pourriez-vous nous préciser : le niveau initial de vos équipes (première formation ou recyclage ?), et si vous souhaitez que la formation se déroule dans vos locaux ou dans notre centre au Havre ?',
   'valide', '2026-06-02 11:30:00+00'),
  ('88888888-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Ce serait pour une première formation, sur site chez nous à Harfleur. Nous avons un grand hall disponible. Nos équipes n''ont aucune formation préalable sur ce sujet.',
   null, '2026-06-03 08:45:00+00'),
  ('88888888-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001',
   'sortant', 'Parfait. Vous trouverez ci-joint notre devis pour une session INTRA de 8 personnes — Travail en hauteur / Port du harnais, 1 journée le 7 juillet 2026, dans vos locaux à Harfleur. Tarif global : 2 800 € HT. N''hésitez pas à revenir vers nous pour toute question.',
   'valide', '2026-06-04 14:00:00+00'),
  ('88888888-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Bonjour, devis bien reçu et signé en retour. Merci. Nous confirmons le 7 juillet.',
   null, '2026-06-09 10:22:00+00');

-- Notifications en attente (file "À valider")
insert into notifications (id, destinataire_type, destinataire_id, type, lien_objet, lu) values
  ('99999999-0000-0000-0000-000000000001', 'ilies', '00000000-0000-0000-0000-000000000000',
   'a_valider', '77777777-0000-0000-0000-000000000003', false),
  ('99999999-0000-0000-0000-000000000002', 'ilies', '00000000-0000-0000-0000-000000000000',
   'reponse_recue', '88888888-0000-0000-0000-000000000001', false),
  ('99999999-0000-0000-0000-000000000003', 'ilies', '00000000-0000-0000-0000-000000000000',
   'relance', '55555555-0000-0000-0000-000000000002', false);
