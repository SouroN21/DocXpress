// components/Feedbacks.js
import React from 'react';
import axios from 'axios';

const Feedbacks = ({ feedbacks, setFeedbacks, token }) => {
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
      setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
      alert('Feedback deleted successfully!');
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert(err.response?.data?.message || 'Failed to delete feedback.');
    }
  };

  // Calculate average rating
  const averageRating =
    feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length || 0;

  return (
    <section className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Patient Feedback</h3>
        {feedbacks.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-600">Average Rating:</span>
            {renderStars(Math.round(averageRating))}
            <span className="font-semibold text-yellow-500">
              ({averageRating.toFixed(1)})
            </span>
          </div>
        )}
      </div>
      {feedbacks.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-gray-100 rounded-md">
          No feedback available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-4 transition duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {renderStars(feedback.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {feedback.userId?.firstName} {feedback.userId?.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="px-3 py-1 text-sm text-white transition duration-150 bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="leading-relaxed text-gray-700">{feedback.comment || 'No comment provided.'}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Feedbacks;