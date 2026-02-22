import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav>
      <h1 onClick={() => navigate("/")}>Palette Hunter</h1>
      <div>
        <button onClick={() => navigate("/")}>Accueil</button>
        <button onClick={() => navigate("/favoris")}>Mes favoris</button>
        <button onClick={() => navigate("/ajouter")}>Ajouter une image</button>
      </div>
    </nav>
  );
};

export default Navbar;
