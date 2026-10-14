# API Équipement de salle de sport

API REST créée avec Node.js et Express pour gérer les équipements d'une salle de sport.

## Lancer le projet

```bash
npm install
npm start
```

## Routes principales

- `GET /api/equipements` : liste des équipements
- `GET /api/equipements/:id` : détail d'un équipement
- `GET /api/equipements/categorie/:categorie` : filtre par catégorie
- `POST /api/equipements` : ajouter un équipement
- `PUT /api/equipements/:id` : modifier un équipement
- `DELETE /api/equipements/:id` : supprimer un équipement

## Images

Les images sont stockées dans `/public/images` et accessibles via :

```text
/images/nom-de-l-image.jpg
```
