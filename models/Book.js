const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);