-- ============================================================
-- Seed — Données fictives Force 7 pour la démo du 27 juin
-- 34 prospects/clients · 6 sessions · 28 apprenants · 22 docs · 59 conversations
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

-- ═══════════════════════════════════════════════════════════
-- Prospects / Clients (34 total)
-- ═══════════════════════════════════════════════════════════
insert into prospects_clients (id, nom_entreprise, siret, contact_nom, contact_prenom, contact_email, contact_telephone, contact_fonction, statut, type_financement, type_formation, nombre_stagiaires_estime, formation_souhaitee) values

  -- ── 001 · Dossier démo principal — HSE INTRA · valide ───────────────────────
  ('22222222-0000-0000-0000-000000000001',
   'Chantiers Maritimes de Normandie', '41234567800012',
   'Bertrand', 'Lacoste', 'b.lacoste@cmn-normandie.fr', '02 35 47 12 98', 'Responsable HSE',
   'valide', 'direct', 'INTRA', 8, '11111111-0000-0000-0000-000000000008'),

  -- ── 002 · BTP Atlantique — Transport INTER · prospect_gagne ─────────────────
  ('22222222-0000-0000-0000-000000000002',
   'BTP Atlantique', '55678901200089',
   'Moreau', 'Sandrine', 's.moreau@btp-atlantique.fr', '02 35 91 44 00', 'DRH',
   'prospect_gagne', 'opco', 'INTER', 3, '11111111-0000-0000-0000-000000000013'),

  -- ── 003 · Duclos Industrie — Transport INTER · prospect_gagne ───────────────
  ('22222222-0000-0000-0000-000000000003',
   'Duclos Industrie', '78901234500034',
   'Duclos', 'Henri', 'h.duclos@duclos-industrie.fr', '02 35 28 67 43', 'Dirigeant',
   'prospect_gagne', 'direct', 'INTER', 2, '11111111-0000-0000-0000-000000000013'),

  -- ── 004 · Port Autonome du Havre — Management INTRA · devis_en_attente ──────
  ('22222222-0000-0000-0000-000000000004',
   'Port Autonome du Havre', '12345678900056',
   'Girard', 'Isabelle', 'i.girard@port-havre.fr', '02 35 19 88 00', 'Chargée de formation',
   'devis_en_attente', 'public_parapublic', 'INTRA', 12, '11111111-0000-0000-0000-000000000011'),

  -- ── 005 · Menuiserie Lebrun & Fils — HSE INTRA · prospect_perdu ─────────────
  ('22222222-0000-0000-0000-000000000005',
   'Menuiserie Lebrun & Fils', '98765432100078',
   'Lebrun', 'Patrick', 'p.lebrun@menuiserie-lebrun.fr', '02 35 56 23 11', 'Gérant',
   'prospect_perdu', 'direct', 'INTRA', 2, '11111111-0000-0000-0000-000000000008'),

  -- ── 006 · Raffinerie Total Normandie — Management INTRA · valide ─────────────
  ('22222222-0000-0000-0000-000000000006',
   'Raffinerie Total Normandie', '32156789000023',
   'Tessier', 'Laurent', 'l.tessier@total-normandie.fr', '02 35 06 10 00', 'Responsable Formation',
   'valide', 'opco', 'INTRA', 15, '11111111-0000-0000-0000-000000000011'),

  -- ── 007 · HAROPA Port du Havre — Bureautique/IA INTRA · valide ──────────────
  ('22222222-0000-0000-0000-000000000007',
   'HAROPA Port du Havre', '23456789012345',
   'Bonnet', 'Christine', 'c.bonnet@haropa-port.fr', '02 35 19 60 00', 'Chargée RH',
   'valide', 'public_parapublic', 'INTRA', 10, '11111111-0000-0000-0000-000000000003'),

  -- ── 008 · Eiffage Construction Normandie — HSE INTRA · devis_signe ──────────
  ('22222222-0000-0000-0000-000000000008',
   'Eiffage Construction Normandie', '45678901234560',
   'Carpentier', 'Nicolas', 'n.carpentier@eiffage-normandie.fr', '02 35 55 44 33', 'Responsable Sécurité',
   'devis_signe', 'opco', 'INTRA', 12, '11111111-0000-0000-0000-000000000008'),

  -- ── 009 · CARGILL France Rouen — Comptabilité INTRA · prospect_gagne ────────
  ('22222222-0000-0000-0000-000000000009',
   'CARGILL France — Site de Rouen', '56789012345678',
   'Prévost', 'Emmanuel', 'e.prevost@cargill.com', '02 35 62 44 00', 'DRH Site',
   'prospect_gagne', 'direct', 'INTRA', 5, '11111111-0000-0000-0000-000000000005'),

  -- ── 010 · Seine-Maritime Habitat — RH INTRA · prospect_gagne ────────────────
  ('22222222-0000-0000-0000-000000000010',
   'Seine-Maritime Habitat', '67890123456789',
   'Picard', 'Valérie', 'v.picard@sm-habitat.fr', '02 35 59 48 00', 'Responsable RH',
   'prospect_gagne', 'public_parapublic', 'INTRA', 8, '11111111-0000-0000-0000-000000000012'),

  -- ── 011 · Sanofi Normandie — Management INTRA · prospect_gagne ──────────────
  ('22222222-0000-0000-0000-000000000011',
   'Sanofi Normandie', '78901234567890',
   'Delacroix', 'Philippe', 'p.delacroix@sanofi.com', '02 35 78 00 00', 'Learning Manager',
   'prospect_gagne', 'direct', 'INTRA', 12, '11111111-0000-0000-0000-000000000011'),

  -- ── 012 · Vallourec Le Havre — HSE INTRA · devis_envoye ─────────────────────
  ('22222222-0000-0000-0000-000000000012',
   'Vallourec Le Havre', '89012345678901',
   'Ferrand', 'Bruno', 'b.ferrand@vallourec.com', '02 35 25 00 00', 'Responsable HSE',
   'devis_envoye', 'opco', 'INTRA', 20, '11111111-0000-0000-0000-000000000008'),

  -- ── 013 · Bolloré Logistics Le Havre — Transport INTER · devis_envoye ────────
  ('22222222-0000-0000-0000-000000000013',
   'Bolloré Logistics Le Havre', '90123456789012',
   'Collin', 'Martine', 'm.collin@bollore-logistics.com', '02 35 25 14 00', 'Responsable Formation',
   'devis_envoye', 'direct', 'INTER', 4, '11111111-0000-0000-0000-000000000013'),

  -- ── 014 · Renault Trucks Le Havre — Management INTRA · devis_envoye ──────────
  ('22222222-0000-0000-0000-000000000014',
   'Renault Trucks — Site Le Havre', '01234567890123',
   'Chemin', 'Olivier', 'o.chemin@renault-trucks.com', '02 35 41 50 00', 'Directeur RH',
   'devis_envoye', 'opco', 'INTRA', 6, '11111111-0000-0000-0000-000000000011'),

  -- ── 015 · Centre Hospitalier du Havre — Communication INTRA · devis_envoye ───
  ('22222222-0000-0000-0000-000000000015',
   'Centre Hospitalier du Havre', '12398765432198',
   'Lemaire', 'Anne-Sophie', 'as.lemaire@ch-havre.fr', '02 35 73 32 32', 'Responsable Formation Continue',
   'devis_envoye', 'public_parapublic', 'INTRA', 8, '11111111-0000-0000-0000-000000000004'),

  -- ── 016 · Geodis Normandie — Transport INTER · devis_envoye ─────────────────
  ('22222222-0000-0000-0000-000000000016',
   'Geodis Normandie', '21098765432109',
   'Allard', 'Julien', 'j.allard@geodis.com', '02 35 54 33 22', 'Manager Opérations',
   'devis_envoye', 'direct', 'INTER', 3, '11111111-0000-0000-0000-000000000013'),

  -- ── 017 · EDF Centrale de Paluel — HSE INTRA · devis_genere ─────────────────
  ('22222222-0000-0000-0000-000000000017',
   'EDF Centrale Nucléaire de Paluel', '30987654321098',
   'Bouchet', 'Jean-Pierre', 'jp.bouchet@edf.fr', '02 35 57 14 00', 'Responsable Sûreté',
   'devis_genere', 'direct', 'INTRA', 10, '11111111-0000-0000-0000-000000000008'),

  -- ── 018 · Vinci Construction Normandie — Management INTRA · devis_genere ─────
  ('22222222-0000-0000-0000-000000000018',
   'Vinci Construction Normandie', '40876543210987',
   'Morin', 'Céline', 'c.morin@vinci-construction.fr', '02 35 63 20 00', 'DRH Normandie',
   'devis_genere', 'opco', 'INTRA', 7, '11111111-0000-0000-0000-000000000011'),

  -- ── 019 · Air France Cargo LH — Anglais INTER · devis_genere ───────────────
  ('22222222-0000-0000-0000-000000000019',
   'Air France Cargo — Aéroport Le Havre', '50765432109876',
   'Roux', 'Éric', 'e.roux@airfrance-cargo.fr', '02 35 54 65 00', 'Coordinateur RH',
   'devis_genere', 'direct', 'INTER', 5, '11111111-0000-0000-0000-000000000009'),

  -- ── 020 · Caen la Mer — RH INTRA · devis_en_attente ───────────────────────
  ('22222222-0000-0000-0000-000000000020',
   'Caen la Mer Communauté Urbaine', '60654321098765',
   'Benoît', 'Marie-Hélène', 'mh.benoit@caenlamer.fr', '02 31 30 40 00', 'Responsable RH',
   'devis_en_attente', 'public_parapublic', 'INTRA', 6, '11111111-0000-0000-0000-000000000012'),

  -- ── 021 · Société Générale Le Havre — Bureautique INTRA · devis_en_attente ──
  ('22222222-0000-0000-0000-000000000021',
   'Société Générale — Agence Le Havre', '70543210987654',
   'Gaillard', 'Thomas', 't.gaillard@socgen.fr', '02 35 42 80 00', 'Responsable Agence',
   'devis_en_attente', 'direct', 'INTRA', 4, '11111111-0000-0000-0000-000000000003'),

  -- ── 022 · Spie Batignolles — HSE INTRA · devis_en_attente ─────────────────
  ('22222222-0000-0000-0000-000000000022',
   'Spie Batignolles Normandie', '80432109876543',
   'Gauthier', 'Richard', 'r.gauthier@spie-batignolles.fr', '02 35 49 88 00', 'Responsable QSE',
   'devis_en_attente', 'opco', 'INTRA', 15, '11111111-0000-0000-0000-000000000008'),

  -- ── 023 · SNCF Réseau Normandie — Management INTRA · devis_en_attente ────────
  ('22222222-0000-0000-0000-000000000023',
   'SNCF Réseau — Direction Normandie', '90321098765432',
   'Bourdin', 'Karine', 'k.bourdin@sncf.fr', '02 35 98 71 00', 'Chargée Formation',
   'devis_en_attente', 'direct', 'INTRA', 9, '11111111-0000-0000-0000-000000000011'),

  -- ── 024 · Mairie de Gonfreville — Communication digitale · profil_cree ───────
  ('22222222-0000-0000-0000-000000000024',
   'Mairie de Gonfreville-l''Orcher', null,
   'Malet', 'Stéphane', 's.malet@ville-gonfreville.fr', '02 35 51 20 00', 'Directeur Général des Services',
   'profil_cree', 'public_parapublic', 'INTRA', 6, '11111111-0000-0000-0000-000000000004'),

  -- ── 025 · AXA Le Havre — Comptabilité/Gestion · profil_cree ────────────────
  ('22222222-0000-0000-0000-000000000025',
   'AXA Assurances — Le Havre', '11109876543210',
   'Papin', 'Hélène', 'h.papin@axa.fr', '02 35 43 21 00', 'Directrice Agence',
   'profil_cree', 'direct', 'INTRA', 4, '11111111-0000-0000-0000-000000000005'),

  -- ── 026 · BNP Paribas Le Havre — Management · profil_cree ─────────────────
  ('22222222-0000-0000-0000-000000000026',
   'BNP Paribas — Le Havre Espace', '22098765432109',
   'Perrot', 'Frédéric', 'f.perrot@bnpparibas.fr', '02 35 22 50 00', 'Responsable RH',
   'profil_cree', 'plateforme_privee', 'INTRA', 5, '11111111-0000-0000-0000-000000000011'),

  -- ── 027 · Carrefour Montivilliers — Achats/Ventes · profil_cree ─────────────
  ('22222222-0000-0000-0000-000000000027',
   'Carrefour Montivilliers', '32987654321098',
   'Guillon', 'Pascale', 'p.guillon@carrefour.fr', '02 35 55 10 00', 'Directrice Magasin',
   'profil_cree', 'opco', 'INTRA', 8, '11111111-0000-0000-0000-000000000002'),

  -- ── 028 · GRDF Normandie — Bureautique/IA · profil_cree ────────────────────
  ('22222222-0000-0000-0000-000000000028',
   'GRDF — Direction Normandie', '42876543210987',
   'Vidal', 'Marc', 'm.vidal@grdf.fr', '02 35 36 00 00', 'Responsable Formation',
   'profil_cree', 'opco', 'INTRA', 6, '11111111-0000-0000-0000-000000000003'),

  -- ── 029 · GSM Group Le Havre — Développement personnel · profil_cree ─────────
  ('22222222-0000-0000-0000-000000000029',
   'GSM Group Le Havre', '52765432109876',
   'Nolin', 'Sandra', 's.nolin@gsm-group.fr', '02 35 47 33 00', 'DRH',
   'profil_cree', 'direct', 'INTRA', 3, '11111111-0000-0000-0000-000000000007'),

  -- ── 030 · Leclerc Caucriauville — Achats/Ventes · prospect_perdu ─────────────
  ('22222222-0000-0000-0000-000000000030',
   'Leclerc Caucriauville', '62654321098765',
   'Poirier', 'Michel', 'm.poirier@leclerc-havre.fr', '02 35 48 77 00', 'Directeur',
   'prospect_perdu', 'direct', 'INTRA', 4, '11111111-0000-0000-0000-000000000002'),

  -- ── 031 · Cabinet Dupré Conseil — RH · prospect_perdu ──────────────────────
  ('22222222-0000-0000-0000-000000000031',
   'Cabinet Dupré Conseil RH', '72543210987654',
   'Dupré', 'Armand', 'a.dupre@dupre-conseil.fr', '06 77 88 99 00', 'Gérant',
   'prospect_perdu', 'direct', 'INTRA', 2, '11111111-0000-0000-0000-000000000012'),

  -- ── 032 · Garage Renault Harfleur — Management · prospect_perdu ─────────────
  ('22222222-0000-0000-0000-000000000032',
   'Garage Renault Harfleur', '82432109876543',
   'Lecomte', 'Bernard', 'b.lecomte@renault-harfleur.fr', '02 35 45 21 00', 'Gérant',
   'prospect_perdu', 'direct', 'INTRA', 3, '11111111-0000-0000-0000-000000000011'),

  -- ── 033 · Pharmacie Centrale du Havre — Communication · prospect_perdu ───────
  ('22222222-0000-0000-0000-000000000033',
   'Pharmacie Centrale du Havre', '92321098765432',
   'Arnaud', 'Sylvie', 's.arnaud@pharmacie-centrale-lh.fr', '02 35 42 13 00', 'Titulaire',
   'prospect_perdu', 'direct', 'INTRA', 2, '11111111-0000-0000-0000-000000000004'),

  -- ── 034 · CMA CGM France — Transport INTER · devis_signe ────────────────────
  ('22222222-0000-0000-0000-000000000034',
   'CMA CGM — Direction France', '02210987654321',
   'Méndez', 'Rodrigo', 'r.mendez@cma-cgm.com', '04 88 91 90 00', 'Directeur Formation',
   'devis_signe', 'direct', 'INTER', 6, '11111111-0000-0000-0000-000000000013');

