const express = require('express');
const CustomerController = require('../controllers/customerController');
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer-specific routes
router.get('/services', CustomerController.viewServices); // No auth required for service listing
router.post('/book-appointment', CustomerController.bookAppointment);
router.post('/cancel-appointment', CustomerController.cancelAppointment);
router.get('/appointments/customer/:customer_id', CustomerController.getAppointmentsByCustomerId);
router.get('/available-staff', CustomerController.getAvailableStaff);
router.get('/booked-appointments', CustomerController.getFutureAppointments);
router.get('/userProfile', CustomerController.getUserProfile);
router.get('/salons', CustomerController.getSalons);
router.get('/services/:salon_id', CustomerController.viewServicesBySalonId);
router.get('/get-wallet/:user_id', CustomerController.getWallet);
router.post('/update-wallet', CustomerController.updateWallet);
router.get("/get-all-salons",AdminController.getAllSalons);
router.post('/editProfile', CustomerController.updateProfileDetails)
module.exports = router;
