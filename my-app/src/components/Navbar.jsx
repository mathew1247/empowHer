import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { darkMode, toggleDarkMode, isAuthenticated, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/ngos', icon: '🤝', label: 'NGOs' },
    { to: '/healthcare', icon: '💊', label: 'Healthcare' },
    { to: '/legal', icon: '⚖️', label: 'Legal' },
    { to: '/chat', icon: '💬', label: 'Chat' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">💜</span>
          <span className="logo-text">EmpowHer</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search women, topics, resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="navbar-search"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              title={link.label}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button className="dark-mode-btn" onClick={toggleDarkMode} title="Toggle Dark Mode" id="dark-mode-toggle">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <div className="profile-dropdown">
              <button className="profile-trigger" onClick={() => setMenuOpen(!menuOpen)} id="profile-menu-btn">
                <img
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop"
                  alt="Profile"
                  className="profile-avatar"
                />
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="hamburger-btn">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={`mobile-menu ${darkMode ? 'dark' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button className="mobile-nav-link logout-link" onClick={handleLogout}>🚪 Logout</button>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🔐 Login</Link>
              <Link to="/signup" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>✨ Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
