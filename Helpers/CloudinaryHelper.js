//cloudinaryUtils.js
const cloudinary = require('../config/cloudinary'); // Chemin corrigé

/**
 * Upload une image vers Cloudinary
 * @param {string} filePath - Chemin du fichier image
 * @param {string} folder - Dossier Cloudinary (optionnel)
 * @returns {Object} - URL et publicId de l'image
 */
const uploadImage = async (filePath, folder = 'images') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Détecte automatiquement le type
      quality: 'auto', // Optimisation automatique
      fetch_format: 'auto'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    throw new Error(`Échec upload image: ${error.message}`);
  }
};

/**
 * Supprime une image de Cloudinary
 * @param {string} publicId - ID public de l'image
 * @returns {Object} - Résultat de la suppression
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
    
    return result;
  } catch (error) {
    console.error('Erreur suppression Cloudinary:', error);
    throw new Error(`Échec suppression image: ${error.message}`);
  }
};

/**
 * Upload multiple d'images
 * @param {Array} filePaths - Tableau de chemins de fichiers
 * @param {string} folder - Dossier Cloudinary
 * @returns {Array} - Tableau des résultats
 */
const uploadMultipleImages = async (filePaths, folder = 'images') => {
  try {
    const uploadPromises = filePaths.map(filePath => 
      uploadImage(filePath, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
    
  } catch (error) {
    console.error('Erreur upload multiple:', error);
    throw new Error(`Échec upload images multiples: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  uploadMultipleImages
};


