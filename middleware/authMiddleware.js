const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenv');

// Middleware to authenticate users
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to authorize roles
const authorize = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
};

module.exports = { authenticate, authorize };
