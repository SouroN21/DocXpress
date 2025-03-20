// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { createReminder, getReminders } = require('../controllers/reminderController');
const { authenticate } = require('../middleware/authMiddleware'); // Corrected to match your auth file

router.post('/reminders', authenticate, createReminder);
router.get('/reminders', authenticate, getReminders);

module.exports = router;