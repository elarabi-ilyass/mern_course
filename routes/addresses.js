const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createAddress,
  getAddressWithUser,
  updateAddress,
  getAddressesByCity
} = require('../controllers/addressController');

const upload = multer(); // This handles multipart/form-data

router.post('/',upload.none() ,createAddress);
router.get('/:id', getAddressWithUser);
router.put('/:id',upload.none() , updateAddress);
router.get('/city/:city', getAddressesByCity);


module.exports = router;