import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let isDoctor = false;
  let userId = '';
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      isDoctor = decodedToken.role === 'doctor';
      userId = decodedToken.id;
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    if (!token || !isDoctor) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileResponse, appointmentResponse] = await Promise.all([
          axios.get('http://localhost:5000/doc/by-user/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/appointment/doctor/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDoctorProfile(profileResponse.data);
        setAppointments(appointmentResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, [token, isDoctor, userId, navigate]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await axios.put(
        'http://localhost:5000/appointment/status',
        { appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map(app => (app._id === appointmentId ? { ...app, status } : app)));
    } catch (err) {
      setError('Error updating appointment status');
    }
  };

  if (!isDoctor) return null;
  if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-shrink-0 w-64 text-white bg-blue-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
          <p className="mt-1 text-sm">Welcome, Dr. {doctorProfile?.userId.firstName}</p>
        </div>
        <nav className="mt-6">
          <button onClick={() => setActiveSection('profile')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'profile' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}>My Profile</button>
          <button onClick={() => setActiveSection('appointments')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'appointments' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}>Appointments</button>
          <button onClick={() => setActiveSection('feedbacks')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'feedbacks' ? 'bg-blue-900' : 'hover:bg-blue-700'}`}>Feedbacks</button>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {activeSection === 'profile' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">My Profile</h3>
              {doctorProfile ? (
                <div className="space-y-4">
                  <img src={doctorProfile.image || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 mx-auto rounded-full" />
                  <p><strong>Name:</strong> {doctorProfile.userId.firstName} {doctorProfile.userId.lastName}</p>
                  <p><strong>Email:</strong> {doctorProfile.userId.email}</p>
                  <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
                  <p><strong>License Number:</strong> {doctorProfile.licenseNumber}</p>
                  <p><strong>Years of Experience:</strong> {doctorProfile.yearsOfExperience}</p>
                  <p><strong>Clinic Address:</strong> {doctorProfile.clinicAddress || 'N/A'}</p>
                  <p><strong>Consultation Fee:</strong> ${doctorProfile.consultationFee}</p>
                  <p><strong>Availability:</strong></p>
                  <ul className="list-disc list-inside">{doctorProfile.availability.map((slot, index) => <li key={index}>{slot.day}: {slot.startTime} - {slot.endTime}</li>)}</ul>
                  <p><strong>Qualifications:</strong></p>
                  <ul className="list-disc list-inside">{doctorProfile.qualifications.map((qual, index) => <li key={index}>{qual.degree}, {qual.institution} ({qual.year})</li>)}</ul>
                  <button onClick={() => navigate('/adddoctor')} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600">Edit Profile</button>
                </div>
              ) : (
                <p className="text-gray-500">No profile found. Please add your profile.</p>
              )}
            </div>
          )}
          {activeSection === 'appointments' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">My Appointments</h3>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="p-4 rounded-md bg-gray-50">
                      <p><strong>Patient:</strong> {appointment.patientId.firstName} {appointment.patientId.lastName}</p>
                      <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                      <p><strong>Mode:</strong> {appointment.mode}</p>
                      <p><strong>Payment Status:</strong> {appointment.paidStatus}</p>
                      <p><strong>Status:</strong> {appointment.status}</p>
                      {appointment.status === 'Confirmed' && (
                        <div className="mt-2 space-x-2">
                          <button onClick={() => handleStatusUpdate(appointment._id, 'Completed')} className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600">Mark Completed</button>
                          <button onClick={() => handleStatusUpdate(appointment._id, 'Canceled')} className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeSection === 'feedbacks' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">Feedbacks</h3>
              <p className="text-gray-500">Feedback feature coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;