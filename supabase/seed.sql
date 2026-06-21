-- ============================================================
-- Seed — Données fictives Force 7 pour la démo du 27 juin
-- ============================================================

-- Catalogue formations (13 domaines réels Force 7)
insert into catalogue_formations (id, intitule, duree, prix_standard, programme_formation) values
  ('11111111-0000-0000-0000-000000000001', 'Accompagnement Coaching', '2 jours (14h)', 950.00,
   'Objectifs : Développer la posture de coach pour accompagner les équipes. Contenu : fondamentaux du coaching, écoute active, techniques de questionnement, gestion des résistances, plan d''action individuel.'),
  ('11111111-0000-0000-0000-000000000002', 'Achats / Ventes', '2 jours (14h)', 850.00,
   'Objectifs : Maîtriser les techniques d''achat et de vente en contexte professionnel. Contenu : cycle de vente, négociation, gestion des objections, optimisation des achats, relation fournisseurs.'),
  ('11111111-0000-0000-0000-000000000003', 'Bureautique / IA / Cybersécurité', '2 jours (14h)', 750.00,
   'Objectifs : Optimiser l''usage des outils bureautiques et comprendre les enjeux de l''IA et de la cybersécurité. Contenu : suite Office avancée, outils IA (Copilot, ChatGPT), bonnes pratiques cyber, RGPD.'),
  ('11111111-0000-0000-0000-000000000004', 'Communication / Communication digitale', '2 jours (14h)', 800.00,
   'Objectifs : Améliorer sa communication professionnelle et sa présence digitale. Contenu : communication interpersonnelle, communication écrite, réseaux sociaux professionnels, personal branding, gestion de crise.'),
  ('11111111-0000-0000-0000-000000000005', 'Comptabilité / Gestion', '3 jours (21h)', 1100.00,
   'Objectifs : Maîtriser les fondamentaux comptables et la gestion financière. Contenu : bilan et compte de résultat, TVA, gestion budgétaire, tableaux de bord, analyse financière.'),
  ('11111111-0000-0000-0000-000000000006', 'Développement Informatique', '3 jours (21h)', 1400.00,
   'Objectifs : Acquérir ou approfondir des compétences en développement logiciel. Contenu : langage(s) ciblé(s), bonnes pratiques de code, gestion de version (Git), tests, déploiement.'),
  ('11111111-0000-0000-0000-000000000007', 'Développement personnel', '2 jours (14h)', 900.00,
   'Objectifs : Renforcer la confiance en soi et l''efficacité professionnelle. Contenu : gestion du temps, organisation personnelle, gestion du stress, assertivité, intelligence émotionnelle.'),
  ('11111111-0000-0000-0000-000000000008', 'Hygiène Sécurité Environnement', '2 jours (14h)', 850.00,
   'Objectifs : Identifier et prévenir les risques professionnels. Contenu : réglementation HSE, risques chimiques, travail en hauteur, incendie, EPI, conduite à tenir en cas d''accident, démarche HSE en entreprise.'),
  ('11111111-0000-0000-0000-000000000009', 'Langue Anglaise', 'selon niveau', 500.00,
   'Objectifs : Développer les compétences en anglais professionnel. Contenu : expression orale et écrite, vocabulaire métier, rédaction de mails, présentations, négociation en anglais.'),
  ('11111111-0000-0000-0000-000000000010', 'Langues étrangères', 'selon niveau', 500.00,
   'Objectifs : Acquérir les bases d''une langue étrangère en contexte professionnel. Contenu : espagnol, allemand, arabe ou autre selon besoin — vocabulaire, grammaire, communication orale.'),
  ('11111111-0000-0000-0000-000000000011', 'Management / RSE / Interculturel', '3 jours (21h)', 1200.00,
   'Objectifs : Développer le leadership et intégrer les enjeux RSE et interculturels. Contenu : management d''équipe, délégation, entretiens professionnels, responsabilité sociétale, management interculturel.'),
  ('11111111-0000-0000-0000-000000000012', 'Ressources humaines', '2 jours (14h)', 950.00,
   'Objectifs : Maîtriser les fondamentaux RH. Contenu : droit du travail, recrutement, intégration, entretiens annuels, formation professionnelle, paie (bases), gestion des conflits.'),
  ('11111111-0000-0000-0000-000000000013', 'Transport Logistique Commerce International', '3 jours (21h)', 1100.00,
   'Objectifs : Optimiser la gestion transport et logistique à l''international. Contenu : réglementation transport, incoterms, douanes, gestion des flux, traçabilité, outils TMS/WMS.');

