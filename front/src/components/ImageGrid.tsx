import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Image = {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  dominant_colors: string[];
};

type Props = {
  images: Image[] | null;
};

const ImageGrid = ({ images: searchResults }: Props) => {
  const [images, setImages] = useState<Image[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResults) {
      setImages(searchResults);
    } else {
      const fetchImages = async () => {
        try {
          const response = await fetch("http://localhost:4242/api/images");
          const data = await response.json();
          setImages(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchImages();
    }
  }, [searchResults]);

  const handleAddFavorite = async (e: React.MouseEvent, id: number) => {
    // Empêche de naviguer vers la page détail quand on clique sur le coeur
    e.stopPropagation();
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer"
          onClick={() => navigate(`/images/${image.id}`)}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full aspect-3/4 object-cover rounded-2xl group-hover:brightness-90 transition"
          />

          {/* Icône coeur */}
          <button
            onClick={(e) => handleAddFavorite(e, image.id)}
            className="absolute top-2 right-2 bg-white text-gray-700 text-s px-3 py-1 rounded-full opacity-0 group-hover:opacity-100  hover:bg-purple-50 hover:text-purple-500"
          >
            ♡ Ajouter aux favoris
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
