import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "./config";

// Tenants Collection Reference
const tenantsRef = collection(db, "tenants");

// Get all tenants (Live updates)
export const subscribeToTenants = (callback) => {
  const q = query(tenantsRef, orderBy("name", "asc"));
  return onSnapshot(q, (snapshot) => {
    const tenants = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tenants);
  });
};

// Add a new tenant
export const addNewTenant = async (tenantData) => {
  try {
    const docRef = await addDoc(tenantsRef, {
      ...tenantData,
      createdAt: new Date().toISOString(),
      pending: true
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding tenant: ", error);
    throw error;
  }
};

// Update tenant payment status
export const updatePaymentStatus = async (tenantId, isPaid) => {
  try {
    const tenantDoc = doc(db, "tenants", tenantId);
    await updateDoc(tenantDoc, {
      pending: !isPaid
    });
  } catch (error) {
    console.error("Error updating payment: ", error);
    throw error;
  }
};
