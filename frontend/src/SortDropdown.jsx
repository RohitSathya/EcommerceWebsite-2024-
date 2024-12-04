import React from 'react';

function SortDropdown({ sortOrder, handleSortChange }) {
  return (
    <div className="mb-4 flex justify-center">
      <div className="relative inline-block">
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="appearance-none bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-black py-3 px-5 pr-10 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 hover:from-purple-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
        >
          <option value="default" className="text-black">Sort By: Default</option>
          <option value="lowToHigh" className="text-black">Price: Low to High</option>
          <option value="highToLow" className="text-black">Price: High to Low</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-white transition-transform duration-300 transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </div>
    </div>
  );
}

export default SortDropdown;
