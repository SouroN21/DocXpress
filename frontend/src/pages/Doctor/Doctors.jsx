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
        (doctor.specialization?.toLowerCase() || '').includes(term) ||
        `${doctor.userId?.firstName || ''} ${doctor.userId?.lastName || ''}`.toLowerCase().includes(term)
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-6xl px-6 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-800 md:text-5xl">
            Meet Our Expert Doctors
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover top healthcare professionals ready to assist you with your medical needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-5 py-3 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-4 top-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="ml-3 text-lg text-gray-600">Loading doctors...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Doctors List */}
        {!loading && !error && (
          <div>
            {filteredDoctors.length === 0 ? (
              <p className="text-lg text-center text-gray-500">
                {searchTerm ? 'No doctors match your search.' : 'No doctors available at this time.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="overflow-hidden transition-all transform bg-white shadow-md rounded-xl hover:shadow-lg hover:-translate-y-1"
                  >
                    <img
                      src={doctor.image || 'https://via.placeholder.com/150?text=Doctor'}
                      alt={`Dr. ${doctor.userId?.lastName || 'Doctor'}`}
                      className="object-cover w-full h-48"
                    />
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Dr. {doctor.userId?.firstName || 'N/A'} {doctor.userId?.lastName || 'N/A'}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Specialization:</span> {doctor.specialization || 'N/A'}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium">Fee:</span> ${doctor.consultationFee || 'N/A'}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 truncate">
                        <span className="font-medium">Availability:</span>{' '}
                        {doctor.availability?.length > 0
                          ? doctor.availability.map((slot) => `${slot.day}: ${slot.startTime}-${slot.endTime}`).join(', ')
                          : 'Not specified'}
                      </p>
                      {doctor.clinicAddress && (
                        <p className="mt-1 text-sm text-gray-600 truncate">
                          <span className="font-medium">Clinic:</span> {doctor.clinicAddress}
                        </p>
                      )}
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => navigate(`/doctor/${doctor._id}`)}
                          className="w-full py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                          className="w-full py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;