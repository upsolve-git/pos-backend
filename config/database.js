const mysql = require('mysql2/promise');
require('./dotenv.js');

const pool = mysql.createPool({
    host: 'cgndbinstance.ctecww4uw29g.us-east-1.rds.amazonaws.com',
    user: 'root', // Ensure this is the correct username
    password: 'CGN_db2024', // Ensure this is the correct password
    database: 'store_management', // Ensure you're connecting to the correct database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    keepAliveInitialDelay: 300000, // 5 minutes
    enableKeepAlive: true
});

module.exports = pool;
