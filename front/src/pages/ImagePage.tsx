import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Image = {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  dominant_colors: string[];
};

type Palette = {
  id: number;
  image_id: number;
  colors: string[];
};

const ImagePage = () => {
  const { id } = useParams();
  const [image, setImage] = useState<Image | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4242/api/images/${id}`);
        const data = await response.json();
        setImage(data.image);
        setPalette(data.palette[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImageDetails();
  }, [id]);

  const handleAddFavorite = async () => {
    try {
      await fetch("http://localhost:4242/api/favoris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: id }),
      });
      alert("Image ajoutée aux favoris !");
    } catch (error) {
      console.error(error);
    }
  };

  if (!image) return <p className="p-10 text-gray-400">Chargement...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenu principal */}
      <main className="flex-1 flex flex-col md:flex-row items-start gap-10 px-6 md:px-16 py-12">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={image.url}
            alt={image.title}
            className="w-full rounded-3xl object-cover"
          />
        </div>

        {/* Infos */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h1 className="font-bold text-5xl uppercase tracking-tight">
            {image.title}
          </h1>
          <p className="font-semibold text-xl text-gray-800">
            {image.description}
          </p>
          <p className="text-gray-400 font-light text-sm">{image.source}</p>

          {/* Palette */}
          {palette && (
            <div className="flex flex-wrap gap-3 mt-4">
              {palette.colors.map((color, index) => (
                <div
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`rounded-2xl ${
                    index < 2
                      ? "w-36 h-20 md:w-48 md:h-24"
                      : "w-24 h-20 md:w-32 md:h-24"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Bouton favoris */}
          <button
            onClick={handleAddFavorite}
            className="mt-6 w-fit bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
          >
            ♡ Ajouter aux favoris
          </button>
        </div>
      </main>
    </div>
  );
};

export default ImagePage;
