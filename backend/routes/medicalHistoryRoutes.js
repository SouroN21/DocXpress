const express = require('express');
const {
  createMedicalHistory,
  updateMedicalHistory,
  getMedicalHistoryByUser,
  getAllMedicalHistories,
} = require('../controllers/medicalHistoryController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Patient creates their own medical history (medications only)
router.post('/create', authenticate, authorize(['patient']), createMedicalHistory);

// Anyone authenticated can update medical history
router.put('/update', authenticate, updateMedicalHistory);

// Get medical history by user (patient sees own, others specify patientId)
router.get('/me', authenticate, authorize(['patient']), getMedicalHistoryByUser); // Patient's own history
router.get('/:patientId', authenticate, authorize(['doctor', 'admin']), getMedicalHistoryByUser); // Doctor/Admin by patientId

// Admin gets all medical histories
router.get('/all', authenticate, authorize(['admin']), getAllMedicalHistories);

module.exports = router;