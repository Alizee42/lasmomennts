# Las Moments — Frontend

Site vitrine Angular pour **Las Moments**, une activité de prestation événementielle (vidéobooth 360°, photobooth, livre d'or audio). Permet aux visiteurs de découvrir les services, consulter les disponibilités, laisser un avis et envoyer une demande de devis. Un panneau d'administration permet de gérer l'ensemble du contenu du site.

## Stack technique

| Technologie | Version |
|---|---|
| Angular | 17.3.x (standalone components) |
| TypeScript | ~5.4.2 |
| RxJS | ~7.8.0 |
| FullCalendar (Angular / daygrid) | ^6.1.11 |
| SCSS | personnalisé par composant |
| Angular CLI | ^17.3.0 |

## Prérequis

- Node.js 18+
- Angular CLI 17 (`npm install -g @angular/cli@17`)
- Backend `lasmoments-api` démarré sur `localhost:8085`

## Installation et lancement

```bash
npm install
npm start
# Application disponible sur http://localhost:4200
```

Le proxy redirige automatiquement les appels `/api` vers `http://localhost:8085/api`.

## Scripts disponibles

| Script | Description |
|---|---|
| `npm start` | Serveur de développement |
| `npm run build:prod` | Build de production |
| `npm run build:docker` | Build pour environnement Docker |

## Pages et fonctionnalités

### Site public

- **Accueil** — hero vidéo, présentation, services, tarifs (Vidéobooth 360°, Photobooth, Livre d'or Audio — classique / premium), galerie vidéo, calendrier de disponibilités, avis clients, formulaire de devis
- **Confirmation** — page post-envoi de devis
- **Mentions légales / Politique de confidentialité**

### Panneau d'administration (`/admin`, route JWT-protégée)

- **Dashboard** — statistiques (avis en attente, dates disponibles, vidéos, avis approuvés)
- **Gestion des avis** — approbation / rejet des avis clients
- **Gestion des disponibilités** — CRUD des créneaux calendrier
- **Gestion des vidéos** — upload et suppression de vidéos portfolio
- **Paramètres** — éditeur CMS multi-onglets pour tous les textes et médias du site (hero, à propos, services, tarifs, liens sociaux) avec upload de fichiers

## Architecture

- JWT stocké en `localStorage`, décodé pour vérification d'expiration
- Intercepteur HTTP qui injecte le token Bearer sur toutes les requêtes
- `authGuard` protège toutes les routes `/admin/**`
- Environnements configurés pour développement (`localhost:8085`), production et Docker
