# DevLearn

DevLearn est une plateforme personnelle d’apprentissage pour DevOps, Python et AI/ML. Le contenu est séparé du code : les cours sont en MDX, les quiz et exercices pratiques sont en JSON, et la progression reste dans le localStorage.

## Installation

```bash
npm install
npm run validate-content
npm run dev
```

Commandes utiles :

- `npm run dev` : démarre Next.js en local.
- `npm run validate-content` : vérifie la cohérence des slugs, quiz, pratiques et parcours.
- `npx tsc --noEmit` : vérifie TypeScript sans générer de fichiers.
- `npm run build` : lance la validation puis construit l’application.

## Architecture

```text
app/                    Pages Next.js App Router
components/             Composants UI, layout, cours, quiz, pratique et parcours
content/courses/        Un fichier MDX par concept
content/quizzes/        Un fichier .quiz.json par concept
content/practices/      Un fichier .practice.json par concept
content/paths/          Parcours d’apprentissage
lib/                    Lecture contenu, recherche, progression, prérequis
types/                  Types TypeScript partagés
scripts/                Validation du contenu
```

## Ajouter un concept

1. Crée un cours MDX dans `content/courses/<domain>/<slug>.mdx`.
2. Renseigne le frontmatter : `title`, `domain`, `slug`, `level`, `tags`, `description`, `prerequisites`, `estimatedTime`, `difficultyPoints`, `ressources`.
3. Crée `content/quizzes/<slug>.quiz.json` avec au moins 5 questions, 4 options par question et une explication.
4. Crée `content/practices/<slug>.practice.json` avec au moins 3 exercices et des IDs stables.
5. Lance `npm run validate-content`.

Les slugs de prérequis doivent pointer vers des cours existants. Les URLs de ressources doivent rester fiables et explicites.

## Ajouter un parcours

1. Crée `content/paths/<id>.path.json`.
2. Ajoute `id`, `title`, `description`, `domain`, `targetLevel`, `totalEstimatedTime` et `steps`.
3. Chaque étape doit contenir un `slug` existant et un `order`.
4. Utilise `optional: true` pour une étape recommandée mais non obligatoire.
5. Lance `npm run validate-content` avant de commiter.

## Extensions futures

- Backend FastAPI + PostgreSQL pour la persistance multi-utilisateurs.
- Authentification avec NextAuth.js.
- Flashcards avec répétition espacée.
- Génération automatique de quiz via API Claude.
- Profil public de progression.
- Contributions communautaires de contenu.
- Progressive Web App avec notifications de révision.
