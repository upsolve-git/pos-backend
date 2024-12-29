const Service = require('../models/Service');
const Slot = require('../models/Slot');

const AdminController = {
    async addService(req, res) {
        try {
            const { name, description, price, duration } = req.body;
            const serviceId = await Service.create({ name, description, price, duration });
            res.status(201).json({ message: 'Service added successfully', serviceId });
        } catch (error) {
            res.status(500).json({ error: 'Error adding service', details: error.message });
        }
    },

    async setSlot(req, res) {
        try {
            const { service_id, staff_id, start_time, end_time } = req.body;
            const slotId = await Slot.create({ service_id, staff_id, start_time, end_time });
            res.status(201).json({ message: 'Slot created successfully', slotId });
        } catch (error) {
            res.status(500).json({ error: 'Error creating slot', details: error.message });
        }
    },
};

module.exports = AdminController;
