import Ticket from '../../models/ticket_model.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse, notFoundResponse, errorResponse, validationErrorResponse } from '../../utils/apiResponse.js';
import { validateObjectId, validateEnum } from '../../utils/validation.js';
import { TICKET_STATUS } from '../../utils/constants.js';

const allowedStatuses = Object.values(TICKET_STATUS);

const updateTicketStatus = asyncHandler(async (req, res) => {
    const ticketId = req.params.id;
    const { status } = req.body;
    const errors = [];
    try {
        validateObjectId(ticketId, 'Ticket ID');
        validateEnum(status, 'Status', allowedStatuses);
    } catch (err) {
        errors.push({ message: err.message });
    }
    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true })
        .populate('owner', 'name email')
        .populate('show', 'showName timing')
        .populate('hall', 'name location')
        .populate('seats', 'seatNo seatType');
    if (!updatedTicket) {
        return notFoundResponse(res, 'Ticket');
    }
    return successResponse(res, updatedTicket, `Ticket status updated to ${status}`);
});

export default updateTicketStatus;