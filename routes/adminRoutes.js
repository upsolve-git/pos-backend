const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-specific routes
router.post('/add-service', authenticate, authorize('admin'), AdminController.addService);
router.post('/set-slot', authenticate, authorize('admin'), AdminController.setSlot);

module.exports = router;
