import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Suraj Kumar', rent: 8000, dueDate: '2026-05-05', phone: '9876543210', pending: true },
    { id: 2, name: 'Amit Sharma', rent: 12000, dueDate: '2026-05-02', phone: '8765432109', pending: true },
    { id: 3, name: 'Rahul Verma', rent: 6500, dueDate: '2026-04-25', phone: '7654321098', pending: false },
    { id: 4, name: 'Deepak Singh', rent: 9500, dueDate: '2026-04-20', phone: '6543210987', pending: true },
  ]);

  const login = (email, password) => {
    if (email === 'admin' && password === '1234') {
      setUser({ email: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const addTenant = (tenant) => {
    const newTenant = {
      ...tenant,
      id: tenants.length + 1,
      rent: parseFloat(tenant.rent),
      pending: true
    };
    setTenants([...tenants, newTenant]);
  };

  const markAsPaid = (id) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, pending: false } : t));
  };

  return (
    <AppContext.Provider value={{
      user,
      currentView,
      setCurrentView,
      tenants,
      login,
      logout,
      addTenant,
      markAsPaid
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
