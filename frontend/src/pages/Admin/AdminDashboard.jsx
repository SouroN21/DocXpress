import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role !== 'admin') {
          setError('Access restricted to admins only.');
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

        const config = { headers: { Authorization: `Bearer ${token.trim()}` } };

        const [doctorsResponse, appointmentsResponse] = await Promise.all([
          axios.get('http://localhost:5000/doc/', config),
          axios.get('http://localhost:5000/appointment/all', config),
        ]);

        setDoctors(doctorsResponse.data || []);
        setAppointments(appointmentsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDoctorUpdate = (updatedDoctors) => {
    setDoctors(updatedDoctors);
  };

  const handleAppointmentUpdate = (updatedAppointments) => {
    setAppointments(updatedAppointments);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center border border-red-200 rounded-lg shadow-md bg-red-50">
        <p className="text-lg text-red-600">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-shrink-0 w-64 text-white bg-gray-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="mt-1 text-sm">Manage System</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveSection('doctors')}
            className={`w-full py-3 text-left px-6 transition-colors ${
              activeSection === 'doctors' ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveSection('appointments')}
            className={`w-full py-3 text-left px-6 transition-colors ${
              activeSection === 'appointments' ? 'bg-gray-900' : 'hover:bg-gray-700'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 text-left transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {activeSection === 'doctors' && <AdminDoctors doctors={doctors} onDoctorUpdate={handleDoctorUpdate} />}
          {activeSection === 'appointments' && (
            <AdminAppointments appointments={appointments} onAppointmentUpdate={handleAppointmentUpdate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;