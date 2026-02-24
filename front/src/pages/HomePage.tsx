import { useState } from "react";
import ImageGrid from "../components/ImageGrid";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 md:px-16 py-12">
        <div className="flex justify-center mb-10">
          <div className="w-full md:w-96">
            <SearchBar onSearch={(results) => setSearchResults(results)} />
          </div>
        </div>
        <ImageGrid images={searchResults} />
      </main>
      <footer className="bg-yellow-50">
        <p className="font-bold text-center py-6">Made with 💛 by Océane</p>
      </footer>
    </div>
  );
}
