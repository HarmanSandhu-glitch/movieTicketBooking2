import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateTicketStatus,
    selectUpdatingTicketId,
} from '../store/slices/ticketSlice';
import {
    FaMapMarkerAlt,
    FaRegClock,
    FaChair,
    FaDollarSign,
    FaSpinner,
    FaTimesCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

function TicketCard({ ticket }) {
    const dispatch = useDispatch();
    const updatingTicketId = useSelector(selectUpdatingTicketId);
    const isUpdating = updatingTicketId === ticket._id;
    const formatShowTime = (isoString) => {
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(isoString).toLocaleString('en-US', options);
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked':
                return 'bg-green-600 text-white';
            case 'cancelled':
                return 'bg-red-600 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this ticket?')) {
            dispatch(
                updateTicketStatus({ ticketId: ticket._id, status: 'cancelled' })
            )
                .unwrap()
                .then(() => {
                    toast.success('Ticket cancelled successfully.');
                })
                .catch((err) => {
                    toast.error(err || 'Failed to cancel ticket');
                });
        }
    };
    const showName = ticket.show?.showName || 'Show N/A';
    const hallName = ticket.show?.hall?.name || 'Hall N/A';
    const showTime = ticket.show?.timing
        ? formatShowTime(ticket.show.timing)
        : 'Time N/A';

    return (
        <div className={`md-card overflow-hidden flex flex-col md:flex-row transition-opacity ${isUpdating ? 'opacity-60' : ''}`}>
            <div className="md:w-2/3 p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{showName}</h3>

                <div className="flex items-center gap-4 text-gray-400 mb-2">
                    <FaMapMarkerAlt className="" />
                    <span>{hallName}</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400 mb-6">
                    <FaRegClock className="text-red-300" />
                    <span>{showTime}</span>
                </div>

                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                    Booked Seats:
                </h4>
                <div className="flex flex-wrap gap-2">
                    {ticket.seats && ticket.seats.length > 0 ? (
                        ticket.seats.map((seat) => (
                            <span
                                key={seat._id || seat.seatNo}
                                className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {seat.seatNo}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">No seat info</span>
                    )}
                </div>
            </div>

            {/* Right Side: Booking Details (Total, Status) */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between items-center md:items-start text-center md:text-left">
                <div>
                    {/* Total Price */}
                    <div className="mb-4">
                        <span className="text-sm text-gray-400 uppercase">
                            Total Price
                        </span>
                        <p className="text-3xl font-bold text-white">
                            ${ticket.totalPrice.toFixed(2)}
                        </p>
                    </div>

                    {/* Booking Status */}
                    <div className='flex gap-2 items-end justify-center'>
                        <span className="text-sm text-gray-400 uppercase">Status</span>
                        <p
                            className={`mt-1 px-4 py-1.5 rounded-full font-bold text-sm inline-block ${getStatusClass(
                                ticket.status
                            )}`}
                        >
                            {ticket.status?.toUpperCase() || 'UNKNOWN'}
                        </p>
                    </div>
                </div>

                {/* Cancel Button */}
                {(ticket.status?.toLowerCase() === 'booked' || ticket.status?.toLowerCase() === 'confirmed') && (
                    <button
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="md-button md-button-filled w-full flex justify-center items-center gap-2 mt-6 py-2 px-4"
                    >
                        {isUpdating ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            <>
                                <FaTimesCircle />
                                <span>Cancel Ticket</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default TicketCard;