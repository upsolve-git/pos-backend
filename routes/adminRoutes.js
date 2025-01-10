const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-specific routes
router.post('/add-service', authenticate, authorize('admin'), AdminController.addService);
router.post('/set-staff', authenticate, authorize('admin'), AdminController.addStaff);
router.post('/get-customers', authenticate, authorize('admin'), AdminController.getCustomers);
router.get('/view-appointments', authenticate, authorize('admin'), AdminController.getAppointmentsForDay);
router.post('/update-appointment', authenticate, authorize('admin'), AdminController.updateAppointment);
router.post('/get-services', authenticate, authorize('admin'), AdminController.getServices);
router.post('/get-available-staff', authenticate, authorize('admin'), AdminController.getAvailableStaff);

module.exports = router;
