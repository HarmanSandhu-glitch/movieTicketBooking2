import React from 'react';

/**
 * Reusable Seat Legend component showing seat types and their colors
 * Aligns with the black/red theme
 */
function SeatLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-gray-700"></div>
        <span className="text-xs text-gray-300">Regular</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-red-500"></div>
        <span className="text-xs text-gray-300">Premium</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-red-700"></div>
        <span className="text-xs text-gray-300">VIP</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-red-600 ring-2 ring-red-400"></div>
        <span className="text-xs text-gray-300">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-gray-600"></div>
        <span className="text-xs text-gray-300">Booked</span>
      </div>
    </div>
  );
}

export default SeatLegend;
