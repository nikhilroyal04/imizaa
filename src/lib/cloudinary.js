import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

/**
 * Upload an image to Cloudinary from a formidable file object
 * @param {Object} file - The formidable file object
 * @param {string} folder - The folder to upload to
 * @returns {Promise<Object>} - The Cloudinary upload response
 */
export const uploadImage = async (file, folder = 'imiiza_documents') => {
  try {
    // For formidable file objects, we need to use the filepath
    const filePath = file.filepath;

    // Upload to Cloudinary using the file path
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });

    // Clean up the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary file:', cleanupError);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default cloudinary;
