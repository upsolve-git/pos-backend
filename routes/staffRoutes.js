const express = require('express');
const StaffController = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Staff-specific routes
router.get('/view-appointments', authenticate, authorize('staff'), StaffController.viewAppointments);
router.post('/confirm-appointment', authenticate, authorize('staff'), StaffController.confirmAppointment);

module.exports = router;
