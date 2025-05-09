// updateTimestamps.js

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp
} from "firebase/firestore";

import { db } from "./src/firebaseConfig.js";

// Function to update 'createdAt' to ISO string
const updateTimestampsToISO = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    let updatedCount = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const createdAt = data.createdAt;

      // Check if field is a Firebase Timestamp
      if (
        createdAt &&
        createdAt.seconds !== undefined &&
        createdAt.nanoseconds !== undefined
      ) {
        const isoDate = new Date(
          createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6
        ).toISOString();

        await updateDoc(doc(productsRef, docSnap.id), {
          createdAt: isoDate,
        });

        console.log(`✅ Updated document ${docSnap.id} → ${isoDate}`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Finished. Total documents updated: ${updatedCount}`);
  } catch (err) {
    console.error("❌ Error updating timestamps:", err);
  }
};

updateTimestampsToISO();
