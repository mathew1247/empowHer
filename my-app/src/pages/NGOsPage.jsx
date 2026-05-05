import React, { useState } from 'react';
import NGOCard from '../components/NGOCard';
import { ngosData } from '../data/ngos';
import './ResourcePages.css';

const NGOsPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(ngosData.map(n => n.category))];

  const filtered = ngosData.filter(ngo => {
    const matchSearch = ngo.name.toLowerCase().includes(search.toLowerCase()) ||
                        ngo.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || ngo.category === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="resource-page">
      {/* Page Hero */}
      <div className="resource-hero resource-hero-ngo">
        <div className="resource-hero-content">
          <span className="resource-hero-tag">🤝 Support Network</span>
          <h1 className="resource-hero-title">NGOs for Women</h1>
          <p className="resource-hero-subtitle">Find trusted organizations providing support, resources, and empowerment programs across India.</p>
        </div>
      </div>

      <div className="resource-container">
        {/* Search & Filter */}
        <div className="resource-controls">
          <div className="resource-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search NGOs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="resource-search-input"
              id="ngo-search"
            />
          </div>
          <div className="resource-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`resource-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                id={`ngo-filter-${cat.replace(/\s/g, '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="resource-count">Showing {filtered.length} organization{filtered.length !== 1 ? 's' : ''}</p>

        {/* Grid */}
        <div className="resource-grid">
          {filtered.map(ngo => <NGOCard key={ngo.id} ngo={ngo} />)}
          {filtered.length === 0 && (
            <div className="resource-empty">
              <span>🔍</span>
              <p>No NGOs found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOsPage;
