const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Define routes
router.post("/add", appointmentController.createAppointment);
router.get("/all", appointmentController.getAllAppointments);
router.get("/patient/:patientId", appointmentController.getPatientAppointments);
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);
router.delete("/delete/:appointmentId", appointmentController.deleteAppointment);

module.exports = router; 
