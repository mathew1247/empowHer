import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      login({ name: 'Kavya Reddy', username: 'kavya_reddy', email: form.email });
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-gradient" />
      <div className="auth-container">
        {/* Branding Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="brand-logo">
              <span className="brand-logo-icon">💜</span>
              <h1 className="brand-name">EmpowHer</h1>
            </div>
            <p className="brand-tagline">A community built on strength, solidarity, and sisterhood.</p>
            <div className="brand-features">
              <div className="brand-feature">✨ Connect with inspiring women</div>
              <div className="brand-feature">🤝 Access NGO support networks</div>
              <div className="brand-feature">⚖️ Know your legal rights</div>
              <div className="brand-feature">💊 Healthcare resources at your fingertips</div>
            </div>
          </div>
          <div className="brand-image-collage">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" alt="" className="collage-img collage-1" />
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop" alt="" className="collage-img collage-2" />
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop" alt="" className="collage-img collage-3" />
          </div>
        </div>

        {/* Login Form */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Welcome Back 💜</h2>
              <p className="auth-form-subtitle">Sign in to your EmpowHer account</p>
            </div>

            {error && <div className="auth-error" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form" id="login-form">
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@empowher.com"
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <div className="form-options">
                <label className="remember-label">
                  <input type="checkbox" className="remember-check" />
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="auth-submit-btn" id="login-submit-btn" disabled={loading}>
                {loading ? <span className="loading-spinner" /> : 'Sign In'}
              </button>
            </form>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth-btns">
              <button className="social-btn" id="google-login-btn">
                <span>🌐</span> Google
              </button>
              <button className="social-btn" id="facebook-login-btn">
                <span>📘</span> Facebook
              </button>
            </div>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-switch-link">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
