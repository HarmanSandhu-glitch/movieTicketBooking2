import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteHall, selectDeletingHallId } from '../store/slices/hallSlice';
import { FaMapMarkerAlt, FaChair, FaDollarSign, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast

function AdminHallCard({ hall, onEdit }) {
    const dispatch = useDispatch();
    const deletingHallId = useSelector(selectDeletingHallId);

    const isDeleting = deletingHallId === hall._id;

    // Calculate total capacity
    const totalCapacity = (hall.normalSittingCapacity || 0) +
        (hall.vipSittingCapacity || 0) +
        (hall.premiumSittingCapacity || 0);

    const handleDelete = () => {
        // Show a confirmation dialog
        if (window.confirm(`Are you sure you want to delete the hall "${hall.name}"? This action cannot be undone.`)) {
            dispatch(deleteHall(hall._id))
                .unwrap()
                .then(() => {
                    // Show success toast
                    toast.success(`Hall "${hall.name}" deleted successfully.`);
                })
                .catch((err) => {
                    // Show error toast instead of alert
                    toast.error(err || 'Failed to delete hall');
                });
        }
    };

    return (
        <div className="md-card  p-5 rounded-lg shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-2xl text-white">{hall.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>{hall.location}</span>
                    </div>
                </div>
                <div className="md-chip bg-red-500 text-white">
                    <FaChair />
                    <span className="ml-2">{totalCapacity} Seats</span>
                </div>
            </div>

            {/* Price Information */}
            <div className="border-t border-b border-gray-700 my-4 py-4 space-y-3">
                <h4 className="text-md font-semibold text-gray-300 mb-3">Price Tiers</h4>
                <div className="flex justify-between items-center text-md">
                    <span className="text-gray-400">Normal:</span>
                    <span className="text-white font-bold">${hall.normalSeatPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-md">
                    <span className="text-gray-400">Premium:</span>
                    <span className="text-white font-bold">${hall.premiumSeatPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-md">
                    <span className="text-gray-400">VIP:</span>
                    <span className="text-white font-bold">${hall.vipSeatPrice?.toFixed(2)}</span>
                </div>
            </div>

            {/* Admin Actions */}
            <div className="flex justify-end gap-4 mt-5">
                <button
                    title="Edit Hall"
                    onClick={() => onEdit && onEdit(hall)}
                    className="md-button md-button-outline flex items-center gap-2 px-4 py-2 text-md"
                >
                    <FaEdit />
                    <span>Edit</span>
                </button>
                <button
                    title="Delete Hall"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="md-button md-button-filled flex items-center gap-2 px-4 py-2 text-md disabled:cursor-not-allowed"
                >
                    {isDeleting ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Deleting...</span>
                        </>
                    ) : (
                        <>
                            <FaTrash />
                            <span>Delete</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default AdminHallCard;