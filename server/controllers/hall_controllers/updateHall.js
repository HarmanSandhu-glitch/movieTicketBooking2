import Hall from "../../models/hall_model.js";
import Seat from "../../models/seat_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, notFoundResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const updateHall = asyncHandler(async (req, res) => {
    const hallId = req.params.id;
    const updateData = req.body;
    if (!validateObjectId(hallId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid hall ID'
        });
    }
    if ('normalSittingCapacity' in updateData || 'vipSittingCapacity' in updateData || 'premiumSittingCapacity' in updateData) {
        await Seat.deleteMany({ hall: hallId });
        const currentHall = await Hall.findById(hallId);
        if (!currentHall) {
            return notFoundResponse(res, 'Hall');
        }
        const normalSittingCapacity = ('normalSittingCapacity' in updateData) ? updateData.normalSittingCapacity : currentHall.normalSittingCapacity;
        const vipSittingCapacity = ('vipSittingCapacity' in updateData) ? updateData.vipSittingCapacity : currentHall.vipSittingCapacity;
        const premiumSittingCapacity = ('premiumSittingCapacity' in updateData) ? updateData.premiumSittingCapacity : currentHall.premiumSittingCapacity;
        const seatsToCreate = [];
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
                seatsToCreate.push({
                    seatNo: `${currentRow}${col}`,
                    row: currentRow,
                    column: col,
                    seatType: 'Regular',
                    hall: hallId,
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
                seatsToCreate.push({
                    seatNo: `${currentRow}${col}`,
                    row: currentRow,
                    column: col,
                    seatType: 'VIP',
                    hall: hallId,
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
                seatsToCreate.push({
                    seatNo: `${currentRow}${col}`,
                    row: currentRow,
                    column: col,
                    seatType: 'Premium',
                    hall: hallId,
                    isAvailable: true
                });
            }
            rowIndex++;
        }
        if (seatsToCreate.length > 0) {
            await Seat.insertMany(seatsToCreate);
        }
    }
    const updatedHall = await Hall.findByIdAndUpdate(hallId, updateData, {
        new: true,
        runValidators: true
    });
    if (!updatedHall) {
        return notFoundResponse(res, 'Hall');
    }

    return successResponse(res, updatedHall, 'Hall updated successfully');
});

export default updateHall;
