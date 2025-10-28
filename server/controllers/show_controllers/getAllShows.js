import Show from "../../models/show_model.js";
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';

const getAllShows = asyncHandler(async (req, res) => {
    const shows = await Show.find().populate('hall');
    return successResponse(res, { shows }, 'Shows fetched successfully');
});

export default getAllShows;