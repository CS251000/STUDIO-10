import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [category, setCategory] = useState('');
  const [fabricator, setFabricator] = useState('');
  const [clothQuality, setClothQuality] = useState('');
  const [status, setStatus] = useState(null); // Initially no status filter

  const handleApply = () => {
    onApply({ category, fabricator, clothQuality, status });
    onClose();
  };

  const handleCancel = () => {
    setCategory('');
    setFabricator('');
    setClothQuality('');
    setStatus(null); // Reset the status filter
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fabricator</label>
            <input
              type="text"
              value={fabricator}
              onChange={(e) => setFabricator(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cloth Quality</label>
            <input
              type="text"
              value={clothQuality}
              onChange={(e) => setClothQuality(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <div className="flex items-center space-x-2">
              <label>
                <input
                  type="radio"
                  name="status"
                  value="true"
                  checked={status === true}
                  onChange={() => setStatus(true)}
                  className="mr-2"
                />
                Checked
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="false"
                  checked={status === false}
                  onChange={() => setStatus(false)}
                  className="mr-2"
                />
                Unchecked
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={status === null}
                  onChange={() => setStatus(null)}
                  className="mr-2"
                />
                None
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterModal;
