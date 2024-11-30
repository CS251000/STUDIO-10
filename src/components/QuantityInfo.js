import React, { useState } from 'react';

export default function QuantityInfo({ selectedSizes = [], selectedQuantities = [] }) {
  const sizes = [
    { value: 's', label: "S" },
    { value: 'm', label: "M" },
    { value: 'l', label: "L" },
    { value: 'xl', label: "XL" },
    { value: 'xxl', label: "XXL" },
    { value: '2024', label: "20/24" },
    { value: '2630', label: "26/30" },
    { value: '3236', label: "32/36" },
    { value: '38', label: "38" },
  ];

  const quantitiesMap = sizes.map(size => {
    const index = selectedSizes.indexOf(size.value);
    return index !== -1 ? selectedQuantities[index] || 0 : 0;
  });

  const [isOpen, setIsOpen] = useState(false);
  const totalQuantity = quantitiesMap.reduce((acc, value) => acc + value, 0);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Quantities: {totalQuantity.toFixed(0)}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Quantities</h2>
            {totalQuantity > 0 ? (
              <ul>
                {sizes.map((size, index) => (
                  <li key={index} className="border-b py-2 flex justify-between">
                    <span>{size.label}:</span>
                    <span>{quantitiesMap[index].toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No quantities provided.</p>
            )}
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
