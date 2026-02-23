import { useEffect, useState } from "react";

type Props = {
  onSearch: (results: any[]) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) {
      onSearch([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:4242/api/images/search?colors=${query}`,
        );
        const data = await response.json();
        onSearch(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="flex items-center gap-2 bg-white border border-olive-200 rounded-full px-4 py-2 shadow-sm focus-within:border-olive-400 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-olive-700"
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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une couleur"
        className="flex-1 outline-none text-olive-700 placeholder-olive-400 bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
