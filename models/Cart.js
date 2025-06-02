const pool = require("../config/database");

const Appointment = {
  // Method to insert to cart
  async insert({
    customer_id,
    service_id,
    date,
    startTime,
    staff_id,
  }) {
    console.log(staff_id);
    const query = `
            INSERT INTO Cart (customer_id, service_id, date, startTime, staff_id)
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      customer_id,
      service_id,
      date,
      startTime,
      staff_id,
    ]);
    return result.insertId;
  },

  async getCartByCustomerId(customerId) {
    const query = `
            SELECT 
                a.cart_id, 
                a.date, 
                a.startTime, 
                s.name AS serviceName, 
                s.description AS serviceDescription, 
                s.price AS servicePrice 
            FROM 
                Cart a 
            JOIN 
                Services s ON a.service_id = s.service_id 
            WHERE 
                a.customer_id = ?
        `;
    const [rows] = await pool.execute(query, [customerId]);
    return rows;
  },

  async getItemsByCustomerId(customerId) {
    const query = `
            SELECT 
                * FROM Cart
            WHERE 
                customer_id = ?
        `;
    const [rows] = await pool.execute(query, [customerId]);
    return rows;
  },

  async delete({
    cart_id
  }) {
    const query = `
            DELETE FROM Cart WHERE cart_id = ?
        `;
    const result = await pool.execute(query, [
     cart_id
    ]);
    return result;
  },

  async clearCustomerCart({
    customer_id
  }) {
    const query = `
            DELETE FROM Cart WHERE customer_id = ?
        `;
    const result = await pool.execute(query, [
      customer_id
    ]);
    return result;
  }
};

module.exports = Appointment;
