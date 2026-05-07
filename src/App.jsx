import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddTenant from './pages/AddTenant';
import Reminders from './pages/Reminders';
import Tenants from './pages/Tenants';
import Expenses from './pages/Expenses';
import Inventory from './pages/Inventory';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

const PrivateRoute = ({ children }) => {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useApp();

  return (
    <div className="app-container">
      {user && <Sidebar />}
      <main className={user ? "main-content" : "auth-content"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={user ? <Navigate to="/" /> : <PageWrapper><LoginPage /></PageWrapper>} />
            
            <Route path="/" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
            <Route path="/tenants" element={<PrivateRoute><PageWrapper><Tenants /></PageWrapper></PrivateRoute>} />
            <Route path="/add-tenant" element={<PrivateRoute><PageWrapper><AddTenant /></PageWrapper></PrivateRoute>} />
            <Route path="/reminders" element={<PrivateRoute><PageWrapper><Reminders /></PageWrapper></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><PageWrapper><Expenses /></PageWrapper></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><PageWrapper><Inventory /></PageWrapper></PrivateRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <AnimatedRoutes />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
