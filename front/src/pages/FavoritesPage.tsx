import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Image = {
  id: number;
  title: string;
  url: string;
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Image[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:4242/api/favoris");
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
      await fetch(`http://localhost:4242/api/favoris/${id}`, {
        method: "DELETE",
      });
      // On met à jour l'affichage en retirant l'image supprimée
      setFavorites(favorites.filter((image) => image.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Mes favoris</h1>
      {favorites.length === 0 && <p>Aucun favori pour le moment</p>}
      <div>
        {favorites.map((image) => (
          <div key={image.id}>
            <img
              src={image.url}
              alt={image.title}
              onClick={() => navigate(`/images/${image.id}`)}
            />
            <p>{image.title}</p>
            <button onClick={() => handleDelete(image.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
