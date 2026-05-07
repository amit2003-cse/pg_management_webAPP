import React from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CheckCircle, IndianRupee, Bell, AlertCircle, FileText } from 'lucide-react';
import { generateRentReceipt } from '../utils/pdfGenerator';

const Reminders = () => {
  const { tenants, markAsPaid, loading } = useApp();
  
  const pendingTenants = tenants.filter(t => t.pending);

  const getDueStatus = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    dueDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 5) return { type: 'critical', label: `${diffDays}d Overdue` };
    if (diffDays > 0) return { type: 'overdue', label: `${diffDays}d Overdue` };
    if (diffDays === 0) return { type: 'today', label: 'Due Today' };
    return { type: 'upcoming', label: `${Math.abs(diffDays)}d Left` };
  };

  const sendWhatsAppReminder = (tenant) => {
    const status = getDueStatus(tenant.dueDate);
    let message = `Hi ${tenant.name},\n\nReminder: Your rent of ₹${tenant.rent} was due on ${tenant.dueDate}.`;
    if (status.type === 'critical' || status.type === 'overdue') message += ` It is overdue by ${status.label}.`;
    else if (status.type === 'today') message += ` It is due today.`;
    message += `\n\nPlease clear it soon.\n\nThank you!`;
    
    window.open(`https://wa.me/91${tenant.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="reminders-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Reminders</h1>
          <p>Pending rent collections</p>
        </div>
        <div className="count-badge glass">
          <Bell size={16} />
          <span>{pendingTenants.length} Pending</span>
        </div>
      </header>

      <div className="reminders-list">
        {pendingTenants.length === 0 ? (
          <motion.div className="card glass empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle size={48} className="text-success" />
            <h3>All Clear!</h3>
            <p>No pending collections at the moment.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {pendingTenants.map((tenant, i) => {
              const status = getDueStatus(tenant.dueDate);
              return (
                <motion.div 
                  key={tenant.id} 
                  className={`card reminder-card glass status-border-${status.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="reminder-main">
                    <div className="t-info">
                      <h3>{tenant.name}</h3>
                      <p className="phone">WhatsApp: {tenant.phone}</p>
                    </div>
                    <div className={`status-tag badge-${status.type}`}>
                      {status.label}
                    </div>
                  </div>

                  <div className="reminder-details">
                    <div className="d-item">
                      <span className="l">Amount</span>
                      <span className="v">₹{tenant.rent.toLocaleString()}</span>
                    </div>
                    <div className="d-item">
                      <span className="l">Due Date</span>
                      <span className="v">{tenant.dueDate}</span>
                    </div>
                  </div>

                  <div className="reminder-actions">
                    <button className="wa-btn-full" onClick={() => sendWhatsAppReminder(tenant)}>
                      <MessageCircle size={18} />
                      Send WhatsApp
                    </button>
                    <button className="paid-btn-outline" onClick={() => markAsPaid(tenant.id)}>
                      Mark Paid
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .reminders-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .count-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.8rem; border-radius: var(--radius-xl); font-size: 0.85rem; font-weight: 700; color: var(--primary); }
        
        .reminders-list { display: flex; flex-direction: column; gap: 1rem; }
        .reminder-card { padding: 1.25rem; border-left: 4px solid transparent; }
        
        .reminder-main { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
        .t-info h3 { font-size: 1.125rem; margin-bottom: 0.15rem; }
        .t-info .phone { font-size: 0.75rem; color: var(--text-muted); }
        
        .status-tag { font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
        .badge-critical { background: var(--danger); color: white; }
        .badge-overdue { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger); }
        .badge-today { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid var(--warning); }
        .badge-upcoming { background: var(--primary-light); color: var(--primary); }

        .reminder-details { display: flex; gap: 2rem; margin-bottom: 1.25rem; padding: 0.75rem; background: var(--bg-main); border-radius: var(--radius-sm); }
        .d-item { display: flex; flex-direction: column; gap: 2px; }
        .d-item .l { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }
        .d-item .v { font-size: 0.9rem; font-weight: 700; }

        .reminder-actions { display: flex; gap: 0.75rem; }
        .wa-btn-full { flex: 2; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #25D366; color: white; border: none; padding: 0.75rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer; }
        .paid-btn-outline { flex: 1; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-main); padding: 0.75rem; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; }

        .status-border-critical { border-left-color: var(--danger) !important; }
        .status-border-today { border-left-color: var(--warning) !important; }
        .empty-state { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .text-success { color: var(--success); }
      `}</style>
    </div>
  );
};

export default Reminders;
