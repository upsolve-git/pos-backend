const mysql = require('mysql2');

function createConnection() {
  return new Promise((resolve, reject) => {
    const db = mysql.createConnection({
      host: 'cgndbinstance.ctecww4uw29g.us-east-1.rds.amazonaws.com',
  user: 'root', // Ensure this is the correct username
  password: 'CGN_db2024', // Ensure this is the correct password
  database: 'store_management', // Ensure you're connecting to the correct database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
    });

    db.connect((err) => {
      if (err) {
        console.log("error", err)
        return reject(err);
      }
      console.log('Connected to MySQL database.');
      resolve(db);
    });
  });
}

module.exports = createConnection;