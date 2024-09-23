import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Pagination = ({ currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-12 mt-10">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-1 rounded-lg bg-grade border-2 border-[#9860FF] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-200 disabled:cursor-not-allowed"
      >
        <ArrowBackIosNewIcon className="text-white" />
      </button>

      {/* Current Page Display */}
      <span className="text-lg font-bold text-white">{currentPage}</span>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center justify-center p-1 rounded-lg bg-grade  border-2 border-[#9860FF] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <ArrowForwardIosIcon className="text-white" />
      </button>
    </div>
  );
};

export default Pagination;