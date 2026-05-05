import React, { useState } from 'react';
import './HealthcareCard.css';

const HealthcareCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="hc-card" id={`hc-${item.id}`} style={{ '--accent': item.color }}>
      <div className="hc-header">
        <div className="hc-icon-wrapper">
          <span className="hc-icon">{item.icon}</span>
        </div>
        <div className="hc-header-text">
          <span className="hc-category">{item.category}</span>
          <h3 className="hc-title">{item.title}</h3>
        </div>
      </div>

      <p className="hc-description">{item.description}</p>

      <div className={`hc-tips-container ${expanded ? 'expanded' : ''}`}>
        <h4 className="hc-tips-title">💡 Health Tips</h4>
        <ul className="hc-tips">
          {item.tips.map((tip, i) => (
            <li key={i} className="hc-tip">
              <span className="hc-tip-check">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="hc-helpline">
        <span className="helpline-icon">📞</span>
        <span className="helpline-text">{item.helpline}</span>
      </div>

      <button
        className="hc-expand-btn"
        onClick={() => setExpanded(!expanded)}
        id={`hc-expand-${item.id}`}
      >
        {expanded ? 'Show Less ↑' : 'Learn More ↓'}
      </button>
    </div>
  );
};

export default HealthcareCard;
