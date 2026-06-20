# CLAUDE.md — Force 7 Plateforme

## Projet
Plateforme ERP de gestion administrative pour Force 7 Formation (Le Havre).
Remplace un ERP Access vieillissant. Automatise 90-100% du processus administratif (devis → facture).
Référence fonctionnelle complète : `PRD.md` à la racine.

## Stack technique
- **Framework** : Next.js 15, App Router, TypeScript
- **Base de données** : Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Déploiement** : Vercel
- **UI** : Tailwind CSS + shadcn/ui
- **IA** : Anthropic API (Claude)

## Intégrations externes
- Microsoft Graph API (Outlook + OneDrive)
- EduSign (émargement)
- Keypredict (tests apprenants)

## Charte graphique
_À compléter_

## Conventions de code
- App Router uniquement — pas de `pages/`
- Server Components par défaut, Client Components explicitement marqués `"use client"`
- Supabase : client browser dans `lib/supabase/client.ts`, client server dans `lib/supabase/server.ts`
- Types TypeScript centralisés dans `lib/types/index.ts` — refléter exactement les 11 entités du PRD
- Nommage des routes API : `/api/[ressource]/route.ts`
- Pas de commentaires sauf si le WHY est non-évident

## Rôles utilisateurs
| Rôle | Valeur en base | Accès |
|---|---|---|
| Admin (Iliès / dirigeants) | `admin` | Toutes les routes `(admin)/` |
| Formateur | `formateur` | Uniquement les routes `(formateur)/` |

## Principe non négociable
Toute communication IA destinée à un prospect/client externe passe par validation humaine (Iliès) avant envoi. L'IA prépare, l'humain valide. Ce principe doit se refléter dans chaque flux : jamais d'envoi automatique sans `statut_validation = 'Validé'`.

## Données de démo
Les données fictives Force 7 sont dans `supabase/seed.sql`.
La démo cible : tunnel complet devis → facture sur un cas fictif, avec simulation d'email entrant vivant.

## Commandes utiles
```bash
# Développement local
npm run dev

# Supabase local (après installation CLI)
supabase start
supabase db reset        # recharge migrations + seed
supabase db push         # pousse vers le projet remote

# Déploiement
vercel deploy            # preview
vercel deploy --prod     # production
```
