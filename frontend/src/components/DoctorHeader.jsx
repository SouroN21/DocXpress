import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isDoctor = false;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      isDoctor = decodedToken.role === 'doctor';
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
    { name: "Home", path: "/doctor-dashboard" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  if (!token || !isDoctor) {
    navigate('/login');
    return null;
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 text-white bg-blue-600 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Doc<span className="text-red-500">X</span>press
        </Link>
        <nav className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-3 py-1 text-base font-medium transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-700 active:bg-blue-800"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white transition-all bg-red-600 rounded-md shadow hover:bg-red-700 active:bg-red-800"
          >
            Logout
          </button>
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
        className={`md:hidden bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-white transition-colors duration-200 rounded-md hover:text-gray-200 hover:bg-blue-800 active:bg-blue-900"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 font-medium text-white transition-all bg-red-600 rounded-md shadow hover:bg-red-700 active:bg-red-800"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default DoctorHeader;