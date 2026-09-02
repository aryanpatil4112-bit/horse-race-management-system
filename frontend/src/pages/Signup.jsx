import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Shield, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side Validations
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // POST to /auth/register with ONLY name, email, and password.
      // Role is NEVER sent from frontend for public signups.
      await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      });

      showToast('Account created successfully! Please sign in.', 'success');
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || 'An account with this email already exists.';
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

      {/* Floating Signup Card */}
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.5rem 2.25rem',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(10, 14, 26, 0.88)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="sidebar-logo" style={{ margin: '0 auto 1rem auto', width: '54px', height: '54px', fontSize: '1.75rem' }}>
            🏇
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '0.02em', marginBottom: '0.35rem' }}>
            CREATE ACCOUNT
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            "Join the racing community."
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
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.6rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

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
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
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
                placeholder="Create a password (min. 8 chars)"
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

          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>

          {loading && (
            <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Loader2 size={14} className="spinner" />
              <span>Connecting to cloud server... If server is waking up, this may take a few seconds.</span>
            </div>
          )}
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-emerald)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
