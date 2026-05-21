/**
 * ProfilePage.jsx — EmpowHer
 * ==========================
 * Protected route that fetches live user data from the Flask backend.
 * Demonstrates how to make a credentialed fetch to a JWT-protected endpoint.
 * The JWT cookie is sent automatically by the browser via credentials: "include".
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProfileHeader from '../components/ProfileHeader';
import PostGrid from '../components/PostGrid';
import { userData } from '../data/user';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]         = useState('posts');
  const [profileData, setProfileData]     = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError]   = useState('');

  // ── Fetch live profile from Flask protected endpoint ────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          credentials: 'include',   // ← Send HTTP-only cookie automatically
        });

        if (res.ok) {
          const data = await res.json();
          setProfileData(data.user);   // { id, username, email }
        } else if (res.status === 401) {
          // Token expired or missing → redirect to login
          navigate('/login');
        } else {
          setProfileError('Failed to load profile data.');
        }
      } catch {
        setProfileError('Cannot connect to server. Is Flask running?');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ── Logout handler ──────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();   // Calls Flask /api/auth/logout → clears cookie
    navigate('/login');
  };

  // ── Merge live data with local dummy data for display ──────────────────────
  // Real username/email from Flask; rest of the UI data from local dummy data
  const mergedUser = {
    ...userData,
    username: profileData?.username || currentUser?.username || userData.username,
    email:    profileData?.email    || currentUser?.email    || '',
    name:     profileData?.username || currentUser?.username || userData.name,
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── Loading / error states ──────────────────────────────────── */}
        {profileLoading && (
          <div className="profile-loading">
            <span className="loading-spinner-lg" />
            <p>Loading your profile…</p>
          </div>
        )}

        {profileError && (
          <div className="profile-error-banner" role="alert">
            ⚠️ {profileError}
          </div>
        )}

        {/* ── Profile content ─────────────────────────────────────────── */}
        {!profileLoading && (
          <>
            {/* Live user badge from Flask */}
            {profileData && (
              <div className="profile-live-badge">
                <span>✅ Authenticated as <strong>@{profileData.username}</strong></span>
                <button
                  className="profile-logout-btn"
                  id="profile-logout-btn"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}

            <ProfileHeader user={mergedUser} />

            {/* Tabs */}
            <div className="profile-tabs">
              {['posts', 'saved', 'tagged'].map(tab => (
                <button
                  key={tab}
                  className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  id={`profile-tab-${tab}`}
                >
                  {tab === 'posts'  && '⊞ '}
                  {tab === 'saved'  && '🔖 '}
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
          </>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
