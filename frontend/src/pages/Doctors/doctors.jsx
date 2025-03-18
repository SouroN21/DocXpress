import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all doctor IDs on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(err.response?.data?.message || 'Failed to load doctors. Please try again.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div className="container max-w-md px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Doctors</h1>

      {loading && (
        <p className="text-center text-gray-500">Loading doctors...</p>
      )}

      {error && (
        <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>
      )}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-center text-gray-500">No doctors found.</p>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Doctor IDs</h2>
          <ul className="list-disc list-inside">
            {doctors.map((doctor) => (
              <li key={doctor._id} className="text-gray-600">
                {doctor._id}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Doctors;