import { Router } from "express";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const router = Router();

// Route pour récupérer toutes les images
router.get("/", async (_, res) => {
  try {
    const response = await sql`SELECT * FROM images`;
    res.json(response);
  } catch {
    console.error(error);
    res.status(500).json({ error: "Échec de récupération des images" });
  }
});

// Route pour récupérer toutes les images par couleur
router.get("/search", async (req, res) => {
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

// Route pour la recherche par couleur
router.get("/color", async (req, res) => {
  const { hex } = req.query;

  if (!hex) {
    return res.status(400).json({ error: "Paramètre hex requis" });
  }

  // On découpe les couleurs séparées par des virgules
  const hexColors = String(hex)
    .split(",")
    .map((h) => h.trim());

  try {
    const response = await sql`
      WITH color_distances AS (
        SELECT
          p.id,
          AVG(
            sqrt(
              power(('x' || substring(c.hex, 2, 2))::bit(8)::int - input.r, 2) +
              power(('x' || substring(c.hex, 4, 2))::bit(8)::int - input.g, 2) +
              power(('x' || substring(c.hex, 6, 2))::bit(8)::int - input.b, 2)
            )
          ) AS avg_distance
        FROM palettes p
        CROSS JOIN LATERAL unnest(p.colors) AS c(hex)
        CROSS JOIN LATERAL (
          SELECT
            ('x' || substring(input_hex, 2, 2))::bit(8)::int AS r,
            ('x' || substring(input_hex, 4, 2))::bit(8)::int AS g,
            ('x' || substring(input_hex, 6, 2))::bit(8)::int AS b
          FROM unnest(${hexColors}::text[]) AS input_hex
        ) AS input
        GROUP BY p.id
      )
      SELECT images.*, cd.avg_distance
      FROM color_distances cd
      JOIN images ON images.id = cd.id
      ORDER BY avg_distance ASC
      LIMIT 10
    `;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la recherche par couleur" });
  }
});

// Route pour récupérer les tags des images
router.get("/tags", async (_, res) => {
  try {
    const response = await sql`
      SELECT DISTINCT tag FROM images
      WHERE tag IS NOT NULL
      ORDER BY tag ASC
    `;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de récupération des tags" });
  }
});

// Route pour filtrer les images par tag
router.get("/tag/:tag", async (req, res) => {
  const { tag } = req.params;
  try {
    const response = await sql`
      SELECT * FROM images WHERE tag = ${tag}
    `;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec du filtrage par tag" });
  }
});

// Route pour récupérer une image et sa palette
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
  const { title, description, url, source, dominant_colors, tag } = req.body;
  if (!title || !url || !source || !dominant_colors) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  try {
    const response = await sql`
      INSERT INTO images (title, description, url, source, dominant_colors, tag)
      VALUES (${title}, ${description}, ${url}, ${source}, ${dominant_colors}, ${tag})
      RETURNING *
    `;
    res.status(201).json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'ajout de l'image" });
  }
});

export default router;
