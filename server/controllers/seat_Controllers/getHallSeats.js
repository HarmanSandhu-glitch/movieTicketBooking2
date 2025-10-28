import Seat from "../../models/seat_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const getHallSeats = asyncHandler(async (req, res) => {
    const hallId = req.params.hallId;
    if (!validateObjectId(hallId)) {
        return successResponse(res, [], "Invalid hall ID");
    }
    const seats = await Seat.find({ hall: hallId }).sort({ seatNo: 1 });
    if (!seats || seats.length === 0) {
        return successResponse(res, [], "No seats found for this hall");
    }

    return successResponse(res, seats, "Hall seats retrieved successfully");
});

export default getHallSeats;
