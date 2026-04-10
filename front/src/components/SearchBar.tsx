import { useEffect, useRef, useState } from "react";
import { API_URL } from "../config";

type Props = {
  onSearch: (results: any[] | null) => void;
};

function SearchBar({ onSearch }: Props) {
  const [colors, setColors] = useState<(string | null)[]>([null, null, null]);
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const colorRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Récupère les tags au chargement
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/images/tags`);
        const data = await response.json();
        setTags(data.map((t: { tag: string }) => t.tag));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  // Recherche par couleur
  useEffect(() => {
    const activeColors = colors.filter(Boolean) as string[];
    if (activeColors.length === 0) return;

    const fetchByColors = async () => {
      try {
        const response = await fetch(
          `${API_URL}/images/color?hex=${encodeURIComponent(activeColors.join(","))}`,
        );
        const data = await response.json();
        onSearch(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchByColors();
  }, [colors]);

  // Recherche par tag
  const handleTagClick = async (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
      onSearch(null);
      return;
    }

    setActiveTag(tag);
    try {
      const response = await fetch(`${API_URL}/images/tag/${tag}`);
      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const handleReset = () => {
    setColors([null, null, null]);
    setIsOpen(false);
    setActiveTag(null);
    onSearch(null);
  };

  const handleOpen = () => {
    setIsOpen(true);
    colorRefs[0].current?.click();
  };

  const hasColors = colors.some(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:border-gray-400 transition">
        {/* Inputs color cachés */}
        {colorRefs.map((ref, index) => (
          <input
            key={index}
            ref={ref}
            type="color"
            value={colors[index] ?? "#ffffff"}
            onChange={(e) => handleColorChange(index, e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
          />
        ))}

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
        {!isOpen && !hasColors && (
          <span
            className="flex-1 items-center text-gray-300 text-sm cursor-pointer"
            onClick={handleOpen}
          >
            Rechercher par couleur
          </span>
        )}

        {/* Cercles de couleurs */}
        {isOpen && (
          <div className="flex items-center gap-2 flex-1">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => colorRefs[index].current?.click()}
                className="flex items-center gap-1"
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-200 transition hover:scale-110"
                  style={{ backgroundColor: color ?? "#f3f4f6" }}
                />
                {color && (
                  <span className="text-gray-400 text-xs hidden md:block">
                    {color}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Croix pour reset */}
        {hasColors && (
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 justify-start md:justify-center">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium transition capitalize ${
              activeTag === tag
                ? "bg-yellow-200 border border-yellow-200 text-gray-900"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {tag}
            {activeTag === tag && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTag(null);
                  onSearch(null);
                }}
                className="ml-1 flex items-center hover:opacity-70 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
