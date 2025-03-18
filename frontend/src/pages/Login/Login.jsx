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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      let userRole;
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userRole = decodedToken.role;
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        userRole = 'patient'; // Fallback role
      }

      console.log('Login successful for:', formData.email, 'Role:', userRole);
      setLoading(false);

      switch (userRole) {
        case 'doctor':
          navigate('/doctor-dashboard');
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
      console.error('Error during login:', err);
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const successMessage = location.state?.message;

  return (
    <div className="container max-w-md px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Login</h1>
      {successMessage && (
        <p className="p-2 mb-4 text-center text-white bg-green-500 rounded-md">{successMessage}</p>
      )}
      {error && (
        <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 text-white rounded-md transition-colors ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don’t have an account?{' '}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate('/register')}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;