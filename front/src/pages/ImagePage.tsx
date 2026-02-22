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

  if (!image) return <p>Chargement...</p>;

  return (
    <div>
      <img src={image.url} alt={image.title} />
      <h1>{image.title}</h1>
      <p>{image.description}</p>
      <p>Source : {image.source}</p>

      {palette && (
        <div>
          <h2>Palette de couleurs</h2>
          <div>
            {palette.colors.map((color) => (
              <div
                key={color}
                style={{
                  backgroundColor: color,
                  width: "50px",
                  height: "50px",
                }}
              />
            ))}
          </div>
        </div>
      )}

      <button onClick={handleAddFavorite}>Ajouter aux favoris</button>
    </div>
  );
};

export default ImagePage;
