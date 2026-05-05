import React from 'react';
import './PostGrid.css';

const PostGrid = ({ posts }) => {
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <div key={post.id} className="grid-post" id={`grid-post-${post.id}`}>
          <img src={post.image} alt="Post" className="grid-post-image" loading="lazy" />
          <div className="grid-post-overlay">
            <span className="grid-post-likes">❤️ {post.likes.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;
