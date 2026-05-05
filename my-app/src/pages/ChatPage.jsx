import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from '../components/MessageBubble';
import { chatMessages, chatContacts } from '../data/user';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState('');
  const [activeContact, setActiveContact] = useState(chatContacts[0]);
  const [contacts] = useState(chatContacts);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate a reply after 1.5s
    setTimeout(() => {
      const replies = [
        "That's so inspiring! 💜",
        "Absolutely agree with you!",
        "Thanks for sharing this 🌸",
        "We rise by lifting others ✨",
        "Stay strong! You've got this 💪",
      ];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Contacts Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 className="chat-sidebar-title">Messages</h2>
            <button className="chat-new-btn" title="New Message" id="new-message-btn">✏️</button>
          </div>
          <div className="chat-search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search messages..." className="chat-search-input" id="chat-search" />
          </div>
          <div className="contacts-list">
            {contacts.map(contact => (
              <button
                key={contact.id}
                className={`contact-item ${activeContact.id === contact.id ? 'active' : ''}`}
                onClick={() => setActiveContact(contact)}
                id={`contact-${contact.id}`}
              >
                <div className="contact-avatar-wrapper">
                  <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                  {contact.online && <span className="online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-top">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-time">{contact.time}</span>
                  </div>
                  <div className="contact-bottom">
                    <span className="contact-last-msg">{contact.lastMessage}</span>
                    {contact.unread > 0 && (
                      <span className="unread-badge">{contact.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="chat-window">
          {/* Chat Header */}
          <div className="chat-window-header">
            <div className="chat-window-user">
              <div className="chat-window-avatar-wrapper">
                <img src={activeContact.avatar} alt={activeContact.name} className="chat-window-avatar" />
                {activeContact.online && <span className="online-dot" />}
              </div>
              <div>
                <p className="chat-window-name">{activeContact.name}</p>
                <p className="chat-window-status">
                  {activeContact.online ? '🟢 Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
            <div className="chat-window-actions">
              <button className="chat-action-btn" title="Voice call" id="voice-call-btn">📞</button>
              <button className="chat-action-btn" title="Video call" id="video-call-btn">📹</button>
              <button className="chat-action-btn" title="Info" id="chat-info-btn">ℹ️</button>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-area">
            <div className="messages-date-divider">
              <span>Today</span>
            </div>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-area" onSubmit={handleSend} id="chat-form">
            <button type="button" className="chat-attach-btn" title="Attach file" id="attach-btn">📎</button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Message ${activeContact.name}...`}
              className="chat-text-input"
              id="chat-message-input"
            />
            <button type="button" className="chat-emoji-btn" title="Emoji" id="emoji-btn">😊</button>
            <button
              type="submit"
              className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
              id="send-message-btn"
              disabled={!input.trim()}
            >
              💜
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
