import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddTenant from './pages/AddTenant';
import Reminders from './pages/Reminders';
import Tenants from './pages/Tenants';

const AppContent = () => {
  const { user, currentView } = useApp();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container animate-fade-in">
      <Sidebar />
      <main className="main-content">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'tenants' && <Tenants />}
        {currentView === 'add-tenant' && <AddTenant />}
        {currentView === 'reminders' && <Reminders />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