-- Prospects / Clients
insert into prospects_clients (id, nom_entreprise, siret, contact_nom, contact_prenom, contact_email, contact_telephone, contact_fonction, statut, type_financement, type_formation, nombre_stagiaires_estime, formation_souhaitee) values
  -- Dossier démo principal (tunnel complet devis → facture — HSE INTRA)
  ('22222222-0000-0000-0000-000000000001',
   'Chantiers Maritimes de Normandie', '41234567800012',
   'Bertrand', 'Lacoste', 'b.lacoste@cmn-normandie.fr', '02 35 47 12 98', 'Responsable HSE',
   'valide', 'direct', 'INTRA', 8,
   '11111111-0000-0000-0000-000000000008'),

  -- Dossier INTER en cours (Transport Logistique — plusieurs entreprises)
  ('22222222-0000-0000-0000-000000000002',
   'BTP Atlantique', '55678901200089',
   'Moreau', 'Sandrine', 's.moreau@btp-atlantique.fr', '02 35 91 44 00', 'DRH',
   'prospect_gagne', 'opco', 'INTER', 3,
   '11111111-0000-0000-0000-000000000013'),

  ('22222222-0000-0000-0000-000000000003',
   'Duclos Industrie', '78901234500034',
   'Duclos', 'Henri', 'h.duclos@duclos-industrie.fr', '02 35 28 67 43', 'Dirigeant',
   'prospect_gagne', 'direct', 'INTER', 2,
   '11111111-0000-0000-0000-000000000013'),

  -- Prospect en qualification (Management / RSE)
  ('22222222-0000-0000-0000-000000000004',
   'Port Autonome du Havre', '12345678900056',
   'Girard', 'Isabelle', 'i.girard@port-havre.fr', '02 35 19 88 00', 'Chargée de formation',
   'devis_en_attente', 'public_parapublic', 'INTRA', 12,
   '11111111-0000-0000-0000-000000000011'),

  -- Prospect perdu (HSE)
  ('22222222-0000-0000-0000-000000000005',
   'Menuiserie Lebrun & Fils', '98765432100078',
   'Lebrun', 'Patrick', 'p.lebrun@menuiserie-lebrun.fr', '02 35 56 23 11', 'Gérant',
   'prospect_perdu', 'direct', 'INTRA', 2,
   '11111111-0000-0000-0000-000000000008');

-- Formateurs
insert into formateurs (id, nom, prenom, email, specialites, compte_cree_le) values
  ('33333333-0000-0000-0000-000000000001', 'Vaillant', 'Marc', 'm.vaillant@formateurs-securite.fr',
   'Hygiène Sécurité Environnement, Transport Logistique Commerce International', '2024-03-15 10:00:00+00'),
  ('33333333-0000-0000-0000-000000000002', 'Chevalier', 'Nathalie', 'n.chevalier@prevention-pro.fr',
   'Management / RSE / Interculturel, Communication / Communication digitale, Ressources humaines', '2024-05-22 09:30:00+00'),
  ('33333333-0000-0000-0000-000000000003', 'Amara', 'Karim', 'k.amara@securite-industrie.fr',
   'Bureautique / IA / Cybersécurité, Développement Informatique, Développement personnel', '2025-01-08 14:00:00+00');

-- Session principale (dossier démo — INTRA CMN — HSE)
insert into sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session) values
  ('44444444-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000008',
   'INTRA', '2026-07-07', '2026-07-08',
   '33333333-0000-0000-0000-000000000001',
   'planifie');

