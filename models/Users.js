const pool = require("../config/database");

const User = {
  // Create a new user
  async create({
    role,
    first_name,
    last_name,
    phone_number,
    email,
    password,
    dob = "",
    status = "active",
    is_subscribed = 0,
    referal_mail
  }) {
    // Switch to the specified database
    await this.useDatabase();
    console.log(role, first_name, last_name, phone_number, email, password, dob, status, is_subscribed, referal_mail);
    const query = `
            INSERT INTO users (
                role,
                first_name,
                last_name,
                phone_number,
                email,
                password,
                dob,
                status,
                is_subscribed,
                referal_mail
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      role,
      first_name,
      last_name,
      phone_number,
      email,
      password,
      dob,
      status,
      is_subscribed,
      referal_mail
    ]);
    return result.insertId;
  },

  // Find a user by email
  async findByEmail(email) {
    await this.useDatabase(); // Switch to the specified database
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  },

  async findByid(id) {
    await this.useDatabase(); // Switch to the specified database
    const query = `SELECT * FROM users WHERE id = ?`;
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  },

  async getAll() {
    const query = `SELECT * FROM users`;
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getUserByRole(role) {
    const query = ` SELECT 
            CONCAT(u.first_name, ' ', u.last_name) AS name,
            u.phone_number, u.email
        FROM 
            users u
            WHERE u.role = ?`;
    const [rows] = await pool.execute(query, [role]);
    return rows;
  },

  async updateUserDetails(first_name, last_name, phone_number, dob, user_id){
    const query = ` UPDATE users
    SET first_name = ?,
      last_name = ?,
      phone_number = ?,
      dob = ?
    WHERE user_id = ?
    `

    let [res] = await pool.execute(query, [first_name, last_name, phone_number, dob, user_id])

    return [res]
  },

  // Switch the database dynamically
  async useDatabase() {
    const query = `USE store_management`;
    await pool.query(query);
  },
  async updateStatus(appointment_id, status) {
    const query = `UPDATE Appointments SET status = ? WHERE appointment_id = ?`;
    const [result] = await pool.execute(query, [status, appointment_id]);
    return result.affectedRows > 0;
  },
};

module.exports = User;
