const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByRestaurant,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsWithFilters
} = require('../controllers/menuItemController');

const upload = multer(); // This handles multipart/form-database
router.post('/',upload.none() ,createMenuItem);
router.get('/', getAllMenuItems);
router.get('/restaurant', getMenuItemsWithFilters);
router.get('/restaurant/:restaurantId',getMenuItemsByRestaurant);
router.get('/:id', getMenuItem);
router.put('/:id', upload.none() ,updateMenuItem);
router.delete('/:id',upload.none() , deleteMenuItem);

module.exports = router;