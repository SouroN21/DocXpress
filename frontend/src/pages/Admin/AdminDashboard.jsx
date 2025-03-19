import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeSection, setActiveSection] = useState('doctors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let isAdmin = false;
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      isAdmin = decodedToken.role === 'admin';
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [doctorsResponse, appointmentsResponse, patientsResponse] = await Promise.all([
          axios.get('http://localhost:5000/doc/', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/appointment/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/user/patients', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDoctors(doctorsResponse.data);
        setAppointments(appointmentsResponse.data);
        setPatients(patientsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, [token, isAdmin, navigate]);

  const handleDoctorStatus = async (doctorId, status) => {
    try {
      await axios.put(
        'http://localhost:5000/doc/status',
        { doctorId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(doctors.map(doc => (doc._id === doctorId ? { ...doc, status } : doc)));
    } catch (err) {
      setError('Error updating doctor status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(patients.filter(p => p._id !== userId));
    } catch (err) {
      setError('Error deleting user');
    }
  };

  if (!isAdmin) return null;
  if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-shrink-0 w-64 text-white bg-gray-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="mt-1 text-sm">Manage System</p>
        </div>
        <nav className="mt-6">
          <button onClick={() => setActiveSection('doctors')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'doctors' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}>Doctors</button>
          <button onClick={() => setActiveSection('appointments')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'appointments' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}>Appointments</button>
          <button onClick={() => setActiveSection('patients')} className={`w-full py-3 text-left px-6 transition-colors ${activeSection === 'patients' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}>Patients</button>
        </nav>
      </div>
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'doctors' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">Manage Doctors</h3>
              {doctors.length === 0 ? (
                <p className="text-gray-500">No doctors found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3">Name</th>
                        <th className="p-3">Specialization</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor._id} className="border-b">
                          <td className="p-3">{doctor.userId.firstName} {doctor.userId.lastName}</td>
                          <td className="p-3">{doctor.specialization}</td>
                          <td className="p-3">{doctor.status}</td>
                          <td className="flex p-3 space-x-2">
                            {doctor.status === 'pending' && (
                              <>
                                <button onClick={() => handleDoctorStatus(doctor._id, 'active')} className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-600">Approve</button>
                                <button onClick={() => handleDoctorStatus(doctor._id, 'inactive')} className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">Reject</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeSection === 'appointments' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">All Appointments</h3>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3">Patient</th>
                        <th className="p-3">Doctor</th>
                        <th className="p-3">Date & Time</th>
                        <th className="p-3">Mode</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id} className="border-b">
                          <td className="p-3">{appointment.patientId.firstName} {appointment.patientId.lastName}</td>
                          <td className="p-3">{appointment.doctorId.firstName} {appointment.doctorId.lastName}</td>
                          <td className="p-3">{new Date(appointment.dateTime).toLocaleString()}</td>
                          <td className="p-3">{appointment.mode}</td>
                          <td className="p-3">{appointment.paidStatus}</td>
                          <td className="p-3">{appointment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeSection === 'patients' && (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">All Patients</h3>
              {patients.length === 0 ? (
                <p className="text-gray-500">No patients found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient._id} className="border-b">
                          <td className="p-3">{patient.firstName} {patient.lastName}</td>
                          <td className="p-3">{patient.email}</td>
                          <td className="p-3">{patient.phoneNumber || 'N/A'}</td>
                          <td className="p-3">
                            <button onClick={() => handleDeleteUser(patient._id)} className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;