import React, { useState } from "react";

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [category, setCategory] = useState("");
  const [fabricator, setFabricator] = useState("");
  const [clothQuality, setClothQuality] = useState("");
  const [clothAgent, setClothAgent] = useState("");
  const [status, setStatus] = useState(null); // Initially no status filter
  const [clorsh, setClorsh] = useState(null);
  const [rateCostingRange, setRateCostingRange] = useState({ min: 0, max: 500 });
  const[itemSale,setItemSale]= useState("");
  const[itemPurchase,setItemPurchase]= useState("");


  const handleApply = () => {
    onApply({
      category,
      fabricator,
      clothQuality,
      status,
      clorsh,
      clothAgent,
      rateCostingRange,
      itemSale,
      itemPurchase,
    });
    onClose();
  };

  const handleCancel = () => {
    setCategory("");
    setFabricator("");
    setClothQuality("");
    setStatus(null); // Reset the status filter
    setClorsh(null);
    setClothAgent("");
    setRateCostingRange({ min: 0, max: 500 });
    setItemSale("");
    setItemPurchase("");
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

          {/* Category Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            {category && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setCategory("")}
              >
                &times;
              </button>
            )}
          </div>

          {/* Fabricator Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Fabricator</label>
            <input
              type="text"
              value={fabricator}
              onChange={(e) => setFabricator(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            {fabricator && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setFabricator("")}
              >
                &times;
              </button>
            )}
          </div>

          {/* Cloth Quality Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Cloth Quality</label>
            <input
              type="text"
              value={clothQuality}
              onChange={(e) => setClothQuality(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            {clothQuality && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setClothQuality("")}
              >
                &times;
              </button>
            )}
          </div>

          {/* Cloth Agent Field */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Cloth Agent</label>
            <input
              type="text"
              value={clothAgent}
              onChange={(e) => setClothAgent(e.target.value)}
              className="w-full p-2 border rounded pr-10"
            />
            {clothAgent && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setClothAgent("")}
              >
                &times;
              </button>
            )}
          </div>
          {/* item */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Item Purchase & Sale rate
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={itemPurchase}
                onChange={(e) =>
                  setItemPurchase(
                    e.target.value)}
                placeholder="Purchase rate"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                value={itemSale}
                onChange={(e) =>
                  setItemSale(e.target.value)}
                placeholder="Item Sale rate"
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>

          {/* Rate Costing Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Filter by Rate Costing
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={rateCostingRange.min}
                onChange={(e) =>
                  setRateCostingRange((prev) => ({
                    ...prev,
                    min:parseFloat(e.target.value),
                  }))
                }
                placeholder="Min"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                value={rateCostingRange.max}
                onChange={(e) =>
                  setRateCostingRange((prev) => ({
                    ...prev,
                    max:parseFloat(e.target.value),
                  }))
                }
                placeholder="Max"
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>

          {/* Status Field */}
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
                Clear
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
                Pending
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
                Both
              </label>
            </div>
          </div>

          {/* Clorsh Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Clorsh</label>
            <div className="flex items-center space-x-2">
              <label>
                <input
                  type="radio"
                  name="clorsh"
                  value="true"
                  checked={clorsh === true}
                  onChange={() => setClorsh(true)}
                  className="mr-2"
                />
                SPO
              </label>
              <label>
                <input
                  type="radio"
                  name="clorsh"
                  value="false"
                  checked={clorsh === false}
                  onChange={() => setClorsh(false)}
                  className="mr-2"
                />
                CPO
              </label>
              <label>
                <input
                  type="radio"
                  name="clorsh"
                  value=""
                  checked={clorsh === null}
                  onChange={() => setClorsh(null)}
                  className="mr-2"
                />
                Both
              </label>
            </div>
          </div>

          {/* Action Buttons */}
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
