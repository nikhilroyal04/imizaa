/**
 * Transforms a Cloudinary URL to apply image transformations
 * @param {string} url - The original Cloudinary URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Width in pixels
 * @param {number} options.height - Height in pixels
 * @param {string} options.crop - Crop mode (fill, scale, fit, etc.)
 * @param {string} options.quality - Image quality (auto, good, best, etc.)
 * @returns {string} - Transformed URL
 */
export const transformCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not a Cloudinary URL
  }

  // Default options
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Find the upload part of the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  // Split the URL at the upload part
  const baseUrl = url.substring(0, uploadIndex + 8); // Include '/upload/'
  const imageUrl = url.substring(uploadIndex + 8);

  // Build transformation string
  let transformation = '';
  
  if (width || height) {
    transformation += 'c_' + crop + ',q_' + quality + ',f_' + format;
    
    if (width) transformation += ',w_' + width;
    if (height) transformation += ',h_' + height;
    
    transformation += '/';
  }

  // Return the transformed URL
  return baseUrl + transformation + imageUrl;
};

/**
 * Creates a thumbnail URL from a Cloudinary URL
 * @param {string} url - The original Cloudinary URL
 * @param {number} size - Size of the thumbnail (width and height)
 * @returns {string} - Thumbnail URL
 */
export const createThumbnailUrl = (url, size = 100) => {
  return transformCloudinaryUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
  });
};

export default {
  transformCloudinaryUrl,
  createThumbnailUrl,
};
