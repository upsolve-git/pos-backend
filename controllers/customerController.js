const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Cart = require('../models/Cart');
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
            const { customer_id } = req.body;
    
            // Fetch user details
            const user = await User.findByid(customer_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Fetch cart items for the customer
            const cartItems = await Cart.getItemsByCustomerId(customer_id);
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }
    
            const createdAppointments = [];
    
            for (const item of cartItems) {
                const { service_id, date, startTime, staff_id } = item;
    
                const service = await Service.getServiceDetails(service_id);
                if (!service) {
                    console.warn(`Service not found for ID: ${service_id}, skipping`);
                    continue;
                }
    
                const status = 'confirmed';
                const serviceName = await Service.getServiceName(service_id);
    
                // Send email
                await Mail.sendMail(
                    user.email,
                    user.first_name + " " + user.last_name,
                    "https://main.d29iicb8es15um.amplifyapp.com/",
                    serviceName.name,
                    date,
                    startTime
                );
    
                // Insert appointment
                const appointmentId = await Appointment.insert({
                    customer_id,
                    service_id,
                    date,
                    startTime,
                    status,
                    paymentStatus: 'pending',
                    staff_id
                });
    
                createdAppointments.push({ appointmentId, service_id, date, startTime });
            }
    
            // Clear cart after booking
            await Cart.clearCustomerCart({customer_id});
    
            res.status(201).json({
                message: 'Appointments created successfully',
                appointments: createdAppointments
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
    },

    async updateProfileDetails(req, res) {
        try {
            const { user_id, first_name, last_name, phone_number, dob } = req.body; // Get data from request body
    
            // Validate required fields
            if (!user_id || !first_name || !last_name || !phone_number) {
                return res.status(400).json({ message: "Missing required fields" });
            }
    
            // Call the update function from User model
            const result = await User.updateUserDetails(first_name, last_name, phone_number, dob, user_id);
    
            // Check if any rows were updated
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found or no changes made" });
            }
    
            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ message: "Failed to update user details" });
        }
    },

    async addToCart(req, res) {
        try {
            console.log(req.body);
            const { customer_id, service_id, date, startTime, staff_id} = req.body;

            // Fetch service details
            const service = await Service.getServiceDetails(service_id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Insert into cart
             await Cart.insert({
                customer_id,
                service_id,
                date,
                startTime,
                staff_id
            });

            res.status(201).json({
                message: ' Successfully addedd to cart'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async deleteFromCart(req, res) {
        try {
          
            const {cart_id} = req.body;

             await Cart.delete({
                cart_id
            });

            res.status(201).json({
                message: ' Successfully deleted from cart'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async getCartByCustomerId(req, res) {
        try {
            const { customer_id } = req.params;
    
            // Fetch cart by customer ID
            const cart = await Cart.getCartByCustomerId(customer_id);
            
            if (!cart || cart.length === 0) {
                return res.status(404).json({ message: 'No items found for this customer.' });
            }

            res.status(200).json(cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    
};

module.exports = CustomerController;
