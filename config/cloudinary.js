// Import and initialize the Cloudinary SDK v2 for cloud-based media management
const cloudinary = require('cloudinary').v2

// Load environment variables from a .env file for secure configuration
require('dotenv').config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,    // Your Cloudinary cloud name (public identifier)
    api_key: process.env.CLOUDINARY_API_KEY,          // Your Cloudinary API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET     // Your secret API key for secure authentication
});

// Export the configured Cloudinary instance for use throughout the application
// This creates a reusable module that can be imported in other files
module.exports = cloudinary;
