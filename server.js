const express = require('express');
const {connectDB} = require('./config/database');
const userRoutes = require('./routes/users');
const addressRoutes = require('./routes/addresses');

const app = express();

// Connect to database
connectDB();

// Middleware
// app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'One-to-One Relationship API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});