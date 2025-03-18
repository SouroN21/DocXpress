const express = require('express');
const { createDoctorProfile, getAllDoctors, getDoctorById, getDoctorByUserId } = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/profile', authenticate, authorize(['doctor']), createDoctorProfile);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/by-user/me', authenticate, authorize(['doctor']), getDoctorByUserId); // Changed to /by-user/me for security

module.exports = router;