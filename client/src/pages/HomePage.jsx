import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllShows,
    selectAllShows,
    selectShowsLoading,
    selectShowsError,
} from '../store/slices/showSlice';

// We will create this ShowCard component in the very next step.
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader'; // We'll create a simple loader too.

function HomePage() {
    const dispatch = useDispatch();
    const shows = useSelector(selectAllShows);
    const isLoading = useSelector(selectShowsLoading);
    const error = useSelector(selectShowsError);

    // Fetch shows when the component mounts
    useEffect(() => {
        dispatch(fetchAllShows());
    }, [dispatch]);

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-xl">Error: {error}</p>
            </div>
        );
    }

    // Render shows list
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-primary-light pl-4">
                Now Showing
            </h1>

            {shows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {shows.map((show) => (
                        <ShowCard key={show._id} show={show} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No shows are currently available.</p>
            )}
        </div>
    );
}

export default HomePage;