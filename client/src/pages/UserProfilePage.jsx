import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserTickets,
    selectUserTickets,
    selectTicketsLoading,
    selectTicketsError,
    clearUserTickets,
} from '../store/slices/ticketSlice';
import { selectUser } from '../store/slices/authSlice';
import Loader from '../components/Loader';
import TicketCard from '../components/TicketCard';
import UpdateProfileForm from '../components/UpdateProfileForm';
import { FaUserCircle, FaTicketAlt } from 'react-icons/fa';

function UserProfilePage() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const tickets = useSelector(selectUserTickets);
    const isLoadingTickets = useSelector(selectTicketsLoading);
    const ticketsError = useSelector(selectTicketsError);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserTickets(userId));
        }

        // Cleanup: Clear the tickets when the user navigates away
        return () => {
            dispatch(clearUserTickets());
        };
    }, [dispatch, userId]);

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* --- Left Column: Profile Info & Edit Form --- */}
            <div className="lg:col-span-1 space-y-8">
                {/* User Profile Header */}
                <div className="md-card text-wrap flex-wrap justify-center p-8 rounded-lg shadow-xl flex items-center gap-6">
                    <FaUserCircle className="h-20 w-20 text-primary-light flex-shrink-0" />
                    <div>
                        <h1 className="text-3xl font-bold text-white truncate" title={user?.name}>
                            {user?.name}
                        </h1>
                        <p className="text-md text-gray-400 truncate" title={user?.email}>
                            {user?.email}
                        </p>
                    </div>
                </div>

                {/* Update Profile Form */}
                <UpdateProfileForm />
            </div>

            {/* --- Right Column: Booked Tickets --- */}
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-primary-light pl-4 flex items-center gap-3">
                    <FaTicketAlt />
                    My Tickets
                </h2>

                {isLoadingTickets && (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                )}

                {ticketsError && (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-500 text-xl">Error: {ticketsError}</p>
                    </div>
                )}

                {!isLoadingTickets && !ticketsError && (
                    tickets.length > 0 ? (
                        <div className="space-y-6">
                            {tickets.map((ticket) => (
                                <TicketCard key={ticket._id} ticket={ticket} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 p-12 rounded-lg text-center shadow-xl">
                            <p className="text-gray-400 text-lg">You haven't booked any tickets yet.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default UserProfilePage;