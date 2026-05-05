import React, { useState } from 'react';
import LegalCard from '../components/LegalCard';
import { legalData } from '../data/legal';
import './ResourcePages.css';

const LegalPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(legalData.map(l => l.category))];

  const filtered = legalData.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                        item.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || item.category === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="resource-page">
      <div className="resource-hero resource-hero-legal">
        <div className="resource-hero-content">
          <span className="resource-hero-tag">⚖️ Know Your Rights</span>
          <h1 className="resource-hero-title">Legal Rights & Acts</h1>
          <p className="resource-hero-subtitle">Every woman deserves to know her rights. Explore key legal protections and how to use them.</p>
        </div>
      </div>

      <div className="resource-container">
        {/* Helpline Banner */}
        <div className="emergency-banner emergency-banner-legal">
          <span className="emergency-icon">⚖️</span>
          <div className="emergency-content">
            <span className="emergency-title">Legal Aid Helplines</span>
            <span className="emergency-numbers">NALSA: 15100 · NCW: 7827170170 · Women Helpline: 1091</span>
          </div>
        </div>

        <div className="resource-controls">
          <div className="resource-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search legal acts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="resource-search-input"
              id="legal-search"
            />
          </div>
          <div className="resource-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`resource-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                id={`legal-filter-${cat.replace(/\s/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="resource-count">Showing {filtered.length} legal act{filtered.length !== 1 ? 's' : ''}</p>

        <div className="resource-grid">
          {filtered.map(item => <LegalCard key={item.id} item={item} />)}
          {filtered.length === 0 && (
            <div className="resource-empty">
              <span>🔍</span>
              <p>No legal acts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
