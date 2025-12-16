const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    uploadedBy: {  // Add this if you need user association
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Set to true if authentication is required
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', ImageSchema);