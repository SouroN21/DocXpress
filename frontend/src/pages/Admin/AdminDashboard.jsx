import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDoctors from './AdminDoctors';
import AdminAppointments from './AdminAppointments';
import AdminFeedbacks from './AdminFeedbacks';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Please log in to access the admin dashboard.');
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

        if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [doctorsResponse, appointmentsResponse, feedbackResponse] = await Promise.all([
          axios.get('http://localhost:5000/doc/', config),
          axios.get('http://localhost:5000/appointment/all', config),
          axios.get('http://localhost:5000/feedback/all', config),
        ]);

        setDoctors(doctorsResponse.data || []);
        setAppointments(appointmentsResponse.data || []);
        setFeedbacks(feedbackResponse.data || []);
      } catch (err) {
        setError(
          err.response?.status === 401 ? 'Unauthorized. Please log in again.' :
          err.response?.status === 403 ? 'Access restricted to admins only.' :
          'Error fetching dashboard data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDoctorUpdate = (updatedDoctors) => setDoctors(updatedDoctors);
  const handleAppointmentUpdate = (updatedAppointments) => setAppointments(updatedAppointments);
  const handleFeedbackUpdate = (updatedFeedbacks) => setFeedbacks(updatedFeedbacks);

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
          className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none lg:hidden"
              >
                {sidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
              <div className="flex items-center flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="mt-1 text-sm text-gray-300">Manage System</p>
          </div>
          <nav className="mt-6">
            {['doctors', 'appointments', 'feedbacks'].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setSidebarOpen(false);
                }}
                className={`w-full py-3 px-6 text-left text-sm font-medium transition-colors ${
                  activeSection === section ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeSection === 'doctors' && (
              <AdminDoctors doctors={doctors} onDoctorUpdate={handleDoctorUpdate} />
            )}
            {activeSection === 'appointments' && (
              <AdminAppointments
                appointments={appointments}
                onAppointmentUpdate={handleAppointmentUpdate}
              />
            )}
            {activeSection === 'feedbacks' && (
              <AdminFeedbacks
                feedbacks={feedbacks}
                onFeedbackUpdate={handleFeedbackUpdate}
                token={token}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;