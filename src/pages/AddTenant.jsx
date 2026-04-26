import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserPlus, Check } from 'lucide-react';

const AddTenant = () => {
  const { addTenant, setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    rent: '',
    dueDate: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTenant(formData);
    setSubmitted(true);
    
    // Reset form after a delay or redirect
    setTimeout(() => {
      setCurrentView('dashboard');
    }, 1500);
  };

  return (
    <div className="add-tenant-container animate-fade-in">
      <header className="page-header">
        <h1>Add Tenant</h1>
        <p>Onboard a new resident instantly</p>
      </header>

      <div className="card form-card glass">
        {submitted ? (
          <div className="success-message animate-fade-in">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h2>Tenant Added Successfully!</h2>
            <p>Redirecting to Dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="tenant-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="e.g. Suraj Kumar"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rent">Monthly Rent (₹)</label>
              <input
                id="rent"
                type="number"
                className="form-input"
                placeholder="e.g. 8000"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">Rent Due Date</label>
              <input
                id="dueDate"
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number (WhatsApp)</label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <UserPlus size={18} />
              Add Tenant in 1 Click
            </button>
          </form>
        )}
      </div>

      <style>{`
        .add-tenant-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .page-header {
          text-align: center;
        }
        .form-card {
          padding: 2.5rem;
        }
        .w-full {
          width: 100%;
        }
        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          text-align: center;
          gap: 1rem;
        }
        .success-icon {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .success-message h2 {
          color: var(--success);
          font-size: 1.5rem;
        }
        .success-message p {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default AddTenant;
