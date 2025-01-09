const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');

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

    async completeAppointment(req, res) {
        try {
            const { appointment_id } = req.params; // Extract appointment_id from route params
            const { staff_id } = req.body; // Extract staff_id from the request body

            if (!appointment_id || !staff_id) {
                return res.status(400).json({ message: 'Appointment ID and Staff ID are required' });
            }

            // Update the appointment status to 'completed'
            const statusUpdated = await Appointment.updateStatus(appointment_id, 'completed');

            if (!statusUpdated) {
                return res.status(404).json({ message: 'Appointment not found or status not updated' });
            }

            // Update staff availability to true
            const availabilityUpdated = await Staff.updateAvailability(staff_id, true);

            if (availabilityUpdated) {
                return res.status(200).json({
                    message: 'Appointment status updated to completed and staff marked as available',
                });
            } else {
                return res.status(500).json({
                    message: 'Appointment completed but failed to update staff availability',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error', details: error.message });
        }
    },

};

module.exports = StaffController;
