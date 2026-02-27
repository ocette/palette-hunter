import { useEffect, useRef, useState } from "react";

type Props = {
  onSearch: (results: any[] | null) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [hexColor, setHexColor] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hexColor) return;

    const fetchByColor = async () => {
      try {
        const response = await fetch(
          `http://localhost:4242/images/color?hex=${encodeURIComponent(hexColor)}`,
        );
        const data = await response.json();
        onSearch(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchByColor();
  }, [hexColor]);

  const handleReset = () => {
    setHexColor(null);
    setIsOpen(false);
    onSearch(null);
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Ouvre le color picker natif au clic sur la loupe
    colorInputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:border-gray-400 transition">
      {/* Input color caché */}
      <input
        ref={colorInputRef}
        type="color"
        value={hexColor ?? "#ffffff"}
        onChange={(e) => setHexColor(e.target.value)}
        className="w-0 h-0 opacity-0 absolute"
      />

      {/* Loupe cliquable */}
      <button onClick={handleOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400 hover:text-gray-600 transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </button>

      {/* Placeholder */}
      {!hexColor && (
        <span
          className="flex-1 text-gray-300 text-sm cursor-pointer"
          onClick={handleOpen}
        >
          Rechercher par couleur
        </span>
      )}

      {/* Couleur choisie */}
      {hexColor && (
        <div className="flex items-center gap-2 flex-1">
          <div
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: hexColor }}
          />
          <span className="text-gray-500 text-sm">{hexColor}</span>
        </div>
      )}

      {/* Croix pour reset */}
      {hexColor && (
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