-- Session INTER (Transport Logistique — BTP Atlantique + Duclos)
insert into sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session) values
  ('44444444-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000013',
   'INTER', '2026-07-14', '2026-07-16',
   '33333333-0000-0000-0000-000000000001',
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

-- Apprenants session INTRA (CMN — HSE)
insert into apprenants (id, session_id, prospect_client_id, nom, prenom, email, fonction, statut, profil_keypredict_id, profil_edusign_id) values
  ('66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Renard', 'Thomas', 't.renard@cmn-normandie.fr', 'Chef d''équipe charpente', 'profil_edusign_cree', 'KP-2847', 'ES-5541'),
  ('66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Fontaine', 'Julien', 'j.fontaine@cmn-normandie.fr', 'Technicien maintenance', 'profil_edusign_cree', 'KP-2848', 'ES-5542'),
  ('66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Perrin', 'Stéphane', 's.perrin@cmn-normandie.fr', 'Technicien maintenance', 'profil_edusign_cree', 'KP-2849', 'ES-5543'),
  ('66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Nguyen', 'Thierry', 't.nguyen@cmn-normandie.fr', 'Opérateur chantier', 'tests_soumis', 'KP-2850', null),
  ('66666666-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Garnier', 'Lucas', 'l.garnier@cmn-normandie.fr', 'Opérateur chantier', 'tests_soumis', 'KP-2851', null),
  ('66666666-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Petit', 'Florian', 'f.petit@cmn-normandie.fr', 'Opérateur chantier', 'profil_keypredict_cree', 'KP-2852', null),
  ('66666666-0000-0000-0000-000000000007', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Martin', 'Adrien', 'a.martin@cmn-normandie.fr', 'Soudeur', 'profil_cree', null, null),
  ('66666666-0000-0000-0000-000000000008', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Simon', 'Baptiste', 'b.simon@cmn-normandie.fr', 'Soudeur', 'profil_cree', null, null);

-- Apprenants session INTER (BTP Atlantique — Transport Logistique)
insert into apprenants (id, session_id, prospect_client_id, nom, prenom, email, fonction, statut) values
  ('66666666-0000-0000-0000-000000000009', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Dupont', 'Marie', 'm.dupont@btp-atlantique.fr', 'Responsable logistique', 'profil_edusign_cree'),
  ('66666666-0000-0000-0000-000000000010', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Lambert', 'Pierre', 'p.lambert@btp-atlantique.fr', 'Coordinateur transport', 'profil_edusign_cree'),
  ('66666666-0000-0000-0000-000000000011', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Bernard', 'Sophie', 's.bernard@btp-atlantique.fr', 'Assistante export', 'tests_soumis');

-- Documents session INTRA (CMN) — état démo
insert into documents (id, type_document, session_id, prospect_client_id, statut) values
  ('77777777-0000-0000-0000-000000000001', 'devis', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'envoye'),
  ('77777777-0000-0000-0000-000000000002', 'convention', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'valide'),
  ('77777777-0000-0000-0000-000000000003', 'facture', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'en_attente_validation');

-- Historique conversations (CMN — HSE)
insert into historique_conversations (id, prospect_client_id, sens, contenu, statut_validation, date) values
  ('88888888-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Bonjour, nous cherchons une formation Hygiène Sécurité Environnement pour 8 de nos techniciens, idéalement courant juillet. Nos équipes sont exposées à des risques chimiques et à des situations de travail en hauteur. Pouvez-vous nous faire une proposition ?',
   null, '2026-06-02 09:14:00+00'),
  ('88888888-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000001',
   'sortant', 'Bonjour M. Lacoste, merci pour votre demande. Afin de préparer une proposition adaptée, pourriez-vous nous préciser : le niveau initial de vos équipes en matière de prévention des risques (première formation ou recyclage ?), et si vous souhaitez que la formation se déroule dans vos locaux ou dans notre centre au Havre ?',
   'valide', '2026-06-02 11:30:00+00'),
  ('88888888-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Ce serait pour une première formation, sur site chez nous à Harfleur. Nous avons un grand hall disponible. Nos équipes n''ont aucune formation HSE préalable.',
   null, '2026-06-03 08:45:00+00'),
  ('88888888-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001',
   'sortant', 'Parfait. Vous trouverez ci-joint notre devis pour une session INTRA de 8 personnes — Hygiène Sécurité Environnement, 2 jours les 7 et 8 juillet 2026, dans vos locaux à Harfleur. Tarif global : 6 800 € HT. N''hésitez pas à revenir vers nous pour toute question.',
   'valide', '2026-06-04 14:00:00+00'),
  ('88888888-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000001',
   'entrant', 'Bonjour, devis bien reçu et signé en retour. Merci. Nous confirmons les 7 et 8 juillet.',
   null, '2026-06-09 10:22:00+00');

-- Notifications en attente (file "À valider")
insert into notifications (id, destinataire_type, destinataire_id, type, lien_objet, lu) values
  ('99999999-0000-0000-0000-000000000001', 'ilies', '00000000-0000-0000-0000-000000000000',
   'a_valider', '77777777-0000-0000-0000-000000000003', false),
  ('99999999-0000-0000-0000-000000000002', 'ilies', '00000000-0000-0000-0000-000000000000',
   'reponse_recue', '88888888-0000-0000-0000-000000000001', false),
  ('99999999-0000-0000-0000-000000000003', 'ilies', '00000000-0000-0000-0000-000000000000',
   'relance', '55555555-0000-0000-0000-000000000002', false);
