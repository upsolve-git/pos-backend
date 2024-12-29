const Appointment = require('../models/Appointment');

const StaffController = {
    async viewAppointments(req, res) {
        try {
            const staffId = req.user.id; // Assuming authentication middleware adds `user` to `req`
            const appointments = await Appointment.findByStaffId(staffId);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching appointments', details: error.message });
        }
    },

    async confirmAppointment(req, res) {
        try {
            const { appointmentId } = req.body;
            await Appointment.updateStatus(appointmentId, 'confirmed');
            res.json({ message: 'Appointment confirmed successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error confirming appointment', details: error.message });
        }
    },
};

module.exports = StaffController;
