const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createUser,
  getUser,
  updateProfile,
  getUserWithAddress,
  getUsersWithAddresses
} = require('../controllers/userController');

const upload = multer(); // This handles multipart/form-data

router.post('/', upload.none() ,createUser);
router.get('/:id', getUser);
router.put('/:id/profile',upload.none() , updateProfile);
router.get('/:id/with-address', getUserWithAddress);
router.get('/', getUsersWithAddresses);

module.exports = router;