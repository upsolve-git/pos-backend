const pool = require("../config/database");

const Appointment = {
  // Method to insert a new appointment
  async insert({
    customer_id,
    service_id,
    date,
    startTime,
    status,
    paymentStatus,
    staff_id,
  }) {
    console.log(staff_id);
    const query = `
            INSERT INTO Appointments (customer_id, service_id, date, startTime, status, paymentStatus, staff_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      customer_id,
      service_id,
      date,
      startTime,
      status,
      paymentStatus,
      staff_id,
    ]);
    return result.insertId;
  },

  // Method to find appointments by staff ID
  async findByStaffId(staff_id, date) {
    const query = `
            SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) AS customer_name, srv.name AS service_name
            FROM Appointments a
            JOIN users u ON a.customer_id = u.id
            JOIN Services srv ON a.service_id = srv.service_id
            WHERE a.staff_id = ? and a.date = ?
        `;
    const [rows] = await pool.execute(query, [staff_id, date]);
    return rows;
  },

  async findFutureAppointmentsByStaffId(staff_id) {
    const query = `
              SELECT 
                  a.date, 
                  a.startTime as time
              FROM 
                  Appointments a
              WHERE 
                  a.staff_id = ? AND a.date > CURRENT_DATE()
            `;

    const [rows] = await pool.execute(query, [staff_id]);
    return rows;
  },

  // Method to update appointment status
  async executeQuery(query, params) {
    try{
      const [result] = await pool.execute(query,params);
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  async updateStatus(appointment_id, status) {
    await pool.query(
      "UPDATE Appointments SET status = ? WHERE appointment_id = ?",
      [status, appointment_id]
    );
  },

  // Method to get appointments for a specific day and service
  async getAppointmentsForDay(date) {
    const query = `
            SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) AS customer_name, srv.name AS service_name, CONCAT(us.first_name, ' ', us.last_name) AS staff_name
            FROM Appointments a
            JOIN users u ON a.customer_id = u.id
            JOIN Services srv ON a.service_id = srv.service_id
            JOIN Staff sta oN a.staff_id = sta.staff_id
            JOIN users us ON sta.user_id = us.id
            WHERE a.date = ?
        `;
    const [rows] = await pool.execute(query, [date]);
    return rows;
  },

  async getAllAppointments() {
    const query = `
            SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) AS customer_name, srv.name AS service_name, CONCAT(us.first_name, ' ', us.last_name) AS staff_name
            FROM Appointments a
            JOIN users u ON a.customer_id = u.id
            JOIN Services srv ON a.service_id = srv.service_id
            JOIN Staff sta oN a.staff_id = sta.staff_id
            JOIN users us ON sta.user_id = us.id
        `;
    const [rows] = await pool.execute(query, []);
    return rows;
  },

  async getsingleAppointment(appointment_id) {
    const query = `
    SELECT a.*, 
           CONCAT(u.first_name, ' ', u.last_name) AS customer_name, 
           srv.name AS service_name, 
           CONCAT(us.first_name, ' ', us.last_name) AS staff_name
    FROM Appointments a
    JOIN users u ON a.customer_id = u.id
    JOIN Services srv ON a.service_id = srv.service_id
    JOIN Staff sta ON a.staff_id = sta.staff_id
    JOIN users us ON sta.user_id = us.id
    WHERE a.appointment_id = ?
`;
const [rows] = await pool.execute(query, [appointment_id]);
return rows.length > 0 ? rows[0] : null;
  },


  async getAppointmentById(appointment_id) {
    const result = await pool.query(
      "SELECT * FROM Appointments WHERE appointment_id = ?",
      [appointment_id]
    );
    return result[0];
  },

  // Method to count appointments for a specific service, date, and time
  async countAppointments(service_id, date, startTime) {
    const query = `
            SELECT COUNT(*) AS appointmentCount
            FROM Appointments
            WHERE service_id = ? AND date = ? AND startTime = ? AND status IN ('confirmed', 'waitlisted')
        `;
    const [[{ appointmentCount }]] = await pool.execute(query, [
      service_id,
      date,
      startTime,
    ]);
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
  },

  async findBookedStaffIds(serviceId, date, startTime) {
    const query = `
            SELECT DISTINCT 
                a.staff_id 
            FROM 
                Appointments a
            WHERE 
                a.service_id = ? AND 
                a.date = ? AND 
                a.startTime = ?
        `;
    const [rows] = await pool.execute(query, [serviceId, date, startTime]);
    return rows.map((row) => row.staff_id);
  },
};

module.exports = Appointment;
