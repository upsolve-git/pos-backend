const Service = require("../models/Service");
const Appointment = require("../models/Appointment");
const User = require("../models/Users");
const Staff = require("../models/Staff");
const Salon = require("../models/Salon");
const SaleAgent = require("../models/SaleAgent");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { pool } = require("../config/database");
// const backendURL = 'http://localhost:8000';
const backendURL = 'https://api.canadiangelnails.com';

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
        referal_mail
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
        referal_mail
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
        referal_mail
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
        referal_mail
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

  async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.getAllAppointments();

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
  
      let queryResults = [];
  
      // Execute query for updating 'status' if it's provided
      if (status) {
        const statusQuery = `
          UPDATE Appointments
          SET status = ?
          WHERE appointment_id = ?
        `;
        await pool.execute(statusQuery, [status, appointment_id]);
        // queryResults.push(statusResult);
      }
  
      // Execute query for updating 'paymentStatus' if it's provided
      if (paymentStatus) {
        const paymentStatusQuery = `
          UPDATE Appointments
          SET paymentStatus = ?
          WHERE appointment_id = ?
        `;
        await pool.execute(paymentStatusQuery, [paymentStatus, appointment_id]);
      }
  
      // Execute query for updating 'staff_id' if it's provided
      if (staff_id) {
        const staffQuery = `
          UPDATE Appointments
          SET staff_id = ?
          WHERE appointment_id = ?
        `;
        await pool.execute(staffQuery, [staff_id, appointment_id]);
      }

      
      return res.status(200).json({ message: "Appointment updated successfully" });
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

  async addSalon(req, res) {
    try {
      console.log("here in request salon ",req.body)
      const {
        salon_name,
        owner_name,
        contact_email,
        contact_mobile,
        bank_account,
        number_of_systems = 0,
        price_per_system = 0.00,
        password,
        referal_mail
      } = req.body.salon;

      // Validate required fields
      if (
        !salon_name ||
        !owner_name ||
        !contact_email ||
        !contact_mobile ||
        !bank_account ||
        !password
      ) {
        return res
          .status(400)
          .json({ error: "Missing required fields for adding a salon." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      // Use the model to add the salon
      const salonId = await Salon.create({
        salon_name,
        owner_name,
        contact_email,
        contact_mobile,
        bank_account,
        number_of_systems,
        price_per_system,
        password,
        referal_mail
      });
       // Call another backend API with contact_email and hashedPassword
      const externalApiResponse = await axios.post(backendURL +"/signup", {
        email: contact_email,
        password: password,
        firstName: owner_name,
        lastName: "",
        phone:contact_mobile,
        accType: "Business",
        countryCode:"+1"
      });
      if (externalApiResponse.status !== 201) {
        return res.status(500).json({ error: "Failed to register with external API." });
      }
      res.status(201).json({
        message: "Salon added successfully",
        salonId,
      });
    } catch (error) {
      console.error("Error adding salon:", error);
      res
        .status(500)
        .json({ error: "Error adding salon", details: error.message });
    }
  },

  async getAllSalons(req, res) {
    try {
      // Fetch all salons using the model
      const salons = await Salon.getAll();

      if (salons.length === 0) {
        return res.status(404).json({ message: "No salons found." });
      }

      res.status(200).json({
        message: "Salons fetched successfully",
        salons,
      });
    } catch (error) {
      console.error("Error fetching salons:", error);
      res.status(500).json({
        error: "Error fetching salons",
        details: error.message,
      });
    }
  },

  async addAgent(req, res) {
    try {
      const {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        dob = "",
        status = "active",
        is_subscribed = 0,
        referal_mail="",
        commision
      } = req.body.agent;

      console.log(req.body);


      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user entry
      const user_id = await User.create({
        role:"sale_agent",
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword,
        dob,
        status,
        is_subscribed,
        referal_mail
      });

      // Create staff entry linked to the user
      const agent_id = await SaleAgent.create({
        user_id: user_id,
        commision
      });

      res.status(201).json({
        message: "Agent registered successfully",
        user_id,
        agent_id,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error registering staff", details: error.message });
    }
  },

};

module.exports = AdminController;
