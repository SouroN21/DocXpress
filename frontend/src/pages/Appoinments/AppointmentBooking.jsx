import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51R4696HMKbL3MyQep9UdgfrZYeL5DJnvgGOmXYRyWuga5HDPMUsDsCivnIlHH9j9nVjOs14fnefYnrIl7BULx06600Fczm0mLr');

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const [formData, setFormData] = useState({ dateTime: '', mode: 'In-Person' });
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Please log in to book an appointment.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doc/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(response.data);
      } catch (err) {
        setError('Error fetching doctor details');
      }
    };

    fetchDoctor();
  }, [doctorId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const patientId = decodedToken.id;

      const response = await axios.post(
        'http://localhost:5000/appointment/add',
        { patientId, doctorId, dateTime: formData.dateTime, mode: formData.mode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const stripe = await stripePromise;
      const { stripeSessionId } = response.data;
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: stripeSessionId });

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Book an Appointment</h1>
          {doctor && (
            <p className="mt-2 text-lg text-gray-600">
              with Dr. {doctor.userId.firstName} {doctor.userId.lastName} ({doctor.specialization})
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
              Appointment Mode
            </label>
            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="In-Person">In-Person</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !doctor}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              loading || !doctor
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
