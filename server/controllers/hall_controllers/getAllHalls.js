import Hall from '../../models/hall_model.js';
import { successResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';

const getAllHalls = asyncHandler(async (req, res) => {
  const halls = await Hall.find().sort({ createdAt: -1 });
  
  return successResponse(res, halls, 'Halls fetched successfully');
});

export default getAllHalls;


