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

  try {
    const response = await sql`
      WITH input_color AS (
        SELECT
          ('x' || substring(${hex}, 2, 2))::bit(8)::int AS r,
          ('x' || substring(${hex}, 4, 2))::bit(8)::int AS g,
          ('x' || substring(${hex}, 6, 2))::bit(8)::int AS b
      ),
      color_distances AS (
        SELECT
          p.id,
          c.hex,
          sqrt(
            power(('x' || substring(c.hex, 2, 2))::bit(8)::int - ic.r, 2) +
            power(('x' || substring(c.hex, 4, 2))::bit(8)::int - ic.g, 2) +
            power(('x' || substring(c.hex, 6, 2))::bit(8)::int - ic.b, 2)
          ) AS distance
        FROM palettes p
        CROSS JOIN LATERAL unnest(p.colors) AS c(hex)
        CROSS JOIN input_color ic
      )
      SELECT
        images.*,
        MIN(cd.distance) AS min_distance
      FROM color_distances cd
      JOIN images ON images.id = cd.id
      GROUP BY images.id
      ORDER BY min_distance ASC
      LIMIT 5
    `;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la recherche par couleur" });
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
router.post("/images", async (req, res) => {
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

export default router;
