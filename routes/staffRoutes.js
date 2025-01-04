const express = require('express');
const StaffController = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Staff-specific routes
router.get('/view-appointments', authenticate, authorize('staff'), StaffController.viewAppointments);
router.post('/complete-appointment', authenticate, authorize('staff'), StaffController.completeAppointment);

module.exports = router;
