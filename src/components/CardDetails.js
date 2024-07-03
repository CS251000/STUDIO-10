import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import ExpenseInfo from './ExpenseInfo';
import QuantityInfo from './QuantityInfo';
import SwprInfo from './SwprInfo';
import SwsrInfo from './Swsrinfo';

const CardDetails = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [isReordered, setIsReordered] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchProduct();
  }, [itemId]);

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
        const reorderedItemsRef = collection(db, 'reorderedItems');
        const q = query(reorderedItemsRef, where('itemId', '==', itemId), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsReordered(true);
        } else {
          setIsReordered(false);
        }
      } catch (error) {
        console.error('Error checking reordered item:', error);
      }
    };

    if (userId) {
      checkIfReordered();
    }
  }, [itemId, userId]);

  const handleReorder = async () => {
    if (!userId) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const reorderedItemsRef = collection(db, 'reorderedItems');
      const docRef = doc(reorderedItemsRef, `${userId}_${itemId}`);

      if (isReordered) {
        await deleteDoc(docRef);
        setIsReordered(false);
      } else {
        await setDoc(docRef, {
          itemId,
          userId,
          reorderedAt: new Date()
        });
        setIsReordered(true);
      }
    } catch (error) {
      console.error('Error handling reorder:', error);
    }
  };

  if (!product) {
    return <div>No product found</div>;
  }

  const totalExpenses = product.expenses.reduce((acc, value) => acc + (value || 0), 0);
  const rateCost = (Number(product.averagePiece) * Number(product.clothSaleRate) + Number(totalExpenses) + Number(product.fabrication)).toFixed(2);

  let netProfit = 0;
  for (let i = 0; i < product.swsr.length; i++) {
    netProfit += (product.swsr[i] * (1 - 0.01 * product.discount) - product.swpr[i] - product.packingCharge);
  }
  netProfit = (netProfit / product.swsr.length).toFixed(2);

  const clothProfit = (product.clothSaleRate - product.clothPurchaseRate - 2).toFixed(2);

  return (
    <div className={`max-w-4xl mx-auto my-8 p-4 ${product.status ? 'bg-yellow-100' : 'bg-white'} shadow-md rounded-md`}>
      <div className="flex justify-around">
        <h2 className="text-2xl font-bold mb-4">{product.itemName}</h2>
        <button
          type="button"
          className={`text-white ${isReordered ? 'bg-green-700' : 'bg-blue-700 hover:bg-blue-800'} focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`}
          onClick={handleReorder}
        >
          {isReordered ? 'Reordered' : 'ReOrder'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.itemName}
            className="w-64 h-64 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
          />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Job Slip:</span> {product.jobslip}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Fabricator:</span> {product.fabricator}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Category:</span> {product.category.join(', ')}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Sizes:</span> {product.sizes.join(', ')}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Meter:</span> {product.meter}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Cloth Quality:</span> {product.clothQuality}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Cloth Name:</span> {product.clothName}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Cloth Purchase Rate:</span> {product.clothPurchaseRate}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Cloth Sale Rate:</span> {product.clothSaleRate}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Average Piece:</span> {product.averagePiece}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">MRP:</span> {product.mrp}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Fabrication Cost:</span> {product.fabrication}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Rate Costing:</span> {rateCost}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Discount:</span> {product.discount}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Packing Charge:</span> {product.packingCharge}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Net Profit:</span> {netProfit}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Cloth Profit:</span> {clothProfit}
            </div>
            <div className="flex flex-row justify-center items-center gap-5 mb-2">
              <ExpenseInfo expensesvalue={product.expenses} />
              <QuantityInfo selectedSizes={product.sizes} selectedQuantities={product.quantities} />
              <SwprInfo selectedSizes={product.sizes} selectedSwpr={product.swpr} />
              <SwsrInfo selectedSizes={product.sizes} selectedSwsr={product.swsr} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
