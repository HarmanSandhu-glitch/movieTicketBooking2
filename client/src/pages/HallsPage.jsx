import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHalls, selectAllHalls, selectHallsLoading, selectHallsError } from '../store/slices/hallSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const HallsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const halls = useSelector(selectAllHalls);
  const isLoading = useSelector(selectHallsLoading);
  const error = useSelector(selectHallsError);

  useEffect(() => {
    dispatch(fetchAllHalls());
  }, [dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Halls</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white rounded-3xl p-8 ">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Halls</h1>
          <p className="text-gray-400">Browse our cinema halls and their facilities</p>
        </div>

        {/* Halls Grid */}
        {halls && halls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {halls.map((hall) => (
              <div
                key={hall._id}
                className="md-card overflow-hidden"
              >
                {/* Hall Header */}
                <div className="bg-gradient-to-r from-red-700 to-red-600 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{hall.name}</h2>
                  <div className="flex items-center text-gray-100">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{hall.location}</span>
                  </div>
                </div>

                {/* Hall Details */}
                <div className="p-6">
                  {/* Seating Capacity */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-red-500">Seating Capacity</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Regular Seats</span>
                        <span className="font-semibold text-white">{hall.normalSittingCapacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">VIP Seats</span>
                        <span className="font-semibold text-white">{hall.vipSittingCapacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Premium Seats</span>
                        <span className="font-semibold text-white">{hall.premiumSittingCapacity}</span>
                      </div>
                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-white">Total Capacity</span>
                          <span className="text-red-400">
                            {hall.normalSittingCapacity + hall.vipSittingCapacity + hall.premiumSittingCapacity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-3 text-red-500">Ticket Prices</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Regular</span>
                        <span className="font-semibold text-white">₹{hall.normalSeatPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">VIP</span>
                        <span className="font-semibold text-white">₹{hall.vipSeatPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Premium</span>
                        <span className="font-semibold text-white">₹{hall.premiumSeatPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* View Shows Button */}
                  <button
                    onClick={() => navigate(`/hall/${hall._id}/shows`)}
                    className="w-full md-button md-button-filled py-3 px-4 text-lg flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                    View Shows
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No Halls Available</h3>
            <p className="text-gray-500">Check back later for new halls!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallsPage;
