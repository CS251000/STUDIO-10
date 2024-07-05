import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from './Card';
import { db, auth,storage } from '../firebaseConfig';
import { collection, getDocs,getDoc, doc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { ref,deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const { searchQuery } = useOutletContext();
  const [data, setData] = useState([]);
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
    const fetchData = async () => {
      if (userId) {
        try {
          const q = query(
            collection(db, 'products'),
            where('user', '==', userId),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setData(products);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
        try {
            // Fetch the document to get the image URL
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const imageUrl = data.imageUrl;

                if (imageUrl) {
                    // Create a reference to the file to delete
                    const storageRef = ref(storage, imageUrl);

                    try {
                        // Delete the file
                        await deleteObject(storageRef);
                        console.log('Image deleted successfully');
                    } catch (error) {
                        console.error('Error deleting image: ', error);
                    }
                }

                // Delete the document from Firestore
                await deleteDoc(docRef);
                setData(prevData => prevData.filter(item => item.id !== id));
                console.log('Document deleted successfully');
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error deleting document or image: ', error);
        }
    }
};

  const filteredData = data.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())||
    item.fabricator.toLowerCase().includes(searchQuery.toLowerCase())||
    item.jobslip.toLowerCase().includes(searchQuery.toLowerCase())||
    item.clothName.toLowerCase().includes(searchQuery.toLowerCase())||
    item.clothQuality.toLowerCase().includes(searchQuery.toLowerCase())
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
            expenses={card.expenses}
            averagePiece={card.averagePiece}
            clothSaleRate={card.clothSaleRate}
            fabrication={card.fabrication}
            timestamp={card.createdAt}

          />
        ))}
      </div>
    </div>
  );
}
