const express = require('express');
const router = express.Router();
const {
  createPrescription,
  updatePrescription,
  getPatientPrescriptions,
  deletePrescription,
  getPrescriptionByAppointment,
  getPrescriptionById,
} = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/authMiddleware'); // Assuming you have this

// Create a prescription (Doctor only)
router.post('/create', authenticate, authorize(['doctor']), createPrescription);

// Update a prescription (Doctor only)
router.put('/:id', authenticate, authorize(['doctor']), updatePrescription);

// View patient's prescriptions (Patient only)
router.get('/my-prescriptions', authenticate, authorize(['patient']), getPatientPrescriptions);

// Delete a prescription (Patient, Doctor, or Admin)
router.delete('/:id', authenticate, authorize(['patient', 'doctor', 'admin']), deletePrescription);

router.get('/appointment/:appointmentId', authenticate, authorize(['doctor']), getPrescriptionByAppointment);
router.get('/:id', authenticate, authorize(['doctor']), getPrescriptionById);

module.exports = router;