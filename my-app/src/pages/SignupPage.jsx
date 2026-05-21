/**
 * SignupPage.jsx — EmpowHer
 * =========================
 * Registers a new user via the Flask JWT backend.
 * After successful registration, user is redirected to /login
 * so they can sign in and receive the HTTP-only JWT cookie.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AuthPages.css';

const SignupPage = () => {
  const { signup } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ── Client-side validation ─────────────────────────────────────────────
    if (!form.name || !form.username || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // ── Call Flask /api/auth/signup via AppContext ──────────────────────────
    // Note: Flask stores username + email + bcrypt hash — name is used as username
    const result = await signup(form.username, form.email, form.password);

    setLoading(false);

    if (result.ok) {
      setSuccess('Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-gradient" />
      <div className="auth-container auth-container-signup">

        {/* ── Form Panel ───────────────────────────────────────────────── */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <Link to="/" className="auth-logo-link">
                <span>💜</span> EmpowHer
              </Link>
              <h2 className="auth-form-title">Join the Movement ✨</h2>
              <p className="auth-form-subtitle">Create your EmpowHer account today</p>
            </div>

            {/* Error / success banners */}
            {error   && <div className="auth-error"   role="alert">{error}</div>}
            {success && <div className="auth-success" role="status">{success}</div>}

            <form onSubmit={handleSubmit} className="auth-form" id="signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="signup-name" className="form-label">Full Name *</label>
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-username" className="form-label">Username *</label>
                  <input
                    id="signup-username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="priya_sharma"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Email Address *</label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@empowher.com"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="signup-password" className="form-label">Password *</label>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm" className="form-label">Confirm Password *</label>
                  <input
                    id="signup-confirm"
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="form-input"
                  />
                </div>
              </div>

              <label className="terms-label">
                <input type="checkbox" required className="remember-check" />
                I agree to the{' '}
                <a href="#" className="forgot-link">Terms of Service</a> and{' '}
                <a href="#" className="forgot-link">Privacy Policy</a>
              </label>

              <button
                type="submit"
                className="auth-submit-btn"
                id="signup-submit-btn"
                disabled={loading}
              >
                {loading ? <span className="loading-spinner" /> : 'Create Account 💜'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Sign in</Link>
            </p>
          </div>
        </div>

        {/* ── Brand Side ───────────────────────────────────────────────── */}
        <div className="auth-brand-panel auth-brand-panel-right">
          <div className="auth-brand-content">
            <h2 className="signup-brand-title">Why EmpowHer?</h2>
            <div className="signup-reasons">
              <div className="signup-reason">
                <span className="reason-icon">💪</span>
                <div>
                  <h4>Empowerment Community</h4>
                  <p>Connect with thousands of women on the same journey</p>
                </div>
              </div>
              <div className="signup-reason">
                <span className="reason-icon">🛡️</span>
                <div>
                  <h4>Safe &amp; Supportive Space</h4>
                  <p>A judgment-free zone to share, learn, and grow</p>
                </div>
              </div>
              <div className="signup-reason">
                <span className="reason-icon">📚</span>
                <div>
                  <h4>Resources at Your Fingertips</h4>
                  <p>Healthcare, legal rights, and NGO connections in one place</p>
                </div>
              </div>
              <div className="signup-reason">
                <span className="reason-icon">🌍</span>
                <div>
                  <h4>Real Impact</h4>
                  <p>Stories and actions that create meaningful change</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
