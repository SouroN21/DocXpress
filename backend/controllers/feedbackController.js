// controllers/feedbackController.js
const Feedback = require('../models/feedbackModel');
const Appointment = require('../models/appointmentsModel');
 
// Create Feedback (Patient Only)
const createFeedback = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user.id; // From authenticated user

    // Check if appointment exists and belongs to the patient
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patientId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only provide feedback for your own appointments' });
    }
    if (appointment.status !== 'Completed') {
      return res.status(400).json({ message: 'Feedback can only be provided for completed appointments' });
    }

    // Check if feedback already exists for this appointment
    const existingFeedback = await Feedback.findOne({ appointmentId, userId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this appointment' });
    }

    const feedback = new Feedback({
      userId,
      doctorId: appointment.doctorId,
      appointmentId,
      rating,
      comment,
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Error creating feedback', error: error.message });
  }
};

// View Feedback by Doctor (Doctor Only)
const getFeedbackByDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id; // Doctor's ID from authenticated user
    const feedbacks = await Feedback.find({ doctorId })
      .populate('userId', 'firstName lastName')
      .populate('appointmentId', 'dateTime')
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
};

// Edit Feedback (Patient Only)
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own feedback' });
    }

    feedback.rating = rating || feedback.rating;
    feedback.comment = comment !== undefined ? comment : feedback.comment;
    await feedback.save();

    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Error updating feedback', error: error.message });
  }
};
// Get Feedback by Doctor ID (Public or Authenticated Access)
const getFeedbackByDoctorId = async (req, res) => {
    try {
      const { id } = req.params; // Doctor ID
      const feedbacks = await Feedback.find({ doctorId: id })
        .populate('userId', 'firstName lastName')
        .populate('appointmentId', 'dateTime')
        .sort({ createdAt: -1 }); // Newest first
  
      res.status(200).json({ feedbacks });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
  };

// Delete Feedback (All Authenticated Users with Permission)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Permission: Patient (owner), Doctor (recipient), or Admin
    if (
      feedback.userId.toString() !== userId &&
      feedback.doctorId.toString() !== userId &&
      userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this feedback' });
    }

    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
};
// Get all feedback (admin only)
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName');
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByDoctor,
  updateFeedback,
  deleteFeedback,
  getFeedbackByDoctorId,
  getAllFeedback,
};