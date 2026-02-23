import { useState } from "react";
import ImageGrid from "../components/ImageGrid";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const handleSearch = (results: any[]) => {
    if (results.length === 0) {
      setSearchResults(null);
    } else {
      setSearchResults(results);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 md:px-16 py-12">
        {/* Barre de recherche centrée */}
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-96">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Message si aucun résultat */}
        {searchResults !== null && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 mt-24 text-gray-400">
            <p className="text-lg">Aucune image trouvée pour cette couleur</p>
            <p className="text-sm">Essaie avec Rouge, Bleu, Vert...</p>
          </div>
        )}

        {/* Grille d'images */}
        <ImageGrid images={searchResults} />
      </main>
    </div>
  );
}
