import Seat from "../../models/seat_model.js";
import Ticket from "../../models/ticket_model.js";
import Show from "../../models/show_model.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { successResponse, errorResponse } from "../../utils/apiResponse.js";
import { validateObjectId } from "../../utils/validation.js";

const getShowSeats = asyncHandler(async (req, res) => {
    const showId = req.params.showId;
    if (!showId || !validateObjectId(showId)) {
        return errorResponse(res, 'Invalid or missing show ID', 400);
    }
    const show = await Show.findById(showId).populate('hall', 'name location normalSeatPrice vipSeatPrice premiumSeatPrice');
    if (!show) {
        return res.status(404).json({
            success: false,
            message: 'Show not found'
        });
    }
    const hallId = show.hall._id;
    const seats = await Seat.find({ hall: hallId }).sort({ row: 1, column: 1 });
    if (!seats || seats.length === 0) {
        return successResponse(res, {
            show: {
                _id: show._id,
                showName: show.showName,
                timing: show.timing,
                hall: {
                    _id: show.hall._id,
                    name: show.hall.name,
                    location: show.hall.location
                }
            },
            seatLayout: {},
            seats: [],
            totalSeats: 0,
            availableSeats: 0,
            bookedSeats: 0
        }, "Seats fetched successfully");
    }
    const bookedTickets = await Ticket.find({
        show: showId,
        status: { $in: ['booked', 'confirmed'] }
    }).populate('seats');

    const bookedSeatIds = new Set();
    bookedTickets.forEach(ticket => {
        ticket.seats.forEach(seat => {
            bookedSeatIds.add(seat._id.toString());
        });
    });

    const seatsWithStatus = seats.map(seat => ({
        _id: seat._id,
        seatNo: seat.seatNo,
        row: seat.row,
        column: seat.column,
        seatType: seat.seatType,
        isAvailable: seat.isAvailable,
        isBooked: bookedSeatIds.has(seat._id.toString()),
        price: seat.seatType === 'Regular' ? show.hall.normalSeatPrice :
            seat.seatType === 'VIP' ? show.hall.vipSeatPrice :
                show.hall.premiumSeatPrice
    }));
    const seatLayout = {};
    seatsWithStatus.forEach(seat => {
        if (!seatLayout[seat.row]) {
            seatLayout[seat.row] = [];
        }
        seatLayout[seat.row].push(seat);
    });
    Object.keys(seatLayout).forEach(row => {
        seatLayout[row].sort((a, b) => a.column - b.column);
    });

    const responseData = {
        show: {
            _id: show._id,
            showName: show.showName,
            timing: show.timing,
            hall: {
                _id: show.hall._id,
                name: show.hall.name,
                location: show.hall.location
            }
        },
        seatLayout,
        seats: seatsWithStatus,
        totalSeats: seats.length,
        availableSeats: seatsWithStatus.filter(s => !s.isBooked && s.isAvailable).length,
        bookedSeats: seatsWithStatus.filter(s => s.isBooked).length
    };

    return successResponse(res, responseData, "Seats fetched successfully");
});

export default getShowSeats;
