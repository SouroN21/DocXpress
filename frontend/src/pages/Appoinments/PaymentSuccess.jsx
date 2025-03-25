// PaymentSuccess.js
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const appointmentId = searchParams.get('appointmentId');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axios.post(
          'http://localhost:5000/appointment/payment-success',
          { appointmentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTimeout(() => navigate('/'), 5000);
      } catch (err) {
        console.error('Error confirming payment:', err);
      }
    };
    if (appointmentId && token) confirmPayment();
  }, [appointmentId, token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-semibold text-green-600">Payment Successful!</h1>
          <p className="text-lg text-gray-700">Your appointment has been booked successfully.</p>
          <p className="text-gray-500 text-md">Redirecting to your profile in 5 seconds...</p>
        </div>
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-green-500 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
