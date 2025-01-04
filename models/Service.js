const pool = require('../config/database');

const Service = {
    async create({ name, description, price, duration, limitPerDay }) {
        const query = `
            INSERT INTO services (name, description, price, duration, limitPerDay)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [name, description, price, duration, limitPerDay]);
        return result.insertId;
    },

    async getServiceDetails(service_id) {
        const query = `SELECT limitPerDay FROM Services WHERE service_id = ?`;
        const [[service]] = await pool.execute(query, [service_id]);
        return service;
    },

    async getAll() {
        await this.useDatabase();
        const query = `SELECT * FROM Services`;
        const [rows] = await pool.execute(query);
        return rows;
    },

    async useDatabase() {
        const query = `USE store_management`;
        await pool.query(query);
    },
};

module.exports = Service;
