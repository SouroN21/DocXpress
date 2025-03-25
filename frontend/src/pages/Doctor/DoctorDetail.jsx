import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDetail = () => {
  const { id } = useParams(); // Doctor collection ID
  const [doctor, setDoctor] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editFeedbackId, setEditFeedbackId] = useState(null);
  const [editFeedbackData, setEditFeedbackData] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    const fetchDoctorAndFeedback = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch doctor details first
        const doctorRes = await axios.get(`http://localhost:5000/doc/${id}`, config);
        const doctorData = doctorRes.data;
        setDoctor(doctorData);
      
        // Fetch feedback using doctor's userId
        const feedbackRes = await axios.get(
          `http://localhost:5000/feedback/doctor/${doctorData.userId._id || doctorData.userId}`,
          config
        );
        setFeedbacks(feedbackRes.data.feedbacks || []);
        console.log('Feedbacks:', feedbackRes.data.feedbacks);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching doctor details or feedback');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorAndFeedback();
  }, [id, token, navigate]);

  const handleBookAppointment = () => {
    if (!token) navigate('/login');
    else navigate(`/book-appointment/${id}`);
  };

  const handleEditFeedback = (feedback) => {
    setEditFeedbackId(feedback._id);
    setEditFeedbackData({ rating: feedback.rating, comment: feedback.comment || '' });
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        `http://localhost:5000/feedback/${editFeedbackId}`,
        editFeedbackData,
        config
      );
      setFeedbacks(
        feedbacks.map((fb) => (fb._id === editFeedbackId ? response.data.feedback : fb))
      );
      setEditFeedbackId(null);
      alert('Feedback updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update feedback.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    setLoading(true);
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/feedback/${feedbackId}`, config);
      setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
      alert('Feedback deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feedback.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading doctor details...</span>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-4xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <h1 className="mb-8 text-3xl font-extrabold text-center text-gray-800 md:text-4xl">
            Doctor Profile
          </h1>
          {doctor && (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                <img
                  src={doctor.image || 'https://via.placeholder.com/150?text=Doctor'}
                  alt={`${doctor.userId.firstName} ${doctor.userId.lastName}`}
                  className="w-32 h-32 mb-4 rounded-full shadow-md md:w-40 md:h-40 md:mb-0"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                  </h2>
                  <p className="mt-1 text-lg text-blue-600">{doctor.specialization}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>License:</strong> {doctor.licenseNumber}
                  </p>
                  <button
                    onClick={handleBookAppointment}
                    className="w-full px-6 py-3 mt-4 text-white transition-all bg-blue-600 rounded-lg md:w-auto hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 bg-gray-100 rounded-lg">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Professional Details</h3>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Experience:</strong> {doctor.yearsOfExperience} years</p>
                    <p><strong>Consultation Fee:</strong> ${doctor.consultationFee}</p>
                    <p><strong>Clinic Address:</strong> {doctor.clinicAddress || 'Not Available'}</p>
                  </div>
                </div>
                <div className="p-6 bg-gray-100 rounded-lg">
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">Availability</h3>
                  <ul className="space-y-2 text-gray-700">
                    {doctor.availability.map((slot, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
                        <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Qualifications Section */}
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Qualifications</h3>
                <ul className="space-y-2 text-gray-700">
                  {doctor.qualifications.map((qual, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                      <span>{qual.degree}, {qual.institution} ({qual.year})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feedback Section */}
              <div className="p-6 bg-gray-100 rounded-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Patient Feedback</h3>
                {feedbacks.length === 0 ? (
                  <p className="text-gray-600">No feedback available for this doctor yet.</p>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div key={feedback._id} className="p-4 bg-white rounded-lg shadow-sm">
                        {editFeedbackId === feedback._id ? (
                          <form onSubmit={handleUpdateFeedback} className="space-y-4">
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Rating (1-5)</label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditFeedbackData({ ...editFeedbackData, rating: star })}
                                    className={`text-2xl ${editFeedbackData.rating >= star ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Comment</label>
                              <textarea
                                value={editFeedbackData.comment}
                                onChange={(e) => setEditFeedbackData({ ...editFeedbackData, comment: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows="3"
                              />
                            </div>
                            <div className="flex gap-4">
                              <button
                                type="submit"
                                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                disabled={loading}
                              >
                                {loading ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditFeedbackId(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <span key={i} className="text-xl text-yellow-400">★</span>
                                ))}
                                {[...Array(5 - feedback.rating)].map((_, i) => (
                                  <span key={i} className="text-xl text-gray-300">★</span>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-500">
                                by {feedback.userId?.firstName} {feedback.userId?.lastName} -{' '}
                                {new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{feedback.comment || 'No comment provided.'}</p>
                            {currentUserId === feedback.userId?._id && (
                              <div className="flex gap-4 mt-3">
                                <button
                                  onClick={() => handleEditFeedback(feedback)}
                                  className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteFeedback(feedback._id)}
                                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {error && (
                  <div className="p-3 mt-4 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;