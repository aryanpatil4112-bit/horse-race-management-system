import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Shield, User, Lock, Eye, EyeOff, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Security Check for Admin Tab
    if (activeTab === 'admin') {
      if (!adminPin) {
        setError('Please enter the Admin Master Security Key.');
        return;
      }
      // Verify Admin Security Passcode
      if (adminPin.trim() !== '8899' && adminPin.trim() !== 'ADMIN-2026') {
        setError('Invalid Admin Security Passcode. Access denied.');
        showToast('Invalid Admin Security Passcode', 'error');
        return;
      }
    }

    try {
      const authData = await login(email.trim(), password);

      // Verify that if Admin tab was used, the account actually has ADMIN role
      if (activeTab === 'admin' && authData.role !== 'ADMIN') {
        setError('Access denied. This account does not possess ADMIN privileges.');
        showToast('Account is not an Administrator', 'error');
        return;
      }

      showToast(`Welcome back to RACEHUB, ${authData.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err.message || 'Invalid email or password.';
      setError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: '#040711',
      padding: '1.5rem'
    }}>
      {/* Background Image with Ken Burns Zoom & Dark Overlay */}
      <img
        src="/assets/login_bg.png"
        alt="RACEHUB Dark Track"
        className="hero-bg-img"
        style={{ opacity: 0.42, filter: 'brightness(0.7) contrast(1.2)' }}
      />
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(5, 8, 17, 0.4) 0%, rgba(4, 7, 17, 0.85) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Floating Login Card */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem 2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(10, 14, 26, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="sidebar-logo" style={{ margin: '0 auto 1rem auto', width: '54px', height: '54px', fontSize: '1.75rem' }}>
            🏇
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '0.25rem' }}>
            RACEHUB
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            "Where every race begins."
          </p>
        </div>

        {/* Portal Access Mode Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'standard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            onClick={() => { setActiveTab('standard'); setError(''); }}
          >
            <UserCheck size={15} /> Standard Portal
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ fontSize: '0.825rem', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            <ShieldCheck size={15} /> Admin Portal
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <Shield size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>{activeTab === 'admin' ? 'ADMIN EMAIL ADDRESS' : 'EMAIL ADDRESS'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.6rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'admin' ? 'Enter admin email' : 'Enter your email'}
                required
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label>{activeTab === 'admin' ? 'ADMIN PASSWORD' : 'PASSWORD'}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Additional Security Field for Admin Portal */}
          {activeTab === 'admin' && (
            <div className="input-group">
              <label style={{ color: 'var(--accent-gold)' }}>ADMIN SECURITY KEY (PIN)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  className="form-control"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem', borderColor: 'var(--accent-gold)' }}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter Security PIN"
                  required
                />
                <KeyRound size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={activeTab === 'admin' ? 'btn btn-gold' : 'btn btn-primary'}
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : activeTab === 'admin' ? 'AUTHENTICATE ADMIN PORTAL' : 'SIGN IN TO PORTAL'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-emerald)', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
