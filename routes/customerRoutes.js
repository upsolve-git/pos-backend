const express = require('express');
const CustomerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer-specific routes
router.get('/services', CustomerController.viewServices); // No auth required for service listing
router.post('/book-appointment', CustomerController.bookAppointment);
router.post('/cancel-appointment', CustomerController.cancelAppointment);
router.get('/appointments/customer/:customer_id', CustomerController.getAppointmentsByCustomerId);
router.get('/available-staff', CustomerController.getAvailableStaff);
router.get('/booked-appointments', CustomerController.getFutureAppointments);
module.exports = router;
