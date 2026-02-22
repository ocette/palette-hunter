import "dotenv/config";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";

const app = express();
const PORT = process.env.PORT || 4242;
const sql = neon(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json());

// Route de test pour vérifier la connexion à la base
app.get("/", async (_, res) => {
  try {
    const response = await sql`SELECT version()`;
    const { version } = response[0];
    res.json({ version });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

// Route pour récupérer toutes les images
app.get("/api/images", async (_, res) => {
  try {
    const response = await sql`SELECT * FROM images`;
    res.json(response);
  } catch {
    console.error(error);
    res.status(500).json({ error: "Échec de récupération des images" });
  }
});

// Route pour récupérer toutes les images par couleur
app.get("/api/images/search", async (req, res) => {
  const { colors } = req.query;

  if (!colors) {
    return res
      .status(400)
      .json({ error: "Le paramètre de requête colors est requis." });
  }
  try {
    const colorsArray = String(colors).split(",");
    const response = await sql`SELECT * FROM images
      WHERE dominant_colors && ${colorsArray.map((color) => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase())}`;
    res.json(response);
  } catch {
    console.error(error);
    res
      .status(500)
      .json({ error: "Échec de récupération des images par couleur" });
  }
});

// Route pour récupérer une image et sa palette
app.get("/api/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const imageResponse = await sql` SELECT * FROM images WHERE id = ${id}`;

    const paletteResponse =
      await sql` SELECT * FROM palettes WHERE image_id = ${id}`;

    res.json({ image: imageResponse[0], palette: paletteResponse });
  } catch {
    console.error(error);
    res
      .status(500)
      .json({ error: "Échec de récupération des détails de l'image" });
  }
});

// Route pour ajouter une nouvelle image
app.post("/api/images", async (req, res) => {
  const { title, description, url, source, dominant_colors } = req.body;
  if (!title || !url || !source || !dominant_colors) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  try {
    const response =
      await sql` INSERT INTO images(title, description, url, source, dominant_colors) VALUES(${title}, ${description}, ${url}, ${source}, ${dominant_colors}) RETURNING *`;
    res.status(201).json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'ajout de l'image" });
  }
});

// Route pour ajouter une image aux favoris
app.post("/api/favoris", async (req, res) => {
  const { image_id } = req.body;
  if (!image_id) {
    return res.status(400).json({ error: "L'id de l'image est requis" });
  }
  try {
    const response =
      await sql`INSERT INTO favoris (image_id) VALUES (${image_id}) RETURNING *`;
    res.status(201).json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'ajout aux favoris" });
  }
});

// Route pour supprimer un favori
app.delete("/api/favoris/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response =
      await sql`DELETE FROM favoris WHERE id = ${id} RETURNING *`;
    res.json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la suppression du favori" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
