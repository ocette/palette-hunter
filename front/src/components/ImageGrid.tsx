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

type ImageProps = {
  images: Image[] | null;
};

const ImageGrid = ({ images: searchResults }: ImageProps) => {
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

  return (
    <div>
      {images.map((image) => (
        <div key={image.id} onClick={() => navigate(`/images/${image.id}`)}>
          <img src={image.url} alt={image.title} />
          <p>{image.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
