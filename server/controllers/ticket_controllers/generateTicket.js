import Ticket from '../../models/ticket_model.js';
import Show from '../../models/show_model.js';
import Seat from '../../models/seat_model.js';
import { asyncHandler } from '../../utils/errorHandler.js';
import { successResponse, errorResponse, notFoundResponse } from '../../utils/apiResponse.js';
import { validateObjectId } from '../../utils/validation.js';
import { sendBookingConfirmation } from '../../utils/emailService.js';
import logger from '../../utils/logger.js';

const generateTicket = asyncHandler(async (req, res) => {
    const { user, show, seats } = req.body;
    if (!user || !show || !seats || !Array.isArray(seats) || seats.length === 0) {
        return errorResponse(res, 'Missing required fields: user, show, and seats are required', 400);
    }
    if (!validateObjectId(user) || !validateObjectId(show) || !seats.every(validateObjectId)) {
        return errorResponse(res, 'Invalid ID format', 400);
    }
    const showData = await Show.findById(show).populate('hall');
    if (!showData) {
        return notFoundResponse(res, 'Show');
    }

    const hall = showData.hall;
    if (!hall) {
        return notFoundResponse(res, 'Hall for this show');
    }
    const seatDetails = await Seat.find({ _id: { $in: seats } });
    if (seatDetails.length !== seats.length) {
        return errorResponse(res, 'Some seats not found', 404);
    }
    const existingBookings = await Ticket.find({
        show: show,
        seats: { $in: seats },
        status: { $in: ['booked', 'confirmed'] }
    });

    if (existingBookings.length > 0) {
        return errorResponse(res, 'Some seats are already booked for this show', 400);
    }
    let totalPrice = 0;
    seatDetails.forEach(seat => {
        if (seat.seatType === 'Regular') {
            totalPrice += hall.normalSeatPrice;
        } else if (seat.seatType === 'VIP') {
            totalPrice += hall.vipSeatPrice;
        } else if (seat.seatType === 'Premium') {
            totalPrice += hall.premiumSeatPrice;
        }
    });
    const newTicket = await Ticket.create({
        owner: user,
        show: show,
        hall: hall._id,
        seats: seats,
        totalPrice: totalPrice,
        status: 'confirmed'
    });

    const populatedTicket = await Ticket.findById(newTicket._id)
        .populate('owner', 'name email')
        .populate('show', 'showName timing length')
        .populate('hall', 'name location')
        .populate('seats', 'seatNo seatType');
    try {
        const bookingData = {
            showName: populatedTicket.show.showName,
            hallName: populatedTicket.hall.name,
            hallLocation: populatedTicket.hall.location,
            showTime: populatedTicket.show.timing,
            duration: populatedTicket.show.length,
            seats: populatedTicket.seats.map(seat => seat.seatNo).sort(),
            bookingId: populatedTicket._id.toString(),
            bookingDate: populatedTicket.createdAt,
            userEmail: populatedTicket.owner.email,
            userName: populatedTicket.owner.name,
            totalPrice: populatedTicket.totalPrice
        };
        sendBookingConfirmation(populatedTicket.owner.email, bookingData)
            .then(emailResult => {
                if (emailResult.success) {
                    logger.info('📧 Booking confirmation email sent successfully', {
                        bookingId: bookingData.bookingId
                    });
                } else {
                    logger.warn('⚠️  Booking confirmation email failed', {
                        bookingId: bookingData.bookingId,
                        error: emailResult.error
                    });
                }
            })
            .catch(emailError => {
                logger.error('🚨 Booking confirmation email threw exception', {
                    bookingId: bookingData.bookingId,
                    error: emailError.message
                });
            });

    } catch (emailPrepError) {
        logger.error('🚨 Failed to prepare booking confirmation email', {
            error: emailPrepError.message,
            bookingId: newTicket._id.toString()
        });
    }

    return successResponse(res, { ticket: populatedTicket }, 'Ticket booked successfully');
});

export default generateTicket;
