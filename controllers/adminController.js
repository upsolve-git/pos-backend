const Service = require("../models/Service");
const Appointment = require("../models/Appointment");
const User = require("../models/Users");
const Staff = require("../models/Staff");
const bcrypt = require("bcrypt");

const AdminController = {
  async addService(req, res) {
    try {
      const {
        name,
        description,
        price,
        duration,
        commissionRate,
        limitPerDay,
      } = req.body.service;
      const serviceId = await Service.create({
        name,
        description,
        price,
        duration,
        commissionRate,
        limitPerDay,
      });
      res
        .status(201)
        .json({ message: "Service added successfully", serviceId });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error adding service", details: error.message });
    }
  },

  async addUser(req, res) {
    try {
      const {
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password,
        dob = "",
        status = "active",
        is_subscribed = 0,
      } = req.body.user;

      console.log(req.body);

      if (role === "staff") {
        return res.status(400).json({
          error:
            "Invalid role. Only admin and customer can be registered using this endpoint.",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user entry
      const user_id = await User.create({
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword,
        dob,
        status,
        is_subscribed,
      });

      res.status(201).json({
        message: "User registered successfully",
        user_id,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error registering staff", details: error.message });
    }
  },

  async addStaff(req, res) {
    try {
      const {
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password,
        dob = "",
        status = "active",
        is_subscribed = 0,
        hourlyWage,
        service_id,
      } = req.body.user;

      console.log(req.body);

      if (role !== "staff") {
        return res.status(400).json({
          error:
            "Invalid role. Only staff can be registered using this endpoint.",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user entry
      const user_id = await User.create({
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword,
        dob,
        status,
        is_subscribed,
      });

      // Create staff entry linked to the user
      const staff_id = await Staff.create({
        user_id: user_id,
        hourlyWage,
        service_id,
      });

      res.status(201).json({
        message: "Staff registered successfully",
        user_id,
        staff_id,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error registering staff", details: error.message });
    }
  },

  async getAppointmentsForDay(req, res) {
    try {
      // Use the current date if none is provided
      const date = req.query.date; // YYYY-MM-DD format

      // Call the Appointment model method
      const appointments = await Appointment.getAppointmentsForDay(date);

      res.status(200).json({
        message: "Appointments fetched successfully",
        appointments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async updateAppointment(req, res) {
    try {
      // Extract the appointment_id from the query params and other fields from the request body
      const { appointment_id } = req.query;
      console.log(req.body); // Make sure to log and check the structure of the incoming body
      const { status, paymentStatus, staff_id } = req.body;

      // Validate appointment_id
      if (!appointment_id) {
        return res.status(400).json({ message: "Appointment ID is required" });
      }

      // Check if at least one field is provided for update
      if (!status && !paymentStatus && !staff_id) {
        return res.status(400).json({ message: "No update fields provided" });
      }

      // Build dynamic update query
      const updates = [];
      const values = [];

      // Check and add the necessary fields for updating
      if (status) {
        updates.push("status = ?");
        values.push(status);
      }

      if (paymentStatus) {
        updates.push("paymentStatus = ?");
        values.push(paymentStatus);
      }

      if (staff_id) {
        updates.push("staff_id = ?");
        values.push(staff_id);
      }

      // Always add the appointment_id for the WHERE clause
      values.push(appointment_id);

      // If no updates were made, return an error
      if (updates.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // Construct the query
      const query = `
        UPDATE Appointments
        SET ${updates.join(", ")}
        WHERE appointment_id = ?
      `;

      // Execute the query
      const [result] = await Appointment.executeQuery(query, values);

      // Check if any rows were affected
      if (result.affectedRows > 0) {
        // If staff_id was updated, mark the staff's availability as false
        if (staff_id) {
          await Staff.updateAvailability(staff_id, false);
        }
        return res
          .status(200)
          .json({ message: "Appointment updated successfully" });
      } else {
        return res.status(404).json({ message: "Appointment not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getServices(req, res) {
    try {
      const services = await Service.getAll();
      return res.status(200).json(services);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error fetching services", details: error.message });
    }
  },

  async getCustomers(req, res) {
    try {
      const users = await User.getUserByRole("customer");
      return res.status(200).json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error fetching services", details: error.message });
    }
  },

  async getStaff(req, res) {
    try {
      const staff = await Staff.getAll();
      return res.status(200).json(staff);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching staff", details: error.message });
    }
  },

  async getAvailableStaff(req, res) {
    try {
      const { service_id, date, startTime } = req.query;

      console.log(req.query);

      // Step 1: Get all staff for the given service ID (A)
      const allStaff = await Staff.findAllByServiceId(service_id);

      // Step 2: Get staff IDs with booked appointments for the given service, date, and time (B)
      const bookedStaffIds = await Appointment.findBookedStaffIds(
        service_id,
        date,
        startTime
      );

      // Step 3: Filter out booked staff from all staff
      const availableStaff = allStaff.filter(
        (staff) => !bookedStaffIds.includes(staff.id)
      );

      // Send the response with available staff details
      res.status(200).json(availableStaff);
    } catch (error) {
      console.error("Error fetching available staff:", error);
      res.status(500).json({ message: "Failed to fetch available staff." });
    }
  },
};

module.exports = AdminController;
