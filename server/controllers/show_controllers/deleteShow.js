import Show from '../../models/show_model.js';
import Ticket from '../../models/ticket_model.js';
import Seat from '../../models/seat_model.js';
import { successResponse, notFoundResponse, errorResponse } from '../../utils/apiResponse.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { validateObjectId } from '../../utils/validation.js';

const deleteShow = asyncHandler(async (req, res) => {
    const showId = req.params.id;
    if (!validateObjectId(showId)) {
        return errorResponse(res, 'Invalid Show ID format', 400);
    }
    const existingTickets = await Ticket.find({
        show: showId,
        status: { $in: ['booked', 'confirmed'] }
    });
    if (existingTickets.length > 0) {
        return errorResponse(
            res,
            `Cannot delete show: ${existingTickets.length} active ticket(s) exist. Cancel all tickets first.`,
            400
        );
    }
    const deletedShow = await Show.findByIdAndDelete(showId);
    if (!deletedShow) {
        return notFoundResponse(res, 'Show');
    }
    await Seat.updateMany(
        { hall: deletedShow.hall },
        { $set: { isAvailable: true } }
    );
    return successResponse(res, null, 'Show deleted successfully');
});

export default deleteShow;
