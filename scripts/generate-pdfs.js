'use strict'
const PDFDocument = require('pdfkit')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Force 7 branding ────────────────────────────────────────────────────────
const F7_BLUE_DARK = '#1267A4'
const F7_BLUE_MID = '#6199C1'
const F7_YELLOW = '#FEE700'
const TEXT_DARK = '#1F2937'
const TEXT_GRAY = '#6B7280'

// ─── Formation metadata per prospect ────────────────────────────────────────
const FORMATION_MAP = {
  '22222222-0000-0000-0000-000000000001': { intitule: 'Travail en Hauteur – Niveau 1', duree: '2 jours', type: 'INTRA', prixUnit: null, prixForfait: 2800, num: '2026-047' },
  '22222222-0000-0000-0000-000000000002': { intitule: 'Montage et Utilisation des Échafaudages Fixes (R408)', duree: '2 jours', type: 'INTER', prixUnit: 380, prixForfait: null, num: '2026-055' },
  '22222222-0000-0000-0000-000000000004': { intitule: 'PRAP IBC – Prévention des Risques liés à l\'Activité Physique', duree: '2 jours', type: 'INTRA', prixUnit: null, prixForfait: 3200, num: '2026-089' },
  '22222222-0000-0000-0000-000000000005': { intitule: 'SST – Sauveteur Secouriste du Travail', duree: '2 jours', type: 'INTER', prixUnit: 280, prixForfait: null, num: '2026-091' },
  '33333333-0000-0000-0000-000000000001': { intitule: 'CACES R489 – Chariots de manutention (cat. 3 + 5)', duree: '3 jours', type: 'INTRA', prixUnit: null, prixForfait: 3600, num: '2026-096' },
  '33333333-0000-0000-0000-000000000003': { intitule: 'Travaux en Espaces Confinés', duree: '2 jours', type: 'INTRA', prixUnit: null, prixForfait: 2800, num: '2026-103' },
  '33333333-0000-0000-0000-000000000006': { intitule: 'ATEX – Atmosphères Explosibles (modules A + B)', duree: '2,5 jours', type: 'INTRA', prixUnit: null, prixForfait: 3800, num: '2026-118' },
  '33333333-0000-0000-0000-000000000007': { intitule: 'Habilitation Électrique B1V/BR – NF C 18-510', duree: '3 jours', type: 'INTRA', prixUnit: null, prixForfait: 3200, num: '2026-124' },
  '33333333-0000-0000-0000-000000000009': { intitule: 'CACES R485 – Gerbeurs (cat. 1 + 2)', duree: '2 jours', type: 'INTER', prixUnit: 390, prixForfait: null, num: '2026-131' },
  '33333333-0000-0000-0000-000000000012': { intitule: 'Risques Chimiques + Espaces Confinés (programme combiné)', duree: '3 jours', type: 'INTRA', prixUnit: null, prixForfait: 4200, num: '2026-078' },
  '33333333-0000-0000-0000-000000000013': { intitule: 'CACES R486 – PEMP Nacelles élévatrices (cat. 1B/3B)', duree: '3 jours', type: 'INTRA', prixUnit: null, prixForfait: 3400, num: '2026-137' },
  '33333333-0000-0000-0000-000000000014': { intitule: 'Habilitation Électrique B2V/BR – NF C 18-510', duree: '3 jours', type: 'INTER', prixUnit: 310, prixForfait: null, num: '2026-141' },
  '33333333-0000-0000-0000-000000000015': { intitule: 'Sécurité Chantier BTP + CACES R487 Grue Mobile', duree: '3 + 3 jours', type: 'INTRA', prixUnit: null, prixForfait: 5800, num: '2026-063' },
  '33333333-0000-0000-0000-000000000021': { intitule: 'PRAP Mixte IBC / Opérateur – Prévention TMS', duree: '1,5 jour', type: 'INTRA', prixUnit: null, prixForfait: 2600, num: '2026-058' },
  '33333333-0000-0000-0000-000000000022': { intitule: 'Plan de Prévention & Coordination Entreprises Extérieures', duree: '1 jour', type: 'INTRA', prixUnit: null, prixForfait: 1800, num: '2026-063' },
  '33333333-0000-0000-0000-000000000023': { intitule: 'CACES R489 – Chariots de manutention (cat. 3)', duree: '2 jours', type: 'INTER', prixUnit: 420, prixForfait: null, num: '2026-138' },
  '33333333-0000-0000-0000-000000000025': { intitule: 'PRAP 2S – Prévention des Risques liés à l\'Activité Physique (secteur sanitaire)', duree: '2 jours/groupe × 5 groupes', type: 'INTRA', prixUnit: null, prixForfait: 9800, num: '2026-074' },
  '33333333-0000-0000-0000-000000000032': { intitule: 'PRAP Opérateur – Prévention des Risques Physiques', duree: '1 jour (2 × 4h)', type: 'INTRA', prixUnit: null, prixForfait: 1600, num: '2026-082' },
  '33333333-0000-0000-0000-000000000033': { intitule: 'CACES R489 – Chariots de manutention (cat. 3)', duree: '2 jours', type: 'INTER', prixUnit: 390, prixForfait: null, num: '2026-147' },
  '33333333-0000-0000-0000-000000000034': { intitule: 'Travail en Hauteur – Initiale', duree: '2 jours', type: 'INTER', prixUnit: 310, prixForfait: null, num: '2026-151' },
}

