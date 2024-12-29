const pool = require('../config/database');

const Service = {
    async create({ name, description, price, duration }) {
        const query = `
            INSERT INTO services (name, description, price, duration)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [name, description, price, duration]);
        return result.insertId;
    },

    async getAll() {
        const query = `SELECT * FROM services`;
        const [rows] = await pool.execute(query);
        return rows;
    },
};

module.exports = Service;
