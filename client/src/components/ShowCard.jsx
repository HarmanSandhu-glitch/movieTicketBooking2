import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaMapMarkerAlt, FaImage } from 'react-icons/fa';

function ShowCard({ show }) {
    const [imgError, setImgError] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);

    // Helper function to format the date/time
    const formatShowTime = (isoString) => {
        try {
            const options = {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(isoString).toLocaleString('en-US', options);
        } catch {
            return 'Time N/A';
        }
    };

    // Get hall info safely
    const hallName = show?.hallId?.name || show?.hall?.name || 'Hall N/A';
    const hallLocation = show?.hallId?.location || show?.hall?.location || 'Location N/A';

    return (
        <Link
            to={`/show/${show._id}`}
            className="block md-card overflow-hidden transition-transform duration-300 hover:scale-105"
        >
            {/* Poster image container */}
            <div className="w-full h-48 bg-[color:var(--md-sys-color-surface-variant)] flex items-center justify-center overflow-hidden relative">
                {show.posterUrl && !imgError ? (
                    <>
                        {imgLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--md-sys-color-primary)]"></div>
                            </div>
                        )}
                        <img
                            src={show.posterUrl}
                            alt={show.showName}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                            onError={() => {
                                setImgError(true);
                                setImgLoading(false);
                            }}
                            onLoad={() => setImgLoading(false)}
                            loading="lazy"
                        />
                    </>
                ) : (
                    // Fallback placeholder
                    <div className="flex flex-col items-center text-gray-500">
                        <FaImage className="h-10 w-10" />
                        <span className="mt-1 text-xs">No Poster</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                {/* Show Name */}
                <h3 className="text-xl font-bold text-white truncate mb-2" title={show.showName}>
                    {show.showName}
                </h3>

                {/* Hall Information */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <FaMapMarkerAlt className="text-[color:var(--md-sys-color-primary)] flex-shrink-0" />
                    <span className="truncate" title={`${hallName} - ${hallLocation}`}>
                        {hallName} - {hallLocation}
                    </span>
                </div>

                {/* Show Timing */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <FaRegClock className="text-[color:var(--md-sys-color-primary)] flex-shrink-0" />
                    <span>{formatShowTime(show.timing)}</span>
                </div>

                {/* Book Now Button */}
                <button
                    className="md-button md-button-filled w-full font-semibold py-2 px-4"
                    onClick={() => {}}
                >
                    Book Now
                </button>
            </div>
        </Link>
    );
}

export default ShowCard;