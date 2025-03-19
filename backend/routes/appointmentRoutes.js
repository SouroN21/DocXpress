const express = require("express");
const { createAppointment, updateAppointmentPayment, updateAppointmentStatus, getAllAppointments, getPatientAppointments, getDoctorAppointments, deleteAppointment } = require("../controllers/appointmentController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authenticate, authorize(['patient']), createAppointment);
router.get("/all", authenticate, getAllAppointments);
router.get("/patient/:patientId", authenticate, getPatientAppointments);
router.get("/doctor/:doctorId", authenticate, getDoctorAppointments);
router.delete("/delete/:appointmentId", authenticate, deleteAppointment);
router.post("/payment-success", updateAppointmentPayment);
router.put("/status", authenticate, authorize(['doctor']), updateAppointmentStatus); // New route

module.exports = router;