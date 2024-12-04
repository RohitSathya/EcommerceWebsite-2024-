import React, { useEffect, useState } from 'react';

export default function CartDisplay({ data, func, ke, deletes }) {
  const [selectedOption, setSelectedOption] = useState(1);

  useEffect(() => {
    const savedQty = localStorage.getItem(`savedqty${ke}`);
    if (savedQty) {
      setSelectedOption(savedQty);
      func(ke, data.price, savedQty);
    } else {
      setSelectedOption(1);
    }
  }, [ke, func, data.price]);

  function handleChange(e) {
    setSelectedOption(e.target.value);
    func(ke, data.price, e.target.value);
    localStorage.setItem(`savedqty${ke}`, e.target.value);
  }

  function deleteCart() {
    deletes(data._id, ke);
  }

  return (
    <div className="flex flex-col md:flex-row items-center p-4 bg-white border-b border-gray-200">
      {/* Image Section */}
      <img
        src={data.image}
        alt={data.name}
        className="w-20 h-20 object-contain rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold text-gray-800">{data.name}</h3>
        <p className="text-sm text-gray-500">Category: {data.category}</p>
        <p className="text-lg text-gray-900 font-bold mt-2">₹ {data.price}</p>
      </div>

      {/* Quantity Selector and Delete Button */}
      <div className="flex flex-col items-center mt-4 md:mt-0 md:ml-6">
        <select
          value={selectedOption}
          onChange={handleChange}
          className="py-1 px-2 border border-gray-300 rounded-lg mb-2"
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={deleteCart}
          className="text-red-500 font-semibold hover:text-red-700 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
