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
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        console.error('Error confirming payment:', err);
      }
    };
    if (appointmentId && token) confirmPayment();
  }, [appointmentId, token, navigate]);

  return (
    <div className="container max-w-2xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-green-600">Payment Successful!</h1>
      <p className="text-center">Your appointment has been booked. Redirecting to profile in 2 seconds...</p>
    </div>
  );
};

export default PaymentSuccess;