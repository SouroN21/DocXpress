import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      className="py-8 mt-16 text-white bg-blue-600"
    >
      <div className="container px-4 mx-auto">
        {/* Top Links */}
        <motion.div 
          className="grid grid-cols-1 gap-8 mb-6 text-center md:grid-cols-3 md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* About */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="mb-3 text-lg font-semibold">About Us</h3>
            <p className="text-sm">
              DocXpress is your trusted healthcare partner, connecting patients and doctors with ease.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['/', '/doctors', '/appointments', '/about', '/contact'].map((path, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link to={path} className="hover:underline">
                    {path === '/' ? 'Home' : path.replace('/', '')}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <h3 className="mb-3 text-lg font-semibold">Contact</h3>
            <p className="text-sm">Email: support@docxpress.com</p>
            <p className="text-sm">Phone: +94 71 234 5678</p>
            <p className="text-sm">Location: Colombo, Sri Lanka</p>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="pt-4 text-sm text-center border-t border-blue-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          © 2025 <span className="font-semibold">Doc<span className="text-red-400">X</span>press</span>. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
