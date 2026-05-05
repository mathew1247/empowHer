import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-graphic">
          <span className="notfound-emoji">💜</span>
          <h1 className="notfound-code">404</h1>
        </div>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-subtitle">
          Oops! The page you're looking for seems to have gone on its own empowerment journey. Let's get you back on track!
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn notfound-btn-primary" id="back-home-btn">
            🏠 Back to Home
          </Link>
          <Link to="/ngos" className="notfound-btn notfound-btn-secondary" id="explore-btn">
            🤝 Explore NGOs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
