// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbackByDoctor,
  updateFeedback,
  deleteFeedback,
  getFeedbackByDoctorId,
  getAllFeedback,
} = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create Feedback (Patient Only)
router.post('/create', authenticate, authorize(['patient']), createFeedback);

// View Feedback by Doctor (Doctor Only)
router.get('/doctor/me', authenticate, authorize(['doctor']), getFeedbackByDoctor);

// Edit Feedback (Patient Only)
router.put('/:id', authenticate, authorize(['patient']), updateFeedback);

// Delete Feedback (Patient, Doctor, Admin)
router.delete('/:id', authenticate, authorize(['patient', 'doctor', 'admin']), deleteFeedback);
router.get('/doctor/:id', authenticate, getFeedbackByDoctorId); 
router.get('/all', authenticate, getAllFeedback);

module.exports = router;