import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Card({ id, imag, jobslip, itemName, status, category = [], fabricator, clothname, quality, meter, onDelete, expenses = [], averagePiece, clothSaleRate, fabrication, timestamp,desc,clorsh,itemPurchase,itemSale,clothPurchaseRate }) {

  const [isReordered, setIsReordered] = useState(false);
  const [userId, setUserId] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState(''); // "update" or "delete"
  const [error, setError] = useState('');

  const PASSWORD="AZX";
  const p2="azx"

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  }, []);

  useEffect(() => {
    const checkIfReordered = async () => {
      try {
        if (!userId) return;

        const reorderedItemsRef = collection(db, 'reorderedItems');
        const q = query(reorderedItemsRef, where('itemId', '==', id), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        setIsReordered(!querySnapshot.empty);
      } catch (error) {
        console.error('Error checking reorder status:', error);
      }
    };

    checkIfReordered();
  }, [id, userId]);

  const handleReorder = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const reorderedItemsRef = collection(db, 'reorderedItems');
      const docRef = doc(reorderedItemsRef, `${userId}_${id}`);

      if (isReordered) {
        await deleteDoc(docRef);
        setIsReordered(false);
      } else {
        await setDoc(docRef, {
          itemId: id,
          userId,
          reorderedAt: new Date(),
        });
        setIsReordered(true);
      }
    } catch (error) {
      console.error('Error handling reorder:', error);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === PASSWORD|| password=== p2) {
      if (actionType === 'delete') {
        onDelete(id); // Call the delete handler
      } else if (actionType === 'update') {
        window.location.href = `/update/${id}`; // Redirect to the update page
      }
      setShowPasswordModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowPasswordModal(true);
  };

  const totalExpenses = expenses.reduce((acc, value) => acc + (value || 0), 0);
  const rateCost = (Number(averagePiece) * Number(clothSaleRate) + Number(totalExpenses) + Number(fabrication)).toFixed(2);

  let formattedDate = 'N/A';

if (timestamp && typeof timestamp.toDate === 'function') {
  // If it's a Firebase Timestamp
  const date = timestamp.toDate();
  formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} else if (timestamp && !isNaN(Date.parse(timestamp))) {
  
  const date = new Date(timestamp);
  formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

  return (
    <div className={`max-w-sm border rounded-lg shadow border-gray-700 ${status ? 'bg-yellow-100' : (!clorsh?'bg-green-300':'bg-white')}`}>
      
      {/* {imag ? (
  <img
    className="rounded-t-lg w-full h-48 object-cover"
    src={imag}
    alt="itemImage"
    onError={(e) => e.target.style.display = 'none'}
  />
) : null} */}
      
      <div className="p-5">
        
        
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-700">
          Job Slip: &nbsp; <span className="text-black text-md font-normal">{jobslip}</span>
        </h5>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-black-700">
          <span className="text-white bg-black p-2 rounded-xl text-md font-normal">{clorsh?'SPO':'CPO'}</span>
        </h5>
        <button
            type="button"
            onClick={handleReorder}
            className={`text-white ${isReordered ? 'bg-green-700' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex flex-row-reverse ml-auto`}
          >
            {isReordered ? 'Reordered' : 'ReOrder'}
          </button>
        <h6 className="mb-2 text-2xl font-bold tracking-tight text-black text-center">{itemName}</h6>
        <p className="mb-3 font-normal text-gray-700">Item Purchase: {itemPurchase}</p>
        <p className="mb-3 font-normal text-gray-700">Item Sale: {itemSale}</p>
        <p className="mb-3 font-normal text-gray-700">Cloth Purchase Rate: {clothPurchaseRate}</p>
        <p className="mb-3 font-normal text-gray-700">Cloth Sale Rate: {clothSaleRate}</p>

        <p className="mb-3 font-normal text-gray-700">Date: {formattedDate}</p>
        <p className="mb-3 font-normal text-gray-700">Category: {category.join(' , ')}</p>
        <p className="mb-3 font-normal text-gray-700">Fabricator: {fabricator}</p>
        <p className="mb-3 font-normal text-gray-700">Cloth Name: {clothname}</p>
        {/* <p className="mb-3 font-normal text-gray-700">Cloth Quality: {quality}</p> */}
        <p className="mb-3 font-normal text-gray-700">Cloth Meter: {meter}</p>
        <p className="mb-3 font-normal text-gray-700">Rate Costing: {rateCost}</p>
        

        <div className="flex justify-between">
          <Link to={`/${id}`}>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Info</button>
          </Link>
          
            <button type="button" 
            className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            onClick={()=>handleAction('update')}
            >Update</button>
          
          <button
            type="button"
            onClick={() => handleAction('delete')}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Delete
          </button>

          {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-80">
            <h3 className="text-xl font-bold mb-4">Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              placeholder="Enter your password"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end">
              <button
                onClick={handlePasswordSubmit}
                className="text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
          
        </div>
      </div>
    </div>
  );
}
