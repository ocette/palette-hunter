import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

type Image = {
  id: number;
  favori_id: number;
  title: string;
  url: string;
};

function FavoritesPage() {
  const [favorites, setFavorites] = useState<Image[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:4242/favoris");
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:4242/favoris/${id}`, {
        method: "DELETE",
      });
      alert("Image suprrimée des favoris !");
      setFavorites(favorites.filter((image) => image.favori_id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 md:px-16 py-12">
        <h1 className="font-extrabold text-4xl tracking-tight mb-10 text-center">
          Mes favoris
        </h1>

        {/* Aucun favori */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 mt-24 text-gray-400">
            <p className="text-lg">Aucun favori pour le moment</p>
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer  bg-yellow-200 border border-yellow-200 text-gray-900 px-6 py-2 rounded-full text-m font-bold md:hover:bg-yellow-100 transition"
            >
              Découvrir des images
            </button>
          </div>
        )}

        {/* Grille de favoris */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((image) => (
            <div key={image.favori_id} className="flex flex-col gap-2">
              {/* Image cliquable */}
              <div className="relative group">
                <img
                  src={image.url}
                  alt={image.title}
                  onClick={() => navigate(`/images/${image.id}`)}
                  className="w-full aspect-square object-cover rounded-2xl cursor-pointer group-hover:brightness-90 transition"
                />

                {/* Bouton supprimer au survol */}
                <button
                  onClick={() => handleDelete(image.favori_id)}
                  className="absolute top-2 right-2 bg-white text-gray-700 text-s px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-400"
                >
                  ✕ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FavoritesPage;
