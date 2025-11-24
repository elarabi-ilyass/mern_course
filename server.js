const express = require('express');
const {connectDB} = require('./config/database');
const authorRoutes = require('./routes/author');
const bookRoutes = require('./routes/book');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Many-to-Many Relationship API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});