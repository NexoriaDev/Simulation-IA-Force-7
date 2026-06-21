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
Voir `charte-graphique.md` à la racine — à consulter avant tout composant d'interface.

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

## Optimisation du code

1. **Ponytail (mode "full") systématique** — Pour toute génération ou modification de code sur ce projet, utiliser ponytail en priorité. Privilégier toujours la solution la plus simple qui fonctionne (stdlib, feature native, dépendance déjà installée, une ligne) avant de construire quelque chose de plus complexe.

2. **Exception impérative — complétude métier non négociable** — Ne jamais sacrifier la couverture fonctionnelle au nom de la simplicité technique. Les éléments suivants doivent toujours être implémentés intégralement, même si cela demande plus de code que le minimum :
   - Machines à états (PRD section 5) avec tous leurs états et transitions
   - Statuts détaillés par apprenant et par dossier
   - Principe de validation humaine (`statut_validation = 'Validé'` avant tout envoi)
   
   La règle de simplicité s'applique à l'implémentation technique (pas de dépendances inutiles, pas d'abstractions superflues), jamais à la couverture fonctionnelle attendue par le PRD.

## Optimisation des sessions

1. **Lecture ciblée de PRD.md** — Ne jamais relire PRD.md en entier par défaut. Cibler uniquement la section pertinente à la tâche :
   - Section 3 (Entités de données) → schéma Supabase ou types TypeScript
   - Section 4 (Arborescence OneDrive) → stockage documentaire
   - Section 5 (Machines à états) → logique de statut
   - Section 6 (Processus automatisé détaillé) → détail d'une étape métier
   - Section 7 (Écrans principaux) → structure d'une page/interface
   
   Si l'info n'est pas dans la section visée, élargir progressivement plutôt que recharger tout le fichier.

2. **Corrections ponctuelles** — Pour toute correction ciblée (couleur, espacement, libellé), modifier uniquement l'élément précis demandé, sans régénérer un composant ou un écran entier.

## Règles de mise en page

Toute page de l'application doit utiliser la pleine largeur disponible entre la sidebar et le bord droit de l'écran, avec un padding cohérent de chaque côté (ex: `px-10`) — jamais de `max-w-*` centré qui laisse un vide latéral important.

- **Par défaut** : `px-8` ou `px-10` sur le conteneur principal, sans `max-w` ni `mx-auto`
- **Interdit par défaut** : `max-w-5xl mx-auto`, `max-w-6xl mx-auto`, `max-w-7xl mx-auto` ou tout centrage artificiel
- **Exception** : centrage autorisé uniquement sur demande explicite, ou pour des formulaires courts (ex : page de connexion, `max-w-sm` OK)
- **`max-w-[Npx]` inline** (texte tronqué, icônes) : autorisé, cette règle ne s'applique qu'aux conteneurs de mise en page

Références visuelles : `design-refs/sidebar-reference.png` et `design-refs/onglet-utilisateurs.png`.

## Discipline de commit

Après chaque modification de code (correction visuelle, ajout de fonctionnalité, changement de données, etc.) :

1. Vérifier que le changement fonctionne (build sans erreur TypeScript, comportement attendu confirmé)
2. Commiter immédiatement avec un message clair et descriptif de ce qui a changé
3. Ne jamais enchaîner plusieurs changements non liés sans commit entre chaque — un commit = une modification logique cohérente
4. Si un changement touche plusieurs fichiers mais représente une seule action cohérente (ex : "ajouter l'onglet Profil" qui touche le composant + le PRD), un seul commit est acceptable pour cet ensemble
5. Si un changement casse quelque chose d'existant ou que son état est incertain, commiter l'état stable précédent avant de continuer à corriger — ne jamais perdre de point de retour

**Exception** : demander confirmation avant de commiter si le changement est ambigu ou si plusieurs interprétations étaient possibles — mais par défaut, commit systématique après chaque tâche validée.

## Skills et plugins à utiliser systématiquement

- **ponytail** : appliquer son principe de sobriété de code (YAGNI, pas de sur-ingénierie) sur CHAQUE requête de développement, sans exception, pour limiter la consommation de tokens et la dette technique.
- **framer-motion** et **ui-ux-pro-max** : utiliser systématiquement pour toute tâche impliquant de l'interface utilisateur (composants, écrans, transitions), afin de garantir un rendu moderne et animé conforme à la charte graphique Nexoria/Force 7.
- Note d'arbitrage : en cas de tension entre les deux principes (ponytail pousse vers le minimum de code, ui-ux-pro-max/framer-motion ajoutent de la polish visuelle), privilégier la sobriété sur la logique métier et les données, et réserver le soin visuel à la couche présentation (animations, transitions, micro-interactions).

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
