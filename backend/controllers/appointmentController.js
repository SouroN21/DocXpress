const Appointment = require("../models/appointmentsModel");
const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAppointmentEmail = async (patient, doctor, appointment, action = 'scheduled') => {
  try {
    // Validate email fields
    if (!patient.email || !doctor.email) {
      throw new Error("Patient or doctor email is missing");
    }

    const subject = action === 'updated' ? 'Appointment Updated' : action === 'deleted' ? 'Appointment Canceled' : 'New Appointment Scheduled';
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [patient.email, doctor.email],
      subject,
      text: `An appointment has been ${action}:\n
        Patient: ${patient.firstName} ${patient.lastName}\n
        Doctor: ${doctor.firstName} ${doctor.lastName}\n
        Date: ${new Date(appointment.dateTime).toLocaleString()}\n
        Mode: ${appointment.mode}\n
        Status: ${appointment.status}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent for ${action} appointment`);
  } catch (error) {
    console.error(`Error sending ${action} email:`, error.message);
    throw error; // Let caller handle the error
  }
};

const createAppointment = async (req, res) => {
  try {
    const { doctorId, dateTime, mode } = req.body;
    const patientId = req.user.id; // From JWT middleware

    if (!doctorId || !dateTime || !mode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId', 'firstName lastName email');
    if (!doctor || !doctor.userId) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await User.findById(patientId, 'firstName lastName email');
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId: doctor.userId._id, // Store the User _id
      dateTime,
      mode,
      paidStatus: "Pending",
      status: "Pending",
    });

    await appointment.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Appointment with Dr. ${doctor.userId.lastName}`,
              description: `Mode: ${mode}, Date: ${new Date(dateTime).toLocaleString()}`,
            },
            unit_amount: doctor.consultationFee * 100 || 5000, // Default to $50 if fee not set
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?appointmentId=${appointment._id}`,
      cancel_url: `http://localhost:3000/payment-cancel?appointmentId=${appointment._id}`,
      metadata: { appointmentId: appointment._id.toString() },
    });

    await sendAppointmentEmail(patient, doctor.userId, appointment);

    res.status(201).json({
      message: "Appointment created, proceed to payment",
      appointment,
      stripeSessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

const updateAppointmentPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'doctorId', select: 'firstName lastName email' },
    ]);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.paidStatus = "Paid";
    appointment.status = "Pending";
    await appointment.save();

    res.status(200).json({ message: "Payment confirmed", appointment });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const userId = req.user.id;

    if (!appointmentId || !status) {
      return res.status(400).json({ message: "Appointment ID and status are required" });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== userId) {
      return res.status(403).json({ message: "Only the assigned doctor can update this appointment status" });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.status(200).json({ message: "Appointment status updated", appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: "Error updating appointment status", error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'firstName lastName specialization')
      .populate('patientId', 'firstName lastName');
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    // Optional: Check if the patient owns this appointment
    if (appointment.patientId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view this appointment' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId, dateTime, mode } = req.body;
    const userId = req.user.id;

    if (!appointmentId || (!dateTime && !mode)) {
      return res.status(400).json({ message: "Appointment ID and at least one field (dateTime or mode) are required" });
    }

    const appointment = await Appointment.findById(appointmentId).populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'doctorId', select: 'firstName lastName email' },
    ]);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.patientId || !appointment.doctorId) {
      return res.status(400).json({ message: "Invalid patient or doctor reference" });
    }

    if (!appointment.patientId.email || !appointment.doctorId.email) {
      return res.status(400).json({ message: "Patient or doctor email is missing" });
    }

    if (appointment.patientId._id.toString() !== userId) {
      return res.status(403).json({ message: "Only the patient who booked this appointment can update it" });
    }

    if (dateTime) {
      appointment.dateTime = new Date(dateTime);
      if (isNaN(appointment.dateTime)) {
        return res.status(400).json({ message: "Invalid dateTime format" });
      }
    }

    if (mode) {
      const validModes = ['In-Person', 'Online'];
      if (!validModes.includes(mode)) {
        return res.status(400).json({ message: "Invalid mode value" });
      }
      appointment.mode = mode;
    }

    const updatedAppointment = await appointment.save();
    await sendAppointmentEmail(appointment.patientId, appointment.doctorId, updatedAppointment, 'updated');

    res.status(200).json({ message: "Appointment updated successfully", appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName');
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'firstName lastName');
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'firstName lastName');
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointment = await Appointment.findById(appointmentId).populate([
      { path: 'patientId', select: 'firstName lastName email' },
      { path: 'doctorId', select: 'firstName lastName email' },
    ]);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (!appointment.patientId || !appointment.doctorId) {
      return res.status(400).json({ message: "Invalid patient or doctor reference" });
    }

    if (!appointment.patientId.email || !appointment.doctorId.email) {
      return res.status(400).json({ message: "Patient or doctor email is missing" });
    }

    if (appointment.patientId._id.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: "Only the patient or an admin can delete this appointment" });
    }
{/** 
    if (appointment.patientId._id.toString() === userId && (appointment.paidStatus === 'Paid' || appointment.status === 'Confirmed')) {
      return res.status(403).json({ message: "Cannot delete a paid or confirmed appointment" });
    }
*/}
    await Appointment.findByIdAndDelete(appointmentId);
    await sendAppointmentEmail(appointment.patientId, appointment.doctorId, appointment, 'deleted');

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};

module.exports = {
  createAppointment,
  updateAppointmentPayment,
  updateAppointmentStatus,
  updateAppointment,
  getAllAppointments,
  getPatientAppointments,
  getDoctorAppointments,
  deleteAppointment,
  getAppointmentById,
};