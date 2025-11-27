const mongoose = require('mongoose');

const UsedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password:{
    type: String,
    required:true,
    unique:true
  }
});

module.exports = mongoose.model('Used', UsedSchema);
  