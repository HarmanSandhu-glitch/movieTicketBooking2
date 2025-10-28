import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllHalls,
    selectAllHalls,
    selectHallsLoading,
} from '../store/slices/hallSlice';
import {
    fetchAllShows,
    selectAllShows,
    selectShowsLoading,
    deleteShow,
    selectDeletingShowId,
} from '../store/slices/showSlice';
import Loader from '../components/Loader';
import CreateHallForm from '../components/CreateHallForm';
import AdminHallCard from '../components/AdminHallCard';
import EditHallForm from '../components/EditHallForm';
import CreateShowForm from '../components/CreateShowForm';
import EditShowForm from '../components/EditShowForm';
import { FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast

function AdminDashboardPage() {
    const dispatch = useDispatch();

    // --- Local State ---
    const [editingShow, setEditingShow] = useState(null);
    const [editingHall, setEditingHall] = useState(null);

    // --- Selectors ---
    const halls = useSelector(selectAllHalls);
    const hallsLoading = useSelector(selectHallsLoading);
    const shows = useSelector(selectAllShows);
    const showsLoading = useSelector(selectShowsLoading);
    const deletingShowId = useSelector(selectDeletingShowId);

    // --- Effects ---
    useEffect(() => {
        dispatch(fetchAllHalls());
        dispatch(fetchAllShows());
    }, [dispatch]);

    const isLoading = hallsLoading || showsLoading;

    // --- Analytics ---
    const totalShows = shows.length;
    const totalHalls = halls.length;
    const activeShows = shows.filter(show =>
      new Date(show.timing) > new Date()
    ).length;
    const completedShows = shows.filter(show =>
      show.status === 'completed'
    ).length;

    // --- Handlers ---
    const handleEditShow = (show) => {
        setEditingShow(show);
    };

    const handleEditHall = (hall) => {
        setEditingHall(hall);
    };

    const handleCloseEdit = () => {
        setEditingShow(null);
    };

    const handleCloseEditHall = () => {
        setEditingHall(null);
    };

    const handleEditSuccess = () => {
        dispatch(fetchAllShows());
        setEditingShow(null);
    };

    const handleEditHallSuccess = () => {
        dispatch(fetchAllHalls());
        setEditingHall(null);
    };

    const handleDeleteShow = (show) => {
        if (window.confirm(`Are you sure you want to delete the show "${show.showName}"?`)) {
            dispatch(deleteShow(show._id))
                .unwrap()
                .then(() => {
                    // Show success toast
                    toast.success(`Show "${show.showName}" deleted.`);
                })
                .catch((err) => {
                    // Show error toast instead of alert
                    toast.error(err || 'Failed to delete show');
                });
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-10">
                Admin Dashboard
            </h1>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            )}

            {!isLoading && (
                <>
                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="md-card p-6">
                            <h3 className="text-lg font-semibold text-gray-300">Total Shows</h3>
                            <p className="text-3xl font-bold text-white mt-2">{totalShows}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-red-400 text-sm">{activeShows} active</span>
                                <span className="text-gray-500 mx-2">•</span>
                                <span className="text-gray-400 text-sm">{completedShows} completed</span>
                            </div>
                        </div>

                        <div className="md-card p-6">
                            <h3 className="text-lg font-semibold text-gray-300">Total Halls</h3>
                            <p className="text-3xl font-bold text-white mt-2">{totalHalls}</p>
                            <p className="text-sm text-gray-500 mt-2">Cinema venues</p>
                        </div>

                        <div className="md-card p-6">
                            <h3 className="text-lg font-semibold text-gray-300">Upcoming Shows</h3>
                            <p className="text-3xl font-bold text-red-500 mt-2">{activeShows}</p>
                            <p className="text-sm text-gray-500 mt-2">Scheduled in future</p>
                        </div>

                        <div className="md-card p-6">
                            <h3 className="text-lg font-semibold text-gray-300">System Status</h3>
                            <p className="text-3xl font-bold text-red-400 mt-2">ONLINE</p>
                            <p className="text-sm text-gray-500 mt-2">All services running</p>
                        </div>
                    </div>

                    {/* Management Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* --- Hall Management Section --- */}
                    <section className="md-card p-6 flex flex-col">
                        <h2 className="md-h2 text-white mb-6">
                            Manage Halls ({halls.length})
                        </h2>
                        <CreateHallForm />
                        <h3 className="text-xl font-semibold text-white mt-4 mb-4">
                            Existing Halls
                        </h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 flex-grow">
                            {halls.length > 0 ? (
                                halls.map((hall) => (
                                    <AdminHallCard key={hall._id} hall={hall} onEdit={handleEditHall} />
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-4">No halls created yet.</p>
                            )}
                        </div>
                    </section>

                    {/* --- Show Management Section --- */}
                    <section className="md-card p-6 flex flex-col">
                        <h2 className="md-h2 text-white mb-6">
                            Manage Shows ({shows.length})
                        </h2>
                        <CreateShowForm />
                        <h3 className="text-xl font-semibold text-white mt-4 mb-4">
                            Existing Shows
                        </h3>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 flex-grow">
                            {shows.length > 0 ? (
                                shows.map((show) => {
                                    const isDeleting = deletingShowId === show._id;
                                    return (
                                        <div
                                            key={show._id}
                                            className={`md-card p-4 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
                                        >
                                            <h3 className="font-bold text-lg text-white">{show.showName}</h3>
                                            <p className="text-sm text-gray-400">
                                                {new Date(show.timing).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Hall: {show.hall?.name || show.hallId?.name || 'N/A'}
                                            </p>
                                            {/* Admin actions for shows */}
                                            <div className="flex justify-end gap-3 mt-3">
                                                <button
                                                    title="Edit Show"
                                                    onClick={() => handleEditShow(show)}
                                                    className="md-button md-button-outline flex items-center gap-2 px-3 py-1.5 text-sm"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    title="Delete Show"
                                                    onClick={() => handleDeleteShow(show)}
                                                    disabled={isDeleting}
                                                    className="md-button md-button-filled flex items-center justify-center w-16 px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isDeleting ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <FaTrash />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-400 text-center py-4">No shows created yet.</p>
                            )}
                        </div>
                    </section>

                    </div>

                    {/* Edit Show Modal */}
                    {editingShow && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="md-card max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <EditShowForm
                                    show={editingShow}
                                    onClose={handleCloseEdit}
                                    onSuccess={handleEditSuccess}
                                />
                            </div>
                        </div>
                    )}

                    {/* Edit Hall Modal */}
                    {editingHall && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="md-card max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <EditHallForm
                                    hall={editingHall}
                                    onClose={handleCloseEditHall}
                                    onSuccess={handleEditHallSuccess}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminDashboardPage;
