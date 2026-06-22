'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { StatutDossier } from '@/lib/types'

// Données des 13 étapes — source de vérité pour toute la plateforme
export const STEPS: { label: string; icon: string }[] = [
  { label: 'Profil créé',                                   icon: 'icon-profil-cree.png' },
  { label: 'Devis en attente',                              icon: 'icon-devis-attente.png' },
  { label: 'Devis généré',                                  icon: 'icon-devis-genere.png' },
  { label: 'Devis envoyé',                                  icon: 'icon-devis-envoye.png' },
  { label: 'Devis signé',                                   icon: 'icon-devis-signe.png' },
  { label: 'Prospect gagné',                                icon: 'icon-prospect-gagne.png' },
  { label: 'Validé',                                        icon: 'icon-valide.png' },
  { label: 'Profil Keypredict créé',                        icon: 'icon-keypredict-cree.png' },
  { label: 'Tests générés',                                 icon: 'icon-tests-generes.png' },
  { label: 'Tests envoyés',                                 icon: 'icon-tests-envoyes.png' },
  { label: 'Profil Edusign créé',                           icon: 'icon-edusign-cree.png' },
  { label: 'Attestation de fin de formation générée',       icon: 'icon-attestation-generee.png' },
  { label: 'Attestation de fin de formation envoyée',       icon: 'icon-attestation-envoyee.png' },
]

export const STATUT_TO_STEP: Partial<Record<StatutDossier, number>> = {
  profil_cree:      0,
  devis_en_attente: 1,
  devis_genere:     2,
  devis_envoye:     3,
  devis_signe:      4,
  prospect_gagne:   5,
  valide:           6,
}

export const TL_N     = STEPS.length  // 13
export const TL_W     = 220           // largeur par colonne (px)
export const TL_BAR_Y = 160           // centre Y de la barre depuis le haut
export const TL_BAR_H = 12
export const TL_PIN_W = 48
export const TL_PIN_H = 66
export const TL_ICON  = 52
export const TL_POINT = 20            // diamètre du point-avancement
export const TL_H     = 268           // hauteur totale du canvas

type Props =
  | { mode: 'progress'; statut: StatutDossier }
  | { mode: 'neutral' }

export function TimelineStepper(props: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const isProgress = props.mode === 'progress'
  const statut: StatutDossier | null = 'statut' in props ? props.statut : null
  const isPerdu  = statut === 'prospect_perdu'
  const stepIdx  = statut && !isPerdu ? (STATUT_TO_STEP[statut] ?? 0) : 0

  const fillWidth = isProgress && !isPerdu ? Math.max(0, stepIdx * TL_W - TL_W / 2) : 0
  const barLeft   = TL_W / 2
  const barWidth  = (TL_N - 1) * TL_W

  useEffect(() => {
    if (!isProgress) return
    const el = scrollRef.current
    if (!el) return
    el.scrollLeft = TL_W * (stepIdx + 0.5) - el.clientWidth / 2
  }, [isProgress, stepIdx])

  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * TL_W * 3, behavior: 'smooth' })

  const pinTop   = TL_BAR_Y - TL_PIN_H / 2
  const iconTop  = pinTop - 8 - TL_ICON
  const labelTop = TL_BAR_Y + TL_PIN_H / 2 + 8

  return (
    <div className="select-none">
      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white shadow border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1267A4] hover:border-[#1267A4] transition-colors cursor-pointer"
          style={{ top: TL_BAR_Y - 16 }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white shadow border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1267A4] hover:border-[#1267A4] transition-colors cursor-pointer"
          style={{ top: TL_BAR_Y - 16 }}
        >
          <ChevronRight size={16} />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto mx-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="relative" style={{ width: TL_N * TL_W, height: TL_H }}>

            {/* Barre grise (fond) */}
            <div
              className="absolute rounded-full bg-[#E5E7EB]"
              style={{ top: TL_BAR_Y - TL_BAR_H / 2, left: barLeft, width: barWidth, height: TL_BAR_H, zIndex: 1 }}
            />

            {/* Progression bleue (mode progress uniquement) */}
            {isProgress && (
              <motion.div
                className="absolute rounded-full bg-[#6199C1]"
                style={{ top: TL_BAR_Y - TL_BAR_H / 2, left: barLeft, height: TL_BAR_H, zIndex: 2 }}
                initial={{ width: 0 }}
                animate={{ width: fillWidth }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}

            {/* Point d'avancement (mode progress uniquement) */}
            {isProgress && !isPerdu && stepIdx > 0 && (
              <div
                className="absolute"
                style={{
                  top: TL_BAR_Y - TL_POINT / 2,
                  left: barLeft + fillWidth - TL_POINT / 2,
                  width: TL_POINT,
                  height: TL_POINT,
                  zIndex: 6,
                }}
              >
                <img src="/images/timeline-icons/point-avancement.png" alt="" width={TL_POINT} height={TL_POINT} style={{ objectFit: 'contain' }} />
              </div>
            )}

            {STEPS.map(({ label, icon }, i) => {
              const isPast    = isProgress && !isPerdu && i < stepIdx
              const isCurrent = isProgress && !isPerdu && i === stepIdx
              // progress : passé → pin bleu, actuel/futur → pin gris | neutral : tous pin bleu
              const pinImg       = (isProgress && !isPast) ? 'pin-non-atteint.png' : 'pin-atteint.png'
              const labelColor   = isProgress ? (isPast ? '#1267A4' : isCurrent ? '#1F2937' : '#9CA3AF') : '#1267A4'
              const labelWeight  = isProgress ? (isPast || isCurrent ? 700 : 400) : 600
              const iconOpacity  = isProgress ? (isPast || isCurrent ? 1 : 0.3) : 1

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: i * TL_W, width: TL_W, top: 0, height: TL_H, zIndex: 10 }}
                >
                  <div
                    className="absolute flex items-center justify-center"
                    style={{ top: iconTop, left: '50%', transform: 'translateX(-50%)', width: TL_ICON, height: TL_ICON }}
                  >
                    <img
                      src={`/images/timeline-icons/${icon}`}
                      alt={label}
                      width={TL_ICON}
                      height={TL_ICON}
                      style={{ objectFit: 'contain', opacity: iconOpacity }}
                    />
                  </div>

                  <div
                    className="absolute"
                    style={{ top: pinTop, left: '50%', transform: 'translateX(-50%)', width: TL_PIN_W, height: TL_PIN_H }}
                  >
                    <img src={`/images/timeline-icons/${pinImg}`} alt="" width={TL_PIN_W} height={TL_PIN_H} style={{ objectFit: 'contain' }} />
                  </div>

                  <p
                    className="absolute text-center leading-snug"
                    style={{ top: labelTop, left: 6, right: 6, fontSize: 12, color: labelColor, fontWeight: labelWeight }}
                  >
                    {label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isProgress && isPerdu && (
        <div className="mt-3 flex items-center gap-1.5 text-[#DC2626]">
          <X size={13} strokeWidth={2} />
          <span className="text-xs font-medium">Prospect perdu</span>
        </div>
      )}
      {isProgress && !isPerdu && (
        <div className="mt-2 flex items-center gap-1 text-[#D1D5DB]">
          <X size={10} strokeWidth={1.5} />
          <span className="text-[10px]">Prospect perdu (branche alternative)</span>
        </div>
      )}
    </div>
  )
}
