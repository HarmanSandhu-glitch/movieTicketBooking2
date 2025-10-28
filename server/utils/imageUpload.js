import multer from 'multer';
import path from 'path';
import cloudinary from '../configs/cloudinary.js';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});
export const uploadToCloudinary = async (fileBuffer, folder = 'movie-posters') => {
  const result = await cloudinary.uploader.upload_stream.promise({
    folder,
    resource_type: 'image',
    transformation: [
      { width: 800, height: 1200, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  }, fileBuffer);
  return result;
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
  const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

  return publicId;
};
