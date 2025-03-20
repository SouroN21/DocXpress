import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-8 mt-16 text-white bg-blue-600">
      <div className="container px-4 mx-auto">
        {/* Top Links */}
        <div className="grid grid-cols-1 gap-8 mb-6 text-center md:grid-cols-3 md:text-left">
          {/* About */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">About Us</h3>
            <p className="text-sm">
              DocXpress is your trusted healthcare partner, connecting patients and doctors with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/doctors" className="hover:underline">Find Doctors</Link></li>
              <li><Link to="/appointments" className="hover:underline">Appointments</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Contact</h3>
            <p className="text-sm">Email: support@docxpress.com</p>
            <p className="text-sm">Phone: +94 71 234 5678</p>
            <p className="text-sm">Location: Colombo, Sri Lanka</p>
          </div>
        </div>

        {/* Divider */}
        <div className="pt-4 text-sm text-center border-t border-blue-400">
          © 2025 <span className="font-semibold">Doc<span className="text-red-400">X</span>press</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
