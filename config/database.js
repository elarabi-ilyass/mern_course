const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore', 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn; // Optionnel: retourner la connexion
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1); // Quitter le processus en cas d'erreur
  }
};

// Exportation de la fonction de connexion ET de mongoose
module.exports = { connectDB, mongoose };