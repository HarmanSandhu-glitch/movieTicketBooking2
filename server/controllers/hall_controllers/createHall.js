import Hall from "../../models/hall_model.js";
import Seat from "../../models/seat_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse } from "../../utils/apiResponse.js";

const createHall = asyncHandler(async (req, res) => {
    const {
        name,
        location,
        normalSittingCapacity,
        vipSittingCapacity,
        premiumSittingCapacity,
        amenities,
        normalSeatPrice,
        vipSeatPrice,
        premiumSeatPrice
    } = req.body;
    if (!name || !location || !normalSittingCapacity || normalSeatPrice === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: name, location, normalSittingCapacity, and normalSeatPrice are required'
        });
    }
    const newHall = await Hall.create({
        name,
        location,
        normalSittingCapacity,
        vipSittingCapacity,
        premiumSittingCapacity,
        amenities,
        normalSeatPrice,
        vipSeatPrice,
        premiumSeatPrice
    });
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    const regularSeatsPerRow = 10;
    const vipSeatsPerRow = 8;
    const premiumSeatsPerRow = 6;
    const regularRows = Math.ceil(normalSittingCapacity / regularSeatsPerRow);
    const vipRows = Math.ceil(vipSittingCapacity / vipSeatsPerRow);
    const premiumRows = Math.ceil(premiumSittingCapacity / premiumSeatsPerRow);
    let rowIndex = 0;
    for (let r = 0; r < regularRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            regularSeatsPerRow,
            normalSittingCapacity - (r * regularSeatsPerRow)
        );
        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'Regular',
                hall: newHall._id,
                isAvailable: true
            });
        }
        rowIndex++;
    }
    for (let r = 0; r < vipRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            vipSeatsPerRow,
            vipSittingCapacity - (r * vipSeatsPerRow)
        );
        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'VIP',
                hall: newHall._id,
                isAvailable: true
            });
        }
        rowIndex++;
    }
    for (let r = 0; r < premiumRows && rowIndex < rows.length; r++) {
        const currentRow = rows[rowIndex];
        const seatsInThisRow = Math.min(
            premiumSeatsPerRow,
            premiumSittingCapacity - (r * premiumSeatsPerRow)
        );

        for (let col = 1; col <= seatsInThisRow; col++) {
            seats.push({
                seatNo: `${currentRow}${col}`,
                row: currentRow,
                column: col,
                seatType: 'Premium',
                hall: newHall._id,
                isAvailable: true
            });
        }
        rowIndex++;
    }

    await Seat.insertMany(seats);

    return successResponse(res, {
        hall: newHall,
        seatsCreated: seats.length
    }, `Hall and ${seats.length} seats created successfully`);
});

export default createHall;
