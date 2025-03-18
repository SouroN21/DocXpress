import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorDetail = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doc/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch doctor details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  const handleBookAppointment = () => {
    alert(`Booking with Dr. ${doctor?.userId.lastName} coming soon!`);
  };

  return (
    <div className="container px-4 py-10 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Doctor Details</h1>
      {loading && (
        <p className="text-lg text-center text-gray-500">
          <svg className="inline-block w-6 h-6 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading doctor details...
        </p>
      )}
      {error && <p className="p-3 mb-6 text-center text-white bg-red-500 rounded-md">{error}</p>}
      {!loading && !error && doctor && (
        <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md">
          <img
            src={doctor.image || 'https://via.placeholder.com/200?text=Doctor+Image'}
            alt={`Dr. ${doctor.userId.lastName}`}
            className="object-cover w-48 h-48 mx-auto mb-6 rounded-full"
          />
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Dr. {doctor.userId.firstName} {doctor.userId.lastName}
          </h2>
          <p className="mt-2 text-gray-600">
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Email:</strong> {doctor.userId.email}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Phone:</strong> {doctor.userId.phoneNumber || 'Not provided'}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Consultation Fee:</strong> ${doctor.consultationFee}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Experience:</strong> {doctor.yearsOfExperience} years
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Status:</strong>{' '}
            <span
              className={`font-bold ${doctor.status === 'active' ? 'text-green-600' : 'text-red-600'}`}
            >
              {doctor.status}
            </span>
          </p>
          <div className="mt-4">
            <strong className="text-gray-700">Availability:</strong>
            <ul className="mt-2">
              {doctor.availability.map((slot, index) => (
                <li
                  key={index}
                  className="inline-block px-3 py-1 m-1 text-gray-600 bg-gray-100 rounded-md"
                >
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
          {doctor.clinicAddress && (
            <p className="mt-2 text-gray-600">
              <strong>Clinic Address:</strong> {doctor.clinicAddress}
            </p>
          )}
          <div className="mt-4">
            <strong className="text-gray-700">Qualifications:</strong>
            <ul className="pl-6 mt-2 list-disc">
              {doctor.qualifications.map((q, index) => (
                <li key={index} className="text-gray-600">
                  {q.degree}, {q.institution} ({q.year})
                </li>
              ))}
            </ul>
          </div>
          <div className="flex mt-6 space-x-4">
            <button
              onClick={handleBookAppointment}
              className="flex-1 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate('/doctors')}
              className="flex-1 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Doctors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetail;