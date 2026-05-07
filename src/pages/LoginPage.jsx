import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, LogIn, Info } from 'lucide-react';

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div 
          className="login-card glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-header">
            <div className="logo-box">
              <Shield size={32} className="logo-icon" />
            </div>
            <h1>PG Manager</h1>
            <p>Your complete property management suite</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-field-modern">
                <Mail size={18} className="icon" />
                <input 
                  type="text" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-field-modern">
                <Lock size={18} className="icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="btn-login-premium"
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In to Dashboard <LogIn size={18} />
            </motion.button>
          </form>

          <div className="login-footer">
            <div className="demo-hint">
              <Info size={14} />
              <span>Use <b>admin</b> / <b>1234</b> for demo access</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>

      <style>{`
        .login-page {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: var(--bg-main);
        }

        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          border-radius: 2rem;
          box-shadow: var(--shadow-lg);
          background: var(--bg-glass);
          border: 1px solid var(--border);
          backdrop-filter: blur(20px);
        }

        .login-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .logo-box {
          width: 64px;
          height: 64px;
          background: var(--bg-card);
          border-radius: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(139, 21, 56, 0.15);
          margin-bottom: 0.5rem;
          border: 1px solid var(--border);
        }

        .logo-icon {
          color: var(--primary);
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }

        .login-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-left: 0.25rem;
        }

        .input-field-modern {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          padding: 0 1.25rem;
          border-radius: 1rem;
          transition: all 0.2s ease;
        }

        .input-field-modern:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-light);
        }

        .input-field-modern .icon {
          color: var(--text-muted);
        }

        .input-field-modern input {
          flex: 1;
          padding: 1.1rem 0;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 1rem;
          font-weight: 500;
          outline: none;
        }

        .btn-login-premium {
          width: 100%;
          padding: 1.1rem;
          background: var(--logo-gradient);
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(139, 21, 56, 0.3);
          margin-top: 0.5rem;
        }

        .login-footer {
          display: flex;
          justify-content: center;
        }

        .demo-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          background: var(--bg-main);
          border: 1px dashed var(--border);
        }

        .demo-hint b {
          color: var(--text-main);
        }

        .bg-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .circle-1 {
          top: -10%;
          right: -10%;
          width: 500px;
          height: 500px;
          background: var(--primary);
        }

        .circle-2 {
          bottom: -10%;
          left: -10%;
          width: 400px;
          height: 400px;
          background: var(--secondary);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem;
          }
          .login-header h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
