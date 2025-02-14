const pool = require("../config/database");

const Service = {
  async create({
    name,
    description,
    price,
    duration,
    commissionRate,
    limitPerDay,
  }) {
    const query = `
            INSERT INTO Services (name, description, price, duration, commissionRate, limitPerDay)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      name,
      description,
      price,
      duration,
      commissionRate,
      limitPerDay,
    ]);
    return result.insertId;
  },

  async getServiceDetails(service_id) {
    const query = `SELECT limitPerDay FROM Services WHERE service_id = ?`;
    const [[service]] = await pool.execute(query, [service_id]);
    return service;
  },

    async getServiceName(service_id) {
        const query = `SELECT name FROM Services WHERE service_id = ?`;
        const [[service]] = await pool.execute(query, [service_id]);
        return service;
    },

    async getAll() {
        await this.useDatabase();
        const query = `SELECT * FROM Services`;
        const [rows] = await pool.execute(query);
        return rows;
    },
    
    async getAllBySalonId(salon_id) {
      await this.useDatabase();
      const query = `SELECT * FROM Services WHERE salon_id = ?`;
      const [rows] = await pool.execute(query, [salon_id]);
      return rows;
  },

  async useDatabase() {
    const query = `USE store_management`;
    await pool.query(query);
  },
};

module.exports = Service;
