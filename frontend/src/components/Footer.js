import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 mt-8 text-white bg-blue-500">
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-4 space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/appointments" className="hover:text-gray-300">Appointments</Link>
          <Link to="/doctors" className="hover:text-gray-300">Doctors</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </div>

        <p className="text-sm">© 2025 MedBook. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