-- Formateurs
insert into formateurs (id, nom, prenom, email, specialites, compte_cree_le) values
  ('33333333-0000-0000-0000-000000000001', 'Vaillant', 'Marc', 'm.vaillant@formateurs-securite.fr',
   'Hygiène Sécurité Environnement, Transport Logistique Commerce International', '2024-03-15 10:00:00+00'),
  ('33333333-0000-0000-0000-000000000002', 'Chevalier', 'Nathalie', 'n.chevalier@prevention-pro.fr',
   'Management / RSE / Interculturel, Communication / Communication digitale, Ressources humaines', '2024-05-22 09:30:00+00'),
  ('33333333-0000-0000-0000-000000000003', 'Amara', 'Karim', 'k.amara@securite-industrie.fr',
   'Bureautique / IA / Cybersécurité, Développement Informatique, Développement personnel', '2025-01-08 14:00:00+00');

-- ═══════════════════════════════════════════════════════════
-- Sessions de formation (6 total)
-- ═══════════════════════════════════════════════════════════
insert into sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session) values
  -- 001 · CMN — HSE INTRA (dossier démo)
  ('44444444-0000-0000-0000-000000000001',
   '11111111-0000-0000-0000-000000000008', 'INTRA', '2026-07-07', '2026-07-08',
   '33333333-0000-0000-0000-000000000001', 'planifie'),
  -- 002 · BTP Atlantique + Duclos — Transport INTER
  ('44444444-0000-0000-0000-000000000002',
   '11111111-0000-0000-0000-000000000013', 'INTER', '2026-07-14', '2026-07-16',
   '33333333-0000-0000-0000-000000000001', 'planifie'),
  -- 003 · Total Normandie — Management INTRA
  ('44444444-0000-0000-0000-000000000003',
   '11111111-0000-0000-0000-000000000011', 'INTRA', '2026-07-21', '2026-07-23',
   '33333333-0000-0000-0000-000000000002', 'planifie'),
  -- 004 · HAROPA — Bureautique/IA INTRA
  ('44444444-0000-0000-0000-000000000004',
   '11111111-0000-0000-0000-000000000003', 'INTRA', '2026-08-04', '2026-08-05',
   '33333333-0000-0000-0000-000000000003', 'planifie'),
  -- 005 · Eiffage — HSE INTRA (devis signé)
  ('44444444-0000-0000-0000-000000000005',
   '11111111-0000-0000-0000-000000000008', 'INTRA', '2026-07-17', '2026-07-18',
   '33333333-0000-0000-0000-000000000001', 'planifie'),
  -- 006 · CMA CGM + Bolloré — Transport INTER (devis signé)
  ('44444444-0000-0000-0000-000000000006',
   '11111111-0000-0000-0000-000000000013', 'INTER', '2026-08-19', '2026-08-21',
   '33333333-0000-0000-0000-000000000001', 'planifie');

