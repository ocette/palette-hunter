import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddImagePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [dominantColors, setDominantColors] = useState("");

  const handleSubmit = async () => {
    try {
      await fetch("http://localhost:4242/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          url,
          source,
          dominant_colors: dominantColors
            .split(",")
            .map(
              (color) =>
                color.trim().charAt(0).toUpperCase() +
                color.trim().slice(1).toLowerCase(),
            ),
        }),
      });
      alert("Image ajoutée avec succès !");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Ajouter une image</h1>

      <div>
        <label>Titre *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Pagode"
        />
      </div>

      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Pagode entourée de cerisiers en fleurs"
        />
      </div>

      <div>
        <label>URL *</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ex: https://monimage.com/photo.jpg"
        />
      </div>

      <div>
        <label>Source *</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Ex: Unsplash"
        />
      </div>

      <div>
        <label>Couleurs dominantes *</label>
        <input
          type="text"
          value={dominantColors}
          onChange={(e) => setDominantColors(e.target.value)}
          placeholder="Ex: Rouge, Bleu, Vert"
        />
        <p>Sépare les couleurs par des virgules</p>
      </div>

      <button onClick={handleSubmit}>Ajouter l'image</button>
    </div>
  );
};

export default AddImagePage;
