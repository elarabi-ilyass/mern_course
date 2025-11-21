const User = require('../models/User');
const Address = require('../models/Address');

// Create user with embedded profile (Embedded Pattern)
const createUser = async (req, res) => {
  try {
    const { name, email, bio, website, location, birthDate, avatar } = req.body;

    const userData = {
      name,
      email,
      profile: {
        bio,
        website,
        location,
        birthDate,
        avatar
      }
    };

    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user with embedded profile
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update embedded profile
const updateProfile = async (req, res) => {
  try {
    const { bio, website, location, birthDate, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          'profile.bio': bio,
          'profile.website': website,
          'profile.location': location,
          'profile.birthDate': birthDate,
          'profile.avatar': avatar
        }
      },
      { new: true, runValidators: true } 
      //new: true to return the updated document  after update 
      //runValidators: apply the schema rules during an update 
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get user with populated address (Document Reference Pattern)
const getUserWithAddress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('addressId');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all users with their addresses using aggregation
const getUsersWithAddresses = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'addresses',
          localField: 'addressId',
          foreignField: '_id',
          as: 'address'
        }
      },
      {
        $unwind: {
          path: '$address',
          preserveNullAndEmptyArrays: true // Include users without addresses
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          'profile.bio': 1,
          'profile.avatar': 1,
          'address.street': 1,
          'address.city': 1,
          'address.state': 1,
          'address.zipCode': 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  getUser,
  updateProfile,
  getUserWithAddress,
  getUsersWithAddresses
};



// This example with populate('addressId')
// {
//   "name": "Ilyass",
//   "email": "test@gmail.com",
//   "addressId": {
//     "_id": "65f3c8a4b2c9183b8a9d5892",
//     "city": "Tanger",
//     "street": "Avenue Mohamed VI",
//     "country": "Morocco",
//     "postalCode": "90000"
//   }
// }

// This example without populate('addressId')
// {
//   "name": "Ilyass",
//   "email": "test@gmail.com",
//   "addressId": "65f3c8a4b2c9183b8a9d5892" 
// }

// 👉 populate('addressId') = remplace l’ObjectId par le document complet de l’adresse
// 👉 équivalent de JOIN entre User et Address
// 👉 te permet d’avoir toutes les infos du user + address en 1 seule query


//==================================================================



// | Opération    | Rôle                                                |
// | ------------ | --------------------------------------------------- |
// | **$lookup**  | Fais un JOIN : User ↔ Address (retourne un tableau) |
// | **$unwind**  | Enlève le tableau et retourne l’objet seul          |
// | **$project** | Choisit les champs à retourner                      |

//preserveNullAndEmptyArrays: true
// Pour retourne just l'objet avec l'address car il y a des users qui n'ont pas d'address