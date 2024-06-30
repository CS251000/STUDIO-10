import React, { useState } from 'react';

const SwsrModal = ({ isOpen, onClose, sizes, onSave }) => {
    const [swsr, setSwsr] = useState(sizes.map(() => 0));

    const handleSwsrChange = (index, value) => {
        const updatedSwsr = [...swsr];
        updatedSwsr[index] = Number(value);
        setSwsr(updatedSwsr);
    };

    const handleSave = () => {
        onSave(swsr);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Enter Size Wise Sale Rates</h2>
                {sizes.map((size, index) => (
                    <div key={index} className="mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {size.label}
                        </label>
                        <input
                            type="number"
                            value={swsr[index]}
                            onChange={(e) => handleSwsrChange(index, e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                ))}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-md mr-2"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwsrModal;
