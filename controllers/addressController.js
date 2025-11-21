const Address = require('../models/Address');
const User = require('../models/User');

// Create address and link to user (Document Reference Pattern)
const createAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country, userId } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user already has an address
    const existingAddress = await Address.findOne({ userId });
    if (existingAddress) {
      return res.status(400).json({
        success: false,
        error: 'User already has an address'
      });
    }

    const address = await Address.create({
      street,
      city,
      state,
      zipCode,
      country,
      userId
    });

    // Update user with address reference
    await User.findByIdAndUpdate(userId, { addressId: address._id });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get address with user details
const getAddressWithUser = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id)
                    .populate('userId', 'name email profile.avatar');
    
    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    
    const address = await Address.findByIdAndUpdate(
      req.params.id,
      {
        street,
        city,
        state,
        zipCode,
        country
      },
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Find addresses by city with user details
const getAddressesByCity = async (req, res) => {
  try {
    const addresses = await Address.aggregate([
      {
        $match: { city: req.params.city }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          street: 1,
          city: 1,
          state: 1,
          zipCode: 1,
          'user.name': 1,
          'user.email': 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createAddress,
  getAddressWithUser,
  updateAddress,
  getAddressesByCity
};