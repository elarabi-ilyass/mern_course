const mongoose = require('mongoose');
require('dotenv').config();

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required' ],
    trim: true,
    maxlegth: [100, 'Title cannot exceed 100 characters' ]
  },
    author: {
    type: String,
    trim: true,
    default: 'Auteur inconnu'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
    publishedYear: {
    type: Number,
    min: [1000, 'Année de publication invalide']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// Export du modèle
module.exports = mongoose.model('Book', bookSchema);