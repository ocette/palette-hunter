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
    <nav className="bg-yellow-50 sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-black tracking-tight text-gray-900 flex items-center gap-2"
          >
            🎨 <span>Palette Hunter</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-full text-s font-semibold transition-all ${
                  location.pathname === link.to
                    ? "bg-yellow-200 text-gray-900"
                    : "text-gray-600 md:hover:bg-yellow-100 md:hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile bouton menu */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-900 md:hover:bg-yellow-100 transition"
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            {toggleMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={`fixed top-16 left-0 w-full bg-yellow-50 lg:hidden overflow-hidden transition-all duration-300 ${
          toggleMenu ? "h-auto opacity-100 py-4" : "h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setToggleMenu(false)}
              className={`px-4 py-2 rounded-lg text-s font-semibold transition-all ${
                location.pathname === link.to
                  ? "bg-yellow-200 text-gray-900"
                  : "text-gray-600 md:hover:bg-yellow-100 md:hover:text-gray-900"
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
