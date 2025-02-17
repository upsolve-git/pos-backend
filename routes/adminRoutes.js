const express = require("express");
const AdminController = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Admin-specific routes
router.post(
  "/add-service",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.addService
);
router.post(
  "/add-staff",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.addStaff
);
router.post(
  "/add-user",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.addUser
)
router.get(
  "/get-customers",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getCustomers
);
router.get(
  "/view-appointments",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getAppointmentsForDay
);
router.get(
  "/view-all-appointments",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getAllAppointments
);
router.post(
  "/update-appointment",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.updateAppointment
);
router.get(
  "/get-services",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getServices
);
router.get(
  "/get-staff",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getStaff
)
router.get(
  "/get-available-staff",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getAvailableStaff
);
router.post(
  "/add-salon",
  AdminController.addSalon
);
router.get(
  "/get-all-salons",
  AuthController.authenticate,
  AuthController.authorize("admin"),
  AdminController.getAllSalons
);
router.post(
  "/add-agent",
  AdminController.addAgent
);
module.exports = router;
