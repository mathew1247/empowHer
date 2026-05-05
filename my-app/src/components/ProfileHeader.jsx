import React from 'react';
import './ProfileHeader.css';

const ProfileHeader = ({ user }) => {
  return (
    <div className="profile-header">
      {/* Cover Photo */}
      <div className="cover-photo-container">
        <img src={user.coverPhoto} alt="Cover" className="cover-photo" />
        <div className="cover-overlay" />
      </div>

      {/* Profile Info */}
      <div className="profile-info-section">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar-ring">
            <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
          </div>
          <button className="edit-avatar-btn" title="Change photo">📷</button>
        </div>

        <div className="profile-details">
          <div className="profile-name-row">
            <h1 className="profile-name">{user.name}</h1>
            <span className="profile-verified">✓</span>
          </div>
          <p className="profile-username">@{user.username}</p>
          <p className="profile-bio">{user.bio}</p>

          <div className="profile-meta">
            {user.location && (
              <span className="profile-meta-item">📍 {user.location}</span>
            )}
            {user.website && (
              <a href={`https://${user.website}`} className="profile-meta-item profile-website" target="_blank" rel="noopener noreferrer">
                🔗 {user.website}
              </a>
            )}
            <span className="profile-meta-item">📅 Joined {user.joined}</span>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{user.posts}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">{user.followers.toLocaleString()}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">{user.following.toLocaleString()}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-edit-profile" id="edit-profile-btn">Edit Profile</button>
          <button className="btn-share-profile" title="Share profile" id="share-profile-btn">📤</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
