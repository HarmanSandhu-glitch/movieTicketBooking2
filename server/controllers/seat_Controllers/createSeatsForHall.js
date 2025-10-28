import Seat from "../../models/seat_model.js";
import Hall from "../../models/hall_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, notFoundResponse, errorResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const createSeatsForHall = asyncHandler(async (req, res) => {
    const hallId = req.params.hallId;
    if (!validateObjectId(hallId)) {
        return errorResponse(res, 'Invalid hall ID', 400);
    }
    const hall = await Hall.findById(hallId);
    if (!hall) {
        return notFoundResponse(res, 'Hall');
    }
    const existingSeats = await Seat.find({ hall: hallId });
    if (existingSeats.length > 0) {
        return errorResponse(res, 'Seats already exist for this hall', 400);
    }

    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    const regularSeatsPerRow = 10;
    const vipSeatsPerRow = 8;
    const premiumSeatsPerRow = 6;
    const regularRows = Math.ceil(hall.normalSittingCapacity / regularSeatsPerRow);
    const vipRows = Math.ceil(hall.vipSittingCapacity / vipSeatsPerRow);
    const premiumRows = Math.ceil(hall.premiumSittingCapacity / premiumSeatsPerRow);
    let rowIndex = 0;
    for (let r = 0; r < regularRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            regularSeatsPerRow,
            hall.normalSittingCapacity - (r * regularSeatsPerRow)
        );
        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                hall: hallId,
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'Regular',
                isAvailable: true
            });
        }
        rowIndex++;
    }
    for (let r = 0; r < vipRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            vipSeatsPerRow,
            hall.vipSittingCapacity - (r * vipSeatsPerRow)
        );

        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                hall: hallId,
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'VIP',
                isAvailable: true
            });
        }
        rowIndex++;
    }
    for (let r = 0; r < premiumRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            premiumSeatsPerRow,
            hall.premiumSittingCapacity - (r * premiumSeatsPerRow)
        );

        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                hall: hallId,
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'Premium',
                isAvailable: true
            });
        }
        rowIndex++;
    }
    const createdSeats = await Seat.insertMany(seats);
    return successResponse(res, {
        count: createdSeats.length,
        seats: createdSeats
    }, `Successfully created ${createdSeats.length} seats for hall`);
});

export default createSeatsForHall;
