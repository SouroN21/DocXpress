// HomePage.js
import React from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">Welcome to Our Medical Appointment System</h1>
        <p className="mb-6 text-lg text-gray-700">Book your doctor appointments with ease and manage your health conveniently.</p>
        <button onClick={() => navigate('/doctors')} className="px-6 py-3 text-lg text-white transition bg-blue-500 shadow-md rounded-xl hover:bg-blue-600">Book an Appointment</button>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 mt-10 md:grid-cols-3">
        <div className="p-6 text-center bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-xl font-semibold text-gray-800">Experienced Doctors</h2><p className="text-gray-600">Consult with top professionals in the industry.</p></div>
        <div className="p-6 text-center bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-xl font-semibold text-gray-800">Online Consultations</h2><p className="text-gray-600">Get medical advice from the comfort of your home.</p></div>
        <div className="p-6 text-center bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-xl font-semibold text-gray-800">Easy Appointment Scheduling</h2><p className="text-gray-600">Book, manage, and cancel appointments effortlessly.</p></div>
      </div>
    </div>
  );
};

export default HomePage;