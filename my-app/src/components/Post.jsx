import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Post.css';

const Post = ({ post, onLike }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now(), username: 'kavya_reddy', text: newComment }]);
    setNewComment('');
  };

  const displayComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <article className="post-card" id={`post-${post.id}`}>
      {/* Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="post-avatar-ring">
            <img src={post.userAvatar} alt={post.username} className="post-avatar" />
          </div>
          <div className="post-user-info">
            <Link to="/profile" className="post-username">{post.username}</Link>
            <span className="post-time">{post.timestamp}</span>
          </div>
        </div>
        <button className="post-more-btn" title="More options">⋯</button>
      </div>

      {/* Image */}
      <div className="post-image-container">
        <img src={post.image} alt="Post" className="post-image" loading="lazy" />
      </div>

      {/* Actions */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button
            className={`action-btn like-btn ${post.liked ? 'liked' : ''}`}
            onClick={() => onLike(post.id)}
            id={`like-btn-${post.id}`}
            title="Like"
          >
            <span className="action-icon">{post.liked ? '❤️' : '🤍'}</span>
          </button>
          <button className="action-btn" onClick={() => setShowCommentInput(!showCommentInput)} title="Comment">
            <span className="action-icon">💬</span>
          </button>
          <button className="action-btn" title="Share">
            <span className="action-icon">📤</span>
          </button>
        </div>
        <button className="action-btn" title="Save">
          <span className="action-icon">🔖</span>
        </button>
      </div>

      {/* Likes */}
      <div className="post-likes">
        <span>{post.likes.toLocaleString()} likes</span>
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="caption-username">{post.username}</span>
        <span className="caption-text"> {post.caption}</span>
      </div>

      {/* Comments */}
      <div className="post-comments">
        {comments.length > 2 && !showAllComments && (
          <button className="view-comments-btn" onClick={() => setShowAllComments(true)}>
            View all {comments.length} comments
          </button>
        )}
        {displayComments.map((comment) => (
          <div key={comment.id} className="comment">
            <span className="comment-username">{comment.username}</span>
            <span className="comment-text"> {comment.text}</span>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      {showCommentInput && (
        <form className="comment-form" onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
            id={`comment-input-${post.id}`}
          />
          <button type="submit" className="comment-submit" disabled={!newComment.trim()}>
            Post
          </button>
        </form>
      )}
    </article>
  );
};

export default Post;
