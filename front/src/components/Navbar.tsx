import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/favoris", label: "Mes favoris" },
    { to: "/ajouter", label: "Ajouter une image" },
  ];

  return (
    <nav className="bg-yellow-50 border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-black tracking-tight">
            🎨 Palette Hunter
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-l font-bold transition hover:text-black ${
                  location.pathname === link.to ? "text-black" : "text-gray-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile bouton menu */}
          <button
            className="lg:hidden text-xl font-black"
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            {toggleMenu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`fixed top-16 left-0 w-full bg-white lg:hidden overflow-hidden transition-all duration-300 ${
          toggleMenu ? "h-screen opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-6 pt-10 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setToggleMenu(false)}
              className={`text-2xl font-bold tracking-tight transition ${
                location.pathname === link.to ? "text-black" : "text-gray-500"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
