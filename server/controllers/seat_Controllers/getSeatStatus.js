import Ticket from "../../models/ticket_model.js";
import Seat from "../../models/seat_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, notFoundResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const getSeatStatus = asyncHandler(async (req, res) => {
    const { seatId, showId } = req.params;

    // Validate IDs
    if (!validateObjectId(seatId) || !validateObjectId(showId)) {
        return notFoundResponse(res, 'Invalid seat or show ID');
    }

    // Find the seat
    const seat = await Seat.findById(seatId);
    if (!seat) {
        return notFoundResponse(res, 'Seat');
    }

    // Check if the seat is booked for this specific show
    const ticket = await Ticket.findOne({
        seats: seatId,
        show: showId,
        status: { $in: ['booked', 'confirmed'] }
    });

    const isSeatBooked = !!ticket;

    const responseData = {
        seat,
        isSeatBooked,
        isAvailable: seat.isAvailable && !isSeatBooked
    };

    return successResponse(res, responseData, "Seat status retrieved successfully");
});

export default getSeatStatus;
