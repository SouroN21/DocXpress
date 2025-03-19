import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));

        if (decodedToken.role !== 'patient') {
          setError('Access restricted to patients only.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const patientId = decodedToken.id;
        const config = { headers: { Authorization: `Bearer ${token.trim()}` } };

        const [profileResponse, appointmentResponse] = await Promise.all([
          axios.get(`http://localhost:5000/user/${patientId}`, config),
          axios.get(`http://localhost:5000/appointment/patient/${patientId}`, config),
        ]);

        setProfile(profileResponse.data);
        setFormData({
          firstName: profileResponse.data.firstName,
          lastName: profileResponse.data.lastName,
          phoneNumber: profileResponse.data.phoneNumber || '',
        });
        setAppointments(appointmentResponse.data);
        setFilteredAppointments(appointmentResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        'http://localhost:5000/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );
      setProfile(response.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await axios.delete('http://localhost:5000/user/self', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      localStorage.removeItem('token');
      navigate('/login', { state: { message: 'Account deleted successfully.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting account');
    }
  };

  // Filter appointments by status
  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(app => app.status === status);
      setFilteredAppointments(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading patient profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mx-auto mt-10 text-center text-red-800 bg-red-200 rounded-lg w-fit">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-8 mx-auto mt-16 bg-white shadow-xl rounded-2xl">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Patient Profile</h1>

      {editMode ? (
        <form onSubmit={handleUpdate} className="grid gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-4">
            <button type="submit" className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)} className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 text-lg text-gray-700">
          <p><strong>First Name:</strong> {profile.firstName}</p>
          <p><strong>Last Name:</strong> {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone Number:</strong> {profile.phoneNumber || 'Not provided'}</p>

          <div className="flex gap-4 mt-6">
            <button onClick={() => setEditMode(true)} className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Edit Profile</button>
            <button onClick={handleDeleteAccount} className="px-6 py-3 font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700">Delete Account</button>
          </div>
        </div>
      )}

      <h2 className="mt-10 mb-4 text-3xl font-semibold text-gray-800">Appointments</h2>

      {/* Appointment Filters */}
      <div className="flex gap-4 mb-6">
        {['all', 'confirmed', 'pending', 'canceled'].map(status => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-4 py-2 rounded-lg text-white ${filter === status ? 'bg-blue-600' : 'bg-gray-500'} hover:bg-blue-700`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <li key={appointment._id} className="p-6 border bg-gray-50 rounded-xl">
              <p><strong>Doctor:</strong> {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</p>
              <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
              <p><strong>Mode:</strong> {appointment.mode}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`font-semibold ml-2 ${
                  appointment.status === 'confirmed' ? 'text-green-600' :
                  appointment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {appointment.status}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientProfile;
