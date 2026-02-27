import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

type Image = {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  dominant_colors: string[];
  tag: string;
};

type Palette = {
  id: number;
  image_id: number;
  colors: string[];
};

function ImagePage() {
  const { id } = useParams();
  const [image, setImage] = useState<Image | null>(null);
  const [palette, setPalette] = useState<Palette | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4242/images/${id}`);
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
      await fetch("http://localhost:4242/favoris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: id }),
      });
      alert("Image ajoutée aux favoris !");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (!image) return <p className="p-10 text-gray-400">Chargement...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row items-start gap-10 px-6 md:px-16 py-12 max-w-7xl mx-auto w-full">
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
          <h1 className="font-black text-5xl tracking-tight">{image.title}</h1>
          <p className="text-gray-400 font-light text-sm">{image.source}</p>
          <p className="font-semibold text-xl text-gray-800">
            {image.description}
          </p>

          <p className=" bg-gray-100 text-gray-800 w-fit text-s font-semibold px-3 py-1 rounded-full">
            {image.tag}
          </p>

          {/* Palette */}
          {palette && (
            <div className="flex flex-wrap gap-3 mt-4">
              {/* Les 2 grands carrés (index 0 et 1) */}
              {palette.colors.slice(0, 2).map((color) => (
                <div
                  key={color}
                  onClick={() => handleCopy(color)}
                  style={{ backgroundColor: color }}
                  className="relative group rounded-2xl cursor-pointer transition md:hover:scale-105 w-36 h-20 md:w-40 md:h-24"
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-s font-medium opacity-0 md:group-hover:opacity-100 transition drop-shadow">
                    {copiedColor === color ? "Copié ✓" : color}
                  </span>
                </div>
              ))}

              {/* Les 3 petits carrés (index 2, 3 et 4) */}
              <div className="w-full flex flex-wrap gap-3">
                {palette.colors.slice(2).map((color) => (
                  <div
                    key={color}
                    onClick={() => handleCopy(color)}
                    style={{ backgroundColor: color }}
                    className="relative group rounded-2xl cursor-pointer transition md:hover:scale-105 w-24 h-20 md:w-26 md:h-24"
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-s font-medium opacity-0 md:group-hover:opacity-100 transition drop-shadow">
                      {copiedColor === color ? "Copié ✓" : color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton favoris */}
          <button
            onClick={handleAddFavorite}
            className="cursor-pointer mt-6 w-fit bg-yellow-200 border border-yellow-200 text-gray-900 px-6 py-3 rounded-full font-bold md:hover:bg-yellow-100  transition"
          >
            ♡ Ajouter aux favoris
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ImagePage;
