# TribTravel

À vous le voyage, à nous l’organisation.

Maquette web complète pour une soutenance hackathon / création d’entreprise : landing, questionnaire personnalisé (11 étapes), analyse de profil, recommandation de destination et road book interactif.

Stack : **React + Vite + TypeScript + Tailwind CSS v4**.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L’application est disponible sur [http://localhost:5173](http://localhost:5173).

## Scripts

```bash
npm run dev       # serveur de développement
npm run build     # build de production
npm run preview   # prévisualiser le build
npm run lint      # ESLint
```

## Variables d’environnement

Copiez `.env.example` vers `.env` :

```
GEOAPIFY_API_KEY=
PEXELS_API_KEY=
```

| Variable | Obligatoire | Usage |
|---|---|---|
| `GEOAPIFY_API_KEY` | Non | Autocomplétion villes, POI, hébergements |
| `PEXELS_API_KEY` | Non | Photos de destination |

- **Open-Meteo** (météo) ne nécessite pas de clé.
- Sans clés, l’application fonctionne en **mode fallback** avec le catalogue éditorial TribTravel.
- Les clés ne sont jamais exposées dans le frontend : elles passent par `/api/geoapify` et `/api/pexels` (Vercel Serverless + middleware Vite en local).

## Déploiement Vercel

1. Importez le dépôt sur [Vercel](https://vercel.com).
2. Framework preset : Vite.
3. Ajoutez éventuellement `GEOAPIFY_API_KEY` et `PEXELS_API_KEY` dans les Environment Variables.
4. Déployez — les routes `/api/*` et le rewrite SPA sont configurés via `vercel.json`.

## Parcours démo

1. Landing → **Créer mon road book**
2. Questionnaire (11 étapes, dont climat / zone / distance) — en dev, bouton discret **Profil démo**
3. Écran d’analyse
4. Résultat + road book + alternatives (catalogue 70+ destinations)

## Crédits données

- Météo : [Open-Meteo](https://open-meteo.com)
- Cartes : © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Lieux : [Geoapify](https://www.geoapify.com) (optionnel)
- Photos : [Pexels](https://www.pexels.com) (optionnel)

Projet étudiant — démonstration.
