import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import { 
  Search, Phone, IndianRupee, Filter, 
  MessageCircle, FileText, CheckCircle, 
  ChevronDown, X, ArrowUpDown, MoreHorizontal
} from 'lucide-react';
import { generateRentReceipt } from '../utils/pdfGenerator';

const Tenants = () => {
  const { tenants, markAsPaid, loading } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, paid, pending

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.phone.includes(searchTerm);
    if (filter === 'paid') return matchesSearch && !t.pending;
    if (filter === 'pending') return matchesSearch && t.pending;
    return matchesSearch;
  });

  const getDueStatus = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return { type: 'overdue', label: `${diffDays}d Overdue` };
    if (diffDays === 0) return { type: 'today', label: 'Due Today' };
    return { type: 'paid', label: 'Paid' };
  };

  return (
    <div className="tenants-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Tenants</h1>
          <p>{tenants.length} residents onboarded</p>
        </div>
        <div className="filter-pills glass">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-container glass">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <X size={18} className="clear-icon" onClick={() => setSearchTerm('')} />}
      </div>

      {/* Tenant Grid */}
      <div className="tenants-list">
        {loading ? (
          <Skeleton height="120px" count={3} />
        ) : filteredTenants.length === 0 ? (
          <div className="empty-state glass">
            <Users size={48} />
            <p>No tenants found.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredTenants.map((tenant, i) => {
              const status = getDueStatus(tenant.dueDate);
              return (
                <motion.div 
                  layout
                  key={tenant.id} 
                  className="tenant-card-modern glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="card-top">
                    <div className="tenant-meta">
                      <h3>{tenant.name}</h3>
                      <span className="phone">{tenant.phone}</span>
                    </div>
                    <div className="quick-actions">
                      <a href={`tel:${tenant.phone}`} className="action-circle"><Phone size={16} /></a>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="info-item">
                      <span className="l">Room</span>
                      <span className="v">{tenant.roomNo || 'N/A'}</span>
                    </div>
                    <div className="info-item border-l">
                      <span className="l">Rent</span>
                      <span className="v">₹{tenant.rent.toLocaleString()}</span>
                    </div>
                    <div className="info-item border-l">
                      <span className="l">Status</span>
                      <span className={`v-status ${tenant.pending ? 'pending' : 'paid'}`}>
                        {tenant.pending ? status.label : 'Paid'}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="main-btns">
                      <button 
                        className="btn-footer wa" 
                        onClick={() => window.open(`https://wa.me/91${tenant.phone}`, '_blank')}
                      >
                        <MessageCircle size={16} /> WhatsApp
                      </button>
                      
                      {tenant.pending ? (
                        <button className="btn-footer pay" onClick={() => markAsPaid(tenant.id)}>
                          Mark Paid
                        </button>
                      ) : (
                        <button className="btn-footer receipt" onClick={() => generateRentReceipt(tenant)}>
                          <FileText size={16} /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .tenants-page { display: flex; flex-direction: column; gap: 1.25rem; padding-bottom: 40px; }
        .filter-pills { display: flex; padding: 4px; border-radius: 100px; gap: 4px; }
        .filter-pills button { 
          padding: 6px 16px; border: none; background: transparent; 
          color: var(--text-muted); font-size: 0.75rem; font-weight: 700; 
          border-radius: 100px; cursor: pointer; transition: var(--transition);
        }
        .filter-pills button.active { background: var(--primary); color: white; }

        .search-container { display: flex; align-items: center; padding: 0.75rem 1.25rem; gap: 0.75rem; border-radius: var(--radius); }
        .search-icon { color: var(--text-muted); }
        .search-container input { flex: 1; background: transparent; border: none; color: var(--text-main); outline: none; font-size: 0.95rem; }
        .clear-icon { color: var(--text-muted); cursor: pointer; }

        .tenants-list { display: flex; flex-direction: column; gap: 1rem; }
        .tenant-card-modern { padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
        .tenant-meta h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 0.15rem; text-transform: capitalize; }
        .tenant-meta .phone { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        .action-circle { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-main); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-main); text-decoration: none; }

        .card-body { display: flex; gap: 1.5rem; background: var(--bg-main); padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; }
        .info-item { display: flex; flex-direction: column; gap: 2px; }
        .info-item.border-l { border-left: 1px solid var(--border); padding-left: 1.5rem; }
        .info-item .l { font-size: 0.6rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .info-item .v { font-size: 0.95rem; font-weight: 800; }
        .v-status { font-size: 0.85rem; font-weight: 700; }
        .v-status.paid { color: var(--success); }
        .v-status.pending { color: var(--danger); }

        .main-btns { display: flex; gap: 0.75rem; }
        .btn-footer { 
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem; 
          padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 700; 
          cursor: pointer; transition: var(--transition); border: 1px solid transparent;
          backdrop-filter: blur(10px);
        }
        .btn-footer.wa { background: rgba(37, 211, 102, 0.2); color: #2ecc71; border-color: rgba(37, 211, 102, 0.3); }
        .btn-footer.pay { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
        .btn-footer.receipt { background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); }
        
        [data-theme='dark'] .btn-footer.receipt { background: rgba(255, 255, 255, 0.15) !important; color: #ffffff !important; border-color: rgba(255, 255, 255, 0.3) !important; }
        [data-theme='dark'] .btn-footer.wa { background: rgba(46, 204, 113, 0.15) !important; color: #2ecc71 !important; border-color: rgba(46, 204, 113, 0.2) !important; }
        [data-theme='dark'] .tenant-card-modern { border-color: rgba(255, 255, 255, 0.1); }

        .empty-state { padding: 4rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default Tenants;
