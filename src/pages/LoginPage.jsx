import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { LogIn, ShieldCheck } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const LoginPage = () => {
  const { login } = useApp();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (err) {
      alert("Login failed. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="brand-header">
          <div className="logo-badge">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h1>Tulip Stays PG</h1>
          <p>The Most Trusted PG Management Suite</p>
        </div>

        <div className="login-visual">
          <div className="blob-bg"></div>
          <img src="https://img.icons8.com/clouds/200/home-address.png" alt="home" />
        </div>

        <div className="auth-section">
          <p className="auth-hint">Admin Secure Login</p>
          <motion.button 
            className="btn-google-auth"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleIcon />
            {loading ? "Authenticating..." : "Continue with Google"}
          </motion.button>
          
          <div className="security-note">
            <ShieldCheck size={12} />
            <span>Encrypted OAuth 2.0 Secure Session</span>
          </div>
        </div>
      </motion.div>

      <style>{`
        .login-container { 
          height: 100vh; display: flex; align-items: center; justify-content: center; 
          background: var(--bg-main); padding: 1.5rem; overflow: hidden;
        }
        .login-card { 
          width: 100%; max-width: 420px; padding: 2.5rem; text-align: center;
          display: flex; flex-direction: column; gap: 2rem; border-radius: 2rem;
        }
        .brand-header h1 { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem; }
        .brand-header p { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
        .logo-badge { 
          width: 60px; height: 60px; background: var(--primary-light); 
          border-radius: 1.25rem; display: flex; align-items: center; 
          justify-content: center; margin: 0 auto 1rem;
        }

        .login-visual { position: relative; padding: 1rem 0; }
        .blob-bg { 
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 150px; height: 150px; background: var(--primary); 
          filter: blur(50px); opacity: 0.15; border-radius: 50%; z-index: -1;
        }
        
        .btn-google-auth { 
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          padding: 1rem; background: #ffffff; color: #1f2937; border: 1px solid #e5e7eb;
          border-radius: var(--radius); font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); font-size: 0.95rem;
        }
        .btn-google-auth:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .security-note { 
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          margin-top: 1rem; color: var(--text-muted); font-size: 0.7rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
