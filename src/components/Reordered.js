import React, { useEffect, useState } from 'react';
import Card from './Card';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, deleteDoc,where,query } from 'firebase/firestore';
import { useOutletContext } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const ReorderedItems = () => {
  const { searchQuery } = useOutletContext();
  const [reorderedItems, setReorderedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

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
    const fetchReorderedItems = async () => {
      if (userId) {
        try {
          const reorderedItemsRef =query(collection
            (db, 'reorderedItems'),
          where('userId', '==', userId),
          // orderBy('reorderedAt', 'desc')
        );
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
      }
    };

    fetchReorderedItems();
  }, [userId]);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      try {
        // Delete from products collection
        await deleteDoc(doc(db, 'products', productId));

        // Delete from reorderedItems collection
        const reorderedItem = reorderedItems.find(item => item.itemId === productId);
        if (reorderedItem) {
          await deleteDoc(doc(db, 'reorderedItems', reorderedItem.id));
        }

        // Update state to reflect the deletion
        setProducts(products.filter(product => product.id !== productId));
        setReorderedItems(reorderedItems.filter(item => item.itemId !== productId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const filteredData = products.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(item.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.fabricator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jobslip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.clothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.clothQuality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 mt-4">
      {userId ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Reordered Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p>No reordered items found.</p>
            ) : (
              filteredData.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  imag={card.imageUrl}
                  jobslip={card.jobslip}
                  itemName={card.itemName}
                  status={card.status}
                  category={card.category}
                  fabricator={card.fabricator}
                  clothname={card.clothName}
                  quality={card.clothQuality}
                  meter={card.meter}
                  clothPurchaseRate={card.clothPurchaseRate}
                  onDelete={() => handleDelete(card.id)}
                  expenses={card.expenses}
                  averagePiece={card.averagePiece}
                  clothSaleRate={card.clothSaleRate}
                  fabrication={card.fabrication}
                  timestamp={card.createdAt}
                  desc= {card.desc}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <p>Please log in to view reordered items.</p>
      )}
    </div>
  );
};

export default ReorderedItems;
