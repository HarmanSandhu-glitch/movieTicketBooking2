import { asyncHandler } from '../utils/errorHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../utils/imageUpload.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 'No image file provided', 400);
  }
  const folder = req.body.folder || 'movie-posters';
  const result = await uploadToCloudinary(req.file.buffer, folder);
  return successResponse(
    res,
    {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    },
    'Image uploaded successfully',
    201
  );
});
