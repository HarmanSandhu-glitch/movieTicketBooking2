import Show from "../../models/show_model.js";
import { successResponse, errorResponse, validationErrorResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { validateObjectId, validateRequired, validateNumber } from "../../utils/validation.js";

const createShow = asyncHandler(async (req, res) => {
    const hallId = req.body.hallId;
    const { showName, timing, length, description, posterUrl, cloudinaryPublicId } = req.body;
    const errors = [];
    try {
        validateRequired(showName, 'Show Name');
        validateRequired(timing, 'Timing');
        validateRequired(length, 'Length');
        validateNumber(length, 'Length', 1);
        validateRequired(description, 'Description');
        validateRequired(hallId, 'Hall ID');
        validateObjectId(hallId, 'Hall ID');
    } catch (err) {
        errors.push({ message: err.message });
    }

    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }
    const newShow = await Show.create({
        showName,
        timing,
        length,
        description,
        hall: hallId,
        posterUrl: posterUrl || '',
        cloudinaryPublicId: cloudinaryPublicId || ''
    });

    return successResponse(res, newShow, 'Show created successfully', 201);
});

export default createShow;