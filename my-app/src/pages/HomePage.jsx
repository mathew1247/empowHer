import React, { useState, useRef, useEffect } from 'react';
import Stories from '../components/Stories';
import Post from '../components/Post';
import { postsData } from '../data/posts';
import './HomePage.css';

/* ── Hero background slides ── */
const HERO_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=400&fit=crop',
    quote: 'She who dares, wins. 💪',
  },
  {
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&h=400&fit=crop',
    quote: 'Empowered women empower women. 🌸',
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=400&fit=crop',
    quote: 'Together we rise. ✨',
  },
  {
    url: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=900&h=400&fit=crop',
    quote: 'Your story matters. 💜',
  },
];

/* ══════════════════════════════
   CREATE POST MODAL
══════════════════════════════ */
const CreatePostModal = ({ onClose, onSubmit }) => {
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preview) return;
    onSubmit({ image: preview, caption });
    onClose();
  };

  /* close on backdrop click */
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} id="create-post-modal">
      <div className="modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">✨ Create New Post</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Drop Zone */}
          {!preview ? (
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              id="drop-zone"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                id="photo-file-input"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className="drop-zone-inner">
                <div className="drop-icon">📸</div>
                <p className="drop-title">Drag & drop your photo here</p>
                <p className="drop-sub">or <span className="drop-browse">browse to upload</span></p>
                <p className="drop-hint">JPG, PNG, GIF — max 10 MB</p>
              </div>
            </div>
          ) : (
            <div className="preview-wrapper">
              <img src={preview} alt="Preview" className="preview-image" />
              <button
                type="button"
                className="preview-remove-btn"
                onClick={() => setPreview(null)}
                id="remove-preview-btn"
              >
                ✕ Remove
              </button>
            </div>
          )}

          {/* Caption */}
          <div className="modal-caption-area">
            <div className="modal-user-row">
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&h=40&fit=crop"
                alt="You"
                className="modal-user-avatar"
              />
              <span className="modal-username">kavya_reddy</span>
            </div>
            <textarea
              className="caption-textarea"
              placeholder="Write a caption... share your story 💜"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              id="caption-textarea"
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="modal-footer-extras">
              <button type="button" className="extra-btn" title="Add location">📍 Location</button>
              <button type="button" className="extra-btn" title="Tag people">🏷️ Tag People</button>
            </div>
            <div className="modal-footer-actions">
              <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
              <button
                type="submit"
                className={`modal-post-btn ${preview ? 'ready' : ''}`}
                disabled={!preview}
                id="post-submit-btn"
              >
                {preview ? '🚀 Share Post' : 'Add Photo First'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════
   HOME PAGE
══════════════════════════════ */
const HomePage = () => {
  const [posts, setPosts] = useState(postsData);
  const [showModal, setShowModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideVisible, setSlideVisible] = useState(true);

  /* Auto-rotate hero slides */
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideVisible(false);
      setTimeout(() => {
        setSlideIndex((i) => (i + 1) % HERO_SLIDES.length);
        setSlideVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleNewPost = ({ image, caption }) => {
    const newPost = {
      id: Date.now(),
      username: 'kavya_reddy',
      userAvatar:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop',
      image,
      caption: caption || '✨ Just posted!',
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      liked: false,
      isNew: true,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const currentSlide = HERO_SLIDES[slideIndex];

  return (
    <div className="home-page">
      {/* Create Post Modal */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewPost}
        />
      )}

      <div className="home-container">
        {/* Main Feed */}
        <main className="home-feed">

          {/* ── HERO BANNER with live slideshow ── */}
          <div
            className={`home-hero-banner ${slideVisible ? 'slide-visible' : 'slide-hidden'}`}
            style={{ backgroundImage: `url(${currentSlide.url})` }}
          >
            {/* dark overlay */}
            <div className="hero-overlay" />

            <div className="hero-banner-content">
              <span className="hero-tag">🌸 Women Empowerment Platform</span>
              <h2 className="hero-banner-title">{currentSlide.quote}</h2>
              <p className="hero-banner-subtitle">
                Share your story. Lift others up. Change the world.
              </p>
            </div>

            <div className="hero-banner-actions">
              {/* Live post button */}
              <button
                className="hero-create-btn"
                id="create-post-btn"
                onClick={() => setShowModal(true)}
              >
                📸 Post a Photo
              </button>
            </div>

            {/* Slide dots */}
            <div className="hero-dots">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot ${i === slideIndex ? 'active' : ''}`}
                  onClick={() => { setSlideIndex(i); setSlideVisible(true); }}
                  id={`hero-dot-${i}`}
                />
              ))}
            </div>
          </div>

          {/* Stories */}
          <Stories />

          {/* Posts */}
          <div className="feed-posts">
            {posts.map((post) => (
              <Post key={post.id} post={post} onLike={handleLike} isNew={post.isNew} />
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="home-sidebar">
          {/* Current User */}
          <div className="sidebar-card sidebar-profile">
            <img
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop"
              alt="Profile"
              className="sidebar-avatar"
            />
            <div className="sidebar-profile-info">
              <span className="sidebar-name">Kavya Reddy</span>
              <span className="sidebar-username">@kavya_reddy</span>
            </div>
            <button className="sidebar-switch-btn">Switch</button>
          </div>

          {/* Quick Create (sidebar shortcut) */}
          <div className="sidebar-card sidebar-create-card">
            <p className="sidebar-card-title" style={{ marginBottom: '10px' }}>SHARE YOUR MOMENT</p>
            <button
              className="sidebar-post-btn"
              onClick={() => setShowModal(true)}
              id="sidebar-create-post-btn"
            >
              📸 Post a Photo Live
            </button>
          </div>

          {/* Suggestions */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <span className="sidebar-card-title">Suggestions for You</span>
              <button className="sidebar-see-all">See All</button>
            </div>
            <div className="suggestions-list">
              {[
                { name: 'Priya Sharma', username: 'priya_sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', mutual: '8 mutual friends' },
                { name: 'Aisha Khan', username: 'aisha_khan', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=50&h=50&fit=crop', mutual: 'Followed by meera_v' },
                { name: 'Nina Patel', username: 'nina_patel', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=50&h=50&fit=crop', mutual: '3 mutual friends' },
                { name: 'Sara Jones', username: 'sara_jones', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop', mutual: 'New to EmpowHer' },
              ].map((user, i) => (
                <SuggestionItem key={i} user={user} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sidebar-card sidebar-links-card">
            <p className="sidebar-quick-title">Quick Resources</p>
            <div className="sidebar-quick-links">
              <a href="/ngos" className="quick-link">🤝 Find NGOs Near You</a>
              <a href="/healthcare" className="quick-link">💊 Healthcare Tips</a>
              <a href="/legal" className="quick-link">⚖️ Know Your Rights</a>
              <a href="/chat" className="quick-link">💬 Open Chatbox</a>
            </div>
            <p className="sidebar-footer-text">© 2025 EmpowHer · Made with 💜</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const SuggestionItem = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  return (
    <div className="suggestion-item">
      <img src={user.avatar} alt={user.name} className="suggestion-avatar" />
      <div className="suggestion-info">
        <span className="suggestion-name">{user.name}</span>
        <span className="suggestion-mutual">{user.mutual}</span>
      </div>
      <button
        className={`follow-btn ${followed ? 'following' : ''}`}
        onClick={() => setFollowed(!followed)}
      >
        {followed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default HomePage;
