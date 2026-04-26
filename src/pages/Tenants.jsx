import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, IndianRupee, CheckCircle, ChevronDown } from 'lucide-react';

const Tenants = () => {
  const { tenants, markAsPaid } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to calculate due status
  const getDueStatus = (dueDateStr, isPending) => {
    if (!isPending) return { type: 'paid', label: 'Paid' };

    const dueDate = new Date(dueDateStr);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { type: 'overdue', label: `${diffDays} Days Extended` };
    } else if (diffDays < 0) {
      return { type: 'upcoming', label: `${Math.abs(diffDays)} Days Left` };
    } else {
      return { type: 'today', label: 'Due Today' };
    }
  };

  // Filter logic
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.phone.includes(searchTerm);
                         
    if (statusFilter === 'paid') return matchesSearch && !tenant.pending;
    if (statusFilter === 'pending') return matchesSearch && tenant.pending;
    return matchesSearch;
  });

  return (
    <div className="tenants-page animate-fade-in">
      <header className="page-header">
        <h1>All Tenants</h1>
        <p>Manage and track all resident details</p>
      </header>

      {/* Controls: Search & Filter */}
      <div className="card controls-card glass">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper" ref={dropdownRef}>
          <button 
            className="custom-dropdown-trigger glass"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>
              {statusFilter === 'all' && 'All Status'}
              {statusFilter === 'paid' && 'Paid'}
              {statusFilter === 'pending' && 'Pending'}
            </span>
            <ChevronDown size={18} className={`arrow-icon ${isFilterOpen ? 'rotated' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className="custom-dropdown-menu glass animate-fade-in">
              <button 
                className={`dropdown-item ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('all'); setIsFilterOpen(false); }}
              >
                All Status
              </button>
              <button 
                className={`dropdown-item ${statusFilter === 'paid' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('paid'); setIsFilterOpen(false); }}
              >
                Paid
              </button>
              <button 
                className={`dropdown-item ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => { setStatusFilter('pending'); setIsFilterOpen(false); }}
              >
                Pending
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="card list-section desktop-only">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Rent</th>
                <th>Due Date</th>
                <th>Due Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No tenants found matching criteria.</td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const dueStatus = getDueStatus(tenant.dueDate, tenant.pending);
                  return (
                    <tr key={tenant.id}>
                      <td className="tenant-name-cell">{tenant.name}</td>
                      <td>{tenant.phone}</td>
                      <td className="amount-cell">
                        <IndianRupee size={14} />
                        {tenant.rent.toLocaleString('en-IN')}
                      </td>
                      <td>{tenant.dueDate}</td>
                      <td>
                        <span className={`status-badge badge-${dueStatus.type}`}>
                          {dueStatus.label}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${tenant.pending ? 'badge-danger' : 'badge-success'}`}>
                          {tenant.pending ? 'Pending' : 'Paid'}
                        </span>
                      </td>
                      <td>
                        {tenant.pending ? (
                          <button 
                            className="btn-action-paid"
                            onClick={() => markAsPaid(tenant.id)}
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="action-done">
                            <CheckCircle size={18} color="var(--success)" />
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-only mobile-cards-container">
        {filteredTenants.length === 0 ? (
          <div className="card glass no-data">No tenants found matching criteria.</div>
        ) : (
          filteredTenants.map((tenant) => {
            const dueStatus = getDueStatus(tenant.dueDate, tenant.pending);
            return (
              <div key={tenant.id} className="card tenant-mobile-card glass">
                <div className="card-header">
                  <h3>{tenant.name}</h3>
                  <span className={`badge ${tenant.pending ? 'badge-danger' : 'badge-success'}`}>
                    {tenant.pending ? 'Pending' : 'Paid'}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{tenant.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Rent:</span>
                    <span className="value amount-cell">
                      <IndianRupee size={14} />
                      {tenant.rent.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Due Date:</span>
                    <span className="value">{tenant.dueDate}</span>
                  </div>
                  {tenant.pending && (
                    <div className="info-row">
                      <span className="label">Due Status:</span>
                      <span className={`status-badge badge-${dueStatus.type}`}>
                        {dueStatus.label}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  {tenant.pending ? (
                    <button 
                      className="btn btn-primary w-full"
                      onClick={() => markAsPaid(tenant.id)}
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <div className="action-done">
                      <CheckCircle size={18} color="var(--success)" />
                      <span>Payment Received</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .tenants-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .controls-card {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          padding: 1.25rem;
          z-index: 5;
        }
        
        .search-wrapper {
          position: relative;
          flex: 1;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-main);
          transition: var(--transition);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        
        /* Custom Premium Dropdown */
        .filter-wrapper {
          position: relative;
          width: 180px;
        }
        .custom-dropdown-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-main);
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
        }
        .custom-dropdown-trigger:hover {
          border-color: var(--primary);
        }
        .arrow-icon {
          transition: transform 0.3s ease;
          color: var(--text-muted);
        }
        .arrow-icon.rotated {
          transform: rotate(180deg);
        }
        
        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          z-index: 100;
          box-shadow: var(--shadow-lg);
        }
        .dropdown-item {
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          text-align: left;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
        }
        .dropdown-item:hover {
          background-color: var(--primary-light);
          color: var(--text-main);
        }
        .dropdown-item.active {
          background-color: var(--primary);
          color: white;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th, .data-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .data-table th {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.875rem;
        }
        .tenant-name-cell {
          font-weight: 600;
          color: var(--text-main);
        }
        .amount-cell {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-xl);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-danger { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .badge-success { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
        
        .status-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .badge-overdue {
          color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .badge-upcoming {
          color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .badge-today {
          color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .badge-paid {
          color: var(--success);
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .no-data {
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
        }
        
        .btn-action-paid {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition);
        }
        .btn-action-paid:hover {
          background-color: var(--primary);
          color: white;
        }
        
        /* Visibility Utilities */
        .desktop-only { display: block; }
        .mobile-only { display: none; }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          
          .controls-card {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .filter-wrapper {
            width: 100%;
          }
          
          .mobile-cards-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .tenant-mobile-card {
            padding: 1.5rem;
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.75rem;
          }
          .card-header h3 {
            font-size: 1.125rem;
            color: var(--text-main);
          }
          .card-body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.875rem;
          }
          .info-row .label {
            color: var(--text-muted);
          }
          .info-row .value {
            color: var(--text-main);
            font-weight: 500;
          }
          .action-done {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: var(--success);
            font-weight: 500;
          }
          .w-full {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Tenants;