const DATES_MAP = {
  '22222222-0000-0000-0000-000000000001': { debut: '16 avril 2026', fin: '17 avril 2026' },
  '22222222-0000-0000-0000-000000000002': { debut: '8 avril 2026', fin: '9 avril 2026' },
  '22222222-0000-0000-0000-000000000004': { debut: '15 mai 2026', fin: '16 mai 2026' },
  '22222222-0000-0000-0000-000000000005': { debut: '19 mai 2026', fin: '20 mai 2026' },
  '33333333-0000-0000-0000-000000000001': { debut: '16 juin 2026', fin: '18 juin 2026' },
  '33333333-0000-0000-0000-000000000003': { debut: '10 juin 2026', fin: '11 juin 2026' },
  '33333333-0000-0000-0000-000000000006': { debut: '3 juin 2026', fin: '5 juin 2026' },
  '33333333-0000-0000-0000-000000000007': { debut: '9 juin 2026', fin: '11 juin 2026' },
  '33333333-0000-0000-0000-000000000009': { debut: '26 mai 2026', fin: '27 mai 2026' },
  '33333333-0000-0000-0000-000000000012': { debut: '10 juin 2026', fin: '12 juin 2026' },
  '33333333-0000-0000-0000-000000000013': { debut: '17 juin 2026', fin: '19 juin 2026' },
  '33333333-0000-0000-0000-000000000014': { debut: '23 juin 2026', fin: '25 juin 2026' },
  '33333333-0000-0000-0000-000000000015': { debut: '12 mai 2026', fin: '17 mai 2026' },
  '33333333-0000-0000-0000-000000000021': { debut: '25 mars 2026', fin: '26 mars 2026' },
  '33333333-0000-0000-0000-000000000022': { debut: '8 avril 2026', fin: '8 avril 2026' },
  '33333333-0000-0000-0000-000000000023': { debut: '9 juin 2026', fin: '10 juin 2026' },
  '33333333-0000-0000-0000-000000000025': { debut: '12 mai 2026', fin: '17 juin 2026' },
  '33333333-0000-0000-0000-000000000032': { debut: '12 mai 2026', fin: '13 mai 2026' },
  '33333333-0000-0000-0000-000000000033': { debut: '19 mai 2026', fin: '20 mai 2026' },
  '33333333-0000-0000-0000-000000000034': { debut: '2 juin 2026', fin: '3 juin 2026' },
}

// ─── PDF helpers ─────────────────────────────────────────────────────────────
function hex(color) {
  return color
}

function drawHeader(doc) {
  // Blue top band
  doc.rect(0, 0, 595, 72).fill(F7_BLUE_DARK)
  // Yellow accent line
  doc.rect(0, 72, 595, 4).fill(F7_YELLOW)

  // Company name
  doc.fillColor('white').fontSize(20).font('Helvetica-Bold')
  doc.text('FORCE 7 FORMATION', 40, 18)
  doc.fontSize(9).font('Helvetica').fillColor('#BFDBFE')
  doc.text('Organisme de formation professionnelle continue', 40, 44)

  // Right side contact
  doc.fontSize(8).fillColor('#BFDBFE')
  doc.text('12 Rue du Commandant Rolland · 76600 Le Havre', 200, 22, { align: 'right', width: 355 })
  doc.text('02 35 19 48 60 · formation@force7-formation.fr', 200, 34, { align: 'right', width: 355 })
  doc.text('N° SIRET : 499 287 341 00019 · N° Qualiopi : 2021-NP-0078', 200, 46, { align: 'right', width: 355 })
}

