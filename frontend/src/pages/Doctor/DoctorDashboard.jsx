import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editMode, setEditMode] = useState(false); // New state for edit mode
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', specialization: '', phoneNumber: '' }); // Form data for editing
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
        setFormData({
          firstName: profileResponse.data.userId.firstName,
          lastName: profileResponse.data.userId.lastName,
          email: profileResponse.data.userId.email,
          specialization: profileResponse.data.specialization,
          phoneNumber: profileResponse.data.userId.phoneNumber || '',
        });
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
      if (selectedAppointment?._id === appointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }
    } catch (err) {
      setError('Error updating appointment status');
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
      {/* Sidebar */}
      <aside className="flex-shrink-0 w-64 p-6 text-white bg-blue-800">
        <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
        <p className="mt-2 text-sm">Welcome, Dr. {doctorProfile?.userId.firstName}</p>
        <nav className="mt-6 space-y-2">
          {['profile', 'appointments', 'feedbacks'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full py-3 text-left px-4 rounded transition-colors ${activeSection === section ? 'bg-blue-900' : 'hover:bg-blue-700'}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl p-6 mx-auto">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">My Profile</h3>
            {doctorProfile ? (
              editMode ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleEditChange}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleEditChange}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleEditChange}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleEditChange}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleEditChange}
                      className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
                <div className="space-y-4">
                  <img src={doctorProfile.image || 'https://via.placeholder.com/150'} alt="Profile" className="w-32 h-32 mx-auto rounded-full" />
                  <p><strong>Name:</strong> {doctorProfile.userId.firstName} {doctorProfile.userId.lastName}</p>
                  <p><strong>Email:</strong> {doctorProfile.userId.email}</p>
                  <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
                  <p><strong>Phone Number:</strong> {doctorProfile.userId.phoneNumber || 'Not provided'}</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded hover:bg-indigo-700"
                  >
                    Edit Profile
                  </button>
                </div>
              )
            ) : (
              <p className="text-gray-500">No profile found. Please add your profile.</p>
            )}
          </section>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">My Appointments</h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments scheduled.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    onClick={() => handleAppointmentClick(appointment)}
                    className="p-4 transition-colors rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <p><strong>Patient:</strong> {appointment.patientId.firstName} {appointment.patientId.lastName}</p>
                    <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                    <p><strong>Mode:</strong> {appointment.mode}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
              <h4 className="mb-4 text-xl font-semibold text-gray-800">Appointment Details</h4>
              <div className="space-y-3">
                <p><strong>Patient:</strong> {selectedAppointment.patientId.firstName} {selectedAppointment.patientId.lastName}</p>
                <p><strong>Email:</strong> {selectedAppointment.patientId.email || 'Not provided'}</p>
                <p><strong>Date & Time:</strong> {new Date(selectedAppointment.dateTime).toLocaleString()}</p>
                <p><strong>Mode:</strong> {selectedAppointment.mode}</p>
                <p><strong>Payment Status:</strong> {selectedAppointment.paidStatus}</p>
                <p><strong>Current Status:</strong> {selectedAppointment.status}</p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Update Status:</label>
                  <select
                    value={selectedAppointment.status}
                    onChange={(e) => handleStatusUpdate(selectedAppointment._id, e.target.value)}
                    className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={closeAppointmentDetails}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedbacks Section */}
        {activeSection === 'feedbacks' && (
          <section className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">Feedbacks</h3>
            <p className="text-gray-500">Feedback feature coming soon!</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;