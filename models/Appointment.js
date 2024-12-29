const pool = require('../config/database');

const Appointment = {
    async create({ customer_id, slot_id, service_id, status = 'pending' }) {
        const query = `
            INSERT INTO appointments (customer_id, slot_id, service_id, status)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [customer_id, slot_id, service_id, status]);
        return result.insertId;
    },

    async findByStaffId(staff_id) {
        const query = `
            SELECT a.*, s.start_time, s.end_time, u.first_name AS customer_name, srv.name AS service_name
            FROM appointments a
            JOIN slots s ON a.slot_id = s.id
            JOIN users u ON a.customer_id = u.id
            JOIN services srv ON a.service_id = srv.id
            WHERE s.staff_id = ?
        `;
        const [rows] = await pool.execute(query, [staff_id]);
        return rows;
    },

    async updateStatus(appointment_id, status) {
        const query = `UPDATE appointments SET status = ? WHERE id = ?`;
        const [result] = await pool.execute(query, [status, appointment_id]);
        return result.affectedRows > 0;
    },
};

module.exports = Appointment;
