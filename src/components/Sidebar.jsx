import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, UserPlus, Bell, LogOut, Shield, Menu, X, Users } from 'lucide-react';

const Sidebar = () => {
  const { currentView, setCurrentView, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'add-tenant', label: 'Tenant Add', icon: UserPlus },
    { id: 'reminders', label: 'WhatsApp Reminder', icon: Bell },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="mobile-header glass">
        <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open Menu">
          <Menu size={24} />
        </button>
        <div className="header-logo">
          <Shield size={24} color="var(--primary)" />
          <h2>PG Admin</h2>
        </div>
        <button className="mobile-logout" onClick={logout} aria-label="Logout">
          <LogOut size={20} />
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="header-logo-menu">
              <Shield size={24} color="var(--primary)" />
              <h2>PG Admin</h2>
            </div>
            <button className="menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
              <X size={24} />
            </button>
          </div>
          <nav className="mobile-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mobile-menu-footer">
            <button className="logout-btn" onClick={logout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <Shield size={24} color="var(--primary)" />
          <h2>PG Admin</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        /* Desktop Sidebar */
        .sidebar {
          width: 260px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border);
          padding: 1.5rem 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          margin-bottom: 2.5rem;
        }
        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-align: left;
          transition: var(--transition);
        }
        .nav-item:hover {
          color: var(--text-main);
          background: var(--primary-light);
        }
        .nav-item.active {
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
          box-shadow: var(--shadow);
        }
        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          width: 100%;
          border-radius: var(--radius);
          color: var(--danger);
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-align: left;
          transition: var(--transition);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          align-items: center;
          padding: 0 1rem;
          z-index: 100;
          border-bottom: 1px solid var(--border);
        }
        .menu-toggle {
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
        }
        .header-logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-logo h2 {
          font-size: 1.125rem;
          color: var(--text-main);
        }
        .mobile-logout {
          background: transparent;
          border: none;
          color: var(--danger);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: var(--radius);
          margin-left: auto;
        }
        .mobile-logout:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition);
        }
        .mobile-menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-menu {
          position: absolute;
          top: 0;
          left: -100%;
          bottom: 0;
          width: 280px;
          background: var(--bg-sidebar);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid var(--border);
        }
        .mobile-menu-overlay.open .mobile-menu {
          left: 0;
        }
        
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          padding: 0.5rem;
        }
        .header-logo-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-logo-menu h2 {
          font-size: 1.125rem;
          color: var(--text-main);
        }
        .menu-close {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-align: left;
          transition: var(--transition);
        }
        .mobile-nav-item:hover {
          color: var(--text-main);
          background: var(--primary-light);
        }
        .mobile-nav-item.active {
          color: white;
          background: linear-gradient(135deg, var(--primary), var(--primary-hover));
        }
        .mobile-menu-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        
        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
          .mobile-header {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
