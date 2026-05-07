import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Users, Bed, 
  IndianRupee, Bell, UserPlus, LogOut, 
  Menu, X, Sun, Moon, ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { logout, user } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Home' },
    { path: '/tenants', icon: <Users size={20} />, label: 'Tenants' },
    { path: '/inventory', icon: <Bed size={20} />, label: 'Rooms' },
    { path: '/expenses', icon: <IndianRupee size={20} />, label: 'Expenses' },
    { path: '/reminders', icon: <Bell size={20} />, label: 'Reminders' },
    { path: '/add-tenant', icon: <UserPlus size={20} />, label: 'Add Tenant' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="mobile-header glass">
        <div className="brand">
          <div className="logo-box">
            <ShieldCheck size={20} color="white" />
          </div>
          <div className="brand-info">
            <span className="name">{user?.displayName?.split(' ')[0] || 'Admin'}</span>
            <span className="status">Online</span>
          </div>
        </div>
        <div className="header-actions">
          <NavLink to="/reminders" className="header-btn glass">
            <Bell size={20} />
          </NavLink>
          <button className="header-btn theme-toggle glass" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="header-btn logout-mini glass" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`sidebar glass ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <ShieldCheck size={24} color="white" />
            </div>
            <div className="logo-text">
              <h2>PG Admin</h2>
              <p>Tulip Stays PG</p>
            </div>
          </div>
        </div>

        <nav className="nav-links">
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-actions">
            <button className="sidebar-action-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="user-profile">
            <div className="avatar-box">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'Admin'}&background=6366f1&color=fff`} 
                alt="profile" 
              />
              <div className="online-dot"></div>
            </div>
            <div className="user-info">
              <p className="u-name">{user?.displayName || 'Admin User'}</p>
              <p className="u-email">{user?.email || 'admin@tulipstays.com'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav glass">
        <NavLink to="/" className="bottom-item">
          <LayoutDashboard size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/tenants" className="bottom-item">
          <Users size={22} />
          <span>Tenants</span>
        </NavLink>
        
        <NavLink to="/add-tenant" className="bottom-item fab-wrapper">
          <div className="plus-fab">
            <UserPlus size={26} />
          </div>
          <span className="fab-label">Add</span>
        </NavLink>

        <NavLink to="/inventory" className="bottom-item">
          <Bed size={22} />
          <span>Rooms</span>
        </NavLink>
        <NavLink to="/expenses" className="bottom-item">
          <IndianRupee size={22} />
          <span>Expenses</span>
        </NavLink>
      </nav>

      <style>{`
        .mobile-header {
          position: fixed; top: 0; left: 0; right: 0; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.25rem; z-index: 1000; border-bottom: 1px solid var(--border);
        }
        .mobile-header .brand { display: flex; align-items: center; gap: 0.75rem; }
        .logo-box { 
          width: 36px; height: 36px; background: var(--primary); 
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .brand-info .name { display: block; font-weight: 800; font-size: 0.95rem; line-height: 1.2; }
        .brand-info .status { font-size: 0.65rem; color: #2ecc71; font-weight: 700; display: flex; align-items: center; gap: 3px; }
        .brand-info .status::before { content: ''; width: 6px; height: 6px; background: #2ecc71; border-radius: 50%; }

        .header-actions { display: flex; gap: 0.65rem; }
        .header-btn { 
          width: 42px; height: 42px; border-radius: 12px; border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text-main); display: flex; 
          align-items: center; justify-content: center; cursor: pointer;
          transition: var(--transition); text-decoration: none;
        }
        .header-btn:active { transform: scale(0.9); }
        .logout-mini { color: var(--primary); }

        .sidebar {
          position: fixed; left: 0; top: 0; bottom: 0; width: 280px;
          display: flex; flex-direction: column; z-index: 1001;
          border-right: 1px solid var(--border); transition: transform 0.3s ease;
        }

        .sidebar-header { padding: 2rem 1.5rem; }
        .logo-container { display: flex; align-items: center; gap: 1rem; }
        .logo { 
          width: 44px; height: 44px; background: var(--primary); 
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .logo-text h2 { font-size: 1.25rem; font-weight: 800; line-height: 1; margin-bottom: 2px; }
        .logo-text p { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }

        .nav-links { flex: 1; padding: 0 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item {
          display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.25rem;
          color: var(--text-muted); text-decoration: none; border-radius: 1rem;
          font-weight: 600; font-size: 0.95rem; transition: all 0.2s;
        }
        .nav-item:hover { background: rgba(99, 102, 241, 0.05); color: var(--primary); }
        .nav-item.active { background: var(--primary); color: white; }

        .sidebar-footer { padding: 1.5rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 1.25rem; }
        .footer-actions { display: flex; flex-direction: column; gap: 0.5rem; }
        .sidebar-action-btn { 
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
          background: var(--bg-main); border: 1px solid var(--border); border-radius: 12px;
          color: var(--text-main); font-weight: 600; font-size: 0.85rem; cursor: pointer;
          transition: var(--transition);
        }
        .sidebar-action-btn:hover { border-color: var(--primary); color: var(--primary); }

        .user-profile { display: flex; align-items: center; gap: 0.75rem; }
        .avatar-box { position: relative; flex-shrink: 0; }
        .avatar-box img { width: 44px; height: 44px; border-radius: 14px; border: 2px solid var(--primary-light); object-fit: cover; }
        .online-dot { position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #2ecc71; border: 2px solid var(--bg-card); border-radius: 50%; }
        
        .u-name { font-weight: 700; font-size: 0.9rem; line-height: 1.2; color: var(--text-main); }
        .u-email { font-size: 0.7rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }

        .logout-btn {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 0.85rem; border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05);
          border-radius: 12px; color: #ef4444; font-weight: 700; cursor: pointer;
          transition: var(--transition);
        }
        .logout-btn:hover { background: #ef4444; color: white; }

        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; height: 72px;
          display: flex; justify-content: space-around; align-items: center;
          padding: 0 0.5rem; z-index: 1000; border-top: 1px solid var(--border);
        }
        .bottom-item {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: var(--text-muted); text-decoration: none; font-size: 0.65rem; font-weight: 700;
        }
        .plus-fab {
          width: 52px; height: 52px; background: var(--primary);
          border-radius: 18px; display: flex; align-items: center; justify-content: center;
          color: white; margin-top: -35px; 
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          border: 3px solid var(--bg-main); transition: var(--transition);
        }
        .bottom-item.active .plus-fab { transform: scale(1.1) translateY(-5px); }
        .fab-label { margin-top: 2px; }

        @media (min-width: 1025px) { .mobile-header, .bottom-nav { display: none; } }
        @media (max-width: 1024px) { .sidebar { display: none; } }
      `}</style>
    </>
  );
};

export default Sidebar;
