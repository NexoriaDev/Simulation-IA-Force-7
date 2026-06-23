'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, X, Check, Building2, Mail, Phone, Users } from 'lucide-react'

interface Demande {
  id: string
  prenom: string
  nom: string
  entreprise: string
  email: string
  telephone: string
  nb_salaries: number
  fonction: string
  initiales: string
  couleur: string
}

const DEMO_DEMANDES: Demande[] = [
  {
    id: '1',
    prenom: 'Thomas',
    nom: 'Lefebvre',
    entreprise: 'Normandie Logistique',
    email: 'thomas.lefebvre@normlogistique.fr',
    telephone: '06 23 45 67 89',
    nb_salaries: 180,
    fonction: 'Directeur RH',
    initiales: 'TL',
    couleur: 'bg-violet-100 text-violet-700',
  },
  {
    id: '2',
    prenom: 'Claire',
    nom: 'Morin',
    entreprise: 'Constructions Navales du Havre',
    email: 'c.morin@cnh-group.fr',
    telephone: '06 12 34 56 78',
    nb_salaries: 320,
    fonction: 'Responsable Formation',
    initiales: 'CM',
    couleur: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: '3',
    prenom: 'Pierre',
    nom: 'Aubert',
    entreprise: 'Aubert Menuiserie & Charpente',
    email: 'p.aubert@aubert-charpente.fr',
    telephone: '06 87 65 43 21',
    nb_salaries: 28,
    fonction: 'Gérant',
    initiales: 'PA',
    couleur: 'bg-amber-100 text-amber-700',
  },
  {
    id: '4',
    prenom: 'Nadia',
    nom: 'Bencheikh',
    entreprise: 'Syndicat Portuaire de Rouen',
    email: 'n.bencheikh@sp-rouen.fr',
    telephone: '07 45 23 89 10',
    nb_salaries: 95,
    fonction: 'DRH',
    initiales: 'NB',
    couleur: 'bg-blue-100 text-blue-700',
  },
]

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>(DEMO_DEMANDES)

  function dismiss(id: string) {
    setDemandes(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-3">
      {demandes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-56 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            <Users size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">Aucune demande en attente</p>
        </div>
      )}

      <AnimatePresence>
        {demandes.map((d, i) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -16, transition: { duration: 0.18 } }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-5"
          >
            {/* Avatar initiales */}
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${d.couleur}`}>
              {d.initiales}
            </div>

            {/* Infos contact */}
            <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_1fr] gap-x-6 gap-y-1 items-center">
              <div>
                <p className="font-semibold text-[#1F2937] text-sm leading-tight">
                  {d.prenom} {d.nom}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{d.fonction}</p>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <Building2 size={13} className="text-gray-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#4B5563] truncate font-medium">{d.entreprise}</p>
                  <p className="text-xs text-gray-400">
                    <Users size={10} className="inline mr-1" />
                    {d.nb_salaries} salarié{d.nb_salaries > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="flex items-center gap-1.5 text-xs text-[#4B5563]">
                  <Mail size={11} className="text-gray-300 shrink-0" />
                  <span className="truncate">{d.email}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Phone size={11} className="text-gray-300 shrink-0" />
                  {d.telephone}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                title="Voir le profil"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-[#1267A4]/40 hover:text-[#1267A4] hover:bg-[#EBF3FB] transition-colors cursor-pointer"
              >
                <Eye size={13} />
                Voir
              </button>
              <button
                onClick={() => dismiss(d.id)}
                title="Refuser la demande"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
              >
                <X size={13} />
                Refuser
              </button>
              <button
                onClick={() => dismiss(d.id)}
                title="Accepter la demande"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1267A4] text-white text-xs font-medium hover:bg-[#0f5390] transition-colors cursor-pointer"
              >
                <Check size={13} />
                Accepter
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
