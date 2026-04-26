import React from 'react';
import { useApp } from '../context/AppContext';
import { IndianRupee, Users, AlertCircle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { tenants } = useApp();

  // Calculations
  const totalTenants = tenants.length;
  const totalRent = tenants.reduce((sum, t) => sum + t.rent, 0);
  const pendingRent = tenants.filter(t => t.pending).reduce((sum, t) => sum + t.rent, 0);
  const paidRent = totalRent - pendingRent;
  
  const pendingCount = tenants.filter(t => t.pending).length;
  const paidCount = totalTenants - pendingCount;

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your PG management</p>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon primary">
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Rent</h3>
            <p className="stat-value">₹{totalRent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon danger">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending Rent</h3>
            <p className="stat-value text-danger">₹{pendingRent.toLocaleString('en-IN')}</p>
            <span className="stat-sub">{pendingCount} Tenants pending</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon success">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Collected Rent</h3>
            <p className="stat-value text-success">₹{paidRent.toLocaleString('en-IN')}</p>
            <span className="stat-sub">{paidCount} Tenants paid</span>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Tenants</h3>
            <p className="stat-value">{totalTenants}</p>
          </div>
        </div>
      </div>

      {/* Visual Impact Section */}
      <div className="card visual-section glass">
        <h2>Rent Collection Status</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(paidRent / totalRent) * 100}%` }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>Collected: {Math.round((paidRent / totalRent) * 100)}%</span>
            <span>Pending: {Math.round((pendingRent / totalRent) * 100)}%</span>
          </div>
        </div>
      </div>



      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .page-header p {
          color: var(--text-muted);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.primary { background-color: var(--primary-light); color: var(--primary); }
        .stat-icon.danger { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .stat-icon.success { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-icon.warning { background-color: rgba(245, 158, 11, 0.1); color: var(--warning); }
        
        .stat-info h3 {
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .stat-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .text-danger { color: var(--danger); }
        .text-success { color: var(--success); }

        .visual-section {
          padding: 2rem;
        }
        .visual-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .progress-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .progress-bar {
          height: 12px;
          background-color: var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: var(--radius-xl);
          transition: width 1s ease-out;
        }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .list-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .data-table th, .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .data-table th {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.875rem;
        }
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-xl);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-danger { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .badge-success { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
      `}</style>
    </div>
  );
};

export default Dashboard;
