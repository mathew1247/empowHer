import React from 'react';
import './NGOCard.css';

const NGOCard = ({ ngo }) => {
  return (
    <div className="ngo-card" id={`ngo-${ngo.id}`}>
      <div className="ngo-image-container">
        <img src={ngo.image} alt={ngo.name} className="ngo-image" loading="lazy" />
        <div className="ngo-category-badge">{ngo.category}</div>
      </div>
      <div className="ngo-content">
        <h3 className="ngo-name">{ngo.name}</h3>
        <p className="ngo-description">{ngo.description}</p>

        <div className="ngo-tags">
          {ngo.tags.map((tag, i) => (
            <span key={i} className="ngo-tag">{tag}</span>
          ))}
        </div>

        <div className="ngo-contact">
          <div className="contact-row">
            <span className="contact-icon">📍</span>
            <span className="contact-text">{ngo.location}</span>
          </div>
          <div className="contact-row">
            <span className="contact-icon">📞</span>
            <a href={`tel:${ngo.phone}`} className="contact-link">{ngo.phone}</a>
          </div>
          <div className="contact-row">
            <span className="contact-icon">✉️</span>
            <a href={`mailto:${ngo.email}`} className="contact-link">{ngo.email}</a>
          </div>
        </div>

        <a
          href={ngo.website}
          target="_blank"
          rel="noopener noreferrer"
          className="ngo-visit-btn"
          id={`ngo-visit-${ngo.id}`}
        >
          Visit Website →
        </a>
      </div>
    </div>
  );
};

export default NGOCard;
