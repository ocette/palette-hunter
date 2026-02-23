import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ImagePage from "./pages/ImagePage";
import FavoritesPage from "./pages/FavoritesPage";
import AddImagePage from "./pages/AddImagePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/images/:id" element={<ImagePage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/ajouter" element={<AddImagePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