-- ═══════════════════════════════════════════════════════════
-- Liaison sessions INTER ↔ entreprises
-- ═══════════════════════════════════════════════════════════
insert into session_entreprises (id, session_id, prospect_client_id, statut_collecte_infos) values
  -- Session 002 INTER Transport
  ('55555555-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'infos_recues'),
  ('55555555-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 'relance_envoyee'),
  -- Session 006 INTER Transport (CMA CGM + Bolloré)
  ('55555555-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'infos_recues'),
  ('55555555-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000013', 'demande_envoyee');

-- ═══════════════════════════════════════════════════════════
-- Apprenants (28 total)
-- ═══════════════════════════════════════════════════════════
insert into apprenants (id, session_id, prospect_client_id, nom, prenom, email, fonction, statut, profil_keypredict_id, profil_edusign_id) values
  -- Session 001 · CMN · HSE (8 apprenants)
  ('66666666-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Renard',   'Thomas',   't.renard@cmn-normandie.fr',   'Chef d''équipe charpente',   'profil_edusign_cree',      'KP-2847', 'ES-5541'),
  ('66666666-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Fontaine', 'Julien',   'j.fontaine@cmn-normandie.fr', 'Technicien maintenance',     'profil_edusign_cree',      'KP-2848', 'ES-5542'),
  ('66666666-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Perrin',   'Stéphane', 's.perrin@cmn-normandie.fr',   'Technicien maintenance',     'profil_edusign_cree',      'KP-2849', 'ES-5543'),
  ('66666666-0000-0000-0000-000000000004', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Nguyen',   'Thierry',  't.nguyen@cmn-normandie.fr',   'Opérateur chantier',         'tests_soumis',             'KP-2850', null),
  ('66666666-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Garnier',  'Lucas',    'l.garnier@cmn-normandie.fr',  'Opérateur chantier',         'tests_soumis',             'KP-2851', null),
  ('66666666-0000-0000-0000-000000000006', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Petit',    'Florian',  'f.petit@cmn-normandie.fr',    'Opérateur chantier',         'profil_keypredict_cree',   'KP-2852', null),
  ('66666666-0000-0000-0000-000000000007', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Martin',   'Adrien',   'a.martin@cmn-normandie.fr',   'Soudeur',                    'profil_cree',              null,       null),
  ('66666666-0000-0000-0000-000000000008', '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Simon',    'Baptiste', 'b.simon@cmn-normandie.fr',    'Soudeur',                    'profil_cree',              null,       null),
  -- Session 002 · BTP Atlantique · Transport INTER
  ('66666666-0000-0000-0000-000000000009', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Dupont',   'Marie',    'm.dupont@btp-atlantique.fr',  'Responsable logistique',     'profil_edusign_cree',      null,       null),
  ('66666666-0000-0000-0000-000000000010', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Lambert',  'Pierre',   'p.lambert@btp-atlantique.fr', 'Coordinateur transport',     'profil_edusign_cree',      null,       null),
  ('66666666-0000-0000-0000-000000000011', '44444444-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Bernard',  'Sophie',   's.bernard@btp-atlantique.fr', 'Assistante export',          'tests_soumis',             null,       null),
  -- Session 003 · Total Normandie · Management (5 apprenants)
  ('66666666-0000-0000-0000-000000000012', '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'Rousseau', 'Claire',   'c.rousseau@total-normandie.fr', 'Responsable d''équipe',    'profil_edusign_cree',      'KP-3001', 'ES-6001'),
  ('66666666-0000-0000-0000-000000000013', '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'Martin',   'Xavier',   'x.martin@total-normandie.fr',   'Chef de projet',           'profil_edusign_cree',      'KP-3002', 'ES-6002'),
  ('66666666-0000-0000-0000-000000000014', '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'Legrand',  'Sylvie',   's.legrand@total-normandie.fr',  'Coordinatrice HSE',        'profil_keypredict_cree',   'KP-3003', null),
  ('66666666-0000-0000-0000-000000000015', '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'Barbier',  'Thierry',  't.barbier@total-normandie.fr',  'Responsable secteur',      'tests_soumis',             'KP-3004', null),
  ('66666666-0000-0000-0000-000000000016', '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'Leconte',  'Marine',   'm.leconte@total-normandie.fr',  'Assistante RH',            'profil_cree',              null,       null),
  -- Session 004 · HAROPA · Bureautique/IA (4 apprenants)
  ('66666666-0000-0000-0000-000000000017', '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'Guérin',   'Antoine',  'a.guerin@haropa-port.fr',    'Agent administratif',        'profil_keypredict_cree',   'KP-3010', null),
  ('66666666-0000-0000-0000-000000000018', '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'Leblanc',  'Valérie',  'v.leblanc@haropa-port.fr',   'Chargée de mission',         'tests_soumis',             'KP-3011', null),
  ('66666666-0000-0000-0000-000000000019', '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'Noël',     'Frédéric', 'f.noel@haropa-port.fr',      'Technicien informatique',    'profil_cree',              null,       null),
  ('66666666-0000-0000-0000-000000000020', '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'Pichon',   'Isabelle', 'i.pichon@haropa-port.fr',    'Assistante portuaire',       'profil_cree',              null,       null),
  -- Session 005 · Eiffage · HSE (5 apprenants)
  ('66666666-0000-0000-0000-000000000021', '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'Dumont',   'Pascal',   'p.dumont@eiffage-normandie.fr',  'Chef de chantier',        'profil_edusign_cree',      'KP-3020', 'ES-6010'),
  ('66666666-0000-0000-0000-000000000022', '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'Fortin',   'Alain',    'a.fortin@eiffage-normandie.fr',  'Conducteur de travaux',   'profil_edusign_cree',      'KP-3021', 'ES-6011'),
  ('66666666-0000-0000-0000-000000000023', '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'Colin',    'Romain',   'r.colin@eiffage-normandie.fr',   'Technicien sécurité',     'tests_soumis',             'KP-3022', null),
  ('66666666-0000-0000-0000-000000000024', '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'Merlin',   'François', 'f.merlin@eiffage-normandie.fr',  'Opérateur chantier',      'profil_keypredict_cree',   'KP-3023', null),
  ('66666666-0000-0000-0000-000000000025', '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'Aubert',   'Denis',    'd.aubert@eiffage-normandie.fr',  'Opérateur chantier',      'profil_cree',              null,       null),
  -- Session 006 · CMA CGM · Transport INTER (3 apprenants)
  ('66666666-0000-0000-0000-000000000026', '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'Perez',    'Lucie',    'l.perez@cma-cgm.com',   'Affréteur',                  'profil_edusign_cree',      'KP-3030', 'ES-6020'),
  ('66666666-0000-0000-0000-000000000027', '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'Gomez',    'Juan',     'j.gomez@cma-cgm.com',   'Agent transit douane',       'profil_keypredict_cree',   'KP-3031', null),
  ('66666666-0000-0000-0000-000000000028', '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'Sanchez',  'Rosa',     'r.sanchez@cma-cgm.com', 'Assistante export',          'profil_cree',              null,       null);

-- ═══════════════════════════════════════════════════════════
-- Documents (22 total)
-- ═══════════════════════════════════════════════════════════
insert into documents (id, type_document, session_id, prospect_client_id, statut) values
  -- Session 001 · CMN (tunnel démo : devis envoyé, convention validée, facture à valider)
  ('77777777-0000-0000-0000-000000000001', 'devis',       '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'envoye'),
  ('77777777-0000-0000-0000-000000000002', 'convention',  '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'valide'),
  ('77777777-0000-0000-0000-000000000003', 'facture',     '44444444-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'en_attente_validation'),
  -- Session 003 · Total Normandie (valide : devis envoyé + convention validée)
  ('77777777-0000-0000-0000-000000000004', 'devis',       '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'envoye'),
  ('77777777-0000-0000-0000-000000000005', 'convention',  '44444444-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000006', 'valide'),
  -- Session 004 · HAROPA (valide : devis envoyé + convention validée)
  ('77777777-0000-0000-0000-000000000006', 'devis',       '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'envoye'),
  ('77777777-0000-0000-0000-000000000007', 'convention',  '44444444-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000007', 'valide'),
  -- Session 005 · Eiffage (devis_signe : devis envoyé + convention à valider)
  ('77777777-0000-0000-0000-000000000008', 'devis',       '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'envoye'),
  ('77777777-0000-0000-0000-000000000009', 'convention',  '44444444-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000008', 'en_attente_validation'),
  -- Session 006 · CMA CGM (devis_signe : devis envoyé + convention à valider)
  ('77777777-0000-0000-0000-000000000010', 'devis',       '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'envoye'),
  ('77777777-0000-0000-0000-000000000011', 'convention',  '44444444-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000034', 'en_attente_validation'),
  -- Prospects gagnés (devis envoyé, pas de session confirmée)
  ('77777777-0000-0000-0000-000000000012', 'devis', null, '22222222-0000-0000-0000-000000000009', 'envoye'),
  ('77777777-0000-0000-0000-000000000013', 'devis', null, '22222222-0000-0000-0000-000000000010', 'envoye'),
  ('77777777-0000-0000-0000-000000000014', 'devis', null, '22222222-0000-0000-0000-000000000011', 'envoye'),
  -- Devis envoyés (en attente réponse client)
  ('77777777-0000-0000-0000-000000000015', 'devis', null, '22222222-0000-0000-0000-000000000012', 'envoye'),
  ('77777777-0000-0000-0000-000000000016', 'devis', null, '22222222-0000-0000-0000-000000000013', 'envoye'),
  ('77777777-0000-0000-0000-000000000017', 'devis', null, '22222222-0000-0000-0000-000000000014', 'envoye'),
  ('77777777-0000-0000-0000-000000000018', 'devis', null, '22222222-0000-0000-0000-000000000015', 'envoye'),
  ('77777777-0000-0000-0000-000000000019', 'devis', null, '22222222-0000-0000-0000-000000000016', 'envoye'),
  -- Devis générés (en attente validation Iliès avant envoi)
  ('77777777-0000-0000-0000-000000000020', 'devis', null, '22222222-0000-0000-0000-000000000017', 'en_attente_validation'),
  ('77777777-0000-0000-0000-000000000021', 'devis', null, '22222222-0000-0000-0000-000000000018', 'en_attente_validation'),
  ('77777777-0000-0000-0000-000000000022', 'devis', null, '22222222-0000-0000-0000-000000000019', 'en_attente_validation');

-- ═══════════════════════════════════════════════════════════
-- Historique conversations (59 total)
-- ═══════════════════════════════════════════════════════════
insert into historique_conversations (id, prospect_client_id, sens, contenu, statut_validation, date) values

  -- ── 001 · CMN (5 messages — tunnel démo complet) ────────────────────────────
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
   null, '2026-06-09 10:22:00+00'),

  -- ── 002 · BTP Atlantique (2 messages) ───────────────────────────────────────
  ('88888888-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000002',
   'entrant', 'Bonjour, nous souhaitons inscrire 3 collaborateurs à une session inter-entreprises en Transport Logistique Commerce International. Avez-vous des dates prévues cet été ?',
   null, '2026-06-05 10:30:00+00'),
  ('88888888-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000002',
   'sortant', 'Bonjour Mme Moreau, oui — nous organisons une session INTER Transport Logistique du 14 au 16 juillet 2026 au Havre. Tarif : 3 × 1 100 € HT = 3 300 € HT. Devis ci-joint, prise en charge OPCO possible. Devis signé en retour, merci.',
   'valide', '2026-06-06 09:15:00+00'),

  -- ── 003 · Duclos Industrie (2 messages) ─────────────────────────────────────
  ('88888888-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000003',
   'entrant', 'Bonjour, j''ai deux cadres à former en transport et commerce international. Vous m''avez été recommandé par un confrère du port. Y a-t-il une session prévue ?',
   null, '2026-06-07 14:10:00+00'),
  ('88888888-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000003',
   'sortant', 'Bonjour M. Duclos, nous avons justement une session INTER Transport du 14 au 16 juillet. Je vous joins le devis (2 personnes × 1 100 € HT). Votre place est réservée sur confirmation.',
   'valide', '2026-06-08 10:00:00+00'),

  -- ── 004 · Port Autonome du Havre (1 message) ────────────────────────────────
  ('88888888-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000004',
   'entrant', 'Bonjour, le Port du Havre souhaite former 12 cadres en Management et enjeux RSE dans le cadre de notre plan stratégique 2026. Formation souhaitée en INTRA sur notre site. Pouvez-vous chiffrer ?',
   null, '2026-06-10 11:00:00+00'),

  -- ── 005 · Menuiserie Lebrun (2 messages — perdu) ────────────────────────────
  ('88888888-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000005',
   'entrant', 'Bonjour, je cherche une formation HSE pour 2 personnes. Budget limité.',
   null, '2026-05-20 08:30:00+00'),
  ('88888888-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000005',
   'sortant', 'Bonjour M. Lebrun, voici notre proposition pour 2 personnes en HSE INTRA (1 700 € HT). Nous pouvons étudier une prise en charge OPCO si vous y êtes éligible.',
   'valide', '2026-05-21 09:30:00+00'),

  -- ── 006 · Total Normandie (3 messages — valide) ──────────────────────────────
  ('88888888-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000006',
   'entrant', 'Bonjour, dans le cadre de notre démarche RSE 2026, nous souhaitons former 15 cadres et techniciens en Management / RSE / Interculturel. Format souhaité : INTRA sur notre site de la raffinerie, juillet si possible.',
   null, '2026-06-01 09:00:00+00'),
  ('88888888-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000006',
   'sortant', 'Bonjour M. Tessier, nous serions ravis de vous accompagner dans cette démarche. Vous trouverez ci-joint notre proposition pour une session INTRA Management/RSE — 3 jours (21h), 15 personnes, du 21 au 23 juillet 2026. Tarif : 18 000 € HT (prise en charge OPCO possible). Programme personnalisé disponible sur demande.',
   'valide', '2026-06-02 14:00:00+00'),
  ('88888888-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000006',
   'entrant', 'Devis accepté. Merci de faire suivre la convention de formation pour validation interne.',
   null, '2026-06-09 08:45:00+00'),

  -- ── 007 · HAROPA (3 messages — valide) ──────────────────────────────────────
  ('88888888-0000-0000-0000-000000000016', '22222222-0000-0000-0000-000000000007',
   'entrant', 'Bonjour, notre direction souhaite mettre à niveau 10 agents administratifs sur les outils bureautiques (Office 365) et les usages de l''IA. Formation INTRA souhaitée courant août.',
   null, '2026-06-04 10:15:00+00'),
  ('88888888-0000-0000-0000-000000000017', '22222222-0000-0000-0000-000000000007',
   'sortant', 'Bonjour Mme Bonnet, voici notre proposition pour une session Bureautique / IA / Cybersécurité — 2 jours (14h), 10 personnes, les 4 et 5 août 2026. Tarif : 7 500 € HT (éligible financement public). Ci-joint le devis et le programme détaillé.',
   'valide', '2026-06-05 11:00:00+00'),
  ('88888888-0000-0000-0000-000000000018', '22222222-0000-0000-0000-000000000007',
   'entrant', 'Devis validé en interne. Merci de nous envoyer la convention de formation.',
   null, '2026-06-12 09:30:00+00'),

  -- ── 008 · Eiffage (3 messages — devis_signe) ────────────────────────────────
  ('88888888-0000-0000-0000-000000000019', '22222222-0000-0000-0000-000000000008',
   'entrant', 'Bonjour, nous devons former 12 compagnons et chefs de chantier en HSE avant démarrage de chantiers normands cet été. Session souhaitée en INTRA sur site.',
   null, '2026-06-06 08:00:00+00'),
  ('88888888-0000-0000-0000-000000000020', '22222222-0000-0000-0000-000000000008',
   'sortant', 'Bonjour M. Carpentier, voici notre proposition HSE INTRA pour 12 personnes — 2 jours (14h), les 17 et 18 juillet 2026. Tarif : 10 200 € HT, prise en charge OPCO possible. Programme adapté travail en hauteur et risques chimiques BTP.',
   'valide', '2026-06-07 10:30:00+00'),
  ('88888888-0000-0000-0000-000000000021', '22222222-0000-0000-0000-000000000008',
   'entrant', 'Devis signé en retour. Merci d''envoyer la convention de formation dès que possible.',
   null, '2026-06-13 14:00:00+00'),

  -- ── 009 · CARGILL (2 messages — prospect_gagne) ─────────────────────────────
  ('88888888-0000-0000-0000-000000000022', '22222222-0000-0000-0000-000000000009',
   'entrant', 'Bonjour, nous souhaitons une formation Comptabilité / Gestion pour 5 personnes de notre direction administrative. Format INTRA sur notre site de Rouen.',
   null, '2026-06-08 09:45:00+00'),
  ('88888888-0000-0000-0000-000000000023', '22222222-0000-0000-0000-000000000009',
   'sortant', 'Bonjour M. Prévost, voici notre devis pour une session INTRA Comptabilité / Gestion — 3 jours (21h), 5 personnes. Tarif : 5 500 € HT. Devis accepté, merci — nous préparons la convention.',
   'valide', '2026-06-09 11:00:00+00'),

  -- ── 010 · Seine-Maritime Habitat (2 messages — prospect_gagne) ───────────────
  ('88888888-0000-0000-0000-000000000024', '22222222-0000-0000-0000-000000000010',
   'entrant', 'Bonjour, nous cherchons à former 8 collaborateurs RH sur les fondamentaux : droit du travail, recrutement et entretiens professionnels. INTRA souhaité.',
   null, '2026-06-09 10:00:00+00'),
  ('88888888-0000-0000-0000-000000000025', '22222222-0000-0000-0000-000000000010',
   'sortant', 'Bonjour Mme Picard, voici notre proposition RH INTRA pour 8 personnes — 2 jours, tarif 7 600 € HT (financement public possible). Devis validé par votre service, merci — convention en cours de préparation.',
   'valide', '2026-06-10 14:00:00+00'),

  -- ── 011 · Sanofi (2 messages — prospect_gagne) ───────────────────────────────
  ('88888888-0000-0000-0000-000000000026', '22222222-0000-0000-0000-000000000011',
   'entrant', 'Dans le cadre de notre plan de développement 2026, nous recherchons une formation Management / RSE pour 12 managers de notre site normand. Pouvez-vous nous soumettre une proposition INTRA ?',
   null, '2026-06-10 08:30:00+00'),
  ('88888888-0000-0000-0000-000000000027', '22222222-0000-0000-0000-000000000011',
   'sortant', 'Bonjour M. Delacroix, voici notre proposition Management / RSE INTRA pour 12 managers — 3 jours (21h), tarif : 14 400 € HT. Programme sur mesure avec étude de cas secteur pharmaceutique. Devis accepté — convention en cours d''envoi.',
   'valide', '2026-06-11 10:00:00+00'),

  -- ── 012 · Vallourec (2 messages — devis_envoye) ──────────────────────────────
  ('88888888-0000-0000-0000-000000000028', '22222222-0000-0000-0000-000000000012',
   'entrant', 'Bonjour, nous devons former 20 opérateurs et techniciens en HSE avant le démarrage d''une nouvelle ligne de production. Urgence : session souhaitée avant fin juillet.',
   null, '2026-06-11 14:00:00+00'),
  ('88888888-0000-0000-0000-000000000029', '22222222-0000-0000-0000-000000000012',
   'sortant', 'Bonjour M. Ferrand, voici notre devis HSE INTRA pour 20 personnes — 2 jours (14h), tarif : 17 000 € HT (prise en charge OPCO possible). Nous avons une disponibilité fin juillet. En attente de votre retour.',
   'valide', '2026-06-12 09:00:00+00'),

  -- ── 013 · Bolloré Logistics (2 messages — devis_envoye) ─────────────────────
  ('88888888-0000-0000-0000-000000000030', '22222222-0000-0000-0000-000000000013',
   'entrant', 'Bonjour, nous avons 4 collaborateurs à former en Transport Logistique Commerce International. Préférence pour une session inter-entreprises au Havre.',
   null, '2026-06-12 10:00:00+00'),
  ('88888888-0000-0000-0000-000000000031', '22222222-0000-0000-0000-000000000013',
   'sortant', 'Bonjour Mme Collin, nous organisons une session INTER Transport du 19 au 21 août 2026 au Havre. Devis ci-joint : 4 × 1 100 € = 4 400 € HT. En attente de votre confirmation.',
   'valide', '2026-06-13 11:00:00+00'),

  -- ── 014 · Renault Trucks (2 messages — devis_envoye) ────────────────────────
  ('88888888-0000-0000-0000-000000000032', '22222222-0000-0000-0000-000000000014',
   'entrant', 'Bonjour, nous souhaitons former 6 managers de production en Management / Leadership. Formation INTRA souhaitée.',
   null, '2026-06-13 08:00:00+00'),
  ('88888888-0000-0000-0000-000000000033', '22222222-0000-0000-0000-000000000014',
   'sortant', 'Bonjour M. Chemin, voici notre devis Management INTRA pour 6 personnes — 3 jours (21h), tarif : 7 200 € HT, prise en charge OPCO envisageable. En attente de votre retour.',
   'valide', '2026-06-14 10:00:00+00'),

  -- ── 015 · Centre Hospitalier du Havre (2 messages — devis_envoye) ─────────────
  ('88888888-0000-0000-0000-000000000034', '22222222-0000-0000-0000-000000000015',
   'entrant', 'Bonjour, nous souhaitons améliorer les pratiques de communication de 8 soignants et cadres de santé. Formation interne souhaitée, financement via notre OPCA santé.',
   null, '2026-06-14 09:30:00+00'),
  ('88888888-0000-0000-0000-000000000035', '22222222-0000-0000-0000-000000000015',
   'sortant', 'Bonjour Mme Lemaire, voici notre devis Communication INTRA pour 8 personnes — 2 jours (14h), tarif : 6 400 € HT (financement public éligible). Nous adaptons le programme au contexte hospitalier. En attente de validation.',
   'valide', '2026-06-15 11:00:00+00'),

  -- ── 016 · Geodis (2 messages — devis_envoye) ────────────────────────────────
  ('88888888-0000-0000-0000-000000000036', '22222222-0000-0000-0000-000000000016',
   'entrant', 'Bonjour, j''ai 3 opérationnels à former en Transport international. Session inter-entreprises préférable.',
   null, '2026-06-15 10:00:00+00'),
  ('88888888-0000-0000-0000-000000000037', '22222222-0000-0000-0000-000000000016',
   'sortant', 'Bonjour M. Allard, notre session INTER Transport du 19 au 21 août correspond parfaitement. Devis : 3 × 1 100 € = 3 300 € HT. Confirmation attendue.',
   'valide', '2026-06-16 09:00:00+00'),

  -- ── 017 · EDF Paluel (1 message — devis_genere) ──────────────────────────────
  ('88888888-0000-0000-0000-000000000038', '22222222-0000-0000-0000-000000000017',
   'entrant', 'Bonjour, la centrale de Paluel cherche une formation HSE pour 10 agents de maintenance. Contexte nucléaire civil, exigences réglementaires renforcées. Formation INTRA souhaitée, devis en cours.',
   null, '2026-06-16 08:00:00+00'),

  -- ── 018 · Vinci (1 message — devis_genere) ───────────────────────────────────
  ('88888888-0000-0000-0000-000000000039', '22222222-0000-0000-0000-000000000018',
   'entrant', 'Bonjour, nous avons un besoin de formation Management pour 7 cadres de notre direction normande. INTRA sur nos bureaux de Rouen. Devis souhaité rapidement.',
   null, '2026-06-17 09:00:00+00'),

  -- ── 019 · Air France Cargo (1 message — devis_genere) ────────────────────────
  ('88888888-0000-0000-0000-000000000040', '22222222-0000-0000-0000-000000000019',
   'entrant', 'Bonjour, 5 agents de notre service cargo ont besoin de renforcer leur anglais professionnel pour les échanges avec nos partenaires internationaux. Session inter possible.',
   null, '2026-06-17 10:30:00+00'),

  -- ── 020 · Caen la Mer (1 message — devis_en_attente) ─────────────────────────
  ('88888888-0000-0000-0000-000000000041', '22222222-0000-0000-0000-000000000020',
   'entrant', 'Bonjour, la communauté urbaine souhaite former 6 agents RH sur les fondamentaux du recrutement et de la gestion administrative. Financement via le CNFPT envisagé.',
   null, '2026-06-17 14:00:00+00'),

  -- ── 021 · Société Générale (1 message — devis_en_attente) ────────────────────
  ('88888888-0000-0000-0000-000000000042', '22222222-0000-0000-0000-000000000021',
   'entrant', 'Bonjour, 4 conseillers ont besoin de progresser sur Excel avancé et les outils IA pour leur activité quotidienne. Formation rapide, INTRA si possible.',
   null, '2026-06-18 08:30:00+00'),

  -- ── 022 · Spie Batignolles (1 message — devis_en_attente) ────────────────────
  ('88888888-0000-0000-0000-000000000043', '22222222-0000-0000-0000-000000000022',
   'entrant', 'Bonjour, nous démarrons un chantier en août et devons former 15 compagnons en HSE avant le début des travaux. Urgence sur le timing — pouvez-vous nous envoyer un devis rapidement ?',
   null, '2026-06-18 09:00:00+00'),

  -- ── 023 · SNCF Réseau (1 message — devis_en_attente) ────────────────────────
  ('88888888-0000-0000-0000-000000000044', '22222222-0000-0000-0000-000000000023',
   'entrant', 'Bonjour, 9 chefs de projet SNCF souhaitent renforcer leurs compétences en management et leadership dans un contexte de transformation. Formation INTRA souhaitée.',
   null, '2026-06-18 11:00:00+00'),

  -- ── 024 · Mairie de Gonfreville (1 message — profil_cree) ────────────────────
  ('88888888-0000-0000-0000-000000000045', '22222222-0000-0000-0000-000000000024',
   'entrant', 'Bonjour, la mairie souhaite former 6 agents aux outils de communication digitale (réseaux sociaux, gestion du site web communal). Financement via le CNFPT envisageable.',
   null, '2026-06-19 08:00:00+00'),

  -- ── 025 · AXA Le Havre (1 message — profil_cree) ─────────────────────────────
  ('88888888-0000-0000-0000-000000000046', '22222222-0000-0000-0000-000000000025',
   'entrant', 'Bonjour, j''ai 4 collaborateurs à former sur les bases de la comptabilité et la lecture des états financiers. Pouvez-vous nous faire parvenir une offre ?',
   null, '2026-06-19 09:30:00+00'),

  -- ── 026 · BNP Paribas (1 message — profil_cree) ─────────────────────────────
  ('88888888-0000-0000-0000-000000000047', '22222222-0000-0000-0000-000000000026',
   'entrant', 'Bonjour, nous souhaitons une formation Management pour 5 responsables d''équipe. Notre accord-cadre de formation prévoit un financement via plateforme privée (Cegos Connect).',
   null, '2026-06-19 10:00:00+00'),

  -- ── 027 · Carrefour Montivilliers (1 message — profil_cree) ─────────────────
  ('88888888-0000-0000-0000-000000000048', '22222222-0000-0000-0000-000000000027',
   'entrant', 'Bonjour, j''ai 8 chefs de rayon à former en techniques d''achats et de ventes. OPCO Commerce prise en charge envisagée. Pouvez-vous nous proposer une formation ?',
   null, '2026-06-19 11:30:00+00'),

  -- ── 028 · GRDF Normandie (1 message — profil_cree) ──────────────────────────
  ('88888888-0000-0000-0000-000000000049', '22222222-0000-0000-0000-000000000028',
   'entrant', 'Bonjour, 6 agents administratifs GRDF ont besoin d''une remise à niveau bureautique et d''une sensibilisation aux outils IA. Formation INTRA souhaitée.',
   null, '2026-06-20 08:00:00+00'),

  -- ── 029 · GSM Group (1 message — profil_cree) ────────────────────────────────
  ('88888888-0000-0000-0000-000000000050', '22222222-0000-0000-0000-000000000029',
   'entrant', 'Bonjour, 3 collaborateurs souhaitent travailler sur la gestion du stress et l''organisation personnelle. Développement personnel, format court si possible.',
   null, '2026-06-20 09:00:00+00'),

  -- ── 030 · Leclerc (3 messages — perdu) ───────────────────────────────────────
  ('88888888-0000-0000-0000-000000000051', '22222222-0000-0000-0000-000000000030',
   'entrant', 'Bonjour, je souhaite former 4 chefs de rayon aux techniques d''achats et de ventes. Budget limité. Qu''avez-vous à proposer ?',
   null, '2026-05-10 10:00:00+00'),
  ('88888888-0000-0000-0000-000000000052', '22222222-0000-0000-0000-000000000030',
   'sortant', 'Bonjour M. Poirier, voici notre devis pour une session Achats/Ventes INTRA — 2 jours, 4 personnes, tarif : 3 400 € HT. Nous pouvons étudier une prise en charge OPCO Commerce.',
   'valide', '2026-05-11 11:00:00+00'),
  ('88888888-0000-0000-0000-000000000053', '22222222-0000-0000-0000-000000000030',
   'entrant', 'Merci pour le devis. Finalement nous n''avons pas le budget cette année. Nous reviendrons vers vous l''an prochain.',
   null, '2026-05-18 08:00:00+00'),

  -- ── 031 · Cabinet Dupré (2 messages — perdu) ─────────────────────────────────
  ('88888888-0000-0000-0000-000000000054', '22222222-0000-0000-0000-000000000031',
   'entrant', 'Bonjour, 2 consultants RH souhaitent une formation Ressources humaines pour consolider leurs pratiques.',
   null, '2026-05-15 09:00:00+00'),
  ('88888888-0000-0000-0000-000000000055', '22222222-0000-0000-0000-000000000031',
   'entrant', 'Suite à notre demande, nous avons finalement opté pour un autre prestataire qui proposait une session sur Paris la semaine prochaine. Merci quand même.',
   null, '2026-05-22 10:00:00+00'),

  -- ── 032 · Garage Renault Harfleur (2 messages — perdu) ───────────────────────
  ('88888888-0000-0000-0000-000000000056', '22222222-0000-0000-0000-000000000032',
   'entrant', 'Bonjour, j''ai 3 techniciens à former en management d''équipe. Petite structure, je cherche quelque chose d''abordable.',
   null, '2026-05-25 14:00:00+00'),
  ('88888888-0000-0000-0000-000000000057', '22222222-0000-0000-0000-000000000032',
   'sortant', 'Bonjour M. Lecomte, voici notre offre Management INTRA pour 3 personnes — tarif : 3 600 € HT. Possibilité de prise en charge OPCO selon votre branche. Nous n''avons pas eu de retour de votre part, ce dossier reste ouvert à votre convenance.',
   'valide', '2026-05-26 10:00:00+00'),

  -- ── 033 · Pharmacie Centrale (2 messages — perdu) ────────────────────────────
  ('88888888-0000-0000-0000-000000000058', '22222222-0000-0000-0000-000000000033',
   'entrant', 'Bonjour, 2 personnes souhaitent une formation Communication pour mieux gérer les situations tendues avec les patients.',
   null, '2026-05-28 09:00:00+00'),
  ('88888888-0000-0000-0000-000000000059', '22222222-0000-0000-0000-000000000033',
   'sortant', 'Bonjour Mme Arnaud, voici notre devis Communication / Gestion des situations difficiles INTRA pour 2 personnes — tarif : 1 600 € HT. Sans retour de votre part, nous clôturons ce dossier.',
   'valide', '2026-05-29 11:00:00+00');

-- ═══════════════════════════════════════════════════════════
-- Notifications en attente (7 total)
-- ═══════════════════════════════════════════════════════════
insert into notifications (id, destinataire_type, destinataire_id, type, lien_objet, lu) values
  ('99999999-0000-0000-0000-000000000001', 'ilies', '00000000-0000-0000-0000-000000000000', 'a_valider',     '77777777-0000-0000-0000-000000000003', false),
  ('99999999-0000-0000-0000-000000000002', 'ilies', '00000000-0000-0000-0000-000000000000', 'reponse_recue', '88888888-0000-0000-0000-000000000001', false),
  ('99999999-0000-0000-0000-000000000003', 'ilies', '00000000-0000-0000-0000-000000000000', 'relance',       '55555555-0000-0000-0000-000000000002', false),
  ('99999999-0000-0000-0000-000000000004', 'ilies', '00000000-0000-0000-0000-000000000000', 'a_valider',     '77777777-0000-0000-0000-000000000009', false),
  ('99999999-0000-0000-0000-000000000005', 'ilies', '00000000-0000-0000-0000-000000000000', 'a_valider',     '77777777-0000-0000-0000-000000000011', false),
  ('99999999-0000-0000-0000-000000000006', 'ilies', '00000000-0000-0000-0000-000000000000', 'a_valider',     '77777777-0000-0000-0000-000000000020', false),
  ('99999999-0000-0000-0000-000000000007', 'ilies', '00000000-0000-0000-0000-000000000000', 'action_requise','55555555-0000-0000-0000-000000000004', false);
