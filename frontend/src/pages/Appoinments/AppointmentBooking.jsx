import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51R4696HMKbL3MyQep9UdgfrZYeL5DJnvgGOmXYRyWuga5HDPMUsDsCivnIlHH9j9nVjOs14fnefYnrIl7BULx06600Fczm0mLr'); // Replace with your Stripe publishable key

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const [formData, setFormData] = useState({
    dateTime: '',
    mode: 'In-Person',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const patientId = decodedToken.id;

      const response = await axios.post(
        'http://localhost:5000/appointment/add',
        {
          patientId,
          doctorId,
          dateTime: formData.dateTime,
          mode: formData.mode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const stripe = await stripePromise;
      const { stripeSessionId } = response.data;

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: stripeSessionId,
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error booking appointment');
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Book Appointment</h1>
      {error && <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="In-Person">In-Person</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <button
          type="submit"
          className={`w-full py-2 text-white rounded-md ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;