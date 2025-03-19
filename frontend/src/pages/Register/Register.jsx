// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'patient', phoneNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, phoneNumber } = formData;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All required fields must be filled.');
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be 10 digits (if provided).');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/user/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
      });
      setLoading(false);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container max-w-md px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Register</h1>
      {error && <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label><input type="text" id="firstName" name="firstName" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your first name" value={formData.firstName} onChange={handleChange} required /></div>
        <div><label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label><input type="text" id="lastName" name="lastName" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your last name" value={formData.lastName} onChange={handleChange} required /></div>
        <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label><input type="email" id="email" name="email" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" value={formData.email} onChange={handleChange} required /></div>
        <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label><input type="password" id="password" name="password" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" value={formData.password} onChange={handleChange} required /></div>
        <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password <span className="text-red-500">*</span></label><input type="password" id="confirmPassword" name="confirmPassword" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required /></div>
        <div><label htmlFor="role" className="block text-sm font-medium text-gray-700">Role <span className="text-red-500">*</span></label><select id="role" name="role" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.role} onChange={handleChange} required><option value="patient">Patient</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></div>
        <div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (optional)</label><input type="text" id="phoneNumber" name="phoneNumber" className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} /></div>
        <button type="submit" className={`w-full py-2 text-white rounded-md transition-colors ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
      <p className="mt-4 text-center text-gray-600">Already have an account? <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Log in here</span></p>
    </div>
  );
};

export default Register;