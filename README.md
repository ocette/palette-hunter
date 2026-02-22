# 🎨 Palette Hunter

Palette Hunter est une application web fullstack permettant de découvrir des images et leurs palettes de couleurs. On peut rechercher des images par couleur, consulter leurs palettes, ajouter ses propres images et sauvegarder ses favoris.

## 🛠️ Stack technique

- **Frontend** : React, TypeScript, Tailwind CSS, React Router
- **Backend** : Node.js, Express
- **Base de données** : PostgreSQL (Neon)

## 📁 Structure du projet

```
palette-hunter/
├── back/         # Serveur Express
│   └── index.js
└── front/        # Application React
    └── src/
        ├── components/
        │   ├── Navbar.tsx
        │   ├── ImageGrid.tsx
        │   └── SearchBar.tsx
        └── pages/
            ├── HomePage.tsx
            ├── ImagePage.tsx
            ├── FavoritesPage.tsx
            └── AddImagePage.tsx
```

## 🚀 Installation

### Prérequis

- Node.js
- Un compte [Neon](https://neon.tech) pour la base de données

### Backend

```bash
cd back
pnpm install
```

Crée un fichier `.env` à la racine du dossier `back` :

```
DATABASE_URL=ta_url_neon
PORT=4242
```

Lance le serveur :

```bash
node index.js
```

### Frontend

```bash
cd front
pnpm install
pnpm run dev
```

L'application est accessible sur `http://localhost:5173`

## 🗄️ Base de données

La base de données contient 3 tables :

- **images** : les images avec leur titre, description, url, source et couleurs dominantes
- **palettes** : les palettes de couleurs associées à chaque image (codes hexadécimaux)
- **favoris** : les images sauvegardées en favori

## 📡 Routes API

### Images

| Méthode | Route                                  | Description                      |
| ------- | -------------------------------------- | -------------------------------- |
| GET     | `/api/images`                          | Récupère toutes les images       |
| GET     | `/api/images/:id`                      | Récupère une image et sa palette |
| GET     | `/api/images/search?colors=Rouge,Bleu` | Recherche des images par couleur |
| POST    | `/api/images`                          | Ajoute une nouvelle image        |

#### Body pour POST `/api/images`

```json
{
  "title": "Mon image",
  "description": "Une description",
  "url": "https://monimage.com/photo.jpg",
  "source": "Unsplash",
  "dominant_colors": ["Rouge", "Bleu", "Vert"]
}
```

### Favoris

| Méthode | Route              | Description                  |
| ------- | ------------------ | ---------------------------- |
| GET     | `/api/favoris`     | Récupère tous les favoris    |
| POST    | `/api/favoris`     | Ajoute une image aux favoris |
| DELETE  | `/api/favoris/:id` | Supprime un favori           |

#### Body pour POST `/api/favoris`

```json
{
  "image_id": 1
}
```

## 📄 Pages

| URL           | Description                                            |
| ------------- | ------------------------------------------------------ |
| `/`           | Mosaïque d'images + barre de recherche par couleur     |
| `/images/:id` | Détail d'une image avec sa palette + ajout aux favoris |
| `/favoris`    | Liste des images favorites avec suppression            |
| `/ajouter`    | Formulaire d'ajout d'une nouvelle image                |
