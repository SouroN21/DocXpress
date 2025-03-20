const Appointment = require("../models/appointmentsModel"); // Fixed typo
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

const sendAppointmentEmail = async (patient, doctor, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [patient.email, doctor.userId.email],
    subject: 'New Appointment Scheduled',
    text: `An appointment has been scheduled:\n
      Patient: ${patient.firstName} ${patient.lastName}\n
      Doctor: ${doctor.userId.firstName} ${doctor.userId.lastName}\n
      Date: ${new Date(appointment.dateTime).toLocaleString()}\n
      Mode: ${appointment.mode}\n
      Status: ${appointment.status}`,
  };

  await transporter.sendMail(mailOptions);
};

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, mode } = req.body;

    console.log('Received doctorId:', doctorId); // Debug log

    if (!patientId || !doctorId || !dateTime || !mode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const doctor = await Doctor.findById(doctorId).populate('userId');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId: doctor.userId, // Store the User _id
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
            unit_amount: doctor.consultationFee * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?appointmentId=${appointment._id}`,
      cancel_url: `http://localhost:3000/payment-cancel?appointmentId=${appointment._id}`,
      metadata: { appointmentId: appointment._id.toString() },
    });

    await sendAppointmentEmail(patient, doctor, appointment);

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
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.paidStatus = "Paid";
    appointment.status = "Confirmed";
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

    // Assuming doctorId is the User _id from the appointment
    if (appointment.doctorId.toString() !== userId) {
      return res.status(403).json({ message: "Only the assigned doctor can update this appointment" });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.status(200).json({ message: "Appointment status updated", appointment: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: "Error updating appointment status", error: error.message });
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
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
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
  getAllAppointments,
  getPatientAppointments,
  getDoctorAppointments,
  deleteAppointment,
};