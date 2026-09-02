import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      await login(email.trim(), password);
      showToast('Welcome back to RACEHUB Portal!', 'success');
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
        maxWidth: '450px',
        padding: '2.75rem 2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(10, 14, 26, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div className="sidebar-logo" style={{ margin: '0 auto 1.25rem auto', width: '58px', height: '58px', fontSize: '1.85rem' }}>
            🏇
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '0.35rem' }}>
            RACEHUB
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', fontStyle: 'italic' }}>
            "Where every race begins."
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <Shield size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.6rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN TO PORTAL'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
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
