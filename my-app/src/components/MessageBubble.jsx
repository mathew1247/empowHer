import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isMe = message.sender === 'me';

  return (
    <div className={`bubble-row ${isMe ? 'bubble-row-me' : 'bubble-row-them'}`}>
      <div className={`bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
        <p className="bubble-text">{message.text}</p>
        <span className="bubble-time">{message.time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
