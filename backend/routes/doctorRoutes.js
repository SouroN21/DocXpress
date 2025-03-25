const express = require('express');
const { 
  createDoctorProfile, 
  getAllDoctors, 
  getDoctorById, 
  getDoctorByUserId, 
  updateDoctorProfile, 
  updateDoctorStatus, 
  deleteDoctorProfile 
} = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/profile', authenticate, authorize(['doctor']), createDoctorProfile);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/by-user/:id', authenticate, authorize(['doctor']), getDoctorByUserId);
router.put('/profile', authenticate, authorize(['doctor']), updateDoctorProfile);
router.put('/status', authenticate, authorize(['admin', 'doctor']), updateDoctorStatus);
router.delete('/:doctorId', authenticate, authorize(['doctor', 'admin']), deleteDoctorProfile); // New route

module.exports = router;