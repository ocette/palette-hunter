import { Router } from "express";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const router = Router();

// Route pour récupérer tous les favoris
router.get("/", async (_, res) => {
  try {
    const response = await sql`
      SELECT images.*, favoris.id AS favori_id FROM images
      JOIN favoris ON images.id = favoris.image_id
    `;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de la récupération des favoris" });
  }
});

// Route pour ajouter une image aux favoris
router.post("/", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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

export default router;
