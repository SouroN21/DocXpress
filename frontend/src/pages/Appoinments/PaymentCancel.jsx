// PaymentCancel.js
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = searchParams.get('appointmentId');

  return (
    <div className="container max-w-2xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-red-600">Payment Canceled</h1>
      <p className="text-center">Your appointment (ID: {appointmentId}) is still pending payment. Redirecting in 2 seconds...</p>
      {setTimeout(() => navigate('/doctors'), 2000)}
    </div>
  );
};

export default PaymentCancel;