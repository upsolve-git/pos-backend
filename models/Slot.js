const pool = require('../config/database');

const Slot = {
    async create({ service_id, staff_id, start_time, end_time, status = 'available' }) {
        const query = `
            INSERT INTO slots (service_id, staff_id, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [service_id, staff_id, start_time, end_time, status]);
        return result.insertId;
    },

    async findByServiceId(service_id) {
        const query = `
            SELECT s.*, u.first_name AS staff_name 
            FROM slots s
            JOIN users u ON s.staff_id = u.id
            WHERE s.service_id = ? AND s.status = 'available'
        `;
        const [rows] = await pool.execute(query, [service_id]);
        return rows;
    },

    async updateStatus(slot_id, status) {
        const query = `UPDATE slots SET status = ? WHERE id = ?`;
        const [result] = await pool.execute(query, [status, slot_id]);
        return result.affectedRows > 0;
    },
};

module.exports = Slot;
