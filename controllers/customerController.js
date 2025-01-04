const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

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

    async bookAppointment(req, res) {
        try {
            console.log(req.body);
            const { customer_id, service_id, date, startTime } = req.body;

            // Fetch service details
            const service = await Service.getServiceDetails(service_id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            const { limitPerDay } = service;

            // Count existing appointments
            const appointmentCount = await Appointment.countAppointments(service_id, date, startTime);

            // Determine status
            const status = appointmentCount < limitPerDay ? 'confirmed' : 'waitlisted';

            // Insert new appointment
            const appointmentId = await Appointment.insert({
                customer_id,
                service_id,
                date,
                startTime,
                status,
                paymentStatus: 'pending'
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
    }    

};

module.exports = CustomerController;
