const express = require('express');
const router = express.Router();
const upload_image = require('../middleware/upload_image');
const {
  deleteImage,
  uploadImage
} = require('../controllers/Image-Controller');

// Add authentication middleware if needed
// const auth = require('../middleware/auth');

router.post('/uploadImage', upload_image.single('image'), uploadImage);
router.delete('/deleteImage/:imageId', deleteImage); // Fixed: added parameter

module.exports = router;