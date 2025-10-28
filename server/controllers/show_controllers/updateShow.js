import Show from '../../models/show_model.js';
import { successResponse, notFoundResponse, errorResponse, validationErrorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { validateObjectId, validateNumber } from '../../utils/validation.js';

const updateShow = asyncHandler(async (req, res) => {
    const showId = req.params.id;
    const { showName, timing, length, description, status, hallId, posterUrl, cloudinaryPublicId } = req.body;
    const updateData = {};
    const errors = [];

    // 1. Validation
    try {
        if (!validateObjectId(showId)) {
            return errorResponse(res, 'Invalid Show ID format', 400);
        }

        if (showName !== undefined) updateData.showName = showName;
        if (timing !== undefined) updateData.timing = timing;

        if (length !== undefined) {
            validateNumber(length, 'Length', 1);
            updateData.length = length;
        }

        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;

        // Handle hallId update
        if (hallId !== undefined) {
            if (validateObjectId(hallId)) {
                updateData.hall = hallId;
            } else {
                return errorResponse(res, 'Invalid Hall ID format', 400);
            }
        }

        // Handle image updates
        if (posterUrl !== undefined) updateData.posterUrl = posterUrl;
        if (cloudinaryPublicId !== undefined) updateData.cloudinaryPublicId = cloudinaryPublicId;

        if (Object.keys(updateData).length === 0) {
            return errorResponse(res, 'No update data provided', 400);
        }

        updateData.updatedAt = Date.now();
    } catch (err) {
        errors.push({ message: err.message });
    }

    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }

    // 2. Update the show
    try {
        const updatedShow = await Show.findByIdAndUpdate(showId, updateData, {
            new: true,
            runValidators: true
        });

        // 3. Handle not found
        if (!updatedShow) {
            return notFoundResponse(res, 'Show');
        }

        // 4. Send standardized success response
        return successResponse(res, updatedShow, 'Show updated successfully');
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return validationErrorResponse(res, validationErrors);
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return errorResponse(res, 'Show with this name already exists', 409);
        }
        
        // Handle other errors
        return errorResponse(res, 'Failed to update show', 500);
    }
});

export default updateShow;
