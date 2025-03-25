import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ dateTime: '', mode: '' });
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

        // Fetch profile and appointments together
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

        // Fetch prescriptions separately
        try {
          const prescriptionRes = await axios.get(`http://localhost:5000/prescriptions/my-prescriptions`, config);
          setPrescriptions(prescriptionRes.data.prescriptions || []);
        } catch (prescriptionErr) {
          console.warn('No prescriptions found or error fetching prescriptions:', prescriptionErr.response?.data || prescriptionErr.message);
          setPrescriptions([]); // Set empty array if prescriptions fetch fails
        }
      } catch (err) {
        setError('Failed to fetch profile or appointments.');
        console.error('Error fetching profile/appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    handleFilterChange(filter);
  }, [appointments]);

  const handleFilterChange = (status) => {
    setFilter(status);
    setFilteredAppointments(
      status === 'all'
        ? appointments
        : appointments.filter((app) => app.status.toLowerCase() === status.toLowerCase())
    );
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

  const handleEditAppointmentChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const startEditingAppointment = (appointment) => {
    setEditAppointmentId(appointment._id);
    setEditFormData({
      dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
      mode: appointment.mode,
    });
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        'http://localhost:5000/appointment/update',
        { appointmentId: editAppointmentId, ...editFormData },
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );
      setAppointments(
        appointments.map((app) =>
          app._id === editAppointmentId ? response.data.appointment : app
        )
      );
      setEditAppointmentId(null);
      alert('Appointment updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/appointment/delete/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      setAppointments(appointments.filter((app) => app._id !== appointmentId));
      alert('Appointment deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
    </div>
  );

  if (error) return (
    <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-4xl font-bold text-center text-blue-700">Patient Profile</h1>

          {/* Reminder and Medical History Buttons */}
          <div className="mb-8 space-x-4 text-center">
            <Link to="/reminder" className="px-6 py-3 text-white bg-green-500 rounded-lg shadow hover:bg-green-600">
              Go to Medicine Reminders
            </Link>
            <Link to="/medical-history" className="px-6 py-3 text-white bg-indigo-500 rounded-lg shadow hover:bg-indigo-600">
              Medical History
            </Link>
          </div>

          {/* Profile Edit/View and Appointments/Prescriptions */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <input name="firstName" value={formData.firstName} onChange={handleChange} required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="First Name" />
                  <input name="lastName" value={formData.lastName} onChange={handleChange} required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Last Name" />
                  <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Phone Number" />
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

            <div className="space-y-8 lg:col-span-2">
              {/* Appointment List */}
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Appointments</h2>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['all', 'confirmed', 'pending', 'canceled', 'completed'].map((status) => (
                    <button key={status} onClick={() => handleFilterChange(status)}
                      className={`px-4 py-2 rounded-full text-sm font-medium shadow
                        ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                {filteredAppointments.length === 0 ? (
                  <p className="py-4 text-center text-gray-600">No appointments found.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((app) => (
                      <div key={app._id} className="p-5 bg-gray-100 rounded-lg shadow hover:shadow-md">
                        {editAppointmentId === app._id ? (
                          <form onSubmit={handleUpdateAppointment} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Date & Time</label>
                                <input
                                  type="datetime-local"
                                  name="dateTime"
                                  value={editFormData.dateTime}
                                  onChange={handleEditAppointmentChange}
                                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Mode</label>
                                <select
                                  name="mode"
                                  value={editFormData.mode}
                                  onChange={handleEditAppointmentChange}
                                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                >
                                  <option value="In-Person">In-Person</option>
                                  <option value="Online">Online</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <button
                                type="submit"
                                className="flex-1 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                disabled={loading}
                              >
                                {loading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditAppointmentId(null)}
                                className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex flex-wrap justify-between gap-4">
                              <div><strong>Doctor:</strong> Dr. {app.doctorId?.firstName} {app.doctorId?.lastName}</div>
                              <div><strong>Date:</strong> {new Date(app.dateTime).toLocaleString()}</div>
                              <div><strong>Mode:</strong> {app.mode}</div>
                              <div><strong>Status:</strong> {app.status.charAt(0).toUpperCase() + app.status.slice(1)}</div>
                            </div>
                            <div className="flex gap-4 mt-4">
                              {app.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => startEditingAppointment(app)}
                                    className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAppointment(app._id)}
                                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              {app.status === 'Completed' && (
                                <button
                                  onClick={() => navigate(`/feedback/create/${app._id}`)}
                                  className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                                >
                                  Add Feedback
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prescription List */}
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Prescriptions</h2>
                {prescriptions.length === 0 ? (
                  <p className="py-4 text-center text-gray-600">No prescriptions found.</p>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div key={prescription._id} className="p-5 bg-gray-100 rounded-lg shadow hover:shadow-md">
                        <div className="space-y-2">
                          <p><strong>Appointment Date:</strong> {new Date(prescription.appointmentId?.dateTime).toLocaleString()}</p>
                          <p><strong>Doctor:</strong> Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}</p>
                          <div>
                            <strong>Medicines:</strong>
                            <ul className="ml-4 list-disc">
                              {prescription.medicines.map((med, index) => (
                                <li key={index}>
                                  {med.medicineName} - {med.dosage}, {med.frequency}, {med.duration}
                                  {med.notes && <span> (Notes: {med.notes})</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {prescription.finalNotes && (
                            <p><strong>Final Notes:</strong> {prescription.finalNotes}</p>
                          )}
                          <p><strong>Issued At:</strong> {new Date(prescription.issuedAt).toLocaleString()}</p>
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
    </div>
  );
};

export default PatientProfile;