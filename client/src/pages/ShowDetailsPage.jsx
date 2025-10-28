import React, { useEffect, useState } from 'react'; // Import useState
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchShowById,
    selectCurrentShow,
    selectShowsLoading,
    selectShowsError,
    clearCurrentShow,
} from '../store/slices/showSlice';
import Loader from '../components/Loader';
import { FaRegClock, FaMapMarkerAlt, FaTicketAlt, FaImage } from 'react-icons/fa'; // Import FaImage

function ShowDetailsPage() {
    const { showId } = useParams();
    const dispatch = useDispatch();
    const [imgError, setImgError] = useState(false); // Add imgError state

    const show = useSelector(selectCurrentShow);
    const isLoading = useSelector(selectShowsLoading);
    const error = useSelector(selectShowsError);

    // Fetch show details when component mounts
    useEffect(() => {
        if (showId) {
            dispatch(fetchShowById(showId));
            setImgError(false); // Reset image error on new show load
        }

        // Cleanup function: Clear the current show
        return () => {
            dispatch(clearCurrentShow());
        };
    }, [dispatch, showId]);

    // Reset error state if the show object changes
    useEffect(() => {
        setImgError(false);
    }, [show]);


    // Helper function to format the date/time
    const formatShowTime = (isoString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(isoString).toLocaleString('en-US', options);
    };

    if (isLoading || !show) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-red-500 text-xl">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="md-card overflow-hidden">
                {/* Header with placeholder image and main details */}
                <div className="md:flex">
                    <div className="md:flex-shrink-0 p-8 ">
                        {/* Poster image container */}
                        <div className="h-64 w-full object-cover rounded-2xl md:w-64 bg-[color:var(--md-sys-color-surface-variant)] flex items-center justify-center overflow-hidden">
                            {show.posterUrl && !imgError ? (
                                <img
                                    src={show.posterUrl}
                                    alt={show.showName}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)} // Set error state on fail
                                />
                            ) : (
                                // Fallback placeholder
                                <div className="flex flex-col items-center text-gray-500">
                                    <FaImage className="h-24 w-24" />
                                    <span className="mt-2 text-sm">No Poster</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                {show.showName}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-300 mb-3">
                                <FaRegClock className="text-red-500" />
                                <span>{formatShowTime(show.timing)}</span>
                            </div>

                            {show.hall && (
                                <div className="flex items-center gap-4 text-gray-300 mb-3">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    <span>{show.hall.name} - {show.hall.location}</span>
                                </div>
                            )}

                            <div className="text-gray-400 text-sm mb-4">
                                {show.length} minutes
                            </div>
                        </div>

                        {/* "Book Tickets" Button */}
                        <Link
                            to={`/book/${show._id}`}
                            className="md-button md-button-filled mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-lg"
                        >
                            <FaTicketAlt />
                            <span>Book Tickets</span>
                        </Link>
                    </div>
                </div>

                {/* Show Description */}
                <div className="p-8 border-t border-[color:var(--md-sys-color-outline)]">
                    <h2 className="md-h2 text-white mb-4">Description</h2>
                    <p className="text-gray-300 leading-relaxed">
                        {show.description || 'No description available for this show.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShowDetailsPage;