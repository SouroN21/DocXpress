// controllers/reminderController.js
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20; // Temporary fix for MaxListeners warning

const MedicineReminder = require('../models/medicineReminder'); // Corrected import
const User = require('../models/userModel'); // Matches your existing user model
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to schedule email reminders
const scheduleEmailReminder = (reminder, userEmail) => {
  reminder.medicines.forEach((medicine) => {
    medicine.reminderTimes.forEach((time) => {
      const [hourMinute, period] = time.split(' ');
      let [hour, minute] = hourMinute.split(':');
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);

      // Convert to 24-hour format
      if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

      const now = new Date();
      const startDate = new Date(medicine.startDate);
      const endDate = new Date(medicine.endDate);

      // Schedule only if within date range
      if (now >= startDate && now <= endDate) {
        cron.schedule(`${minute} ${hour} * * *`, () => {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `DocXpress Reminder: ${medicine.medicineName}`,
            text: `Hi ${reminder.userId.firstName || 'Patient'}, it’s time to take your ${medicine.medicineName} (${medicine.dosage}). Notes: ${medicine.notes || 'None'}. Stay healthy! - DocXpress`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        });
      }
    });
  });
};

// Create a new reminder
exports.createReminder = async (req, res) => {
  try {
    const { medicines } = req.body;
    const userId = req.user.id; // From JWT middleware

    const reminder = new MedicineReminder({
      userId,
      medicines,
    });

    const savedReminder = await reminder.save();

    // Fetch user email from existing User model
    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found. Please update your profile.' });
    }

    // Schedule email reminders
    scheduleEmailReminder(savedReminder, user.email);

    res.status(201).json(savedReminder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reminder', error: error.message });
  }
};

// Get all reminders for the logged-in user
exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await MedicineReminder.find({ userId }).populate('userId', 'firstName email');
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reminders', error: error.message });
  }
};