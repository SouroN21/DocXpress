import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doc/');
        setDoctors(response.data);
        setFilteredDoctors(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctors.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = doctors.filter(
      (doctor) =>
        doctor.specialization.toLowerCase().includes(term) ||
        `${doctor.userId.firstName} ${doctor.userId.lastName}`.toLowerCase().includes(term)
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Our Doctors</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by specialization or name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 mx-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading && (
        <p className="text-center text-gray-500">
          <svg className="inline-block w-6 h-6 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading doctors...
        </p>
      )}
      {error && <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>}
      {!loading && !error && filteredDoctors.length === 0 && (
        <p className="text-center text-gray-500">
          {searchTerm ? 'No doctors match your search.' : 'No doctors available at this time.'}
        </p>
      )}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="p-6 transition-shadow bg-white rounded-lg shadow-lg hover:shadow-xl"
            >
              <img
                src={doctor.image || 'https://via.placeholder.com/150?text=Doctor+Image'}
                alt={`Dr. ${doctor.userId.lastName}`}
                className="object-cover w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h2 className="text-xl font-semibold text-center text-gray-800">
                Dr. {doctor.userId.firstName} {doctor.userId.lastName}
              </h2>
              <p className="mt-2 text-gray-600">
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
              <p className="mt-1 text-gray-600">
                <strong>Consultation Fee:</strong> ${doctor.consultationFee}
              </p>
              <p className="mt-1 text-gray-600">
                <strong>Availability:</strong>{' '}
                {doctor.availability
                  .map((slot) => `${slot.day}: ${slot.startTime} - ${slot.endTime}`)
                  .join(', ')}
              </p>
              {doctor.clinicAddress && (
                <p className="mt-1 text-gray-600">
                  <strong>Clinic Address:</strong> {doctor.clinicAddress}
                </p>
              )}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/doctor/${doctor._id}`)}
                  className="w-full py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  View Details
                </button>
                <button
                  onClick={() => alert(`Booking with Dr. ${doctor.userId.lastName} coming soon!`)}
                  className="w-full py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;