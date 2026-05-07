import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Receipt, Trash2, IndianRupee, 
  Lightbulb, Droplets, Wrench, CreditCard, ShoppingBag, 
  ChevronRight, Calendar, Tag, Info
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

const Expenses = () => {
  const { expenses, addExpense, deleteExpense, loading } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Electricity',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { name: 'Electricity', icon: Lightbulb, color: '#f59e0b' },
    { name: 'Water', icon: Droplets, color: '#3b82f6' },
    { name: 'Repairs', icon: Wrench, color: '#ef4444' },
    { name: 'Salary', icon: CreditCard, color: '#10b981' },
    { name: 'Other', icon: ShoppingBag, color: '#6366f1' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    await addExpense(formData);
    setFormData({ ...formData, title: '', amount: '' });
    setIsAdding(false);
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="expenses-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Expense Tracker</h1>
          <p>Visual spending insights</p>
        </div>
        <div className="summary-card glass">
          <span className="label">Total Spent</span>
          <span className="value">₹{totalExpense.toLocaleString()}</span>
        </div>
      </header>

      {/* Modern Category Selector (Horizontal) */}
      {!isAdding && (
        <div className="category-strip-container">
          <p className="section-label">Quick Insights</p>
          <div className="category-strip">
            {categories.map((cat, i) => {
              const catTotal = expenses.filter(e => e.category === cat.name).reduce((s, e) => s + e.amount, 0);
              return (
                <motion.div 
                  key={cat.name} className="cat-chip glass"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  <div className="chip-icon" style={{color: cat.color, background: `${cat.color}15`}}>
                    <cat.icon size={16} />
                  </div>
                  <div className="chip-data">
                    <span className="n">{cat.name}</span>
                    <span className="v">₹{catTotal.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB Interaction: Form Toggle */}
      <div className="action-row">
        <button className={`btn-toggle-form ${isAdding ? 'active' : ''}`} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Close Form' : 'Log New Expense'}
          <Plus size={20} className={isAdding ? 'rotated' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            className="card glass floating-form"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="input-group-modern">
                <div className="icon-box"><Info size={18} /></div>
                <input 
                  type="text" required placeholder="What was this for?" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                />
              </div>

              <div className="input-group-modern">
                <div className="icon-box"><IndianRupee size={18} /></div>
                <input 
                  type="number" required placeholder="Amount" 
                  value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} 
                />
              </div>

              <div className="category-picker">
                <p className="picker-label">Select Category</p>
                <div className="picker-grid">
                  {categories.map(cat => (
                    <button 
                      key={cat.name} type="button"
                      className={`picker-item ${formData.category === cat.name ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, category: cat.name})}
                    >
                      <cat.icon size={18} />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group-modern">
                <div className="icon-box"><Calendar size={18} /></div>
                <input 
                  type="date" required 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>

              <button type="submit" className="btn-save-expense">
                Confirm Expense <ChevronRight size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="transactions-container">
        <p className="section-label">Recent Transactions</p>
        <div className="transactions-list">
          {loading ? (
            <Skeleton height="80px" />
          ) : expenses.length === 0 ? (
            <div className="empty-state glass">
              <Receipt size={48} />
              <p>No bills logged yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {expenses.map((exp) => {
                const cat = categories.find(c => c.name === exp.category) || categories[4];
                return (
                  <motion.div 
                    layout key={exp.id} className="transaction-item glass"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="t-left">
                      <div className="t-icon" style={{background: `${cat.color}15`, color: cat.color}}>
                        <cat.icon size={20} />
                      </div>
                      <div className="t-info">
                        <h3>{exp.title}</h3>
                        <span>{new Date(exp.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}</span>
                      </div>
                    </div>
                    <div className="t-right">
                      <span className="t-amount">- ₹{exp.amount.toLocaleString()}</span>
                      <button className="t-del" onClick={() => deleteExpense(exp.id)}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      <style>{`
        .expenses-page { display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 40px; }
        .summary-card { padding: 0.75rem 1.25rem; border-radius: var(--radius-xl); display: flex; flex-direction: column; align-items: flex-end; }
        .summary-card .label { font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; }
        .summary-card .value { font-size: 1.25rem; font-weight: 800; color: var(--danger); }

        .section-label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
        
        .category-strip-container { margin: 0 -1.25rem; padding: 0 1.25rem; }
        .category-strip { display: flex; gap: 0.75rem; overflow-x: auto; scrollbar-width: none; padding-bottom: 0.5rem; }
        .category-strip::-webkit-scrollbar { display: none; }
        .cat-chip { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-md); min-width: 140px; }
        .chip-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .chip-data { display: flex; flex-direction: column; }
        .chip-data .n { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
        .chip-data .v { font-size: 0.85rem; font-weight: 700; }

        .action-row { display: flex; justify-content: center; }
        .btn-toggle-form { 
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; 
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); 
          color: var(--text-main); font-weight: 700; font-size: 0.9rem; transition: var(--transition);
          box-shadow: var(--shadow);
        }
        .btn-toggle-form.active { background: var(--danger); color: white; border-color: var(--danger); }
        .btn-toggle-form .rotated { transform: rotate(45deg); }

        .floating-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .input-group-modern { display: flex; align-items: center; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius); padding: 0 1rem; margin-bottom: 1rem; }
        .input-group-modern .icon-box { color: var(--text-muted); margin-right: 0.75rem; }
        .input-group-modern input { flex: 1; padding: 1rem 0; background: transparent; border: none; color: var(--text-main); font-weight: 500; outline: none; }

        .category-picker { margin-bottom: 1.25rem; }
        .picker-label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.75rem; }
        .picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.5rem; }
        .picker-item { 
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem; 
          padding: 0.75rem; border-radius: var(--radius); border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text-muted); transition: var(--transition);
        }
        .picker-item.selected { background: var(--primary); color: white; border-color: var(--primary); transform: scale(1.05); }
        .picker-item span { font-size: 0.65rem; font-weight: 600; }

        .btn-save-expense { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: linear-gradient(135deg, var(--primary), var(--primary-hover)); color: white; border: none; border-radius: var(--radius); font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }

        .transactions-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .transaction-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; }
        .t-left { display: flex; align-items: center; gap: 1rem; }
        .t-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .t-info h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.15rem; }
        .t-info span { font-size: 0.7rem; color: var(--text-muted); }
        .t-right { display: flex; align-items: center; gap: 1rem; }
        .t-amount { font-weight: 700; color: var(--danger); font-size: 0.95rem; }
        .t-del { background: transparent; border: none; color: var(--text-muted); padding: 0.5rem; }

        .empty-state { padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default Expenses;
