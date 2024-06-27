import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from './Card';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const { searchQuery } = useOutletContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(products);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setData(prevData => prevData.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const filteredData = data.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            img={card.imageUrl}
            jobslip={card.jobslip}
            itemName={card.itemName}
            status={card.status}
            category={card.category}
            fabricator={card.fabricator}
            clothname={card.clothName}
            quality={card.clothQuality}
            meter={card.meter}
            clothPurchaseRate={card.clothPurchaseRate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
