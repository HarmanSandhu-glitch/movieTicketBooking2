import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSeatsForShow,
    selectSeatLayout,
    selectSeatShowInfo,
    selectSeatsLoading,
    selectSeatsError,
    clearSeatLayout,
} from '../store/slices/seatSlice';
import {
    bookTicket,
    selectTicketsLoading,
    selectTicketsError,
    clearTicketError,
} from '../store/slices/ticketSlice';
import { selectUser } from '../store/slices/authSlice';
import Loader from '../components/Loader';
import SeatLegend from '../components/SeatLegend';
import { FaChair, FaTicketAlt } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast

function BookingPage() {
    const { showId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state for tracking which seats are selected
    const [selectedSeats, setSelectedSeats] = useState({});

    // Selectors
    const seatLayout = useSelector(selectSeatLayout);
    const show = useSelector(selectSeatShowInfo);
    const isLoadingSeats = useSelector(selectSeatsLoading);
    const seatsError = useSelector(selectSeatsError);
    const user = useSelector(selectUser);
    const isBookingLoading = useSelector(selectTicketsLoading);
    const bookingError = useSelector(selectTicketsError);

    // Fetch seat layout on mount
    useEffect(() => {
        if (showId) {
            dispatch(fetchSeatsForShow(showId));
        }
        return () => {
            dispatch(clearSeatLayout());
            dispatch(clearTicketError());
        };
    }, [dispatch, showId]);

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;
        const newSelectedSeats = { ...selectedSeats };
        if (newSelectedSeats[seat._id]) {
            delete newSelectedSeats[seat._id];
        } else {
            newSelectedSeats[seat._id] = seat;
        }
        setSelectedSeats(newSelectedSeats);
    };

    const getSeatClass = (seat) => {
        const base = 'w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center font-bold text-xs transition transform duration-150';
        if (seat.isBooked) return `${base} bg-gray-600 text-gray-400 cursor-not-allowed`;
        const isSelected = !!selectedSeats[seat._id];
        if (isSelected) return `${base} bg-red-600 text-white ring-2 ring-red-400 scale-110`;
        switch (seat.seatType) {
            case 'VIP':
                return `${base} bg-red-700 text-white hover:bg-red-600 cursor-pointer`;
            case 'Premium':
                return `${base} bg-red-500 text-white hover:bg-red-400 cursor-pointer`;
            case 'Regular':
            default:
                return `${base} bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer`;
        }
    };

    const handleBooking = () => {
        const selectedSeatsArray = Object.values(selectedSeats);
        if (selectedSeatsArray.length === 0) {
            toast.warn('Please select at least one seat.'); // Replaced alert
            return;
        }

        const totalPrice = selectedSeatsArray.reduce((acc, seat) => acc + seat.price, 0);
        const seatIds = selectedSeatsArray.map((seat) => seat._id);

        const bookingData = {
            user: user._id,
            show: show._id,
            seats: seatIds,
            totalPrice: totalPrice,
        };

        dispatch(bookTicket(bookingData))
            .unwrap()
            .then(() => {
                toast.success('Booking successful!'); // Replaced alert
                navigate(`/profile/${user._id}`);
            })
            .catch((err) => {
                toast.error(err || 'Booking failed'); // Replaced console.error/alert
            });
    };

    // --- Calculations for Summary ---
    const selectedSeatsArray = Object.values(selectedSeats);
    const totalPrice = selectedSeatsArray.reduce((acc, seat) => acc + seat.price, 0);
    const rowNames = Object.keys(seatLayout).sort();

    // --- Render Logic ---
    if (isLoadingSeats || !show) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader />
            </div>
        );
    }

    const error = seatsError || bookingError;
    if (error && !toast.isActive('booking-error')) { // Prevent duplicate toasts
        toast.error(error, { toastId: 'booking-error' });
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            {/* Left Side: Seat Map */}
            <div className="flex-grow md-card p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{show.showName}</h1>
                <p className="text-gray-400 mb-6">{new Date(show.timing).toLocaleString()}</p>
                {/* Screen */}
                <div className="bg-white/20 h-2 h-fit rounded-lg w-3/4 mx-auto mb-1 text-center text-gray-400 text-sm">
                    SCREEN
                </div>
                <div className="w-full h-16"></div>

                {/* Seat Rows */}
                <div className="space-y-3 overflow-x-auto p-4">
                    {rowNames.map((rowName) => (
                        <div key={rowName} className="flex items-center justify-center gap-2">
                            <span className="w-6 font-bold text-gray-400 text-center">{rowName}</span>
                            <div className="flex gap-1.5 md:gap-2.5">
                                {seatLayout[rowName].map((seat) => (
                                    <button
                                        key={seat._id}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.isBooked}
                                        className={getSeatClass(seat)}
                                        title={`Seat: ${seat.seatNo}\nType: ${seat.seatType}\nPrice: $${seat.price}`}
                                    >
                                        {seat.seatNo.replace(rowName, '')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-8">
                    <SeatLegend />
                </div>
            </div>

            {/* Right Side: Booking Summary */}
            <div className="lg:w-1/3">
                <div className="md-card p-6 sticky top-24">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                        Booking Summary
                    </h2>

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Selected Seats:</h3>
                        {selectedSeatsArray.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {selectedSeatsArray.map(seat => (
                                    <span key={seat._id} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {seat.seatNo}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No seats selected.</p>
                        )}
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-6">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span className="text-gray-300">Total Price:</span>
                            <span className="text-red-500 text-2xl">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={isBookingLoading || selectedSeatsArray.length === 0}
                        className="w-full mt-6 md-button md-button-filled py-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isBookingLoading ? (
                            <>
                                <Loader />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FaTicketAlt />
                                <span>Confirm Booking</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;