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
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Schedule Your Appointment</h1>
          <div className="w-20 h-1 mx-auto bg-indigo-600"></div>
        </div>

        <div className="overflow-hidden bg-white shadow-xl rounded-xl">
          {doctor && (
            <div className="p-6 text-white bg-indigo-700">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold bg-indigo-600 rounded-full">
                    {doctor.userId.firstName.charAt(0)}{doctor.userId.lastName.charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                  </h2>
                  <p className="text-indigo-100">{doctor.specialization}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {error && (
              <div className="p-4 mb-6 border-l-4 border-red-500 rounded bg-red-50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="dateTime" className="block mb-1 text-sm font-medium text-gray-700">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Please select a future date and time</p>
              </div>

              <div>
                <label htmlFor="mode" className="block mb-1 text-sm font-medium text-gray-700">
                  Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`relative rounded-lg border p-4 cursor-pointer ${formData.mode === 'In-Person' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      id="inPerson"
                      name="mode"
                      value="In-Person"
                      checked={formData.mode === 'In-Person'}
                      onChange={handleChange}
                      className="absolute w-0 h-0 opacity-0"
                    />
                    <label htmlFor="inPerson" className="flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">In-Person</span>
                      <span className="mt-1 text-xs text-gray-500">Clinic visit</span>
                    </label>
                  </div>
                  <div className={`relative rounded-lg border p-4 cursor-pointer ${formData.mode === 'Online' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}`}>
                    <input
                      type="radio"
                      id="online"
                      name="mode"
                      value="Online"
                      checked={formData.mode === 'Online'}
                      onChange={handleChange}
                      className="absolute w-0 h-0 opacity-0"
                    />
                    <label htmlFor="online" className="flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Online</span>
                      <span className="mt-1 text-xs text-gray-500">Video consultation</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !doctor}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                    loading || !doctor
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Payment'
                  )}
                </button>
                <p className="mt-2 text-sm text-center text-gray-500">
                  You'll be redirected to secure payment after confirmation
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;