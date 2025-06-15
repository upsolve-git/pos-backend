const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const staffRoutes = require("./routes/staffRoutes");
const customerRoutes = require("./routes/customerRoutes");
const cookieParser = require("cookie-parser");
const { pool } = require("./config/database");
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require("bcrypt");

const allowedOrigins = [
  "https://main.d29iicb8es15um.amplifyapp.com",
  "http://localhost:3000",
  "http://192.168.29.48:8081",
  "http://192.168.29.42:8081",
  "https://www.canadiangelnails.com",
  "http://localhost:3001",
  "http://192.168.29.164"
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Route setup
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/customer", customerRoutes);

// Start server
(async () => {
  try {
    await pool// Initialize database connection
    app.listen(PORT, async() => {
      console.log(await bcrypt.hash("Test@123", 10));
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
})();
