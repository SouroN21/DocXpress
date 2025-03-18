import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let isDoctor = false;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      isDoctor = decodedToken.role === 'doctor';
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  if (!isDoctor) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Doctor Dashboard</h1>
      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={() => navigate('/adddoctor')}
          className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Add/Edit Profile
        </button>
        <p className="text-center text-gray-600">More features coming soon!</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;