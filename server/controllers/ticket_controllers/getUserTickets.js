import Ticket from '../../models/ticket_model.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';
import { validateObjectId } from '../../utils/validation.js';

const getUserTickets = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    if (!userId || userId === 'undefined') {
        return errorResponse(res, 'User ID is required', 400);
    }
    if (!validateObjectId(userId, 'User ID')) {
        return errorResponse(res, 'Invalid User ID format', 400);
    }
    const tickets = await Ticket.find({ owner: userId })
        .populate('owner', 'name email')
        .populate('show', 'showName timing')
        .populate('hall', 'name location')
        .populate('seats', 'seatNo seatType')
        .sort({ purchaseDate: -1 });

    return successResponse(res, tickets, 'User tickets fetched successfully');
});

export default getUserTickets;