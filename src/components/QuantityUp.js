import React, { useState, useEffect } from 'react';

const QuantityUpModal = ({ isOpen, onClose, sizes, onSave, quantities2 }) => {
    const [quantities, setQuantities] = useState(sizes.map((_, index) => quantities2?.[index] || 0));

    useEffect(() => {
        setQuantities(sizes.map((_, index) => quantities2?.[index] || 0));
    }, [quantities2, sizes]);

    const handleQuantityChange = (index, value) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] = Number(value);
        setQuantities(updatedQuantities);
    };

    const handleSave = () => {
        onSave(quantities);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
                <h2 className="text-lg font-bold mb-4">Enter Size-Wise Quantities</h2>
                {sizes.map((size, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {size}
                            {quantities2 && (
                                <span className="ml-2 text-sm text-gray-500">
                                    (Current: {quantities2[index] || 0})
                                </span>
                            )}
                        </label>
                        <input
                            type="number"
                            value={quantities[index]}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                ))}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-md mr-2 hover:bg-green-700 transition"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuantityUpModal;
