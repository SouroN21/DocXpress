import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');
    const fetchProfile = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role !== 'patient') return navigate('/');
        if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
          localStorage.removeItem('token');
          return navigate('/login');
        }

        const patientId = decodedToken.id;
        const config = { headers: { Authorization: `Bearer ${token.trim()}` } };

        const [profileRes, appointmentRes] = await Promise.all([
          axios.get(`http://localhost:5000/user/${patientId}`, config),
          axios.get(`http://localhost:5000/appointment/patient/${patientId}`, config),
        ]);

        setProfile(profileRes.data);
        setFormData({
          firstName: profileRes.data.firstName,
          lastName: profileRes.data.lastName,
          phoneNumber: profileRes.data.phoneNumber || '',
        });
        setAppointments(appointmentRes.data);
        setFilteredAppointments(appointmentRes.data);
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  const handleFilterChange = (status) => {
    setFilter(status);
    setFilteredAppointments(status === 'all'
      ? appointments
      : appointments.filter((app) => app.status === status));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:5000/user/profile',
        formData,
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );
      setProfile(response.data);
      setEditMode(false);
      alert('Profile updated!');
    } catch {
      setError('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete account permanently?')) return;
    try {
      await axios.delete('http://localhost:5000/user/self', {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch {
      setError('Failed to delete account.');
    }
  };

  if (loading) return <div className="py-20 text-lg text-center">Loading profile...</div>;
  if (error) return <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-4xl font-bold text-center text-blue-700">Patient Profile</h1>

          {/* Reminder Button */}
          <div className="mb-8 text-center">
            <Link to="/reminder" className="px-6 py-3 text-white bg-green-500 rounded-lg shadow hover:bg-green-600">
              Go to Medicine Reminders
            </Link>
          </div>

          {/* Profile Edit/View */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required
                    className="w-full p-3 border rounded-lg" placeholder="First Name" />
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required
                    className="w-full p-3 border rounded-lg" placeholder="Last Name" />
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    className="w-full p-3 border rounded-lg" placeholder="Phone Number" />
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditMode(false)}
                      className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-gray-800">
                  <p><strong>First Name:</strong> {profile.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.lastName}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Phone:</strong> {profile.phoneNumber || 'Not provided'}</p>
                  <button onClick={() => setEditMode(true)}
                    className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Edit Profile
                  </button>
                  <button onClick={handleDeleteAccount}
                    className="w-full py-2 mt-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
                    Delete Account
                  </button>
                </div>
              )}
            </div>

            {/* Appointment List */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-2xl font-semibold">Appointments</h2>
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['all', 'confirmed', 'pending', 'canceled'].map((status) => (
                  <button key={status} onClick={() => handleFilterChange(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium shadow
                      ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Appointment Cards */}
              {filteredAppointments.length === 0 ? (
                <p className="py-4 text-center text-gray-600">No appointments found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((app) => (
                    <div key={app._id} className="p-5 bg-gray-100 rounded-lg shadow hover:shadow-md">
                      <div className="flex flex-wrap justify-between gap-4">
                        <div><strong>Doctor:</strong> Dr. {app.doctorId?.firstName} {app.doctorId?.lastName}</div>
                        <div><strong>Date:</strong> {new Date(app.dateTime).toLocaleString()}</div>
                        <div><strong>Mode:</strong> {app.mode}</div>
                        <div><strong>Status:</strong> <span className={
                          app.status === 'confirmed' ? 'text-green-600 font-bold'
                            : app.status === 'pending' ? 'text-yellow-600 font-bold'
                              : 'text-red-600 font-bold'
                        }>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span></div>
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