const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenv');

const AuthController = {
    async register(req, res) {
        try {
            const { role, first_name, last_name, phone_number, email, password, dob = '', status = 'active', is_subscribed = 0 } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
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
            res.status(201).json({ message: 'User registered successfully', userId });
        } catch (error) {
            res.status(500).json({ error: 'Error registering user', details: error.message });
        }
    },



    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role, userId: user.id });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in', details: error.message });
        }
    },
};

module.exports = AuthController;
