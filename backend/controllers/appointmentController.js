const Appointment = require("../models/appointmentsModel"); // Corrected import
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add your Stripe secret key in .env

// Create a new appointment with Stripe payment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, dateTime, mode } = req.body;

    if (!patientId || !doctorId || !dateTime || !mode) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      dateTime,
      mode,
      paidStatus: "Pending",
      status: "Pending",
    });

    await appointment.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Appointment with Doctor (ID: ${doctorId})`,
              description: `Mode: ${mode}, Date: ${new Date(dateTime).toLocaleString()}`,
            },
            unit_amount: 5000, // Example: $50.00 (adjust based on doctor’s consultationFee)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?appointmentId=${appointment._id}`,
      cancel_url: `http://localhost:3000/payment-cancel?appointmentId=${appointment._id}`,
      metadata: { appointmentId: appointment._id.toString() },
    });

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

// Update appointment status after payment
exports.updateAppointmentPayment = async (req, res) => {
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
    res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

// Existing functions...
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

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

module.exports = {
  createAppointment: exports.createAppointment,
  getAllAppointments: exports.getAllAppointments,
  getPatientAppointments: exports.getPatientAppointments,
  getDoctorAppointments: exports.getDoctorAppointments,
  deleteAppointment: exports.deleteAppointment,
  updateAppointmentPayment: exports.updateAppointmentPayment,
};