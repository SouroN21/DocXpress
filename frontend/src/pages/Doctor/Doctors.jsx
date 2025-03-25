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
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-blue-700 md:text-4xl">
            Find the Right Doctor for You
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Search our network of experienced doctors by name or specialization.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-5 py-3 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <svg
              className="w-8 h-8 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="ml-3 text-lg text-gray-700">Searching for doctors...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-500 rounded-md shadow-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Doctors List */}
        {!loading && !error && (
          <div className="mt-8">
            {filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {searchTerm ? 'No matching doctors found' : 'No doctors available at the moment'}
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Please try a different search term or check the spelling.' : 'We are working to add more doctors soon. Please check back later.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex flex-col w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl"
                  >
                    <div className="relative bg-gray-100 aspect-w-4 aspect-h-3">
                      <img
                        src={doctor.image || '/doctor-placeholder.svg'}
                        alt={`Dr. ${doctor.userId?.lastName || 'Doctor'}`}
                        className="object-cover w-full h-full rounded-t-lg"
                        onError={(e) => {
                          e.target.src = '/doctor-placeholder.svg';
                        }}
                      />
                      {doctor.consultationFee && (
                        <div className="absolute bottom-0 right-0 px-3 py-1 m-2 text-sm font-semibold text-white bg-green-500 rounded-full shadow-sm">
                          ${doctor.consultationFee}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        Dr. {doctor.userId?.firstName || 'N/A'} {doctor.userId?.lastName || 'N/A'}
                      </h3>
                      {doctor.specialization && (
                        <p className="mt-1 text-sm font-medium text-blue-500">
                          {doctor.specialization}
                        </p>
                      )}

                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        {doctor.availability?.length > 0 && (
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Available {doctor.availability.length} day{doctor.availability.length !== 1 ? 's' : ''} a week</span>
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

                      <div className="mt-4 space-x-2">
                        <button
                          onClick={() => navigate(`/doctor/${doctor._id}`)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Details
                        </button>
                        <button
                          onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
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