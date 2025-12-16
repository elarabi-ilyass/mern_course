const multer = require('multer');
const path = require('path');

// Configure how files will be stored on disk
const storage = multer.diskStorage({

  // This function decides WHERE to save the uploaded file
  destination: function (req, file, cb) {
    // Save all uploaded files inside the "uploads" folder
    cb(null, 'uploads/'); 
  },

  // This function decides the NAME of the uploaded file
  filename: function (req, file, cb) {
    // Create a unique file name using the current timestamp + original file extension
    // Example: 1701234567890.jpg
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


// File filter → Only allow images (jpeg, jpg, png, gif)
const fileFilter = (req, file, cb) => {

  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif/;

  // Check the file extension (ex: .jpg, .png)
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check the file MIME type (ex: image/png)
  const mimetype = allowedTypes.test(file.mimetype);

  // If both extension and MIME type are allowed → accept the file
  if (mimetype && extname) {
    cb(null, true);
  } 
  // Otherwise → reject the file and send an error
  else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create the upload middleware using the storage and file filter
const upload_image = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Export the upload middleware so it can be used in routes
module.exports = upload_image;
