const Service = require('../models/Service');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');

const CustomerController = {
    async viewServices(req, res) {
        try {
            const services = await Service.getAll();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching services', details: error.message });
        }
    },

    async viewAvailableSlots(req, res) {
        try {
            const { serviceId } = req.params;
            const slots = await Slot.findByServiceId(serviceId);
            res.json(slots);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching slots', details: error.message });
        }
    },

    async bookAppointment(req, res) {
        try {
            const { customer_id, slot_id, service_id } = req.body;
            const appointmentId = await Appointment.create({ customer_id, slot_id, service_id });
            await Slot.updateStatus(slot_id, 'booked'); // Assume `updateStatus` changes the slot status
            res.status(201).json({ message: 'Appointment booked successfully', appointmentId });
        } catch (error) {
            res.status(500).json({ error: 'Error booking appointment', details: error.message });
        }
    },
};

module.exports = CustomerController;
