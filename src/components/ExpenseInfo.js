import React, { useState } from 'react';

const ExpenseInfo = ({ expensesvalue }) => {
  const expenses = [
    { value: 'washing', label: 'Washing' },
    { value: 'kadhai', label: 'Kadhai' },
    { value: 'pasting', label: 'Pasting' },
    { value: 'button', label: 'Button' },
    { value: 'design', label: 'Design' },
    { value: 'print', label: 'Print' },
    { value: 'id', label: 'ID' },
    { value: 'double-pocket', label: 'Double Pocket' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const totalExpenses = expensesvalue.reduce((acc, value) => acc + (value || 0), 0);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Expenses:  ₹ {totalExpenses.toFixed(2)}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Expenses</h2>
            <ul>
              {expenses.map((expense, index) => (
                <li key={index} className="border-b py-2 flex justify-between">
                  <span>{expense.label}:</span>
                  <span> ₹ {expensesvalue[index].toFixed(2)}</span>
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
};

export default ExpenseInfo;
