import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, UserPlus, Bell, LogOut, 
  Shield, Users, Plus, Sun, Moon, Receipt, LayoutGrid
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useApp();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
    { id: 'tenants', label: 'Tenants', icon: Users, path: '/tenants' },
    { id: 'inventory', label: 'Rooms', icon: LayoutGrid, path: '/inventory' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/expenses' },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="logo-badge">
            <Shield size={20} color="white" fill="white" />
          </div>
          <h2>PG Admin</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink key={item.id} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <NavLink to="/reminders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            <span>Reminders</span>
          </NavLink>
          <NavLink to="/add-tenant" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <UserPlus size={20} />
            <span>Add Tenant</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="mobile-header glass">
        <div className="header-left">
          <div className="mobile-logo-box">
            <Shield size={18} color="white" fill="white" />
          </div>
          <div className="brand-info">
            <h3>PG Admin</h3>
            <span className="status-dot">Online</span>
          </div>
        </div>
        <div className="header-right">
          <NavLink to="/reminders" className="header-action-circle">
            <Bell size={18} />
          </NavLink>
          <button className="header-action-circle theme" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="header-action-circle logout" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav glass">
        {menuItems.map((item) => (
          <NavLink key={item.id} to={item.path} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* MOBILE FAB */}
      <NavLink to="/add-tenant" className="mobile-fab-right">
        <div className="fab-inner">
          <Plus size={32} color="white" />
        </div>
      </NavLink>

      <style>{`
        .sidebar { width: 260px; height: 100vh; display: flex; flex-direction: column; border-right: 1px solid var(--border); padding: 1.5rem 1rem; position: sticky; top: 0; z-index: 50; background: var(--bg-card); }
        .sidebar-header { display: flex; align-items: center; gap: 0.85rem; padding: 0.5rem; margin-bottom: 2.5rem; }
        .logo-badge { width: 34px; height: 34px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(139, 21, 56, 0.3); }
        .sidebar-header h2 { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-main); }
        
        .sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.8rem 1rem; border-radius: var(--radius); color: var(--text-muted); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: var(--transition); }
        .nav-item:hover { color: var(--text-main); background: var(--primary-light); }
        .nav-item.active { color: white !important; background: var(--logo-gradient); box-shadow: 0 4px 15px rgba(139, 21, 56, 0.2); }
        
        .sidebar-footer { padding-top: 1rem; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 0.25rem; }
        .theme-toggle-btn, .logout-btn { display: flex; align-items: center; gap: 0.85rem; padding: 0.75rem 1rem; width: 100%; border-radius: var(--radius); border: none; cursor: pointer; font-weight: 600; font-size: 0.85rem; background: transparent; transition: var(--transition); color: var(--text-main); }
        .theme-toggle-btn:hover { background: var(--primary-light); }
        .logout-btn { color: var(--danger); }
        .logout-btn:hover { background: rgba(139, 21, 56, 0.1); }

        .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 68px; align-items: center; justify-content: space-between; padding: 0 1.25rem; z-index: 1000; border-bottom: 1px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.05); background: var(--bg-glass); backdrop-filter: blur(20px); }
        .header-left { display: flex; align-items: center; gap: 0.75rem; }
        .mobile-logo-box { width: 38px; height: 38px; background: var(--logo-gradient); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(139, 21, 56, 0.2); }
        .brand-info h3 { font-size: 0.95rem; font-weight: 800; line-height: 1.1; color: var(--text-main); }
        .status-dot { font-size: 0.65rem; color: var(--success); font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .status-dot::before { content: ''; width: 6px; height: 6px; background: var(--success); border-radius: 50%; box-shadow: 0 0 8px var(--success); }

        .header-right { display: flex; gap: 0.5rem; }
        .header-action-circle { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; background: var(--bg-card); color: var(--text-main); transition: var(--transition); text-decoration: none; }
        .header-action-circle:active { transform: scale(0.9); }
        .header-action-circle.logout { color: var(--danger); background: rgba(139, 21, 56, 0.05); border-color: rgba(139, 21, 56, 0.1); }

        .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 74px; background: var(--bg-glass); backdrop-filter: blur(25px); border-top: 1px solid var(--border); justify-content: space-around; align-items: center; padding: 0 0.25rem; z-index: 1000; padding-bottom: env(safe-area-inset-bottom); }
        .bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); text-decoration: none; font-size: 0.65rem; font-weight: 700; flex: 1; transition: var(--transition); }
        .bottom-nav-item.active { color: var(--primary); }

        .mobile-fab-right { display: none; position: fixed; bottom: 92px; right: 20px; z-index: 1001; }
        .fab-inner { width: 64px; height: 64px; background: var(--logo-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(139, 21, 56, 0.4); border: 4px solid var(--bg-main); }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .mobile-header, .bottom-nav, .mobile-fab-right { display: flex; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
