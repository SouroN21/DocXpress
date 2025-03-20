import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 text-white bg-blue-500 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Doc<span className="text-red-500">X</span>press
        </Link>

        <nav className="items-center hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-3 py-1 text-base font-medium transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-600 active:bg-blue-700"
            >
              {item.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-base font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </nav>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        className={`md:hidden bg-blue-600 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-white transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-700 active:bg-blue-800"
            >
              {item.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 text-base font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 text-base font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
