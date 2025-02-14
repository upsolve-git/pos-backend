const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const Mail = require('../mail');
const User = require('../models/Users');
const Salon = require('../models/Salon');
const Wallet = require('../models/Wallet');

const CustomerController = {
    async viewServices(req, res) {
        console.log("here");
        try {
            const services = await Service.getAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching services', details: error.message });
        }
    },

    async getSalons(req, res) {
        try {
           
            const salons = await Salon.getAll();
            console.log(salons)
            res.json(salons);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching salons', details: error.message });
        }
    },

    async getWallet(req, res) {
        try {
            const {user_id} = req.params
            const wallet = await Wallet.getById(user_id);
            res.json(wallet);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching wallet', details: error.message });
        }
    },

    async updateWallet(req, res) {
        try {
            console.log(req.body)
            const {user_id, credits} = req.body
            const wallet = await Wallet.updateById(user_id, credits);
            res.json(wallet);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching wallet', details: error.message });
        }
    },

    async viewServicesBySalonId(req, res) {
        try {
            console.log(req.params)
            const {salon_id} = req.params 
            const services = await Service.getAllBySalonId(salon_id);
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching services', details: error.message });
        }
    },

    async bookAppointment(req, res) {
        try {
            console.log(req.body);
            const { customer_id, service_id, date, startTime, staff_id} = req.body;

            // Fetch service details
            const service = await Service.getServiceDetails(service_id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Determine status
            const status ='confirmed'
            const user  = await User.findByid(customer_id)
            const serviceName = await Service.getServiceName(service_id)
            console.log(serviceName)
            Mail.sendMail(user.email, user.first_name + user.last_name, "https://main.d29iicb8es15um.amplifyapp.com/", serviceName.name, date, startTime)

            // Insert new appointment
            const appointmentId = await Appointment.insert({
                customer_id,
                service_id,
                date,
                startTime,
                status,
                paymentStatus: 'pending',
                staff_id
            });

            res.status(201).json({
                message: 'Appointment created successfully',
                appointmentId,
                status
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async cancelAppointment(req, res) {
        try {
            const { appointment_id } = req.body;
    
            // Fetch appointment details
            const appointment = await Appointment.getAppointmentById(appointment_id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
    
            // Check if the appointment can be canceled
            if (appointment.status === 'completed') {
                return res.status(400).json({ message: 'Completed appointments cannot be canceled.' });
            }
    
            // Update the appointment status to 'cancelled'
            await Appointment.updateStatus(appointment_id, 'cancelled');
    
            res.status(200).json({
                message: 'Appointment canceled successfully',
                appointmentId: appointment_id,
            });
        } catch (error) {
            console.error('Error canceling appointment:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getAppointmentsByCustomerId(req, res) {
        try {
            const { customer_id } = req.params;
    
            // Fetch appointments by customer ID
            const appointments = await Appointment.getAppointmentsByCustomerId(customer_id);
            
            if (!appointments || appointments.length === 0) {
                return res.status(404).json({ message: 'No appointments found for this customer.' });
            }

            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getAvailableStaff(req, res) {
        // console.log(req)
        const { serviceId, salonId } = req.query;
        try {
          const staffList = await Staff.findAllByServiceId(serviceId, salonId);
      
          res.status(200).json(staffList);
        } catch (error) {
          console.error("Error fetching staff:", error);
          res.status(500).json({ message: "Failed to fetch staff." });
        }
    },

    async getFutureAppointments(req, res) {
        const { staffId } = req.query;
        console.log(staffId)
        try {
          const futureAppointments = await Appointment.findFutureAppointmentsByStaffId(staffId);
      
          res.status(200).json(futureAppointments);
        } catch (error) {
          console.error("Error fetching future appointments:", error);
          res.status(500).json({ message: "Failed to fetch future appointments." });
        }
    },

    async getUserProfile(req, res) {
        const { userId } = req.query;
        console.log(userId)
        try{
            const userDetails = await User.findByid(userId);

            res.status(200).json(userDetails);
        } catch (error){
            console.log(error)
            res.status(500).json({ message: "Failed to fetch user details." });
        }
    }

};

module.exports = CustomerController;
