const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');

const upload = multer(); // This handles multipart/form-database
router.post('/',upload.none() , createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurant);
router.put('/:id',upload.none() , updateRestaurant);
router.delete('/:id',upload.none() , deleteRestaurant);

module.exports = router;

// Multer is a middleware for handling multipart/form-data,
// mainly used for uploading files in Express.js. It parses incoming
// file data and stores it on the server or memory.