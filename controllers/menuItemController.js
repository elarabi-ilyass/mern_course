const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// Create a new menu item for a restaurant
exports.createMenuItem = async (req, res) => {
  try {
    // Verify restaurant exists
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    
    // Get menu item with restaurant details using aggregation
    const menuItemsWithRestaurant = await MenuItem.aggregate([
      {
        $match: { _id: menuItem._id }
      },
      {
        $lookup: {
          from: 'restaurants', // collection name in MongoDB
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant' // Convert array to object
      }
    ]);

    res.status(201).json({
      success: true,
      data: menuItemsWithRestaurant[0]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all menu items with restaurant details using $lookup
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.aggregate([
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: {
          path: '$restaurant',
          preserveNullAndEmptyArrays: true // Keep menu items even if restaurant not found
        }
      },
      {
        $sort: { name: 1 } // Sort by menu item name
      }
    ]);
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get menu items by restaurant with aggregation
exports.getMenuItemsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    // Verify restaurant exists and get menu items in single aggregation
    const result = await Restaurant.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(restaurantId) }
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

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    const restaurantWithMenu = result[0];

    res.json({
      success: true,
      count: restaurantWithMenu.menuItems.length,
      data: {
        restaurant: {
          _id: restaurantWithMenu._id,
          name: restaurantWithMenu.name,
          description: restaurantWithMenu.description,
          address: restaurantWithMenu.address
        },
        menuItems: restaurantWithMenu.menuItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Alternative version of getMenuItemsByRestaurant using separate aggregation
exports.getMenuItemsByRestaurantAlternative = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    
    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    // Get menu items for this restaurant
    const menuItems = await MenuItem.aggregate([
      {
        $match: { restaurant: mongoose.Types.ObjectId(restaurantId) }
      },
      {
        $sort: { price: 1 } // Sort by price
      }
    ]);

    res.json({
      success: true,
      count: menuItems.length,
      data: {
        restaurant: restaurant,
        menuItems: menuItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single menu item with restaurant details using aggregation
exports.getMenuItem = async (req, res) => {
  try {
    const menuItems = await MenuItem.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: {
          path: '$restaurant',
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItems[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update menu item with aggregation for response
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    // Get updated menu item with restaurant details using aggregation
    const updatedMenuItems = await MenuItem.aggregate([
      {
        $match: { _id: menuItem._id }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      {
        $unwind: '$restaurant'
      }
    ]);

    res.json({
      success: true,
      data: updatedMenuItems[0],
      request:req.body
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully',
      deletedItem: {
        name: menuItem.name,
        price: menuItem.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};




// Advanced aggregation example with filtering and projection
// Controller to get menu items with filters (price, category) and sorting
exports.getMenuItemsWithFilters = async (req, res) => {
  try {
    // Extract query parameters from the URL
    // Example: /menu-items?minPrice=10&maxPrice=50&category=Pizza&sortBy=price&sortOrder=desc
    const { minPrice, maxPrice, category, sortBy = 'name', sortOrder = 'asc' } = req.query;

    // Start building MongoDB aggregation pipeline
    const pipeline = [
      {
        // Join MenuItem with Restaurant collection
        $lookup: {
          from: 'restaurants',        // name of the collection to join
          localField: 'restaurant',   // field inside MenuItem
          foreignField: '_id',        // field inside Restaurant
          as: 'restaurant'            // result will appear as an array: restaurant: [...]
        }
      },
      {
        // Unwind the restaurant array to a single object
        $unwind: '$restaurant'
      }
    ];

    // Create an empty match object to store filters
    const matchStage = {};

    // Add price filtering if minPrice or maxPrice exists
    if (minPrice || maxPrice) {
      matchStage.price = {}; // prepare price object

      if (minPrice) {
        // Convert minPrice to number and set minimum price filter
        matchStage.price.$gte = parseFloat(minPrice);
      }

      if (maxPrice) {
        // Convert maxPrice to number and set maximum price filter
        matchStage.price.$lte = parseFloat(maxPrice);
      }
    }

    // Add category filter if provided
    if (category) {
      matchStage.category = category;
    }

    // Only add $match stage if we actually have filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Sorting stage
    const sortStage = {};
    sortStage[sortBy] = sortOrder === 'desc' ? -1 : 1; // -1 = descending, 1 = ascending

    // Add sorting stage to the pipeline
    pipeline.push({ $sort: sortStage });

    // Run the aggregation pipeline on MenuItem collection
    const menuItems = await MenuItem.aggregate(pipeline);

    // Return success response
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });

  } catch (error) {
    // Return error response if something goes wrong
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
