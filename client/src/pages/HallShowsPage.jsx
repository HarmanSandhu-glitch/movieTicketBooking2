import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHallById, selectCurrentHall, selectHallsLoading } from '../store/slices/hallSlice';
import { fetchAllShows, selectAllShows, selectShowsLoading } from '../store/slices/showSlice';
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader';

const HallShowsPage = () => {
  const { hallId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentHall = useSelector(selectCurrentHall);
  const hallLoading = useSelector(selectHallsLoading);
  const shows = useSelector(selectAllShows);
  const showsLoading = useSelector(selectShowsLoading);

  useEffect(() => {
    if (hallId) {
      dispatch(fetchHallById(hallId));
      dispatch(fetchAllShows());
    }
  }, [dispatch, hallId]);

  // Always ensure shows is an array
  const showsArr = Array.isArray(shows) ? shows : [];
  // Filter shows for this hall
  const hallShows = showsArr.filter(show => show.hall?._id === hallId || show.hall === hallId) || [];

  if (hallLoading || showsLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-[color:var(--md-sys-color-surface-variant)] text-white rounded-3xl p-8 ">
        <Loader />
      </div>
    );
  }

  if (!currentHall) {
    return (
      <div className="min-h-screen bg-[color:var(--md-sys-color-surface-variant)] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Hall Not Found</h2>
          <button
            onClick={() => navigate('/halls')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
          >
            Back to Halls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md-card p-8">
      <div className="container mx-auto px-4">
        {/* Hall Header */}
        <div className="bg-[color:var(--md-sys-color-surface-variant)]/40 rounded-xl p-6 mb-8 border-[0.5px] border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentHall.name}</h1>
              <div className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{currentHall.location}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/halls')}
              className="px-6 py-2  hover:bg-gray-600 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Halls
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md-card flex flex-col justify-center items-center p-4 py-8">
              <p className="text-gray-400 text-sm mb-1">Total Capacity</p>
              <p className="text-2xl font-bold text-green-400">
                {currentHall.normalSittingCapacity + currentHall.vipSittingCapacity + currentHall.premiumSittingCapacity}
              </p>
            </div>
            <div className="md-card flex flex-col justify-center items-center p-4 py-8">
              <p className="text-gray-400 text-sm mb-1">Price Range</p>
              <p className="text-2xl font-bold text-purple-400">
                ₹{Math.min(currentHall.normalSeatPrice, currentHall.vipSeatPrice, currentHall.premiumSeatPrice)} -
                ₹{Math.max(currentHall.normalSeatPrice, currentHall.vipSeatPrice, currentHall.premiumSeatPrice)}
              </p>
            </div>
            <div className="md-card flex flex-col justify-center items-center p-4 py-8">
              <p className="text-gray-400 text-sm mb-1">Available Shows</p>
              <p className="text-2xl font-bold text-blue-400">{hallShows.length}</p>
            </div>
          </div>
        </div>

        {/* Shows List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Shows at {currentHall.name}</h2>
        </div>

        {hallShows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hallShows.map((show) => (
              <ShowCard key={show._id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Shows Scheduled</h3>
            <p className="text-gray-500">There are currently no shows scheduled for this hall.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallShowsPage;
