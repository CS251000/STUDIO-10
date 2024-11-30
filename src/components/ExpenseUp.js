import React, { useState, useEffect } from 'react';

const ExpenseUpModal = ({ isOpen, onClose, onSave, expenses2, availableExpenses }) => {
    const [expenses, setExpenses] = useState(availableExpenses.map((_, index) => expenses2?.[index] || 0));

    useEffect(() => {
        setExpenses(availableExpenses.map((_, index) => expenses2?.[index] || 0));
    }, [expenses2, availableExpenses]);

    const handleExpenseChange = (index, value) => {
        const updatedExpenses = [...expenses];
        updatedExpenses[index] = Number(value);
        setExpenses(updatedExpenses);
    };

    const handleSave = () => {
        onSave(expenses);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg max-h-[90vh] overflow-hidden">
                <h2 className="text-lg font-bold mb-4">Enter Expenses</h2>
                <div className="overflow-y-auto max-h-[60vh] pr-2">
                    {availableExpenses.map((expense, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                {expense.label}
                                {expenses2 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        (Current: {expenses2[index] || 0})
                                    </span>
                                )}
                            </label>
                            <input
                                type="number"
                                value={expenses[index]}
                                onChange={(e) => handleExpenseChange(index, e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    ))}
                </div>
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

export default ExpenseUpModal;
