import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import ExpenseInfo from './ExpenseInfo';
import QuantityInfo from './QuantityInfo';
import SwprInfo from './SwprInfo';



const CardDetails = () => {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);


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

  if (!product) {
    return <div>No product found</div>;
  }
  const margin = product.margin || 0;

  const salerateS = product.sizeWiseRateS
    ? ((1 + margin / 100) * product.sizeWiseRateS).toFixed(2)
    : 'N/A';
  const salerateMLXL = product.sizeWiseRateMLXL
    ? ((1 + margin / 100) * product.sizeWiseRateMLXL).toFixed(2)
    : 'N/A';
  const salerateXXL = product.sizeWiseRateXXL
    ? ((1 + margin / 100) * product.sizeWiseRateXXL).toFixed(2)
    : 'N/A';
   
    const totalExpenses = product.expenses.reduce((acc, value) => acc + (value || 0), 0);
    
  var ratecost = (Number(product.averagePiece) * Number(product.clothSaleRate) + Number(totalExpenses) + Number(product.fabrication)).toFixed(2);


  return (
    <div className={`max-w-4xl mx-auto my-8 p-4 ${product.status===true?'bg-yellow-100':'bg-white'}  shadow-md 
    rounded-md`}>
      <div className="flex justify-around">
        <h2 className="text-2xl font-bold mb-4">{product.itemName}</h2>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          ReOrder
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
              <span className="font-bold">Rate Costing:</span> 
              {ratecost}
            </div>

            {/* <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Margin:</span> {product.margin}
            </div> */}
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Discount:</span> {product.discount}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">Packing Charge:</span> {product.packingCharge}
            </div>
            <div className="flex flex-row justify-center items-center gap-5 mb-2">
            <ExpenseInfo expensesvalue={product.expenses}/>
            <QuantityInfo selectedSizes={product.sizes} selectedQuantities={product.quantities}/>
            <SwprInfo selectedSizes={product.sizes} selectedSwpr={product.swpr}/>
            </div>
            {/*<div className="flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 border border-black p-2 w-full mb-2">
              
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 xl:mb-0 xl:mr-4">Size Wise Rates</h3>
              <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">S:</span> {product.sizeWiseRateS}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">M,L,XL:</span> {product.sizeWiseRateMLXL}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">XXL:</span> {product.sizeWiseRateXXL}
            </div>

            </div>*/}
            <div className="flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 border border-black p-2 bg-yellow-300 w-full mb-2">
              
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 xl:mb-0 xl:mr-4">Size Wise SALE rates</h3>
              <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">S:</span> {salerateS}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">M,L,XL:</span> {salerateMLXL}
            </div>
            <div className="w-full sm:w-1/2 mb-4">
              <span className="font-bold">XXL:</span> {salerateXXL}
            </div>

            </div>
            
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
