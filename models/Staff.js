const pool = require("../config/database");

const Staff = {
  // Method to create a staff entry
  async create({ user_id, hourlyWage, service_id }) {
    const query = `
            INSERT INTO Staff (user_id, hourlyWage, service_id)
            VALUES (?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      user_id,
      hourlyWage,
      service_id,
    ]);
    return result.insertId; // Return the staff_id
  },

  async updateAvailability(staff_id, availability) {
    const query = `
            UPDATE Staff
            SET available = ?
            WHERE staff_id = ?
        `;
    const [result] = await pool.execute(query, [availability, staff_id]);
    return result.affectedRows > 0;
  },

  async getAll() {
    const query = `
          SELECT 
              s.*, 
              CONCAT(u.first_name, ' ', u.last_name) AS name,
              u.phone_number, u.email,
              u.id as id,
              serv.name as service_name
          FROM 
              Staff s 
          JOIN 
              users u ON s.user_id = u.id
          JOIN 
              Services serv on s.service_id = serv.service_id;
        `;

    const [rows] = await pool.execute(query);
    return rows;
  },

  async findAllByServiceId(service_id) {
    const query = `
          SELECT 
              s.staff_id , 
              CONCAT(u.first_name, ' ', u.last_name) AS name
          FROM 
              Staff s 
          JOIN 
              users u ON s.user_id = u.id
          WHERE 
              s.service_id = ? AND s.available = true;
        `;

    const [rows] = await pool.execute(query, [service_id]);
    return rows;
  },
};

module.exports = Staff;
