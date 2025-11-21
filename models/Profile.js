// models/profile.model.js
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
}, { _id: false }); // No separate _id for embedded subdocument

module.exports = profileSchema; // Export ONLY the schema
