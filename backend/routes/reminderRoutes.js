// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createReminder, 
  getReminders, 
  deleteReminder, 
  updateReminder 
} = require('../controllers/reminderController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/reminders', authenticate, createReminder); // Create a new reminder
router.get('/reminders', authenticate, getReminders);    // Get all reminders for the user
router.delete('/reminders/:id', authenticate, deleteReminder); // Delete a specific reminder
router.put('/reminders/:id', authenticate, updateReminder);    // Update a specific reminder

module.exports = router;