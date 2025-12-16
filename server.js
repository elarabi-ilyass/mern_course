const express = require('express');
const {connectDB} = require('./config/database');
const ItemRoutes = require('./routes/AuthRoutes');
const {authMiddleware} = require('./middleware/authMiddleware'); // ← Vérifiez le chemin
const multer = require('multer');
const ImageRoutes = require('./routes/Image'); // ← Importer les routes d'images
require('dotenv').config();


const app = express();
const upload = multer(); // This handles multipart/form-database

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', ItemRoutes);
app.use('/api/images', ImageRoutes); // ← Ajout de la route pour les images

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Many-to-one  Relationship API' });
});

app.get('/profile',upload.none() ,authMiddleware, (req, res) => {      
    res.json({ user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
