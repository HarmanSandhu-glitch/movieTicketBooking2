import Ticket from '../../models/ticket_model.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse } from '../../utils/apiResponse.js';

const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find()
        .populate('owner', 'name email')
        .populate('show', 'showName timing')
        .populate('hall', 'name location')
        .populate('seats', 'seatNo seatType');

    return successResponse(res, tickets, 'Tickets fetched successfully');
});

export default getAllTickets;