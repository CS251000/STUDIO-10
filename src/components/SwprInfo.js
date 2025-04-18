import React, { useState } from 'react';
import { sizes } from '../lib/constants';

export default function SwprInfo({ selectedSizes, selectedSwpr }) {
  

  const swprmap = sizes.map(size => {
    const index = selectedSizes.indexOf(size.value);
    return index !== -1 ? selectedSwpr[index] : 0;
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        SizeWise-Purchase rates
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Size Wise Purchase rates</h2>
            <ul>
              {sizes.map((size, index) => (
                <li key={index} className="border-b py-2 flex justify-between">
                  <span>{size.label}:</span>
                  <span>₹ {swprmap[index].toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