function drawFooter(doc) {
  const y = 800
  doc.rect(0, y, 595, 42).fill('#F8F9FA')
  doc.rect(0, y, 595, 1).fill('#E5E7EB')
  doc.fillColor(TEXT_GRAY).fontSize(7.5).font('Helvetica')
  doc.text(
    'Force 7 Formation · SAS au capital de 10 000 € · RCS Le Havre B 499 287 341 · N° TVA : FR45 499 287 341 · Certifié Qualiopi',
    0, y + 10, { align: 'center', width: 595 }
  )
  doc.text(
    'Assurance RC Professionnelle : AXA France – Contrat n° 4800 512 483',
    0, y + 22, { align: 'center', width: 595 }
  )
}

function drawClientBlock(doc, prospect, y) {
  doc.rect(40, y, 230, 80).stroke('#E5E7EB')
  doc.fillColor(TEXT_GRAY).fontSize(8).font('Helvetica-Bold')
  doc.text('CLIENT / BÉNÉFICIAIRE', 50, y + 8)
  doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica-Bold')
  doc.text(prospect.nom_entreprise, 50, y + 22)
  doc.fontSize(9).font('Helvetica').fillColor(TEXT_DARK)
  if (prospect.contact_prenom || prospect.contact_nom) {
    doc.text(`À l'attention de : ${prospect.contact_prenom || ''} ${prospect.contact_nom || ''}`.trim(), 50, y + 36)
  }
  if (prospect.contact_email) {
    doc.fillColor(TEXT_GRAY).text(prospect.contact_email, 50, y + 48)
  }
  if (prospect.siret) {
    doc.text(`SIRET : ${prospect.siret}`, 50, y + 60)
  }
}

function calcMontant(formation, nbStagiaires) {
  if (formation.prixForfait) return formation.prixForfait
  return (formation.prixUnit || 350) * nbStagiaires
}

