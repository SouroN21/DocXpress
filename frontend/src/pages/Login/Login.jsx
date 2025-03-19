import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const checkDoctorProfile = async (userId, token) => {
    try {
      const response = await axios.get(`http://localhost:5000/doc/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data !== null; // Returns true if doctor profile exists
    } catch (err) {
      // If 404 (not found), assume no profile exists
      if (err.response?.status === 404) return false;
      throw err; // Re-throw other errors
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/user/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedToken.role;
      const userId = decodedToken.id;

      setLoading(false);

      switch (userRole) {
        case 'doctor':
          try {
            const hasDoctorProfile = await checkDoctorProfile(userId, token);
            if (hasDoctorProfile) {
              navigate('/doctor-dashboard');
            } else {
              navigate('/adddoctor');
            }
          } catch (err) {
            setError('Error checking doctor profile. Please try again.');
          }
          break;
        case 'patient':
          navigate('/');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const successMessage = location.state?.message;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Login</h1>
        {successMessage && (
          <p className="p-3 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="p-3 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-2 text-center text-gray-600">
          Don’t have an account?{' '}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;