const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'USA',
    trim: true
  },
  // Reference back to user (optional, for bidirectional relationship)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensures one-to-one relationship
  }
}, {
  timestamps: true
});

// Compound index for better query performance
addressSchema.index({ city: 1, state: 1 });
addressSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Address', addressSchema);