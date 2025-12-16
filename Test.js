// cloudinaryUtils.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * CREATE - Upload une image vers Cloudinary
 * @param {string} filePath - Chemin du fichier image
 * @param {string} folder - Dossier Cloudinary (optionnel)
 * @returns {Object} - URL et publicId de l'image
 */
const uploadImage = async (filePath, folder = 'images') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Erreur upload Cloudinary:', error);
    throw new Error(`Échec upload image: ${error.message}`);
  }
};

/**
 * READ - Récupère les informations d'une image
 * @param {string} publicId - ID public de l'image
 * @returns {Object} - Informations de l'image
 */
const getImageInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'image'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height,
      createdAt: result.created_at,
      tags: result.tags || []
    };
  } catch (error) {
    console.error('Erreur récupération info image:', error);
    throw new Error(`Impossible de récupérer l'image: ${error.message}`);
  }
};

/**
 * READ - Liste les images dans un dossier
 * @param {string} folder - Dossier Cloudinary
 * @param {number} maxResults - Nombre maximum de résultats
 * @returns {Array} - Liste des images
 */
const listImages = async (folder = 'images', maxResults = 100) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: maxResults,
      resource_type: 'image'
    });
    
    return result.resources.map(resource => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      size: resource.bytes,
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at
    }));
  } catch (error) {
    console.error('Erreur liste images:', error);
    throw new Error(`Impossible de lister les images: ${error.message}`);
  }
};

/**
 * UPDATE - Modifie une image (remplacement)
 * @param {string} publicId - ID public de l'image existante
 * @param {string} newFilePath - Chemin du nouveau fichier
 * @param {boolean} deleteOriginal - Supprimer l'original après remplacement
 * @returns {Object} - Nouvelle image
 */
const updateImage = async (publicId, newFilePath, deleteOriginal = true) => {
  try {
    // Télécharger la nouvelle image
    const uploadResult = await uploadImage(newFilePath, path.dirname(publicId));
    
    // Supprimer l'ancienne image si demandé
    if (deleteOriginal) {
      await deleteImage(publicId);
    }
    
    return uploadResult;
  } catch (error) {
    console.error('Erreur mise à jour image:', error);
    throw new Error(`Impossible de mettre à jour l'image: ${error.message}`);
  }
};

/**
 * UPDATE - Ajoute des tags à une image
 * @param {string} publicId - ID public de l'image
 * @param {Array} tags - Tags à ajouter
 * @returns {Object} - Résultat de l'opération
 */
const addImageTags = async (publicId, tags) => {
  try {
    const result = await cloudinary.uploader.add_tag(tags, publicId);
    return result;
  } catch (error) {
    console.error('Erreur ajout tags:', error);
    throw new Error(`Impossible d'ajouter les tags: ${error.message}`);
  }
};

/**
 * UPDATE - Supprime des tags d'une image
 * @param {string} publicId - ID public de l'image
 * @param {Array} tags - Tags à supprimer
 * @returns {Object} - Résultat de l'opération
 */
const removeImageTags = async (publicId, tags) => {
  try {
    const result = await cloudinary.uploader.remove_tag(tags, publicId);
    return result;
  } catch (error) {
    console.error('Erreur suppression tags:', error);
    throw new Error(`Impossible de supprimer les tags: ${error.message}`);
  }
};

/**
 * DELETE - Supprime une image de Cloudinary
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
 * DELETE - Supprime plusieurs images
 * @param {Array} publicIds - Tableau d'IDs publics
 * @returns {Object} - Résultats de suppression
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => 
      deleteImage(publicId)
    );
    
    const results = await Promise.allSettled(deletePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    return {
      total: publicIds.length,
      successful: successful.length,
      failed: failed.length,
      failedIds: failed.map(f => f.reason?.message || 'Unknown error')
    };
  } catch (error) {
    console.error('Erreur suppression multiple:', error);
    throw new Error(`Échec suppression images multiples: ${error.message}`);
  }
};

/**
 * CREATE - Upload multiple d'images
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

/**
 * CREATE - Upload à partir d'une URL
 * @param {string} imageUrl - URL de l'image
 * @param {string} folder - Dossier Cloudinary
 * @returns {Object} - URL et publicId de l'image
 */
const uploadFromUrl = async (imageUrl, folder = 'images') => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: 'auto'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes
    };
  } catch (error) {
    console.error('Erreur upload depuis URL:', error);
    throw new Error(`Échec upload depuis URL: ${error.message}`);
  }
};

/**
 * READ - Génère une URL optimisée avec transformations
 * @param {string} publicId - ID public de l'image
 * @param {Object} options - Options de transformation
 * @returns {string} - URL optimisée
 */
const generateOptimizedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: options.width || 800,
    height: options.height || null,
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'limit'
  };
  
  return cloudinary.url(publicId, {
    ...defaultOptions,
    ...options
  });
};

/**
 * DELETE - Vide un dossier complet
 * @param {string} folder - Dossier à vider
 * @returns {Object} - Résultat de l'opération
 */
const deleteFolder = async (folder) => {
  try {
    const result = await cloudinary.api.delete_folder(folder);
    return result;
  } catch (error) {
    console.error('Erreur suppression dossier:', error);
    throw new Error(`Impossible de supprimer le dossier: ${error.message}`);
  }
};

module.exports = {
  // CREATE operations
  uploadImage,
  uploadMultipleImages,
  uploadFromUrl,
  
  // READ operations
  getImageInfo,
  listImages,
  generateOptimizedUrl,
  
  // UPDATE operations
  updateImage,
  addImageTags,
  removeImageTags,
  
  // DELETE operations
  deleteImage,
  deleteMultipleImages,
  deleteFolder
};