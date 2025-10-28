import Hall from '../../models/hall_model.js';
import Seat from '../../models/seat_model.js';
import Show from '../../models/show_model.js';
import Ticket from '../../models/ticket_model.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse, notFoundResponse, errorResponse } from '../../utils/apiResponse.js';
import { validateObjectId } from '../../utils/validation.js';

const deleteHall = asyncHandler(async (req, res) => {
    const hallId = req.params.id;
    if (!validateObjectId(hallId)) {
        return errorResponse(res, 'Invalid hall ID', 400);
    }
    const associatedShows = await Show.find({ hall: hallId });
    if (associatedShows.length > 0) {
        return errorResponse(res, `Cannot delete hall: ${associatedShows.length} shows are associated with this hall. Delete shows first.`, 400);
    }
    const deletedHall = await Hall.findByIdAndDelete(hallId);
    if (!deletedHall) {
        return notFoundResponse(res, 'Hall');
    }
    await Seat.deleteMany({ hall: hallId });

    return successResponse(res, null, 'Hall and associated seats deleted successfully');
});

export default deleteHall;
