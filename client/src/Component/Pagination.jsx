import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Pagination = ({ currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 rounded-full bg-white border-2 border-[#5cdbd4] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        <ArrowBackIosNewIcon className="text-[#20807b]" />
      </button>

      {/* Current Page Display */}
      <span className="text-lg font-bold text-[#20807b]">{currentPage}</span>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center p-2 rounded-full bg-white border-2 border-[#5cdbd4] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <ArrowForwardIosIcon className="text-[#20807b]" />
      </button>
    </div>
  );
};

export default Pagination;