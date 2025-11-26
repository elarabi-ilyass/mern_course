const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');


// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all restaurants with their menu items using $lookup
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.aggregate([
      {
        $lookup: {
          from: 'menuitems', // collection name in MongoDB (usually pluralized)
          localField: '_id', // field from Restaurant collection
          foreignField: 'restaurant', // field from MenuItem collection
          as: 'menuItems' // output array field name
        }
      }
    ]);

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    }) ;
  }
};

// Get single restaurant with menu items using $lookup
exports.getRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: 'restaurant',
          as: 'menuItems'
        }
      }
    ]);

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: restaurants[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Alternative version using findById + separate lookup (if you prefer)
exports.getRestaurantAlternative = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Manual join using separate query
    const menuItems = await MenuItem.find({ restaurant: req.params.id });
    const restaurantWithMenu = {
      ...restaurant.toObject(),
      menuItems: menuItems
    };

    res.json({
      success: true,
      data: restaurantWithMenu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete restaurant and its menu items
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Delete all menu items associated with this restaurant
    await MenuItem.deleteMany({ restaurant: req.params.id });
    
    // Delete the restaurant
    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Restaurant and associated menu items deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


