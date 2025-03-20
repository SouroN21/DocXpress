import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/doc/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, token, navigate]);

  const handleBookAppointment = () => {
    if (!token) navigate('/login');
    else navigate(`/book-appointment/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading doctor details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-4xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h1 className="mb-8 text-3xl font-extrabold text-center text-gray-800 md:text-4xl">
            Doctor Profile
          </h1>
          {doctor && (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                <img
                  src={doctor.image || 'https://via.placeholder.com/150?text=Doctor'}
                  alt={`${doctor.userId.firstName} ${doctor.userId.lastName}`}
                  className="w-32 h-32 mb-4 rounded-full shadow-md md:w-40 md:h-40 md:mb-0"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                  </h2>
                  <p className="mt-1 text-lg text-blue-600">{doctor.specialization}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>License:</strong> {doctor.licenseNumber}
                  </p>
                  <button
                    onClick={handleBookAppointment}
                    className="w-full px-6 py-3 mt-4 text-white transition-all bg-blue-600 rounded-lg md:w-auto hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="p-6 bg-gray-100 rounded-lg">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Professional Details</h3>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Experience:</strong> {doctor.yearsOfExperience} years
                    </p>
                    <p>
                      <strong>Consultation Fee:</strong> ${doctor.consultationFee}
                    </p>
                    <p>
                      <strong>Clinic Address:</strong> {doctor.clinicAddress || 'Not Available'}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="p-6 bg-gray-100 rounded-lg">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Availability</h3>
                  <ul className="space-y-2 text-gray-700">
                    {doctor.availability.map((slot, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
                        <span>
                          {slot.day}: {slot.startTime} - {slot.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Qualifications Section */}
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Qualifications</h3>
                <ul className="space-y-2 text-gray-700">
                  {doctor.qualifications.map((qual, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                      <span>
                        {qual.degree}, {qual.institution} ({qual.year})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;