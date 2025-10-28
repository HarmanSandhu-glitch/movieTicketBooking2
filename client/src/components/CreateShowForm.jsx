import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShow, selectShowsLoading, selectShowsError, clearShowError } from '../store/slices/showSlice';
import { fetchAllHalls, selectAllHalls } from '../store/slices/hallSlice';
import Loader from './Loader';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload'; // Import the new component

function CreateShowForm() {
  const dispatch = useDispatch();

  // --- Form State ---
  const [showName, setShowName] = useState('');
  const [timing, setTiming] = useState('');
  const [length, setLength] = useState(120);
  const [description, setDescription] = useState('');
  const [hallId, setHallId] = useState('');
  const [posterUrl, setPosterUrl] = useState(''); // Add posterUrl state
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(''); // Add cloudinary public ID state

  // --- Redux State ---
  const isLoading = useSelector(selectShowsLoading);
  const error = useSelector(selectShowsError);
  const halls = useSelector(selectAllHalls);

  // Fetch halls on component mount
  useEffect(() => {
    if (halls.length === 0) {
      dispatch(fetchAllHalls());
    }
    if (halls.length > 0 && !hallId) {
      setHallId(halls[0]._id);
    }
  }, [dispatch, halls, hallId]);

  // Clear form errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearShowError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearShowError());

    if (!hallId) {
      toast.error('Please select a hall.');
      return;
    }

    const showData = {
      showName,
      timing: new Date(timing).toISOString(),
      length: Number(length),
      description,
      hallId, // Backend expects 'hallId' in request body
      posterUrl, // Include posterUrl in the payload
      cloudinaryPublicId, // Include cloudinary public ID
    };

    dispatch(createShow(showData))
      .unwrap()
      .then(() => {
        toast.success('Show created successfully!');
        // Clear the form
        setShowName('');
        setTiming('');
        setLength(120);
        setDescription('');
        setHallId(halls[0]?._id || '');
        setPosterUrl(''); // Clear posterUrl
      })
      .catch((err) => {
        toast.error(err || 'Failed to create show');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="md-card p-6 space-y-4 mb-8">
      <h3 className="md-h3 text-white">Create New Show</h3>

      {error && (
        <div className="bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Show Name */}
      <div>
        <label htmlFor="showName" className="md-label">Show Name</label>
        <input
          type="text"
          id="showName"
          value={showName}
          onChange={(e) => setShowName(e.target.value)}
          required
          className="md-input"
        />
      </div>

      {/* Hall & Timing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hallId" className="md-label">Select Hall</label>
          <select
            id="hallId"
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
          <label htmlFor="timing" className="md-label">Show Timing</label>
          <input
            type="datetime-local"
            id="timing"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            required
            className="md-input [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Length & Description */}
      <div>
        <label htmlFor="length" className="md-label">Length (minutes)</label>
        <input
          type="number"
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          required
          min="1"
          className="md-input"
        />
      </div>
      <div>
        <label htmlFor="description" className="md-label">Description</label>
        <textarea
          id="description"
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

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || halls.length === 0}
          className="md-button md-button-filled w-full flex justify-center items-center gap-2 py-2.5 px-4"
        >
          {isLoading ? (
            <>
              <Loader />
              <span>Creating Show...</span>
            </>
          ) : (
            <span>Create Show</span>
          )}
        </button>
      </div>
    </form>
  );
}

export default CreateShowForm;
