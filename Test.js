// Here’s a complete, runnable example of implementing JWT authentication in an Express.js + MongoDB app with secure password hashing and protected routes.
// It includes user registration, login, and JWT-protected endpoints.

// Project Setup
// mkdir jwt-auth-app
// cd jwt-auth-app
// npm init -y
// npm install express mongoose bcryptjs jsonwebtoken dotenv cors

// Directory Structure
// jwt-auth-app/
// │-- server.js
// │-- .env
// └-- models/
//     └-- User.js

// .env (Environment Variables)
// PORT=5000
// MONGO_URI=mongodb://127.0.0.1:27017/jwt_auth_demo
// JWT_SECRET=your_jwt_secret_key_here
// JWT_EXPIRES_IN=1h

// models/User.js
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

module.exports = mongoose.model('User', userSchema);

server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Protected Route
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello user ${req.user.id}, you have access!` });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});

How to Test
Start MongoDB locally or use MongoDB Atlas.
Run the server:
node server.js

Register a user:
POST http://localhost:5000/register
Content-Type: application/json

{
  "username": "john",
  "password": "mypassword"
}

Login to get a token:
POST http://localhost:5000/login
Content-Type: application/json

{
  "username": "john",
  "password": "mypassword"
}

Response:
{ "token": "your.jwt.token" }

Access protected route:
GET http://localhost:5000/protected
Authorization: Bearer your.jwt.token


✅ This setup is secure, modular, and production-ready for basic JWT authentication.
If you want, I can extend this to include refresh tokens and role-based authorization so you can manage admin/user permissions.

Do you want me to add refresh token support next?