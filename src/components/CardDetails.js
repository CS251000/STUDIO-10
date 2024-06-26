import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';

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

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-around">
      <h2 className="text-2xl font-bold mb-4">{product.itemName}</h2>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">ReOrder</button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.itemName} className="w-64 h-64 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4" />
        )}
        <div className="flex-1">
          <div className="mb-4">
            <span className="font-bold">Job Slip:</span> {product.jobslip}
          </div>
          <div className="mb-4">
            <span className="font-bold">Fabricator:</span> {product.fabricator}
          </div>
          <div className="mb-4">
            <span className="font-bold">Category:</span> {product.category.join(', ')}
          </div>
          <div className="mb-4">
            <span className="font-bold">Sizes:</span> {product.sizes.join(', ')}
          </div>
          <div className="mb-4">
            <span className="font-bold">Meter:</span> {product.meter}
          </div>
          <div className="mb-4">
            <span className="font-bold">Cloth Quality:</span> {product.clothQuality}
          </div>
          <div className="mb-4">
            <span className="font-bold">Cloth Name:</span> {product.clothName}
          </div>
          <div className="mb-4">
            <span className="font-bold">Cloth Purchase Rate:</span> {product.clothPurchaseRate}
          </div>
          <div className="mb-4">
            <span className="font-bold">Cloth Sale Rate:</span> {product.clothSaleRate}
          </div>
          <div className="mb-4">
            <span className="font-bold">Average Piece:</span> {product.averagePiece}
          </div>
          <div className="mb-4">
            <span className="font-bold">MRP:</span> {product.mrp}
          </div>
          <div className="mb-4">
            <span className="font-bold">Fabrication Cost:</span> {product.fabrication}
          </div>
          <div className="mb-4">
            <span className="font-bold">Margin:</span> {product.margin}
          </div>
          <div className="mb-4">
            <span className="font-bold">Discount:</span> {product.discount}
          </div>
          <div className="mb-4">
            <span className="font-bold">Packing Charge:</span> {product.packingCharge}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
