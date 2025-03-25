import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeedbackForm = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Fetch appointment details including doctor info
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAppointment = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token.trim()}` } };
        const response = await axios.get(`http://localhost:5000/appointment/${appointmentId}`, config);
        setAppointment(response.data); // Assuming response contains appointment with populated doctorId
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch appointment details.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token.trim()}` } };
      const feedbackData = { appointmentId, rating, comment };
      await axios.post('http://localhost:5000/feedback/create', feedbackData, config);
      alert('Feedback submitted successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  if (fetchLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span className="ml-3 text-lg text-gray-600">Loading appointment details...</span>
    </div>
  );

  if (error && !appointment) return (
    <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-lg px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-6 text-3xl font-bold text-center text-indigo-700">Submit Feedback</h1>

          {/* Appointment and Doctor Details */}
          {appointment && (
            <div className="p-4 mb-8 space-y-3 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800">Appointment Details</h2>
              <p><strong>Doctor:</strong> Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</p>
              <p><strong>Specialization:</strong> {appointment.doctorId?.specialization || 'Not specified'}</p>
              <p><strong>Date & Time:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
              <p><strong>Mode:</strong> {appointment.mode}</p>
              <p><strong>Status:</strong> {appointment.status}</p>
            </div>
          )}

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && <p className="mt-1 text-sm text-gray-600">Selected: {rating} star{rating > 1 ? 's' : ''}</p>}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Your feedback about the doctor and appointment..."
              />
            </div>
            {error && (
              <div className="p-3 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                disabled={loading || rating === 0}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;