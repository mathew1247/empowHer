import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import PostGrid from '../components/PostGrid';
import { userData } from '../data/user';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="profile-page">
      <div className="profile-container">
        <ProfileHeader user={userData} />

        {/* Tabs */}
        <div className="profile-tabs">
          {['posts', 'saved', 'tagged'].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`profile-tab-${tab}`}
            >
              {tab === 'posts' && '⊞ '}
              {tab === 'saved' && '🔖 '}
              {tab === 'tagged' && '🏷️ '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="profile-content">
          {activeTab === 'posts' && <PostGrid posts={userData.userPosts} />}
          {activeTab === 'saved' && (
            <div className="profile-empty-state">
              <span className="empty-state-icon">🔖</span>
              <h3>No saved posts yet</h3>
              <p>Posts you save will appear here</p>
            </div>
          )}
          {activeTab === 'tagged' && (
            <div className="profile-empty-state">
              <span className="empty-state-icon">🏷️</span>
              <h3>No tagged posts yet</h3>
              <p>Posts you're tagged in will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
