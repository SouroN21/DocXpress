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
        setLoading(false);
      } catch (err) {
        setError('Error fetching doctor details');
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, token]);

  const handleBookAppointment = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/book-appointment/${id}`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container max-w-4xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Doctor Details</h1>
      {doctor && (
        <div className="space-y-4">
          <img
            src={doctor.image || 'https://via.placeholder.com/150'}
            alt={doctor.userId.firstName}
            className="w-32 h-32 mx-auto rounded-full"
          />
          <p><strong>Name:</strong> {doctor.userId.firstName} {doctor.userId.lastName}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
          <p><strong>Years of Experience:</strong> {doctor.yearsOfExperience}</p>
          <p><strong>Clinic Address:</strong> {doctor.clinicAddress || 'N/A'}</p>
          <p><strong>Consultation Fee:</strong> ${doctor.consultationFee}</p>
          <p><strong>Availability:</strong></p>
          <ul className="list-disc list-inside">
            {doctor.availability.map((slot, index) => (
              <li key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</li>
            ))}
          </ul>
          <p><strong>Qualifications:</strong></p>
          <ul className="list-disc list-inside">
            {doctor.qualifications.map((qual, index) => (
              <li key={index}>{qual.degree}, {qual.institution} ({qual.year})</li>
            ))}
          </ul>
          <button
            onClick={handleBookAppointment}
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorDetail;