const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/getAuth', AuthController.authenticate);
router.get('/logout', AuthController.logout);
router.get('/isAdmin', AuthController.isAdmin);
module.exports = router;
