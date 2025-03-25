import React from 'react';
import axios from 'axios';

const AdminFeedbacks = ({ feedbacks, onFeedbackUpdate, token }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await axios.delete(`http://localhost:5000/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedFeedbacks = feedbacks.filter((fb) => fb._id !== feedbackId);
      onFeedbackUpdate(updatedFeedbacks);
      alert('Feedback deleted successfully!');
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert(err.response?.data?.message || 'Failed to delete feedback.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Feedback Management</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback available.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div>
                <div className="flex items-center">
                  {renderStars(feedback.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    by {feedback.userId?.firstName || 'Anonymous'} {feedback.userId?.lastName || ''} for Dr.{' '}
                    {feedback.doctorId?.firstName || 'N/A'} {feedback.doctorId?.lastName || 'N/A'}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{feedback.comment || 'No comment provided.'}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteFeedback(feedback._id)}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacks;