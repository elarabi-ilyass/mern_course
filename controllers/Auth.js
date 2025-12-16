const Used = require('../models/Used');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.Register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    let user = await Used.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new Used({ name, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign(
      {
        userid: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here_make_it_long',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Default fallback
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await Used.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = jwt.sign(
      {
        userid: user._id,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key_here_make_it_long',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Default fallback
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


