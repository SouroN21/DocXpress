import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
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
          setError('Only patients can access this page.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const profileResponse = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileResponse.data);
        setFormData({
          firstName: profileResponse.data.firstName,
          lastName: profileResponse.data.lastName,
          phoneNumber: profileResponse.data.phoneNumber || '',
        });

        const appointmentResponse = await axios.get(`http://localhost:5000/appointment/patient/${decodedToken.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appointmentResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile data');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        'http://localhost:5000/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data.user);
      setEditMode(false);
      setLoading(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container max-w-4xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Patient Profile</h1>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Personal Information</h2>
        {editMode ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <p><strong>First Name:</strong> {profile.firstName}</p>
            <p><strong>Last Name:</strong> {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone Number:</strong> {profile.phoneNumber || 'Not provided'}</p>
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Appointment History */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Appointment History</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="p-4 bg-gray-100 rounded-md">
                <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                <p><strong>Mode:</strong> {appointment.mode}</p>
                <p><strong>Payment Status:</strong> {appointment.paidStatus}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;