import React from 'react';
import { Link } from 'react-router-dom';

export default function Card({ id, img, jobslip, itemName, status, category = [], fabricator, clothname, quality, meter, onDelete, expenses = [], averagePiece, clothSaleRate, fabrication, timestamp }) {

  const totalExpenses = expenses.reduce((acc, value) => acc + (value || 0), 0);
  const rateCost = (Number(averagePiece) * Number(clothSaleRate) + Number(totalExpenses) + Number(fabrication)).toFixed(2);
  
  let formattedDate = 'N/A';
  if (timestamp && typeof timestamp.toDate === 'function') {
    const date = timestamp.toDate();
    formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className={`max-w-sm border rounded-lg shadow border-gray-700 ${status ? 'bg-yellow-100' : 'bg-white'}`}>

      <img className="rounded-t-lg w-full h-48 object-cover" src={img} alt='itemImage' />

      <div className="p-5">

        <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-700">
          Job Slip: &nbsp; <span className='text-black text-md font-normal'>{jobslip}</span>
        </h5>

        <h6 className="mb-2 text-2xl font-bold tracking-tight text-black text-center">{itemName}</h6>

        <p className="mb-3 font-normal text-gray-700">
          Date: {formattedDate}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Category: {category.join(' , ')}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Fabricator: {fabricator}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Cloth Name: {clothname}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Cloth Quality: {quality}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Cloth Meter: {meter}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          Rate Costing: {rateCost}
        </p>

        <div className="flex justify-between">
          <Link to={`/${id}`}>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Info</button>
          </Link>
          {/* <Link to={`/update/${id}`}>
            <button type="button" className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Update</button>
          </Link> */}
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
