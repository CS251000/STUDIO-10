import React, { useEffect, useState } from 'react';
import Card from './Card';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const ReorderedItems = () => {
  const [reorderedItems, setReorderedItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchReorderedItems = async () => {
      try {
        const reorderedItemsRef = collection(db, 'reorderedItems');
        const querySnapshot = await getDocs(reorderedItemsRef);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReorderedItems(items);

        // Fetch corresponding products
        const productPromises = items.map(item => {
          const productRef = doc(db, 'products', item.itemId);
          return getDoc(productRef);
        });

        const productSnapshots = await Promise.all(productPromises);
        const fetchedProducts = productSnapshots.map(snapshot => ({
          id: snapshot.id,
          ...snapshot.data()
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching reordered items and products:', error);
      }
    };

    fetchReorderedItems();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-4">
      <h2 className="text-2xl font-bold mb-4">Reordered Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p>No reordered items found.</p>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              img={product.imageUrl}
              jobslip={product.jobslip}
              itemName={product.itemName}
              status={product.status}
              category={product.category}
              fabricator={product.fabricator}
              clothname={product.clothName}
              quality={product.clothQuality}
              meter={product.meter}
              clothPurchaseRate={product.clothPurchaseRate}
              // Optionally, if you want to include a delete functionality
              // onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReorderedItems;
