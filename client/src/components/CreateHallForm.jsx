import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHall, selectHallsLoading, selectHallsError, clearHallError } from '../store/slices/hallSlice';
import Loader from './Loader';
import { toast } from 'react-toastify'; // Import toast

function CreateHallForm() {
    const dispatch = useDispatch();

    // Form state
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [normalSittingCapacity, setNormalSittingCapacity] = useState(50);
    const [vipSittingCapacity, setVipSittingCapacity] = useState(10);
    const [premiumSittingCapacity, setPremiumSittingCapacity] = useState(10);
    const [normalSeatPrice, setNormalSeatPrice] = useState(10);
    const [vipSeatPrice, setVipSeatPrice] = useState(20);
    const [premiumSeatPrice, setPremiumSeatPrice] = useState(15);

    // Redux state
    const isLoading = useSelector(selectHallsLoading);
    const error = useSelector(selectHallsError);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(clearHallError());

        const hallData = {
            name,
            location,
            normalSittingCapacity: Number(normalSittingCapacity),
            vipSittingCapacity: Number(vipSittingCapacity),
            premiumSittingCapacity: Number(premiumSittingCapacity),
            normalSeatPrice: Number(normalSeatPrice),
            vipSeatPrice: Number(vipSeatPrice),
            premiumSeatPrice: Number(premiumSeatPrice),
        };

        dispatch(createHall(hallData))
            .unwrap()
            .then(() => {
                // Success! Show toast and clear the form.
                toast.success('Hall created successfully!');
                setName('');
                setLocation('');
                setNormalSittingCapacity(50);
                setVipSittingCapacity(10);
                setPremiumSittingCapacity(10);
                setNormalSeatPrice(10);
                setVipSeatPrice(20);
                setPremiumSeatPrice(15);
            })
            .catch((err) => {
                // Show error toast
                toast.error(err || 'Failed to create hall');
            });
    };

    return (
        <form onSubmit={handleSubmit} className="md-card p-6 space-y-4 mb-8">
            <h3 className="md-h3 text-white">Create New Hall</h3>

            {/* This error display is still useful for validation messages */}
            {error && (
                <div className="bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded-md" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Row 1: Name & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="hallName" className="md-label">Hall Name</label>
                    <input
                        type="text"
                        id="hallName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="md-input"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="md-label">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="md-input"
                    />
                </div>
            </div>

            {/* Row 2: Capacities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="normalCap" className="md-label">Normal Seats</label>
                    <input
                        type="number"
                        id="normalCap"
                        value={normalSittingCapacity}
                        onChange={(e) => setNormalSittingCapacity(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
                <div>
                    <label htmlFor="vipCap" className="md-label">VIP Seats</label>
                    <input
                        type="number"
                        id="vipCap"
                        value={vipSittingCapacity}
                        onChange={(e) => setVipSittingCapacity(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
                <div>
                    <label htmlFor="premiumCap" className="md-label">Premium Seats</label>
                    <input
                        type="number"
                        id="premiumCap"
                        value={premiumSittingCapacity}
                        onChange={(e) => setPremiumSittingCapacity(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
            </div>

            {/* Row 3: Prices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="normalPrice" className="md-label">Normal Price ($)</label>
                    <input
                        type="number"
                        id="normalPrice"
                        value={normalSeatPrice}
                        onChange={(e) => setNormalSeatPrice(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
                <div>
                    <label htmlFor="vipPrice" className="md-label">VIP Price ($)</label>
                    <input
                        type="number"
                        id="vipPrice"
                        value={vipSeatPrice}
                        onChange={(e) => setVipSeatPrice(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
                <div>
                    <label htmlFor="premiumPrice" className="md-label">Premium Price ($)</label>
                    <input
                        type="number"
                        id="premiumPrice"
                        value={premiumSeatPrice}
                        onChange={(e) => setPremiumSeatPrice(e.target.value)}
                        required
                        min="0"
                        className="md-input"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="md-button md-button-filled w-full flex justify-center items-center gap-2 py-2.5 px-4"
                >
                    {isLoading ? (
                        <>
                            <Loader />
                            <span>Creating Hall...</span>
                        </>
                    ) : (
                        <span>Create Hall</span>
                    )}
                </button>
            </div>
        </form>
    );
}

export default CreateHallForm;