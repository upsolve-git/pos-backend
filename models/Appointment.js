const pool = require('../config/database');

const Appointment = {
    // Method to insert a new appointment
    async insert({ customer_id, service_id, date, startTime, status, paymentStatus }) {
        const query = `
            INSERT INTO Appointments (customer_id, service_id, date, startTime, status, paymentStatus)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [customer_id, service_id, date, startTime, status, paymentStatus]);
        return result.insertId;
    },

    // Method to find appointments by staff ID
    async findByStaffId(staff_id) {
        const query = `
            SELECT a.*, u.first_name AS customer_name, srv.name AS service_name
            FROM Appointments a
            JOIN users u ON a.customer_id = u.id
            JOIN Services srv ON a.service_id = srv.service_id
            WHERE a.staff_id = ?
        `;
        const [rows] = await pool.execute(query, [staff_id]);
        return rows;
    },

    // Method to update appointment status
    async executeQuery(query, params) {
        const [result] = await pool.execute(query, params);
        return result;
    },

    async updateStatus(appointment_id, status) {
        await pool.query('UPDATE Appointments SET status = ? WHERE appointment_id = ?', [status, appointment_id]);
    },
    

    // Method to get appointments for a specific day and service
    async getAppointmentsForDay(service_id, date) {
        const query = `
            SELECT a.*, u.first_name AS customer_name, srv.name AS service_name
            FROM Appointments a
            JOIN users u ON a.customer_id = u.id
            JOIN Services srv ON a.service_id = srv.service_id
            WHERE a.service_id = ? AND a.date = ?
        `;
        const [rows] = await pool.execute(query, [service_id, date]);
        return rows;
    },

    async getAppointmentById(appointment_id) {
        const result = await pool.query('SELECT * FROM Appointments WHERE appointment_id = ?', [appointment_id]);
        return result[0];
    },

    // Method to count appointments for a specific service, date, and time
    async countAppointments(service_id, date, startTime) {
        const query = `
            SELECT COUNT(*) AS appointmentCount
            FROM Appointments
            WHERE service_id = ? AND date = ? AND startTime = ? AND status IN ('confirmed', 'waitlisted')
        `;
        const [[{ appointmentCount }]] = await pool.execute(query, [service_id, date, startTime]);
        return appointmentCount;
    },

    async getAppointmentsByCustomerId(customerId) {
        const query = `
            SELECT 
                a.appointment_id, 
                a.date, 
                a.startTime, 
                a.status, 
                a.paymentStatus, 
                s.name AS serviceName, 
                s.description AS serviceDescription, 
                s.price AS servicePrice 
            FROM 
                Appointments a 
            JOIN 
                Services s ON a.service_id = s.service_id 
            WHERE 
                a.customer_id = ?
        `;
        const [rows] = await pool.execute(query, [customerId]);
        return rows;
    }
    
};

module.exports = Appointment;
