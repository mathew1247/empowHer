import React from 'react';
import { storiesData } from '../data/posts';
import './Stories.css';

const Stories = () => {
  return (
    <div className="stories-container">
      <div className="stories-scroll">
        {storiesData.map((story) => (
          <div key={story.id} className="story-item" id={`story-${story.id}`}>
            <div className={`story-ring ${story.isOwn ? 'story-ring-own' : ''}`}>
              {story.isOwn && (
                <div className="story-add-icon">+</div>
              )}
              <img src={story.avatar} alt={story.username} className="story-avatar" />
            </div>
            <span className="story-username">{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
