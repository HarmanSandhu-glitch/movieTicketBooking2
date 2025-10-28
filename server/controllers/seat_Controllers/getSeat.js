import Ticket from "../../models/ticket_model.js";
import Seat from "../../models/seat_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, notFoundResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const getSeat = asyncHandler(async (req, res) => {
    const seatId = req.params.id;
    const showId = req.params.showId;
    if (!validateObjectId(seatId)) {
        return notFoundResponse(res, 'Invalid seat ID');
    }
    const seat = await Seat.findById(seatId);
    if (!seat) {
        return notFoundResponse(res, 'Seat');
    }
    let isSeatBooked = false;
    if (showId && validateObjectId(showId)) {
        const ticket = await Ticket.findOne({
            seats: seatId,
            show: showId,
            status: { $in: ['booked', 'confirmed'] }
        });
        isSeatBooked = !!ticket;
    }
    const responseData = {
        seat,
        isSeatBooked,
        isAvailable: seat.isAvailable && !isSeatBooked
    };

    return successResponse(res, responseData, "Seat information retrieved successfully");
});

export default getSeat;
