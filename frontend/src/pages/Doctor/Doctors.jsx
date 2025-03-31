import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-6xl px-6 mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-cyan-700 md:text-4xl">Find the Right Doctor for You</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">Search our network of experienced doctors by name or specialization.</p>
        </motion.div>

        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-5 py-3 text-gray-700 transition-all bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </motion.div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <span className="ml-3 text-lg text-gray-700">Searching for doctors...</span>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-4 mb-6 text-red-700 bg-red-100 border border-red-500 rounded-md shadow-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <motion.div key={doctor._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-col w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-md">
                <div className="relative bg-gray-100 aspect-w-4 aspect-h-3">
                  <img
                    src={doctor.image || '/doctor-placeholder.svg'}
                    alt={`Dr. ${doctor.userId?.lastName || 'Doctor'}`}
                    className="object-cover w-full h-full rounded-t-lg"
                    onError={(e) => {
                      e.target.src = '/doctor-placeholder.svg';
                    }}
                  />
                </div>

                <div className="flex flex-col flex-1 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">Dr. {doctor.userId?.firstName || 'N/A'} {doctor.userId?.lastName || 'N/A'}</h3>
                  {doctor.specialization && <p className="mt-1 text-sm font-medium text-cyan-500">{doctor.specialization}</p>}
                  <div className="mt-4 space-x-2">
                    <button onClick={() => navigate(`/doctor/${doctor._id}`)} className="px-4 py-2 text-sm font-medium border rounded-md text-cyan-700 bg-cyan-100 border-cyan-200 hover:bg-cyan-200">Details</button>
                    <button onClick={() => navigate(`/book-appointment/${doctor._id}`)} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Book Now</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Doctors;