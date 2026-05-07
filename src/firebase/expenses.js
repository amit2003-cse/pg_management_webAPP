import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

const expensesCollection = collection(db, "expenses");

// Subscribe to real-time expenses
export const subscribeToExpenses = (callback) => {
  const q = query(expensesCollection, orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(expenses);
  });
};

// Add new expense
export const addNewExpense = async (expense) => {
  return await addDoc(expensesCollection, {
    ...expense,
    createdAt: serverTimestamp()
  });
};

// Delete expense
export const deleteExpenseById = async (id) => {
  const expenseRef = doc(db, "expenses", id);
  return await deleteDoc(expenseRef);
};
