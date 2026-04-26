import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, CheckCircle, IndianRupee } from 'lucide-react';

const Reminders = () => {
  const { tenants, markAsPaid } = useApp();
  
  const pendingTenants = tenants.filter(t => t.pending);

  const getDueStatus = (dueDateStr) => {
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

  const sendWhatsAppReminder = (tenant) => {
    const status = getDueStatus(tenant.dueDate);
    let message = `Hi ${tenant.name},\n\nThis is a reminder that your rent of ₹${tenant.rent} was due on ${tenant.dueDate}.`;
    
    if (status.type === 'overdue') {
      message += ` It has been overdue by ${status.label}.`;
    } else if (status.type === 'upcoming') {
      message += ` You have ${status.label}.`;
    } else {
      message += ` It is due today.`;
    }
    
    message += `\n\nPlease clear the pending amount as soon as possible.\n\nThank you!`;
    
    let phone = tenant.phone;
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="reminders-container animate-fade-in">
      <header className="page-header">
        <h1>Rent Reminders</h1>
        <p>Send quick WhatsApp reminders to tenants with pending dues</p>
      </header>

      <div className="card glass">
        <h2>Pending Collections</h2>
        
        {pendingTenants.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="var(--success)" />
            <h3>All caught up!</h3>
            <p>No pending rent collections at the moment.</p>
          </div>
        ) : (
          <div className="reminders-list">
            {pendingTenants.map((tenant) => {
              const status = getDueStatus(tenant.dueDate);
              return (
                <div key={tenant.id} className="reminder-item">
                  <div className="tenant-info">
                    <h3>{tenant.name}</h3>
                    <p className="phone-no">WhatsApp: {tenant.phone}</p>
                    <div className="amount-due">
                      <IndianRupee size={16} />
                      <span>₹{tenant.rent.toLocaleString('en-IN')}</span>
                      <span className="due-date">Due: {tenant.dueDate}</span>
                      
                      <span className={`status-badge badge-${status.type}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="reminder-actions">
                    <button 
                      className="btn btn-primary reminder-btn"
                      onClick={() => sendWhatsAppReminder(tenant)}
                    >
                      <MessageCircle size={18} />
                      Send Reminder
                    </button>
                    
                    <button 
                      className="btn btn-secondary paid-btn"
                      onClick={() => markAsPaid(tenant.id)}
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .reminders-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .glass h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 0;
          gap: 1rem;
          text-align: center;
        }
        .empty-state p {
          color: var(--text-muted);
        }
        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .reminder-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          background-color: rgba(15, 23, 42, 0.3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .reminder-item:hover {
          border-color: rgba(99, 102, 241, 0.4);
          transform: translateX(5px);
        }
        .tenant-info h3 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }
        .phone-no {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .amount-due {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
        }
        .due-date {
          margin-left: 1rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 400;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        
        .status-badge {
          margin-left: 1rem;
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

        .reminder-actions {
          display: flex;
          gap: 0.75rem;
        }
        .reminder-btn {
          background: linear-gradient(135deg, #25D366, #128C7E); /* WhatsApp Green */
        }
        .reminder-btn:hover {
          box-shadow: 0 10px 20px -10px rgba(37, 211, 102, 0.5);
        }
        
        @media (max-width: 768px) {
          .reminder-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .reminder-actions {
            width: 100%;
          }
          .reminder-btn, .paid-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Reminders;
