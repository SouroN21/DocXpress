const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentsModel'); // Assuming this exists
const User = require('../models/userModel'); // Assuming this exists
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Create Prescription
const createPrescription = async (req, res) => {
  try {
    const { userId, appointmentId, medicines, finalNotes } = req.body;
    const doctorId = req.user.id; // Assuming authenticated doctor's ID from JWT

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    // Verify appointment exists and belongs to the doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.doctorId.toString() !== doctorId) {
      return res.status(404).json({ message: 'Appointment not found or unauthorized' });
    }

    // Create prescription
    const prescription = new Prescription({
      userId,
      doctorId,
      appointmentId,
      medicines,
      finalNotes,
    });
    await prescription.save();

    // Fetch patient email
    const patient = await User.findById(userId);
    if (!patient || !patient.email) {
      return res.status(400).json({ message: 'Patient email not found' });
    }

    // Prepare email content
    const medicinesList = medicines
      .map(
        (med) =>
          `${med.medicineName} - Dosage: ${med.dosage}, Frequency: ${med.frequency}, Duration: ${med.duration}${
            med.notes ? `, Notes: ${med.notes}` : ''
          }`
      )
      .join('\n');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Your New Prescription',
      text: `Dear ${patient.firstName || 'Patient'},

You have received a new prescription from your doctor:

Appointment Date: ${new Date(appointment.dateTime).toLocaleString()}
Medicines:
${medicinesList}

Final Notes: ${finalNotes || 'None'}

Best regards,
Your Healthcare Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Prescription created and emailed', prescription });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
};

// Update Prescription (Doctor only)
const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicines, finalNotes } = req.body;
    const doctorId = req.user.id;

    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update prescriptions' });
    }

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    if (prescription.doctorId.toString() !== doctorId) {
      return res.status(403).json({ message: 'Unauthorized to update this prescription' });
    }

    prescription.medicines = medicines || prescription.medicines;
    prescription.finalNotes = finalNotes || prescription.finalNotes;
    await prescription.save();

    res.status(200).json({ message: 'Prescription updated', prescription });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ message: 'Error updating prescription', error: error.message });
  }
};

// View Patient's Prescriptions
const getPatientPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id; // Patient's ID from JWT

    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can view their prescriptions' });
    }

    const prescriptions = await Prescription.find({ userId })
      .populate('appointmentId', 'dateTime mode status')
      .populate('doctorId', 'firstName lastName');
    if (!prescriptions.length) {
      return res.status(404).json({ message: 'No prescriptions found' });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Delete Prescription
const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Authorization: Allow patient, doctor, or admin to delete
    if (
      role !== 'admin' &&
      prescription.userId.toString() !== userId &&
      prescription.doctorId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Unauthorized to delete this prescription' });
    }

    await Prescription.findByIdAndDelete(id);
    res.status(200).json({ message: 'Prescription deleted' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Error deleting prescription', error: error.message });
  }
};

module.exports = {
  createPrescription,
  updatePrescription,
  getPatientPrescriptions,
  deletePrescription,
};