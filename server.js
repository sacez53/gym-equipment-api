import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"))
);

function readEquipment() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeEquipment(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

app.get("/", (req, res) => {
  res.json({
    message: "API Équipement de salle de sport",
    documentation: {
      liste: "/api/equipements",
      detail: "/api/equipements/:id",
      categorie: "/api/equipements/categorie/:categorie"
    }
  });
});

app.get("/api/equipements", (req, res) => {
  res.json(readEquipment());
});

app.get("/api/equipements/categorie/:categorie", (req, res) => {
  const categorie = req.params.categorie.toLowerCase();

  const resultats = readEquipment().filter(
    item => item.categorie.toLowerCase() === categorie
  );

  res.json(resultats);
});

app.get("/api/equipements/:id", (req, res) => {
  const item = readEquipment().find(
    e => e.id === Number(req.params.id)
  );

  if (!item) {
    return res.status(404).json({ error: "Équipement introuvable" });
  }

  res.json(item);
});

app.post("/api/equipements", (req, res) => {
  const { nom, categorie, quantite, etat, description, image } = req.body;

  if (!nom || !categorie || !image) {
    return res.status(400).json({
      error: "nom, categorie et image sont obligatoires."
    });
  }

  const items = readEquipment();
  const newId = items.length ? Math.max(...items.map(e => e.id)) + 1 : 1;

  const equipment = {
    id: newId,
    nom,
    categorie,
    quantite: Number(quantite) || 1,
    etat: etat || "Bon",
    description: description || "",
    image: image.startsWith("/images/") ? image : `/images/${image}`,
    cree_le: new Date().toISOString()
  };

  items.push(equipment);
  writeEquipment(items);

  res.status(201).json(equipment);
});

app.put("/api/equipements/:id", (req, res) => {
  const items = readEquipment();
  const index = items.findIndex(e => e.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Équipement introuvable" });
  }

  const old = items[index];

  items[index] = {
    ...old,
    nom: req.body.nom || old.nom,
    categorie: req.body.categorie || old.categorie,
    quantite: req.body.quantite ? Number(req.body.quantite) : old.quantite,
    etat: req.body.etat || old.etat,
    description: req.body.description ?? old.description,
    image: req.body.image
      ? req.body.image.startsWith("/images/")
        ? req.body.image
        : `/images/${req.body.image}`
      : old.image,
    modifie_le: new Date().toISOString()
  };

  writeEquipment(items);
  res.json(items[index]);
});

app.delete("/api/equipements/:id", (req, res) => {
  const items = readEquipment();
  const index = items.findIndex(e => e.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Équipement introuvable" });
  }

  const deleted = items.splice(index, 1)[0];
  writeEquipment(items);

  res.json({ message: "Équipement supprimé", equipement: deleted });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API disponible sur http://localhost:${PORT}`);
});
