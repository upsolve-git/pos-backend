const pool = require("../config/database");

const Staff = {
  // Method to create a staff entry
  async create({ user_id, hourlyWage, specialisation }) {
    const query = `
            INSERT INTO Staff (user_id, hourlyWage, specialisation)
            VALUES (?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      user_id,
      hourlyWage,
      specialisation,
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
              u.* 
          FROM 
              Staff s 
          JOIN 
              users u ON s.user_id = u.id;
        `;

    const [rows] = await pool.execute(query);
    return rows;
  },

  async findAllByServiceId(serviceId) {
    const query = `
          SELECT 
              s.staff_id , 
              u.first_name, 
              u.last_name 
          FROM 
              Staff s 
          JOIN 
              users u ON s.user_id = u.id
          WHERE 
              s.service_id = ? AND s.available = true;
        `;
  
    const [rows] = await pool.execute(query, [serviceId]);
    return rows;
  }
  
  
};

module.exports = Staff;
