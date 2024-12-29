const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
