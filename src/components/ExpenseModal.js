import React, { useState } from 'react';

const ExpenseModal = ({ isOpen, onClose, expenses, onSave }) => {
    const [expenseValues, setExpenseValues] = useState(expenses.map(() => ''));

    const handleExpenseChange = (index, value) => {
        const updatedExpenses = [...expenseValues];
        updatedExpenses[index] = value;
        setExpenseValues(updatedExpenses);
    };

    const handleSave = () => {
        const numericExpenses = expenseValues.map(value => value !== '' ? Number(value) : 0);
        onSave(numericExpenses);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-md">
                <h2 className="text-lg font-bold mb-4">Enter Expenses</h2>
                <div className="max-h-60 overflow-y-auto">
                    {expenses.map((expense, index) => (
                        <div key={index} className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {expense.label}
                            </label>
                            <input
                                type="number"
                                value={expenseValues[index]}
                                onChange={(e) => handleExpenseChange(index, e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                            />
                        </div>
                    ))}
                </div>
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

export default ExpenseModal;
