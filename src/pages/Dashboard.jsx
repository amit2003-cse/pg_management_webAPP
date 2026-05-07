import React from 'react';
import { useApp } from '../context/AppContext';
import { IndianRupee, Users, AlertCircle, CheckCircle, TrendingDown, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const Dashboard = () => {
  const { tenants, expenses, loading } = useApp();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Analyzing financials...</p>
      </div>
    );
  }

  const totalRent = tenants.reduce((sum, t) => sum + t.rent, 0);
  const pendingRent = tenants.filter(t => t.pending).reduce((sum, t) => sum + t.rent, 0);
  const collectedRent = totalRent - pendingRent;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = collectedRent - totalExpenses;

  const pieData = [
    { name: 'Collected', value: collectedRent, color: '#2E7D5B' },
    { name: 'Expenses', value: totalExpenses, color: '#E8804A' },
    { name: 'Pending', value: pendingRent, color: '#8B1538' },
  ];

  return (
    <motion.div className="dashboard-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="page-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p>Net Profit Analysis</p>
        </div>
        <div className="net-profit-badge glass">
          <span>Net Profit:</span>
          <span className={netProfit >= 0 ? 'text-success' : 'text-danger'}>₹{netProfit.toLocaleString()}</span>
        </div>
      </header>

      {/* Stats Pills Row */}
      <div className="stats-scroll-area">
        <div className="stats-flex">
          {[
            { icon: <Wallet size={18} />, label: 'Profit', value: `₹${netProfit.toLocaleString()}`, color: 'primary' },
            { icon: <TrendingDown size={18} />, label: 'Expenses', value: `₹${totalExpenses.toLocaleString()}`, color: 'warning' },
            { icon: <CheckCircle size={18} />, label: 'Collected', value: `₹${collectedRent.toLocaleString()}`, color: 'success' },
            { icon: <AlertCircle size={18} />, label: 'Pending', value: `₹${pendingRent.toLocaleString()}`, color: 'danger' }
          ].map((stat, i) => (
            <motion.div key={i} className="stat-pill glass" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <div className={`pill-icon ${stat.color}`}>{stat.icon}</div>
              <div className="pill-info">
                <span className="pill-label">{stat.label}</span>
                <span className={`pill-value ${stat.label === 'Expenses' ? 'orange' : stat.label === 'Pending' ? 'red' : stat.label === 'Collected' ? 'green' : ''}`}>{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="charts-grid">
        <motion.div className="card glass chart-box" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3>Cash Flow Distribution</h3>
          <div className="chart-h">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card glass chart-box" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3>Revenue vs Expense</h3>
          <div className="chart-h">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: 'Income', amount: collectedRent, color: '#2E7D5B' },
                { name: 'Expense', amount: totalExpenses, color: '#E8804A' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--primary-light)'}} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                   <Cell fill="#2E7D5B" />
                   <Cell fill="#E8804A" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <style>{`
        .dashboard-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header { display: flex; justify-content: space-between; align-items: center; }
        .net-profit-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: var(--radius-xl); font-weight: 700; font-size: 0.85rem; }
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }

        .stats-scroll-area { margin: 0 -1.25rem; padding: 0.5rem 1.25rem; overflow-x: auto; scrollbar-width: none; }
        .stats-scroll-area::-webkit-scrollbar { display: none; }
        .stats-flex { display: flex; gap: 0.75rem; width: max-content; }
        
        .stat-pill { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; min-width: 140px; border-radius: var(--radius-md); background: var(--bg-card); }
        .pill-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .pill-icon.primary { background: var(--primary-light); color: var(--primary); }
        .pill-icon.warning { background: var(--secondary-light); color: var(--secondary); }
        .pill-icon.success { background: rgba(46, 125, 91, 0.1); color: var(--success); }
        .pill-icon.danger { background: var(--primary-light); color: var(--danger); }
        
        .pill-info { display: flex; flex-direction: column; }
        .pill-label { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
        .pill-value { font-size: 1rem; font-weight: 700; color: var(--text-main); }
        .pill-value.red { color: var(--danger); }
        .pill-value.green { color: var(--success); }
        .pill-value.orange { color: var(--secondary); }

        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .chart-box { padding: 1.25rem; }
        .chart-box h3 { font-size: 1rem; margin-bottom: 1.25rem; }

        @media (max-width: 768px) {
          .charts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
