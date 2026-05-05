import React, { useState } from 'react';
import HealthcareCard from '../components/HealthcareCard';
import { healthcareData } from '../data/healthcare';
import './ResourcePages.css';

const HealthcarePage = () => {
  const [search, setSearch] = useState('');

  const filtered = healthcareData.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="resource-page">
      <div className="resource-hero resource-hero-health">
        <div className="resource-hero-content">
          <span className="resource-hero-tag">💊 Women's Health</span>
          <h1 className="resource-hero-title">Healthcare Resources</h1>
          <p className="resource-hero-subtitle">Your guide to women's health — from reproductive care to mental well-being. Knowledge is power.</p>
        </div>
      </div>

      <div className="resource-container">
        {/* Emergency Banner */}
        <div className="emergency-banner">
          <span className="emergency-icon">🆘</span>
          <div className="emergency-content">
            <span className="emergency-title">Emergency Helplines</span>
            <span className="emergency-numbers">Women Helpline: 1091 · National Health: 104 · Police: 100</span>
          </div>
        </div>

        {/* Search */}
        <div className="resource-controls">
          <div className="resource-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search health topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="resource-search-input"
              id="health-search"
            />
          </div>
        </div>

        <p className="resource-count">Showing {filtered.length} health topic{filtered.length !== 1 ? 's' : ''}</p>

        <div className="resource-grid">
          {filtered.map(item => <HealthcareCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default HealthcarePage;
