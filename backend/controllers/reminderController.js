// controllers/reminderController.js
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 20; // Temporary fix for MaxListeners warning

const MedicineReminder = require('../models/medicineReminder');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

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

      if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

      const now = new Date();
      const startDate = new Date(medicine.startDate);
      const endDate = new Date(medicine.endDate);

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
    const userId = req.user.id;

    const reminder = new MedicineReminder({
      userId,
      medicines,
    });

    const savedReminder = await reminder.save();

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found. Please update your profile.' });
    }

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

// Delete a specific reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const userId = req.user.id;

    const reminder = await MedicineReminder.findOneAndDelete({
      _id: reminderId,
      userId, // Ensure the user owns the reminder
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or you do not have permission to delete it.' });
    }

    // Note: Cron tasks aren't stopped here as they reset on server restart.
    // In a production setup, you'd need to track and cancel them explicitly.

    res.status(200).json({ message: 'Reminder deleted successfully', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reminder', error: error.message });
  }
};

// Update a specific reminder
exports.updateReminder = async (req, res) => {
  try {
    const reminderId = req.params.id;
    const userId = req.user.id;
    const { medicines } = req.body;

    if (!medicines || !Array.isArray(medicines)) {
      return res.status(400).json({ message: 'Medicines array is required.' });
    }

    const reminder = await MedicineReminder.findOneAndUpdate(
      { _id: reminderId, userId }, // Ensure the user owns the reminder
      { medicines },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found or you do not have permission to update it.' });
    }

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found. Please update your profile.' });
    }

    // Reschedule reminders (since cron tasks reset on server restart, this is sufficient for now)
    scheduleEmailReminder(reminder, user.email);

    res.status(200).json({ message: 'Reminder updated successfully', reminder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reminder', error: error.message });
  }
};