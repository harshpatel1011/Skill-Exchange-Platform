import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Send, MessageSquare, User, Star, Calendar, Sparkles, Info, Zap, Clock } from 'lucide-react';
import './Chat.css';
const Chat = () => {
  const {
    chats,
    requests,
    users,
    sendMessage,
    currentUser
  } = useContext(AppContext);
  const [selectedChatId, setSelectedChatId] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll chat body on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [chats, selectedChatId]);

  // Set default selected chat if available
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);
  const activeChat = chats.find(c => c.id === selectedChatId);
  const getPartnerDetails = partnerId => {
    return users.find(u => u.id === partnerId) || {
      name: 'External Member',
      title: 'Expert Peer',
      rating: 4.8
    };
  };
  const getRequestDetails = reqId => {
    return requests.find(r => r.id === reqId) || {
      skillOffered: 'Skills',
      skillRequested: 'Skills',
      status: 'active'
    };
  };
  const handleSend = e => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    sendMessage(activeChat.requestId, inputText.trim());
    setInputText('');
  };
  const handleQuickReply = text => {
    if (!activeChat) return;
    sendMessage(activeChat.requestId, text);
  };

  // Format timestamp nicely
  const formatTime = timeStr => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="chat-style-1">
      

      <div className="glass-panel chat-layout">
        
        {/* LEFT CHANNELS PANE */}
        <div className="channels-pane">
          <div className="chat-style-2">
            <h3 className="chat-style-3">
              <MessageSquare size={16} className="text-gradient" /> Swapping Arenas
            </h3>
          </div>
          
          <div className="chat-style-4">
            {chats.length === 0 ? <p className="chat-style-5">
                No active conversations yet. Start a proposal to trigger channels!
              </p> : chats.map(chat => {
            const req = getRequestDetails(chat.requestId);
            const partnerId = req.senderId === currentUser?.id ? req.receiverId : req.senderId;
            const partner = getPartnerDetails(partnerId);
            const lastMsg = chat.messages[chat.messages.length - 1] || {
              text: 'Exchange alignment drafted.'
            };
            return <div key={chat.id} className={`channel-item ${selectedChatId === chat.id ? 'active' : ''}`} onClick={() => setSelectedChatId(chat.id)}>
                    <div className="chat-style-6">
                      {partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div className="chat-channel-text chat-style-7">
                      <div className="chat-style-8">
                        <h4 className="chat-style-9">
                          {partner.name}
                        </h4>
                      </div>
                      <p className="chat-style-10">
                        {lastMsg.senderId === currentUser?.id ? 'You: ' : ''}{lastMsg.text}
                      </p>
                    </div>
                  </div>;
          })}
          </div>
        </div>

        {/* RIGHT CHAT PANE */}
        <div className="chat-pane">
          {activeChat ? <>
              {/* Chat Header */}
              {(() => {
            const req = getRequestDetails(activeChat.requestId);
            const partnerId = req.senderId === currentUser?.id ? req.receiverId : req.senderId;
            const partner = getPartnerDetails(partnerId);
            return <div className="chat-header">
                    <div className="chat-style-11">
                      <div className="chat-style-12">
                        {partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h3 className="chat-style-13">{partner.name}</h3>
                        <div className="chat-style-14">
                          <span className="chat-style-15">{partner.title}</span>
                          <span className="chat-style-16"></span>
                          <div className="chat-style-17">
                            <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
                            <span className="chat-style-18">{partner.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swap indicator */}
                    <div className="chat-style-19">
                      <Zap size={14} className="text-gradient" />
                      <span className="chat-style-20">
                        Swap: <strong>{req.skillOffered} ⇄ {req.skillRequested}</strong>
                      </span>
                    </div>
                  </div>;
          })()}

              {/* Chat Messages Body */}
              <div className="chat-body">
                
                {/* Information Alignment Notice */}
                <div className="chat-style-21">
                  <Info size={14} className="chat-style-22" />
                  <span className="chat-style-23">
                    This is your direct peer-to-peer manual chat box. Messages are saved in your LocalStorage database.
                  </span>
                </div>

                {activeChat.messages.map(msg => <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser?.id ? 'outgoing' : 'incoming'}`}>
                    <div>{msg.text}</div>
                    <div style={{
                color: msg.senderId === currentUser?.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'
              }} className="chat-style-24">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>)}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Helper Presets */}
              <div className="chat-style-25">
                <button type="button" className="quick-reply-btn" onClick={() => handleQuickReply("Hey, when are you free for our next Zoom call?")}>
                  🗓️ Schedule Call
                </button>
                <button type="button" className="quick-reply-btn" onClick={() => handleQuickReply("I am struggling with the homework exercises. Can you help me?")}>
                  ❓ Help with Exercise
                </button>
                <button type="button" className="quick-reply-btn" onClick={() => handleQuickReply("Awesome! That was a really helpful study session. Thanks!")}>
                  ⭐ Friendly Kudos
                </button>
              </div>

              {/* Chat Input Footer Form */}
              <form onSubmit={handleSend} className="chat-style-26">
                <input type="text" className="form-input" placeholder="Type a friendly response to your swap peer..." value={inputText} onChange={e => setInputText(e.target.value)} required />
                <button type="submit" className="btn btn-primary chat-style-27">
                  Send <Send size={16} />
                </button>
              </form>
            </> : <div className="chat-style-28">
              <MessageSquare size={48} className="chat-style-29" />
              <h3>Select a swap room channel to begin</h3>
              <p className="chat-style-30">Communication will activate automatically when a contract proposal is registered!</p>
            </div>}
        </div>

      </div>
    </div>;
};
export default Chat;
