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
        referal_mail
      } = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user in the database
      const userId = await User.create({
        role:"customer",
        first_name,
        last_name,
        phone_number,
        email,
        password: hashedPassword,
        dob,
        status,
        is_subscribed,
        referal_mail
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

      console.log(req.body);

      // Find user by email
      const user = await User.findByEmail(email);

      // Validate user existence and password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        console.log("Invalid email or password");
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
        path: "/",
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

  authenticate(req, res, next) {
    console.log("in authenticate ",req.cookies.pos_token)
    const token = req.cookies.pos_token; // Assuming you're using cookies for the token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach decoded user data to the request object
      next(); // Proceed to next middleware
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  },


  isAdmin(req, res) {
    console.log(req.cookies)
    const token = req.cookies.pos_token; // Assuming you're using cookies for the token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ role: decoded.role, userId: decoded.id });
      
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  },

  // Authorization middleware for role
  authorize(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res
          .status(403)
          .json({
            message: "Forbidden: You do not have the required permissions",
          });
      }
      next(); // Proceed to next middleware if the user has the correct role
    };
  },

  async logout(req, res) {
    try {
      // Clear the 'pos_token' cookie
      res.clearCookie("pos_token", {
        httpOnly: true,
        secure: false, // Change to true if using HTTPS
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
