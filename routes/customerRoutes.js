const express = require('express');
const CustomerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer-specific routes
router.get('/view-services', CustomerController.viewServices); // No auth required for service listing
router.get('/view-slots/:serviceId', authenticate, authorize('customer'), CustomerController.viewAvailableSlots);
router.post('/book-appointment', authenticate, authorize('customer'), CustomerController.bookAppointment);

module.exports = router;
