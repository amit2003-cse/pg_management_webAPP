import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, Shield } from 'lucide-react';

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass">
        <div className="login-header">
          <div className="logo-icon">
            <Shield size={32} color="var(--primary)" />
          </div>
          <h1>PG Manager</h1>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address / Username</label>
            <input
              id="email"
              type="text"
              className="form-input"
              placeholder="Enter admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter 1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials: <strong>admin</strong> / <strong>1234</strong></p>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          min-height: 100vh;
          background: radial-gradient(circle at center, var(--bg-card), var(--bg-main));
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .logo-icon {
          background: var(--primary-light);
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .login-header h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem;
          border-radius: var(--radius);
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .w-full {
          width: 100%;
        }
        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .login-footer strong {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
