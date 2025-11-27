const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  Register,
  Login,
} = require('../controllers/Auth');

const upload = multer(); // This handles multipart/form-database
router.post('/registered',upload.none() , Register);
router.get('/login',upload.none() , Login);




module.exports = router;

// Multer is a middleware for handling multipart/form-data,
// mainly used for uploading files in Express.js. It parses incoming
// file data and stores it on the server or memory.