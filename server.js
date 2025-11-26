const express = require('express');
const {connectDB} = require('./config/database');
const menuItemRoutes = require('./routes/menuItemRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/menuItemRoutes', menuItemRoutes);
app.use('/api/restaurantRoutes', restaurantRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Many-to-one Relationship API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});