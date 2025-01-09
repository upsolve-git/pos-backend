const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/dotenv");

const AuthController = {
  async register(req, res) {
    try {
      const {
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password,
        dob = "",
        status = "active",
        is_subscribed = 0,
      } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const userId = await User.create({
        role,
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword,
        dob,
        status,
        is_subscribed,
      });

      // Respond with success message
      res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
      // Enhanced error logging
      console.error("Error registering user:", error);

      res.status(500).json({
        error: "Error registering user",
        details: error.message,
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
 
      // console.log(req.body);

      // Find user by email
      const user = await User.findByEmail(email);

      // Validate user existence and password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send token as a secure, HTTP-only cookie
      res.cookie("pos_token", token, {
        httpOnly: true,
        secure: true, // Change to true if using HTTPS
        sameSite: "None",
        maxAge: 3600000,
        path: "/", // Ensure the cookie is set for all paths
      });

      // Respond with user role
      res.json({ role: user.role });
    } catch (error) {
      console.error("Error logging in:", error);
      res
        .status(500)
        .json({ error: "Error logging in", details: error.message });
    }
  },

  async authenticate(req, res) {
    try {
      // Retrieve the token from cookies
      const token = req.cookies.pos_token;

      // Check if token exists
      if (!token) {
        return res
          .status(401)
          .json({ message: "Authentication token is missing" });
      }

      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded);

      // Check if the user's role is valid
      // const validRoles = ['customer', 'staff', 'admin'];
      // if (!validRoles.includes(decoded.role)) {
      //     return res.status(403).json({ message: 'Unauthorized role' });
      // }

      // Respond with success and user details
      res.json({
        message: "Authentication successful",
        role: decoded.role,
        userId: decoded.id,
      });
    } catch (error) {
      console.error("Error during authentication:", error);

      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Authentication token has expired" });
      }

      res
        .status(500)
        .json({ error: "Error during authentication", details: error.message });
    }
  },

  async logout(req, res) {
    try {
      // Clear the 'pos_token' cookie
      res.clearCookie("pos_token", {
        httpOnly: true,
        secure: true, // Change to true if using HTTPS
        sameSite: "None",
        path: "/", // Ensure the cookie is set for all paths
      });

      // Respond with a success message
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      res
        .status(500)
        .json({ error: "Error logging out", details: error.message });
    }
  },
};

module.exports = AuthController;
