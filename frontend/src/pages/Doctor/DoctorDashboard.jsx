// components/DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Profile from '../../components/Profile';
import Appointments from '../../components/Appointments';
import AppointmentModal from '../../components/AppointmentModal';
import Feedbacks from '../../components/Feedbacks';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialization: '',
    phoneNumber: '',
  });
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
        const [profileResponse, appointmentResponse, feedbackResponse] = await Promise.all([
          axios.get('http://localhost:5000/doc/by-user/me', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/appointment/doctor/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5000/feedback/doctor/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDoctorProfile(profileResponse.data);
        setFormData({
          firstName: profileResponse.data.userId.firstName,
          lastName: profileResponse.data.userId.lastName,
          email: profileResponse.data.userId.email,
          specialization: profileResponse.data.specialization,
          phoneNumber: profileResponse.data.userId.phoneNumber || '',
        });
        setAppointments(appointmentResponse.data);
        setFeedbacks(feedbackResponse.data.feedbacks || []);
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
      const response = await axios.put(
        'http://localhost:5000/appointment/status',
        { appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedAppointment = response.data.appointment;
      setAppointments(appointments.map((app) => (app._id === appointmentId ? updatedAppointment : app)));
      if (selectedAppointment?._id === appointmentId) {
        setSelectedAppointment(updatedAppointment);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating appointment status');
      console.error('Frontend error:', err);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        'http://localhost:5000/doc/me',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          specialization: formData.specialization,
          phoneNumber: formData.phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctorProfile(response.data);
      setEditMode(false);
      setLoading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      setLoading(false);
    }
  };

  if (!isDoctor) return null;
  if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar doctorProfile={doctorProfile} activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 max-w-4xl p-6 mx-auto">
        {activeSection === 'profile' && (
          <Profile
            doctorProfile={doctorProfile}
            editMode={editMode}
            setEditMode={setEditMode}
            formData={formData}
            handleEditChange={handleEditChange}
            handleProfileUpdate={handleProfileUpdate}
            loading={loading}
          />
        )}
        {activeSection === 'appointments' && (
          <Appointments 
            appointments={appointments} 
            handleAppointmentClick={handleAppointmentClick}
            handleStatusUpdate={handleStatusUpdate}
          />
        )}
        {activeSection === 'feedbacks' && (
          <Feedbacks 
            feedbacks={feedbacks} 
            setFeedbacks={setFeedbacks} 
            token={token} // Pass token for API calls
          />
        )}
        {selectedAppointment && (
          <AppointmentModal
            selectedAppointment={selectedAppointment}
            handleStatusUpdate={handleStatusUpdate}
            closeAppointmentDetails={closeAppointmentDetails}
          />
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;