function formatEuro(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

// ─── Devis PDF ───────────────────────────────────────────────────────────────
function generateDevis(doc, prospect, formation, dates, factureMode = false) {
  drawHeader(doc)

  const nb = prospect.nombre_stagiaires_estime || 1
  const montantHT = calcMontant(formation, nb)
  const tva = Math.round(montantHT * 0.2 * 100) / 100
  const ttc = montantHT + tva

  // Title
  const title = factureMode ? 'FACTURE' : 'DEVIS'
  const num = factureMode ? formation.num.replace('2026-', '2026-F') : formation.num
  doc.fillColor(F7_BLUE_DARK).fontSize(18).font('Helvetica-Bold')
  doc.text(`${title} N° ${num}`, 40, 100)

  const today = new Date()
  const dateStr = today.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.fillColor(TEXT_GRAY).fontSize(9).font('Helvetica')
  doc.text(`Date : ${dateStr}`, 40, 124)
  if (!factureMode) {
    doc.text('Valable 30 jours', 40, 136)
  } else {
    doc.text('Conditions : paiement à 30 jours date de facture', 40, 136)
  }

  drawClientBlock(doc, prospect, 96)

  // Formation info box
  doc.rect(40, 192, 515, 56).fill('#F0F7FF').stroke(F7_BLUE_MID)
  doc.fillColor(F7_BLUE_DARK).fontSize(9).font('Helvetica-Bold')
  doc.text('FORMATION', 52, 200)
  doc.fillColor(TEXT_DARK).fontSize(10).font('Helvetica-Bold')
  doc.text(formation.intitule, 52, 212, { width: 490 })
  doc.fillColor(TEXT_GRAY).fontSize(8.5).font('Helvetica')
  doc.text(`Type : ${formation.type} · Durée : ${formation.duree} · Dates : du ${dates.debut} au ${dates.fin}`, 52, 230)

  // Table header
  const tableY = 270
  doc.rect(40, tableY, 515, 22).fill(F7_BLUE_DARK)
  doc.fillColor('white').fontSize(8.5).font('Helvetica-Bold')
  doc.text('DÉSIGNATION', 52, tableY + 7)
  doc.text('QTÉ', 340, tableY + 7, { width: 60, align: 'center' })
  doc.text('P.U. HT', 400, tableY + 7, { width: 70, align: 'right' })
  doc.text('MONTANT HT', 470, tableY + 7, { width: 80, align: 'right' })

  // Table row 1
  const r1y = tableY + 22
  doc.rect(40, r1y, 515, 32).stroke('#E5E7EB')
  doc.fillColor(TEXT_DARK).fontSize(9).font('Helvetica')
  doc.text(formation.intitule, 52, r1y + 5, { width: 280 })
  doc.fontSize(8.5).fillColor(TEXT_GRAY)
  doc.text(`Formation ${formation.type} – ${formation.duree}`, 52, r1y + 18, { width: 280 })

  if (formation.prixForfait) {
    doc.fillColor(TEXT_DARK).fontSize(9)
    doc.text('1 forfait', 340, r1y + 11, { width: 60, align: 'center' })
    doc.text(formatEuro(formation.prixForfait), 400, r1y + 11, { width: 70, align: 'right' })
    doc.text(formatEuro(formation.prixForfait), 470, r1y + 11, { width: 80, align: 'right' })
  } else {
    doc.fillColor(TEXT_DARK).fontSize(9)
    doc.text(`${nb} pers.`, 340, r1y + 11, { width: 60, align: 'center' })
    doc.text(formatEuro(formation.prixUnit), 400, r1y + 11, { width: 70, align: 'right' })
    doc.text(formatEuro(montantHT), 470, r1y + 11, { width: 80, align: 'right' })
  }

  // Totals
  const totY = r1y + 50
  doc.fillColor(TEXT_GRAY).fontSize(9).font('Helvetica')
  doc.text('Total HT', 370, totY, { width: 100, align: 'right' })
  doc.text('TVA 20 %', 370, totY + 16, { width: 100, align: 'right' })

  doc.fillColor(TEXT_DARK)
  doc.text(formatEuro(montantHT), 470, totY, { width: 80, align: 'right' })
  doc.text(formatEuro(tva), 470, totY + 16, { width: 80, align: 'right' })

  // Total TTC box
  doc.rect(360, totY + 36, 195, 28).fill(F7_BLUE_DARK)
  doc.fillColor('white').fontSize(11).font('Helvetica-Bold')
  doc.text('TOTAL TTC', 370, totY + 43, { width: 100, align: 'right' })
  doc.text(formatEuro(ttc), 470, totY + 43, { width: 80, align: 'right' })

  // Conditions
  const condY = totY + 90
  doc.rect(40, condY, 515, 60).fill('#FEFCE8').stroke('#FDE68A')
  doc.fillColor('#92400E').fontSize(8.5).font('Helvetica-Bold')
  doc.text('CONDITIONS ET MODALITÉS', 52, condY + 8)
  doc.font('Helvetica').fillColor('#78350F').fontSize(8)
  if (factureMode) {
    doc.text('Paiement à 30 jours date de facture. Tout retard de paiement entraîne des pénalités au taux légal.', 52, condY + 20, { width: 490 })
    doc.text('IBAN : FR76 2004 1010 0801 0483 2134 000 · BIC : PSSTFRPPPAR · Banque Postale · Titulaire : Force 7 Formation', 52, condY + 33, { width: 490 })
    doc.text('Réf. à rappeler : ' + num, 52, condY + 46, { width: 490 })
  } else {
    doc.text('Devis valable 30 jours à compter de la date d\'émission. Formation soumise à TVA à 20 %.', 52, condY + 20, { width: 490 })
    doc.text('Financement : ' + (prospect.type_financement === 'opco' ? 'Prise en charge OPCO – dossier fourni sur demande.' : prospect.type_financement === 'public_parapublic' ? 'Financement public/parapublic.' : 'Financement direct.'), 52, condY + 33, { width: 490 })
    doc.text('Acompte de 30 % à la commande. Solde à réception de facture post-formation.', 52, condY + 46, { width: 490 })
  }

  // Signature zone (devis only)
  if (!factureMode) {
    const sigY = condY + 78
    doc.fillColor(TEXT_GRAY).fontSize(8.5).font('Helvetica')
    doc.text('Bon pour accord – Cachet et signature :', 40, sigY)
    doc.rect(40, sigY + 14, 230, 55).stroke('#E5E7EB')
    doc.fillColor(TEXT_GRAY).fontSize(7.5)
    doc.text(`${prospect.nom_entreprise}`, 50, sigY + 22)
    doc.text(`${prospect.contact_prenom || ''} ${prospect.contact_nom || ''}`.trim(), 50, sigY + 32)
    doc.text('Date :', 50, sigY + 50)

    doc.rect(325, sigY + 14, 230, 55).stroke('#E5E7EB')
    doc.text('Pour Force 7 Formation', 335, sigY + 22)
    doc.text('Iliès Benali – Gérant', 335, sigY + 32)
    doc.text('Date :', 335, sigY + 50)
  }

  drawFooter(doc)
}

// ─── Convention PDF ───────────────────────────────────────────────────────────
function generateConvention(doc, prospect, formation, dates) {
  drawHeader(doc)

  doc.fillColor(F7_BLUE_DARK).fontSize(14).font('Helvetica-Bold')
  doc.text('CONVENTION DE FORMATION PROFESSIONNELLE CONTINUE', 40, 100, { align: 'center', width: 515 })
  doc.fillColor(TEXT_GRAY).fontSize(8.5).font('Helvetica')
  doc.text('(Articles L.6353-1 et suivants du Code du Travail)', 40, 120, { align: 'center', width: 515 })

  // Parties
  doc.rect(40, 138, 515, 1).fill('#E5E7EB')
  doc.fillColor(TEXT_DARK).fontSize(9.5).font('Helvetica-Bold')
  doc.text('ENTRE LES SOUSSIGNÉS', 40, 148)

  doc.font('Helvetica').fillColor(TEXT_DARK).fontSize(9)
  doc.text('Force 7 Formation, SAS au capital de 10 000 €, SIRET 499 287 341 00019, dont le siège social est situé au 12 Rue du Commandant Rolland, 76600 Le Havre, représentée par M. Iliès Benali en qualité de Gérant, ci-après désigné « le Prestataire »,', 40, 162, { width: 515 })

  doc.text('ET', 40, 210, { align: 'center', width: 515 })

  doc.fillColor(F7_BLUE_DARK).fontSize(10).font('Helvetica-Bold')
  doc.text(prospect.nom_entreprise, 40, 224)
  doc.fillColor(TEXT_DARK).fontSize(9).font('Helvetica')
  const siretLine = prospect.siret ? `, SIRET ${prospect.siret}` : ''
  doc.text(`Représentée par ${prospect.contact_prenom || ''} ${prospect.contact_nom || ''}${siretLine}, ci-après désigné « le Bénéficiaire »`.trim(), 40, 238, { width: 515 })

  // Articles
  const articles = [
    {
      title: 'Article 1 – Objet',
      text: `Le Prestataire s'engage à organiser la formation intitulée « ${formation.intitule} » au profit de ${prospect.nombre_stagiaires_estime || 1} stagiaire(s) désigné(s) par le Bénéficiaire. Cette formation est de type ${formation.type}.`
    },
    {
      title: 'Article 2 – Dates et lieu de réalisation',
      text: `La formation se déroulera du ${dates.debut} au ${dates.fin}, soit une durée de ${formation.duree}. ${formation.type === 'INTRA' ? `Lieu : locaux du Bénéficiaire (adresse à confirmer).` : 'Lieu : locaux de Force 7 Formation, 12 Rue du Commandant Rolland, 76600 Le Havre.'}`
    },
    {
      title: 'Article 3 – Effectif et niveau',
      text: `La formation accueille ${prospect.nombre_stagiaires_estime || 1} stagiaire(s). Les conditions d'admission sont communiquées dans le programme de formation joint en annexe.`
    },
    {
      title: 'Article 4 – Prix et modalités de règlement',
      text: `Le prix total de la prestation est fixé à ${formatEuro(calcMontant(formation, prospect.nombre_stagiaires_estime || 1))} HT, soit ${formatEuro(calcMontant(formation, prospect.nombre_stagiaires_estime || 1) * 1.2)} TTC. Règlement à 30 jours à réception de facture.`
    },
    {
      title: 'Article 5 – Financement',
      text: prospect.type_financement === 'opco'
        ? 'Le Bénéficiaire a sollicité une prise en charge auprès de son OPCO. La convention est établie sous réserve d\'obtention de l\'accord de financement. En cas de refus, le Bénéficiaire demeure redevable du montant total de la formation.'
        : 'Le Bénéficiaire prend en charge le financement de la formation. La facture sera émise après réalisation de la prestation.'
    },
    {
      title: 'Article 6 – Résiliation',
      text: 'En cas d\'annulation par le Bénéficiaire moins de 7 jours ouvrés avant le début de la formation, le Prestataire se réserve le droit de facturer 50 % du montant total. En deçà de 48h, la totalité est due.'
    },
  ]

  let y = 280
  for (const art of articles) {
    if (y > 700) break
    doc.fillColor(F7_BLUE_DARK).fontSize(9.5).font('Helvetica-Bold')
    doc.text(art.title, 40, y)
    doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica')
    doc.text(art.text, 40, y + 14, { width: 515 })
    y += 14 + doc.heightOfString(art.text, { width: 515 }) + 10
  }

  // Signatures
  const sigY = Math.max(y + 10, 680)
  if (sigY < 760) {
    doc.rect(40, sigY, 515, 1).fill('#E5E7EB')
    doc.fillColor(TEXT_GRAY).fontSize(8.5).font('Helvetica')
    doc.text('Fait en deux exemplaires originaux, le ____________________', 40, sigY + 10)

    doc.rect(40, sigY + 30, 230, 65).stroke('#E5E7EB')
    doc.fillColor(F7_BLUE_DARK).fontSize(8.5).font('Helvetica-Bold')
    doc.text('LE BÉNÉFICIAIRE', 52, sigY + 38)
    doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(8)
    doc.text(prospect.nom_entreprise, 52, sigY + 50)
    doc.text(`${prospect.contact_prenom || ''} ${prospect.contact_nom || ''}`.trim(), 52, sigY + 62)
    doc.fillColor(TEXT_GRAY).text('Signature + cachet :', 52, sigY + 82)

    doc.rect(325, sigY + 30, 230, 65).stroke('#E5E7EB')
    doc.fillColor(F7_BLUE_DARK).fontSize(8.5).font('Helvetica-Bold')
    doc.text('LE PRESTATAIRE', 337, sigY + 38)
    doc.fillColor(TEXT_DARK).font('Helvetica').fontSize(8)
    doc.text('Force 7 Formation', 337, sigY + 50)
    doc.text('Iliès Benali – Gérant', 337, sigY + 62)
    doc.fillColor(TEXT_GRAY).text('Signature :', 337, sigY + 82)
  }

  drawFooter(doc)
}

// ─── PDF bytes helper ─────────────────────────────────────────────────────────
function pdfToBuffer(drawFn) {
  return new Promise((resolve, reject) => {
    const pdf = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: true })
    const chunks = []
    pdf.on('data', c => chunks.push(c))
    pdf.on('end', () => resolve(Buffer.concat(chunks)))
    pdf.on('error', reject)
    drawFn(pdf)
    pdf.end()
  })
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // 1. Fetch data
  const { data: docs, error: docErr } = await supabase.from('documents').select('*')
  if (docErr) { console.error(docErr); process.exit(1) }

  const { data: prospects } = await supabase.from('prospects_clients').select('*')
  const prospectMap = Object.fromEntries(prospects.map(p => [p.id, p]))

  console.log(`Generating PDFs for ${docs.length} documents...`)

  // 2. Create storage bucket (ignore if exists)
  await supabase.storage.createBucket('force7-documents', { public: true })

  // 3. Process each document
  let ok = 0
  for (const doc of docs) {
    const prospect = prospectMap[doc.prospect_client_id]
    if (!prospect) { console.warn(`  skip: no prospect for ${doc.id}`); continue }

    const formation = FORMATION_MAP[doc.prospect_client_id]
    if (!formation) { console.warn(`  skip: no formation for ${doc.prospect_client_id}`); continue }

    const dates = DATES_MAP[doc.prospect_client_id] || { debut: 'à définir', fin: 'à définir' }

    try {
      const pdfBuf = await pdfToBuffer((pdf) => {
        if (doc.type_document === 'convention') {
          generateConvention(pdf, prospect, formation, dates)
        } else if (doc.type_document === 'facture') {
          generateDevis(pdf, prospect, formation, dates, true)
        } else {
          generateDevis(pdf, prospect, formation, dates, false)
        }
      })

      const path = `${doc.id}.pdf`
      const { error: uploadErr } = await supabase.storage
        .from('force7-documents')
        .upload(path, pdfBuf, { contentType: 'application/pdf', upsert: true })

      if (uploadErr) { console.error(`  upload error ${doc.id}:`, uploadErr.message); continue }

      const { data: { publicUrl } } = supabase.storage.from('force7-documents').getPublicUrl(path)

      const { error: updateErr } = await supabase
        .from('documents')
        .update({ url_stockage_plateforme: publicUrl })
        .eq('id', doc.id)

      if (updateErr) { console.error(`  update error ${doc.id}:`, updateErr.message); continue }

      console.log(`  ✓ ${doc.type_document.padEnd(12)} ${prospect.nom_entreprise}`)
      ok++
    } catch (e) {
      console.error(`  error ${doc.id}:`, e.message)
    }
  }

  console.log(`\nDone: ${ok}/${docs.length} PDFs generated and uploaded.`)
}

main().catch(console.error)
