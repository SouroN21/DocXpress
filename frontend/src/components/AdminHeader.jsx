import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isAdmin = false;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      isAdmin = decodedToken.role === 'admin';
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: "Home", path: "/admin-dashboard" },
    { name: "About", path: "/about" },
    { name: "Logout", path: "/login", onClick: handleLogout },
  ];

  if (!token || !isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 text-white bg-blue-700 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Doc<span className="text-red-500">X</span>press
        </Link>
        <nav className="items-center hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={item.onClick || null}
              className="px-3 py-1 text-base font-medium transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-800 active:bg-blue-900"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <nav
        className={`md:hidden bg-blue-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={item.onClick || (() => setIsMenuOpen(false))}
              className="px-3 py-2 text-base font-medium text-white transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-900 active:bg-blue-950"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;