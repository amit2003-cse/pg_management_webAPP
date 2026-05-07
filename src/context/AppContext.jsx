import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [rooms, setRooms] = useState([]);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Google Login
  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth Error:", error);
      throw error;
    }
  };

  // 3. Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // 4. Firestore Real-time Listeners (Only if user is logged in)
  useEffect(() => {
    if (!user) {
      setTenants([]);
      setExpenses([]);
      setRooms([]);
      return;
    }

    const qTenants = query(collection(db, 'tenants'), orderBy('name'));
    const unsubTenants = onSnapshot(qTenants, (snapshot) => {
      setTenants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qExpenses = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qRooms = query(collection(db, 'rooms'), orderBy('roomNo'));
    const unsubRooms = onSnapshot(qRooms, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTenants();
      unsubExpenses();
      unsubRooms();
    };
  }, [user]);

  // CRUD Operations
  const addTenant = (data) => addDoc(collection(db, 'tenants'), data);
  const updateTenant = (id, data) => updateDoc(doc(db, 'tenants', id), data);
  const deleteTenant = (id) => deleteDoc(doc(db, 'tenants', id));
  
  const addExpense = (data) => addDoc(collection(db, 'expenses'), { ...data, date: new Date().toISOString() });
  
  const addRoom = (data) => addDoc(collection(db, 'rooms'), data);
  const updateRoomStatus = (id, occupied) => updateDoc(doc(db, 'rooms', id), { occupied });

  return (
    <AppContext.Provider value={{
      user, loading, tenants, expenses, rooms,
      login, logout,
      addTenant, updateTenant, deleteTenant,
      addExpense, addRoom, updateRoomStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
