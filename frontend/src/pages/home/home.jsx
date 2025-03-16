// src/Home.jsx
import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <header className="text-center p-5 bg-blue-500 w-full">
        <h1 className="text-4xl font-bold text-white">Welcome to Our Website</h1>
        <p className="text-lg text-white mt-2">We are happy to have you here</p>
      </header>

      <main className="flex flex-col justify-center items-center p-10">
        <h2 className="text-2xl font-semibold mb-5">About Us</h2>
        <p className="text-center max-w-3xl text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula, libero vel suscipit
          dignissim, libero ipsum sodales odio, euismod tincidunt augue eros sit amet est. Nullam convallis
          eu risus eu scelerisque.
        </p>
        
        <div className="mt-8 space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
            Learn More
          </button>
          <button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
            Contact Us
          </button>
        </div>
      </main>

      <footer className="w-full text-center bg-blue-500 p-3 text-white mt-auto">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
