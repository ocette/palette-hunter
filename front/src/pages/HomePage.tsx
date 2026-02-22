import { useState } from "react";
import ImageGrid from "../components/ImageGrid";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  return (
    <>
      <div>
        <SearchBar onSearch={setSearchResults} />
        <ImageGrid images={searchResults} />
      </div>
    </>
  );
}
