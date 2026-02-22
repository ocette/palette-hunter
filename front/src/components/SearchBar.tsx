import { useState } from "react";

// type props
type SearchBarProps = {
  onSearch: (result: any[]) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:4242/api/images/search?colors=${query}`,
      );
      const data = await response.json();
      onSearch(data);
      console.log(data);
    } catch (error) {
      console.log(error, "erreur lors du chargement des données");
    }
  };
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher une couleur"
      />
      <button onClick={handleSearch}>Rechercher</button>
    </div>
  );
};
export default SearchBar;
