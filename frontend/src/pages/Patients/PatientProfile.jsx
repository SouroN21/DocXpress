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

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
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

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter((app) => app.status === status));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="w-8 h-8 text-blue-500 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading your profile...</span>
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
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-lg rounded-xl">
          {/* Header */}
          <h1 className="mb-8 text-3xl font-extrabold text-center text-gray-800 md:text-4xl">
            Your Profile
          </h1>

          {/* Profile Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="p-6 bg-gray-100 rounded-lg lg:col-span-1">
              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 py-2 text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p className="text-lg text-gray-800">{profile.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p className="text-lg text-gray-800">{profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-lg text-gray-800">{profile.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2 text-white transition-all bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Appointments Section */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-semibold text-gray-800 md:text-3xl">
                Your Appointments
              </h2>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['all', 'confirmed', 'pending', 'canceled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Appointments List */}
              {filteredAppointments.length === 0 ? (
                <p className="py-4 text-center text-gray-600">No appointments found for this filter.</p>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-6 transition-all rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Doctor</p>
                          <p className="text-gray-800">
                            Dr. {appointment.doctorId?.firstName || 'N/A'} {appointment.doctorId?.lastName || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="text-gray-800">{new Date(appointment.dateTime).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mode</p>
                          <p className="text-gray-800">{appointment.mode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p
                            className={`font-semibold ${
                              appointment.status === 'confirmed'
                                ? 'text-green-600'
                                : appointment.status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;