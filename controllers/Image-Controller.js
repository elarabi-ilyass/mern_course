const CloudinaryHelper = require('../Helpers/CloudinaryHelper'); // Fixed path
const Image = require('../models/Image');

// Upload Image Controller
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload image to Cloudinary
    const uploadResult = await CloudinaryHelper.uploadImage(req.file.path);

    // Save image details to MongoDB
    const newImage = new Image({
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    await newImage.save();

    res.status(201).json({ 
      message: 'Image uploaded successfully', 
      image: newImage 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Image Controller
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find image in MongoDB
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete image from Cloudinary
    await CloudinaryHelper.deleteImage(image.publicId);

    // Remove image document from MongoDB - FIXED: use deleteOne instead of remove
    await Image.findByIdAndDelete(imageId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
};