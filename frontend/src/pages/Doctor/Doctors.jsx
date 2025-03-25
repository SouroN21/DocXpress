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
{/* Doctors List */}
{/* Doctors List */}
{!loading && !error && (
  <div className="mt-8">
    {filteredDoctors.length === 0 ? (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {searchTerm ? 'No matching doctors found' : 'No doctors available'}
        </h3>
        <p className="mt-1 text-gray-500">
          {searchTerm ? 'Try adjusting your search criteria' : 'Please check back later'}
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="flex flex-col w-full max-w-xs mx-auto overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-100"
          >
            <div className="relative pt-[75%] bg-gray-100">
              <img
                src={doctor.image || '/doctor-placeholder.svg'}
                alt={`Dr. ${doctor.userId?.lastName || 'Doctor'}`}
                className="absolute top-0 left-0 object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = '/doctor-placeholder.svg';
                }}
              />
              {doctor.consultationFee && (
                <div className="absolute bottom-0 right-0 px-3 py-1 m-2 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm">
                  ${doctor.consultationFee}
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-1 p-5">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {doctor.userId?.firstName || 'N/A'} {doctor.userId?.lastName || 'N/A'}
                </h3>
                {doctor.specialization && (
                  <p className="mt-1 text-sm font-medium text-blue-600">
                    {doctor.specialization}
                  </p>
                )}
                
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  {doctor.availability?.length > 0 && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {doctor.availability.length} day{doctor.availability.length !== 1 ? 's' : ''}/week
                      </span>
                    </div>
                  )}
                  
                  {doctor.clinicAddress && (
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-4 h-4 mt-0.5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-2">{doctor.clinicAddress}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => navigate(`/doctor/${doctor._id}`)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Details
                </button>
                <button
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                  className="flex items-center justify-center px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book
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