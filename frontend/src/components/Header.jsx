import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full p-4 text-white bg-blue-600 shadow-lg">
      <div className="container flex items-center justify-between mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Doc<span className="text-red-500">X</span>press
          </Link>
        </motion.div>

        <nav className="items-center hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.path}
                className="px-4 py-2 text-base font-medium transition-all duration-300 rounded-md hover:bg-blue-700"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          {isAuthenticated ? (
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Logout
            </motion.button>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Login
              </Link>
            </motion.div>
          )}
        </nav>

        <motion.button
          onClick={toggleMenu}
          className="text-2xl text-white md:hidden focus:outline-none"
          whileTap={{ scale: 0.8 }}
        >
          {isMenuOpen ? "✕" : "☰"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-700 md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2 text-white transition-all duration-300 rounded-md hover:bg-blue-800"
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
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;