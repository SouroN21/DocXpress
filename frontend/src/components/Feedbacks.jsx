import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaTrash } from 'react-icons/fa';

const Feedbacks = ({ feedbacks, setFeedbacks, token }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          />
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

  const averageRating =
    feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length || 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Patient Feedback</h3>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center text-gray-500 bg-gray-100 rounded-md"
        >
          No feedback available yet.
        </motion.div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 transition-transform transform border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:scale-105"
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none"
                  >
                    <FaTrash size={14} />
                  </motion.button>
                </div>
              </div>
              <p className="leading-relaxed text-gray-700">{feedback.comment || 'No comment provided.'}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default Feedbacks;