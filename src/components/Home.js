import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "./Card";
import { db, auth, storage } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import FilterModal from "./FilterModal";

export default function Home() {
  const { searchQuery } = useOutletContext();
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

  // State to manage filters and modal visibility
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFabricator, setFilterFabricator] = useState("");
  const [filterClothQuality, setFilterClothQuality] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterClorsh, setFilterClorsh] = useState(false);
  const[filterAgent,setFilterAgent]= useState("");
  const [rateCostingRange, setRateCostingRange] = useState({min:0, max:500});

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
          // Fetch all products for the user
          let q = query(
            collection(db, "products"),
            where("user", "==", userId),
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log("Fetched products:", products);

          // Apply filters locally (case-insensitive, partial matching)
          const filteredProducts = products.filter((product) => {
            const matchesCategory = filterCategory
              ? String(product.category || "")
                  .toLowerCase()
                  .includes(filterCategory.toLowerCase())
              : true;
            const matchesFabricator = filterFabricator
              ? (product.fabricator || "")
                  .toLowerCase()
                  .includes(filterFabricator.toLowerCase())
              : true;
            const matchesClothQuality = filterClothQuality
              ? (product.clothQuality || "")
                  .toLowerCase()
                  .includes(filterClothQuality.toLowerCase())
              : true;
              const matchesAgent = filterAgent
              ? (product.clothagent || "")
                  .toLowerCase()
                  .includes(filterAgent.toLowerCase())
              : true;


            const matchesStatus =
              filterStatus !== null ? product.status === filterStatus : true;

            const matchesClorsh =
              // filterClorsh !== null
              //   ? product.clorsh === null ||
              //     product.clorsh === undefined ||
              //     product.clorsh === false
              //     ? filterClorsh === false
              //     : product.clorsh === filterClorsh
              //   : true;
              filterClorsh!==null?product.clorsh===filterClorsh:true;
              
                const totalExpenses = product.expenses.reduce(
                  (acc, expense) => acc + expense,
                  0
                );
              var ratecost = (
                Number(product.averagePiece) * Number(product.clothSaleRate) +
                Number(totalExpenses) +
                Number(product.fabrication)
              ).toFixed(2);
              const matchesRateCosting =
              ratecost >= rateCostingRange.min &&
              ratecost<= rateCostingRange.max;

            return (
              matchesCategory &&
              matchesFabricator &&
              matchesClothQuality &&
              matchesStatus &&
              matchesClorsh&&
              matchesAgent&&
              matchesRateCosting
            );
          });

          setData(filteredProducts);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [
    userId,
    filterCategory,
    filterFabricator,
    filterClothQuality,
    filterStatus,
    filterClorsh,
    filterAgent,
    rateCostingRange,
  ]);

  

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const imageUrl = data.imageUrl;

          if (imageUrl) {
            const storageRef = ref(storage, imageUrl);
            try {
              await deleteObject(storageRef);
              console.log("Image deleted successfully");
            } catch (error) {
              console.error("Error deleting image: ", error);
            }
          }

          await deleteDoc(docRef);

          const reorderedItemsRef = collection(db, "reorderedItems");
          const q = query(reorderedItemsRef, where("itemId", "==", id));
          const reorderedSnapshot = await getDocs(q);

          if (!reorderedSnapshot.empty) {
            const reorderedItemDoc = reorderedSnapshot.docs[0];
            await deleteDoc(doc(db, "reorderedItems", reorderedItemDoc.id));
            console.log("Reordered item deleted successfully");
          }

          setData((prevData) => prevData.filter((item) => item.id !== id));
          console.log("Document deleted successfully");
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error deleting document or image: ", error);
      }
    }
  };

  const filteredData = data.filter((item) => {
    // console.log("Filtering item:", item); // Log each item before filtering
    return (
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(item.category).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fabricator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jobslip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clothQuality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const totalMeter = filteredData.reduce((sum, item) => {
    const meterValue = parseFloat(item.meter) || 0; // Ensure meter is a number
    return sum + meterValue;
  }, 0);

  const handleApplyFilters = ({ category, fabricator, clothQuality, status, clorsh,clothAgent,rateCostingRange }) => {
    const filterState = { category, fabricator, clothQuality, status, clorsh,clothAgent };
    localStorage.setItem('filters', JSON.stringify(filterState)); 
    setFilterCategory(category);
    setFilterFabricator(fabricator);
    setFilterClothQuality(clothQuality);
    setFilterStatus(status);
    setFilterClorsh(clorsh);
    setFilterAgent(clothAgent);
    setRateCostingRange(rateCostingRange);
    
  };
  useEffect(() => {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      const { category, fabricator, clothQuality, status, clorsh,clothAgent } = JSON.parse(savedFilters);
      setFilterCategory(category || '');
      setFilterFabricator(fabricator || '');
      setFilterClothQuality(clothQuality || '');
      setFilterStatus(status !== undefined ? status : null);
      setFilterClorsh(clorsh !== undefined ? clorsh : false);
      setFilterAgent(clothAgent||'');
      setRateCostingRange(rateCostingRange||[0,500]);
    }
  }, []);
  
  

  return (
    <div className="container mx-auto px-4 mt-4">
      <button
        className="flex items-center bg-slate-400 hover:bg-slate-600 border-0 py-1 px-3 focus:outline-none rounded text-base text-black"
        onClick={() => setIsFilterModalOpen(true)}
      >
        Filter
      </button>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />
      <div className="my-4 text-xl font-bold text-gray-700">
        Total Meter: {totalMeter.toFixed(2)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {filteredData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            // imag={card.imageUrl}
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
            desc={card.desc}
            clorsh={card.clorsh}
            itemPurchase= {card.itempurchase}
            itemSale={card.itemsale}
          />
        ))}
      </div>
    </div>
  );
}
