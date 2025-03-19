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
      try {
        const response = await axios.get(`http://localhost:5000/doc/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(response.data);
      } catch (err) {
        setError('Error fetching doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, token]);

  const handleBookAppointment = () => {
    if (!token) navigate('/login');
    else navigate(`/book-appointment/${id}`);
  };

  if (loading) return <p className="text-center text-gray-600">Loading doctor details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container max-w-4xl px-6 py-8 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Doctor Details</h1>
      {doctor && (
        <div className="p-6 bg-gray-100 rounded-md">
          <div className="flex flex-col items-center">
            <img 
              src={doctor.image || 'https://via.placeholder.com/150?text=Doctor'} 
              alt={doctor.userId.firstName} 
              className="w-32 h-32 mb-4 rounded-full shadow-lg"
            />
            <h2 className="text-2xl font-semibold text-gray-900">Dr. {doctor.userId.firstName} {doctor.userId.lastName}</h2>
            <p className="text-lg text-gray-600">{doctor.specialization}</p>
          </div>
          <div className="mt-6 space-y-3 text-gray-700">
            <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
            <p><strong>Years of Experience:</strong> {doctor.yearsOfExperience} years</p>
            <p><strong>Clinic Address:</strong> {doctor.clinicAddress || 'Not Available'}</p>
            <p><strong>Consultation Fee:</strong> ${doctor.consultationFee}</p>
            <p className="mt-4 font-semibold">Availability:</p>
            <ul className="ml-4 list-disc list-inside">
              {doctor.availability.map((slot, index) => (
                <li key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">Qualifications:</p>
            <ul className="ml-4 list-disc list-inside">
              {doctor.qualifications.map((qual, index) => (
                <li key={index}>{qual.degree}, {qual.institution} ({qual.year})</li>
              ))}
            </ul>
          </div>
          <button 
            onClick={handleBookAppointment} 
            className="w-full py-3 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorDetail;