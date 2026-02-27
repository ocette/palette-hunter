import { useState } from "react";
import ImageGrid from "../components/ImageGrid";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 md:px-16 py-12">
        <h1 className="font-extrabold text-4xl tracking-tight mb-10 text-center">
          Bienvenue sur Palette Hunter
        </h1>
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-136">
            <SearchBar onSearch={(results) => setSearchResults(results)} />
          </div>
        </div>
        <ImageGrid images={searchResults} />
      </main>
      <Footer />
    </div>
  );
}
