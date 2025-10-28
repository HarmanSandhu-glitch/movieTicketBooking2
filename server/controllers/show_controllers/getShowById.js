import Show from '../../models/show_model.js';
import { successResponse, notFoundResponse, errorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { validateObjectId } from '../../utils/validation.js';

const getShow = asyncHandler(async (req, res) => {
    const showId = req.params.id;
    if (!validateObjectId(showId, 'Show ID')) {
        return errorResponse(res, 'Invalid Show ID format', 400);
    }
    const show = await Show.findById(showId).populate('hall');
    if (!show) {
        return notFoundResponse(res, 'Show');
    }
    return successResponse(res, { show }, 'Show fetched successfully');
});

export default getShow;