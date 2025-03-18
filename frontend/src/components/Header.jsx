import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');
  let userRole = '';
  if (isAuthenticated) {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userRole = decodedToken.role;
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Appointments", path: "/appointments" },
    { name: "Doctors", path: "/doctors" },
    ...(userRole === 'doctor' ? [{ name: "Add Profile", path: "/adddoctor" }] : []),
    { name: "About", path: "/about" },
    ...(isAuthenticated
      ? [{ name: "Logout", path: "/login", onClick: handleLogout }]
      : [{ name: "Login", path: "/login" }]),
  ];

  return (
    <header className="p-4 text-white bg-blue-500">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="text-2xl font-bold">
          Doc<span className="text-red-500">X</span>press
        </Link>
        <nav className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={item.onClick || null}
              className="hover:text-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="md:hidden" onClick={toggleMenu}>
          <button className="text-white focus:outline-none">
            {isMenuOpen ? "X" : "≡"}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="flex flex-col p-4 space-y-4 bg-blue-600 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={item.onClick || (() => setIsMenuOpen(false))}
              className="text-white hover:text-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;