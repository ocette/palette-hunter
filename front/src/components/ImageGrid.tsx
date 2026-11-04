import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

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

function ImageGrid({ images: searchResults }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (searchResults) {
      setImages(searchResults);
      return;
    }

    const controller = new AbortController();
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/images`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setImages(data);
      } catch (error) {
        if ((error as Error).name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();

    // Annule la requête si le composant est démonté (navigation rapide)
    return () => controller.abort();
  }, [searchResults]);

  const handleAddFavorite = async (e: React.MouseEvent, id: number) => {
    // Empêche de naviguer vers la page détail quand on clique sur le coeur
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/favoris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_id: id }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      // Feedback inline au lieu de alert(), plus accessible et non bloquant
      setFavorites((prev) => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Squelettes de chargement */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-full aspect-3/4 rounded-2xl bg-gray-200 animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <article
          key={image.id}
          onClick={() => navigate(`/images/${image.id}`)}
          onKeyDown={(e) => {
            // Navigation clavier : Entrée ou Espace ouvrent l'image
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/images/${image.id}`);
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`Voir la palette de ${image.title}`}
          className="relative group cursor-pointer rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-purple-600"
        >
          <img
            src={image.url}
            alt={image.title}
            // Lazy loading : seules les images visibles sont chargées
            loading={index < 4 ? "eager" : "lazy"}
            // Décode l'image hors du thread principal
            decoding="async"
            className="w-full aspect-3/4 object-cover rounded-2xl md:group-hover:brightness-90 transition"
          />

          {/* Icône coeur */}
          <button
            onClick={(e) => handleAddFavorite(e, image.id)}
            aria-label={`Ajouter ${image.title} aux favoris`}
            className="absolute top-2 right-2 bg-white text-gray-700 text-s px-3 py-1 rounded-full opacity-0 md:group-hover:opacity-100 md:hover:bg-purple-50 md:hover:text-purple-600 focus:opacity-100"
          >
            {favorites[image.id] ? "✓ Ajouté" : "♡ Ajouter aux favoris"}
          </button>
        </article>
      ))}
    </div>
  );
}

export default ImageGrid;
