import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function AddImagePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [dominantColors, setDominantColors] = useState("");
  const [tags, setTags] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [paletteColors, setPaletteColors] = useState("");

  const handleSubmit = async () => {
    try {
      const imageResponse = await fetch("http://localhost:4242/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          url,
          source,
          tag: tags === "autre" ? customTag : tags,
          dominant_colors: dominantColors
            .split(",")
            .map(
              (color) =>
                color.trim().charAt(0).toUpperCase() +
                color.trim().slice(1).toLowerCase(),
            ),
        }),
      });
      const newImage = await imageResponse.json();

      await fetch("http://localhost:4242/palettes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_id: newImage.id,
          colors: paletteColors.split(",").map((c) => c.trim()),
        }),
      });
      alert("Image ajoutée avec succès !");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center px-6 md:px-16 py-12">
        <h1 className="font-extrabold text-4xl tracking-tight self-center mb-10">
          Ajouter une image
        </h1>

        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Titre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pagode"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Pagode entourée de cerisiers en fleurs"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: https://monimage.com/photo.jpg"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Source <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Ex: Unsplash"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Tag <span className="text-red-400">*</span>
            </label>
            <select
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 outline-none focus:border-gray-400 transition appearance-none"
            >
              <option value="">Sélectionner un tag</option>
              <option value="nature">Nature</option>
              <option value="urbain">Urbain</option>
              <option value="architecture">Architecture</option>
              <option value="abstrait">Abstrait</option>
              <option value="culture">Culture</option>
              <option value="art">Art</option>
              <option value="autre">Autre</option>
            </select>

            {/* Champ texte qui apparaît uniquement si "Autre" est sélectionné */}
            {tags === "autre" && (
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Écris ton tag..."
                className="mt-2 border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
              />
            )}
          </div>

          {/* Couleurs dominantes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Couleurs dominantes <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={dominantColors}
              onChange={(e) => setDominantColors(e.target.value)}
              placeholder="Ex: Rouge, Bleu, Vert"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              Sépare les couleurs par des virgules
            </p>
          </div>

          {/* Palette de couleurs */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Palette de couleurs <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={paletteColors}
              onChange={(e) => setPaletteColors(e.target.value)}
              placeholder="Ex: #C9BECC, #82CCEC, #BA3303, #F0A644, #1D0F04"
              className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 placeholder-gray-300 outline-none focus:border-gray-400 transition"
            />
            <p className="text-xs text-gray-400 mt-1">
              5 codes hexadécimaux séparés par des virgules
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={handleSubmit}
            className=" cursor-pointer mt-4 w-fit bg-yellow-200 border border-yellow-200 text-gray-900 px-6 py-3 rounded-full font-bold md:hover:bg-yellow-100 transition"
          >
            Ajouter l'image
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AddImagePage;
