import { Router } from "express";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const router = Router();

// Route pour ajouter une palette
router.post("/", async (req, res) => {
  const { image_id, colors } = req.body;
  if (!image_id || !colors) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }
  try {
    const response = await sql`
      INSERT INTO palettes (image_id, colors)
      VALUES (${image_id}, ${colors})
      RETURNING *
    `;
    res.status(201).json(response[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'ajout de la palette" });
  }
});

export default router;
