import Hall from '../../models/hall_model.js';
import { successResponse, notFoundResponse, errorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { validateObjectId } from '../../utils/validation.js';

const getHallById = asyncHandler(async (req, res) => {
  const hallId = req.params.id;
  if (!validateObjectId(hallId)) {
    return errorResponse(res, 'Invalid hall ID', 400);
  }
  const hall = await Hall.findById(hallId);
  if (!hall) {
    return notFoundResponse(res, 'Hall');
  }
  return successResponse(res, hall, 'Hall fetched successfully');
});

export default getHallById;