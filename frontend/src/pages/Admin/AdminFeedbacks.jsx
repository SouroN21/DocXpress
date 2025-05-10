import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminFeedbacks = ({ feedbacks, onFeedbackUpdate, token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const renderStars = (rating) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await axios.delete(`http://localhost:5000/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onFeedbackUpdate(feedbacks.filter((fb) => fb._id !== feedbackId));
      alert('Feedback deleted successfully');
    } catch (error) {
      alert(
        error.response?.status === 404 ? 'Feedback not found.' :
        error.response?.data?.message || 'Failed to delete feedback.'
      );
    }
  };

  const generateFeedbackReport = () => {
    const doc = new jsPDF();
    doc.text('Feedback Report', 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['Patient', 'Doctor', 'Rating', 'Comment', 'Date']],
      body: filteredFeedbacks.map((feedback) => [
        `${feedback.userId?.firstName || 'Anonymous'} ${feedback.userId?.lastName || ''}`,
        `${feedback.doctorId?.firstName || 'N/A'} ${feedback.doctorId?.lastName || ''}`,
        feedback.rating || 'N/A',
        feedback.comment || 'No comment',
        new Date(feedback.createdAt).toLocaleString(),
      ]),
    });
    doc.save('feedback_report.pdf');
  };

  const filteredFeedbacks = feedbacks
    .filter((feedback) =>
      filterRating === 'all' ? true : feedback.rating === parseInt(filterRating)
    )
    .filter((feedback) =>
      `${feedback.userId?.firstName || ''} ${feedback.userId?.lastName || ''} ${feedback.doctorId?.firstName || ''} ${feedback.comment || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.rating - a.rating;
    });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Feedback Management</h2>
        <button
          onClick={generateFeedbackReport}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient, doctor, or comment"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Rating</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date (Newest)</option>
            <option value="rating">Rating (Highest)</option>
          </select>
        </div>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback available.</p>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
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
                title="Delete feedback"
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