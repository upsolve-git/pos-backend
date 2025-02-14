const pool = require("../config/database");


const Salon = {
  async getById(userId) {
    const query = `SELECT * FROM Wallet WHERE user_id = ?`;
    const [[wallet]] = await pool.execute(query, [userId]);
    return wallet; // Return wallet details
  },

  async updateById(userId, credits) {
    const query = `
      UPDATE Wallet
      SET credits = credits + ?
      WHERE user_id = ?
    `;
    const [result] = await pool.execute(query, [credits, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('Wallet not found for this user');
    }
  
    return { message: 'Wallet updated successfully' };
  }

};

module.exports = Salon;
