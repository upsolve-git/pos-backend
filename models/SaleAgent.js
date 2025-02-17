const pool = require("../config/database");

const SaleAgent = {
  // Method to create a staff entry
  async create({ user_id, commision}) {
    const query = `
            INSERT INTO SaleAgent (user_id, commision)
            VALUES (?, ?)
        `;
    const [result] = await pool.execute(query, [
      user_id,
      commision
    ]);
    return result.insertId; // Return the staff_id
  },

};

module.exports = SaleAgent;
