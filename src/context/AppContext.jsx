import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscribeToTenants, addNewTenant, updatePaymentStatus } from '../firebase/tenants';
import { subscribeToExpenses, addNewExpense, deleteExpenseById } from '../firebase/expenses';
import { subscribeToRooms, addNewRoom, updateRoomOccupancy } from '../firebase/rooms';
import { toast } from 'react-hot-toast';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('pg_admin_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [tenants, setTenants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubTenants = subscribeToTenants((data) => setTenants(data));
    const unsubExpenses = subscribeToExpenses((data) => setExpenses(data));
    const unsubRooms = subscribeToRooms((data) => {
      setRooms(data);
      setLoading(false);
    });

    return () => {
      unsubTenants();
      unsubExpenses();
      unsubRooms();
    };
  }, []);

  const login = (email, password) => {
    if (email === 'admin' && password === '1234') {
      const userData = { email: 'admin', role: 'admin' };
      setUser(userData);
      sessionStorage.setItem('pg_admin_user', JSON.stringify(userData));
      toast.success('Welcome!');
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('pg_admin_user');
    toast.success('Logged out');
  };

  const addTenant = async (tenant) => {
    const tid = toast.loading('Adding tenant...');
    try {
      await addNewTenant({ ...tenant, rent: parseFloat(tenant.rent) });
      toast.success('Added!', { id: tid });
    } catch (e) { toast.error('Failed!', { id: tid }); }
  };

  const markAsPaid = async (id) => {
    const tid = toast.loading('Updating...');
    try {
      await updatePaymentStatus(id, true);
      toast.success('Paid!', { id: tid });
    } catch (e) { toast.error('Failed!', { id: tid }); }
  };

  const addExpense = async (expense) => {
    const tid = toast.loading('Saving expense...');
    try {
      await addNewExpense({ ...expense, amount: parseFloat(expense.amount) });
      toast.success('Saved!', { id: tid });
    } catch (e) { toast.error('Failed!', { id: tid }); }
  };

  const deleteExpense = async (id) => {
    const tid = toast.loading('Deleting...');
    try {
      await deleteExpenseById(id);
      toast.success('Deleted!', { id: tid });
    } catch (e) { toast.error('Failed!', { id: tid }); }
  };

  const addRoom = async (room) => {
    const tid = toast.loading('Adding room...');
    try {
      await addNewRoom({ ...room, capacity: parseInt(room.capacity), occupied: 0 });
      toast.success('Room added!', { id: tid });
    } catch (e) { toast.error('Failed!', { id: tid }); }
  };

  const updateRoomStatus = async (roomId, count) => {
    try {
      await updateRoomOccupancy(roomId, count);
    } catch (e) { toast.error('Failed to update room!'); }
  };

  return (
    <AppContext.Provider value={{
      user, tenants, expenses, rooms, loading,
      login, logout, addTenant, markAsPaid,
      addExpense, deleteExpense, addRoom, updateRoomStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
