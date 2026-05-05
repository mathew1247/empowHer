import React, { useState } from 'react';
import './LegalCard.css';

const LegalCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="legal-card" id={`legal-${item.id}`} style={{ '--accent': item.color }}>
      <div className="legal-header">
        <div className="legal-icon-badge">{item.icon}</div>
        <div className="legal-header-info">
          <span className="legal-category">{item.category}</span>
          <span className="legal-short-title">{item.shortTitle}</span>
        </div>
      </div>

      <h3 className="legal-title">{item.title}</h3>
      <p className="legal-description">{item.description}</p>

      <div className={`legal-details ${expanded ? 'expanded' : ''}`}>
        <div className="legal-section">
          <h4 className="legal-section-title">📋 Key Provisions</h4>
          <ul className="legal-points">
            {item.keyPoints.map((point, i) => (
              <li key={i} className="legal-point">
                <span className="legal-bullet">▶</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="legal-how-to">
          <h4 className="legal-section-title">📝 How to Report</h4>
          <p className="legal-how-text">{item.howToReport}</p>
        </div>

        <div className="legal-helpline-box">
          <span className="helpline-badge">Emergency</span>
          <span className="legal-helpline-text">📞 {item.helpline}</span>
        </div>
      </div>

      <button
        className="legal-expand-btn"
        onClick={() => setExpanded(!expanded)}
        id={`legal-expand-${item.id}`}
      >
        {expanded ? '↑ Show Less' : '↓ Know Your Rights'}
      </button>
    </div>
  );
};

export default LegalCard;
