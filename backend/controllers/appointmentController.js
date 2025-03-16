const Appointment = require("../models/appointmentsModel");

//  Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, mode, paidStatus, status } = req.body;

    // Check if all required fields are provided
    if (!patientId || !doctorId || !dateTime || !mode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      dateTime,
      mode,
      paidStatus: paidStatus || "Pending",
      status: status || "Pending",
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment created successfully", newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

//  Get all appointments (Admin or Doctor)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "fullName email") 
      .populate("doctorId", "fullName email"); 

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Get appointments for a specific patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "fullName email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

//  Get appointments for a specific doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "fullName email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

//  Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};
