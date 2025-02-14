const pool  = require("../config/database");


const Salon = {
  async create({
    salon_name,
    owner_name,
    contact_email,
    contact_mobile,
    bank_account,
    number_of_systems,
    price_per_system,
    password,
  }) {
    const query = `
      INSERT INTO Salons (salon_name, owner_name, contact_email, contact_mobile, bank_account, number_of_systems, price_per_system, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.useDatabase();
    try {
      
      const [result] = await pool.execute(query, [
        salon_name,
        owner_name,
        contact_email,
        contact_mobile,
        bank_account,
        number_of_systems,
        price_per_system,
        password,
      ]);

      // result.insertId will give you the ID of the newly inserted record
      return result.insertId;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  async getById(salonId) {
    await this.useDatabase();
    const query = `SELECT * FROM Salons WHERE id = ?`;
    const [[salon]] = await pool.execute(query, [salonId]);
    return salon; // Return salon details
  },

  async getAll() {
    await this.useDatabase();
    const query = `SELECT * FROM Salons`;
    const [salons] = await pool.execute(query);
    return salons; // Return all salons
  },

  async update(salonId, updateFields) {
    await this.useDatabase();
    const fields = Object.keys(updateFields)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = [...Object.values(updateFields), salonId];

    const query = `UPDATE Salons SET ${fields}, updated_at = NOW() WHERE id = ?`;
    const [result] = await pool.execute(query, values);
    return result.affectedRows; // Return number of affected rows
  },
  async useDatabase() {
    const query = `USE store_management`;
    await pool.query(query);
  },
};

module.exports = Salon;
