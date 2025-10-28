import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHall, selectHallsLoading, selectHallsError, clearHallError } from '../store/slices/hallSlice';
import Loader from './Loader';
import { toast } from 'react-toastify';

function EditHallForm({ hall, onClose, onSuccess }) {
  const dispatch = useDispatch();

  // Form state pre-filled from the hall prop
  const [name, setName] = useState(hall.name || '');
  const [location, setLocation] = useState(hall.location || '');
  const [normalSittingCapacity, setNormalSittingCapacity] = useState(hall.normalSittingCapacity || 0);
  const [vipSittingCapacity, setVipSittingCapacity] = useState(hall.vipSittingCapacity || 0);
  const [premiumSittingCapacity, setPremiumSittingCapacity] = useState(hall.premiumSittingCapacity || 0);
  const [normalSeatPrice, setNormalSeatPrice] = useState(hall.normalSeatPrice || 0);
  const [vipSeatPrice, setVipSeatPrice] = useState(hall.vipSeatPrice || 0);
  const [premiumSeatPrice, setPremiumSeatPrice] = useState(hall.premiumSeatPrice || 0);

  // Redux state
  const isLoading = useSelector(selectHallsLoading);
  const error = useSelector(selectHallsError);

  useEffect(() => {
    return () => {
      dispatch(clearHallError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearHallError());

    // Basic validation
    if (!name.trim()) {
      toast.error('Hall name is required.');
      return;
    }
    if (!location.trim()) {
      toast.error('Location is required.');
      return;
    }
    if (Number(normalSittingCapacity) < 0 || Number(vipSittingCapacity) < 0 || Number(premiumSittingCapacity) < 0) {
      toast.error('Capacities cannot be negative.');
      return;
    }

    const hallData = {
      name: name.trim(),
      location: location.trim(),
      normalSittingCapacity: Number(normalSittingCapacity),
      vipSittingCapacity: Number(vipSittingCapacity),
      premiumSittingCapacity: Number(premiumSittingCapacity),
      normalSeatPrice: Number(normalSeatPrice),
      vipSeatPrice: Number(vipSeatPrice),
      premiumSeatPrice: Number(premiumSeatPrice),
    };

    dispatch(updateHall({ hallId: hall._id, hallData }))
      .unwrap()
      .then(() => {
        toast.success('Hall updated successfully!');
        onSuccess && onSuccess();
        onClose && onClose();
      })
      .catch((err) => {
        toast.error(err || 'Failed to update hall');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="md-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="md-h3 text-white">Edit Hall</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Row 1: Name & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="editHallName" className="md-label">Hall Name</label>
          <input
            type="text"
            id="editHallName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="md-input"
          />
        </div>
        <div>
          <label htmlFor="editLocation" className="md-label">Location</label>
          <input
            type="text"
            id="editLocation"
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
          <label htmlFor="editNormalCap" className="md-label">Normal Seats</label>
          <input
            type="number"
            id="editNormalCap"
            value={normalSittingCapacity}
            onChange={(e) => setNormalSittingCapacity(e.target.value)}
            required
            min="0"
            className="md-input"
          />
        </div>
        <div>
          <label htmlFor="editVipCap" className="md-label">VIP Seats</label>
          <input
            type="number"
            id="editVipCap"
            value={vipSittingCapacity}
            onChange={(e) => setVipSittingCapacity(e.target.value)}
            required
            min="0"
            className="md-input"
          />
        </div>
        <div>
          <label htmlFor="editPremiumCap" className="md-label">Premium Seats</label>
          <input
            type="number"
            id="editPremiumCap"
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
          <label htmlFor="editNormalPrice" className="md-label">Normal Price ($)</label>
          <input
            type="number"
            id="editNormalPrice"
            value={normalSeatPrice}
            onChange={(e) => setNormalSeatPrice(e.target.value)}
            required
            min="0"
            className="md-input"
          />
        </div>
        <div>
          <label htmlFor="editVipPrice" className="md-label">VIP Price ($)</label>
          <input
            type="number"
            id="editVipPrice"
            value={vipSeatPrice}
            onChange={(e) => setVipSeatPrice(e.target.value)}
            required
            min="0"
            className="md-input"
          />
        </div>
        <div>
          <label htmlFor="editPremiumPrice" className="md-label">Premium Price ($)</label>
          <input
            type="number"
            id="editPremiumPrice"
            value={premiumSeatPrice}
            onChange={(e) => setPremiumSeatPrice(e.target.value)}
            required
            min="0"
            className="md-input"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="md-button md-button-outline flex-1 py-2.5 px-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="md-button md-button-filled flex-1 gap-2 py-2.5 px-4"
        >
          {isLoading ? (
            <>
              <Loader />
              <span>Updating...</span>
            </>
          ) : (
            <span>Update Hall</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default EditHallForm;
