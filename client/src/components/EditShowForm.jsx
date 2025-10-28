import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateShow, selectShowsUpdating, selectShowsError, clearShowError } from '../store/slices/showSlice';
import { fetchAllHalls, selectAllHalls } from '../store/slices/hallSlice';
import Loader from './Loader';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload'; // Import the new component

function EditShowForm({ show, onClose, onSuccess }) {
  const dispatch = useDispatch();

  // --- Form State ---
  const [showName, setShowName] = useState(show.showName || '');
  const [timing, setTiming] = useState('');
  const [length, setLength] = useState(show.length || 120);
  const [description, setDescription] = useState(show.description || '');
  const [hallId, setHallId] = useState(show.hall?._id || show.hall || show.hallId || '');
  const [posterUrl, setPosterUrl] = useState(show.posterUrl || '');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(show.cloudinaryPublicId || '');

  // Format timing for datetime-local input
  useEffect(() => {
    if (show.timing) {
      const date = new Date(show.timing);
      const formatted = date.toISOString().slice(0, 16); // Format for datetime-local
      setTiming(formatted);
    }
    // Normalize hallId to always be a string ObjectId
    const normalizedHallId = show.hall?._id || show.hall || show.hallId || '';
    setHallId(normalizedHallId);
  }, [show]);

  // --- Redux State ---
  const isUpdating = useSelector(selectShowsUpdating);
  const error = useSelector(selectShowsError);
  const halls = useSelector(selectAllHalls);

  // Fetch halls on component mount if not already loaded
  useEffect(() => {
    if (halls.length === 0) {
      dispatch(fetchAllHalls());
    }
  }, [dispatch, halls.length]);

  // Clear form errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearShowError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearShowError());

    // Client-side validation
    if (!showName.trim()) {
      toast.error('Show name is required.');
      return;
    }
    if (!timing) {
      toast.error('Show timing is required.');
      return;
    }
    if (!hallId) {
      toast.error('Please select a hall.');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }
    if (length < 1) {
      toast.error('Show length must be at least 1 minute.');
      return;
    }

    const showData = {
      showName: showName.trim(),
      timing: new Date(timing).toISOString(),
      length: Number(length),
      description: description.trim(),
      hallId, // Backend expects 'hallId' in request body
      posterUrl,
      cloudinaryPublicId,
    };

    dispatch(updateShow({ id: show._id, showData }))
      .unwrap()
      .then(() => {
        toast.success('Show updated successfully!');
        onSuccess && onSuccess(); // Call success callback
        onClose && onClose(); // Close the modal/form
      })
      .catch((err) => {
        toast.error(err || 'Failed to update show');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="md-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="md-h3 text-white">Edit Show</h3>
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

      {/* Show Name */}
      <div>
        <label htmlFor="editShowName" className="md-label">Show Name</label>
        <input
          type="text"
          id="editShowName"
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
          required
          className="md-input"
        />
      </div>

      {/* Hall & Timing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="editHallId" className="md-label">Select Hall</label>
          <select
            id="editHallId"
            value={hallId}
            onChange={(e) => setHallId(e.target.value)}
            required
            className="md-input"
            disabled={halls.length === 0}
          >
            <option value="" disabled>
              {halls.length === 0 ? 'Loading halls...' : 'Select a hall'}
            </option>
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {hall.name} ({hall.location})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="editTiming" className="md-label">Show Timing</label>
          <input
            type="datetime-local"
            id="editTiming"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
            className="md-input [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Length & Description */}
      <div>
        <label htmlFor="editLength" className="md-label">Length (minutes)</label>
        <input
          type="number"
          id="editLength"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
          min="1"
          className="md-input"
        />
      </div>
      <div>
        <label htmlFor="editDescription" className="md-label">Description</label>
        <textarea
          id="editDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="md-input"
        />
      </div>

      {/* Image Upload Component */}
      <div>
        <ImageUpload
          value={posterUrl}
          onChange={setPosterUrl}
          onPublicIdChange={setCloudinaryPublicId}
        />
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
          disabled={isUpdating || halls.length === 0}
          className="md-button md-button-filled flex-1 gap-2 py-2.5 px-4"
        >
          {isUpdating ? (
            <>
              <Loader />
              <span>Updating...</span>
            </>
          ) : (
            <span>Update Show</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default EditShowForm;
