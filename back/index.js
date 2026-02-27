import "dotenv/config";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import imagesRouter from "./routes/images.js";
import palettesRouter from "./routes/palettes.js";
import favorisRouter from "./routes/favoris.js";

const app = express();
const PORT = process.env.PORT || 4242;
const sql = neon(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

app.use("/images", imagesRouter);
app.use("/palettes", palettesRouter);
app.use("/favoris", favorisRouter);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
