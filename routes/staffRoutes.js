const express = require('express');
const StaffController = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const AuthController = require('../controllers/AuthController')

const router = express.Router();

// Staff-specific routes
router.get('/view-appointments', AuthController.authenticate, AuthController.authorize('staff'), StaffController.viewAppointments);
router.post('/complete-appointment', AuthController.authenticate, AuthController.authorize('staff'), StaffController.completeAppointment);


module.exports = router;
