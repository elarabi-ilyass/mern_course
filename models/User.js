const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    maxlength: 500
  },
  website: String,
  location: String,
  birthDate: Date,
  avatar: String
}, { _id: false }); // _id: false prevents creating separate _id for embedded doc

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // Embedded one-to-one relationship
  profile: profileSchema,
  // Reference for address (Document Reference pattern)
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'addressId': 1 });

module.exports = mongoose.model('User', userSchema);