import Show from '../../models/show_model.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { validateObjectId } from '../../utils/validation.js';

const getHallShows = asyncHandler(async (req, res) => {
  const hallId = req.params.id
  if (!validateObjectId(hallId)) {
    return errorResponse(res, 'Invalid hall ID', 400);
  }
  const shows = await Show.find({ hall: hallId })
    .sort({ timing: 1 })
    .populate('hall', 'name location');
  return successResponse(res, { shows }, 'Shows fetched successfully');
});

export default getHallShows;
