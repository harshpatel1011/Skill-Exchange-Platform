import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, MapPin, Star, ArrowLeftRight, BookOpen, Send, X } from 'lucide-react';
import './Explore.css';
const Explore = () => {
  const {
    users,
    currentUser,
    sendExchangeRequest,
    requests
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null); // Member chosen for sending a request

  // Exchange Request Modal Form State
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [commitment, setCommitment] = useState('2 hours per week');
  const [message, setMessage] = useState('');

  // Derived members list: exclude current user so they don't see themselves in explore
  const members = users ? users.filter(u => u.id !== currentUser.id) : [];

  // Categories helper mapping
  const categoryKeywords = {
    All: [],
    Technology: ['React JS', 'HTML', 'CSS', 'JavaScript Basics', 'Figma (UI/UX)', 'Coding', 'Web Design'],
    Languages: ['English Speaking', 'Spanish Language', 'French'],
    Creative: ['Gourmet Cooking', 'French Baking', 'Acoustic Guitar', 'Music Theory', 'Creative Writing'],
    Business: ['Digital Marketing', 'SEO Optimization', 'Copywriting']
  };

  // Filter members based on search term and selected category tab
  const filteredMembers = members.filter(m => {
    // 1. Text Search matching
    const matchText = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.bio.toLowerCase().includes(searchTerm.toLowerCase()) || m.skillsTeach.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || m.skillsLearn.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    // 2. Category matching
    if (activeCategory === 'All') return matchText;
    const keywords = categoryKeywords[activeCategory] || [];
    const matchCategory = m.skillsTeach.some(skill => keywords.some(kw => skill.toLowerCase().includes(kw.toLowerCase())));
    return matchText && matchCategory;
  });
  const openRequestModal = member => {
    setSelectedMember(member);
    // Prefill with reasonable options
    setSkillOffered(currentUser.skillsTeach[0] || '');
    setSkillRequested(member.skillsTeach[0] || '');
    setMessage(`Hey ${member.name.split(' ')[0]}, I'd love to swap my skill in ${currentUser.skillsTeach[0] || 'design/coding'} for your skill in ${member.skillsTeach[0]}! Let's connect!`);
  };
  const closeRequestModal = () => {
    setSelectedMember(null);
    setMessage('');
  };
  const handleRequestSubmit = e => {
    e.preventDefault();
    if (!selectedMember) return;
    sendExchangeRequest(selectedMember.id, {
      skillOffered,
      skillRequested,
      commitment,
      message
    });
    closeRequestModal();
  };

  // Check if there is an active request between current user and member
  const getRequestStatusBadge = memberId => {
    const activeReq = requests.find(r => r.senderId === currentUser.id && r.receiverId === memberId || r.senderId === memberId && r.receiverId === currentUser.id);
    if (!activeReq) return null;
    let color = 'rgba(245, 158, 11, 0.2)';
    let textColor = '#fbbf24';
    if (activeReq.status === 'approved') {
      color = 'rgba(16, 185, 129, 0.2)';
      textColor = '#34d399';
    } else if (activeReq.status === 'completed') {
      color = 'rgba(99, 102, 241, 0.2)';
      textColor = '#a5b4fc';
    }
    return <span style={{
      background: color,
      color: textColor
    }} className="explore-style-1">
        {activeReq.status} Exchange
      </span>;
  };
  return <div className="explore-style-2">
      

      {/* Header Info */}
      <div className="explore-style-3">
        <h1 className="explore-style-4">Explore Tutors & Swap Skills</h1>
        <p className="explore-style-5">
          Browse available teachers, see their ratings, and send customized exchange offers.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input type="text" className="form-input search-box" placeholder="Search by skill name, member profile details..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Category Tabs */}
      <div className="explore-style-6">
        {Object.keys(categoryKeywords).map(cat => <button key={cat} className={`category-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>)}
      </div>

      {/* Members Cards Grid */}
      {filteredMembers.length === 0 ? <div className="explore-style-7" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <BookOpen size={48} className="explore-style-8" />
          <h3>No matching members found</h3>
          <p className="explore-style-9">Be the first to invite colleagues or register another profile to build up the directory!</p>
        </div> : <div className="member-grid">
          {filteredMembers.map(member => <div key={member.id} className="member-card">
              
              {/* Member Header Block */}
              <div className="member-header">
                <div className="avatar-frame">
                  <div className="explore-style-10">
                    {member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className="explore-style-11">
                  <div className="explore-style-12">
                    <h3 className="explore-style-13">{member.name}</h3>
                    {getRequestStatusBadge(member.id)}
                  </div>
                  <p className="explore-style-14">{member.title}</p>
                  
                  {/* Rating Info */}
                  <div className="explore-style-15">
                    <div className="explore-style-16">
                      <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                      <span className="explore-style-17">{member.rating}</span>
                    </div>
                    <span className="explore-style-18">({member.reviewsCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Bio Description */}
              <p className="explore-style-19">
                "{member.bio}"
              </p>

              {/* Teacher Skills */}
              <div className="explore-style-20">
                <h4 className="explore-style-21">
                  Teaches:
                </h4>
                <div className="skills-tag-container">
                  {member.skillsTeach.map(skill => <span key={skill} className="badge badge-tech explore-style-22">
                      {skill}
                    </span>)}
                </div>
              </div>

              {/* Learning Skills */}
              <div className="explore-style-23">
                <h4 className="explore-style-24">
                  Wants to Learn:
                </h4>
                <div className="skills-tag-container">
                  {member.skillsLearn.map(skill => <span key={skill} className="badge badge-creative explore-style-25">
                      {skill}
                    </span>)}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="explore-style-26">
                <button className="btn btn-primary explore-style-27" onClick={() => openRequestModal(member)}>
                  <ArrowLeftRight size={16} /> Send Swap Offer
                </button>
              </div>

            </div>)}
        </div>}

      {/* Exchange Contract Draft Modal Overlay */}
      {selectedMember && <div className="modal-overlay">
          <div className="modal-body explore-style-28">
            
            {/* Modal Header */}
            <div className="explore-style-29">
              <div>
                <h2 className="explore-style-30">Draft Exchange Contract</h2>
                <p className="explore-style-31">
                  Initiate a learning agreement with {selectedMember.name}
                </p>
              </div>
              <button onClick={closeRequestModal} className="explore-style-32">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleRequestSubmit} className="explore-style-33">
              
              {/* Profile Card Summary */}
              <div className="explore-style-34">
                <div className="explore-style-35">
                  {selectedMember.name ? selectedMember.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="explore-style-36">{selectedMember.name}</h4>
                  <p className="explore-style-37">{selectedMember.title}</p>
                </div>
              </div>

              {/* Skills Swap Selectors */}
              <div className="explore-style-38">
                
                {/* Offered Skill */}
                <div className="form-group explore-style-39">
                  <label className="form-label explore-style-40">You Offer to Teach:</label>
                  <select className="form-select explore-style-41" value={skillOffered} onChange={e => setSkillOffered(e.target.value)} required>
                    {currentUser.skillsTeach.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                  </select>
                </div>

                {/* Requested Skill */}
                <div className="form-group explore-style-42">
                  <label className="form-label explore-style-43">They Offer to Teach:</label>
                  <select className="form-select explore-style-44" value={skillRequested} onChange={e => setSkillRequested(e.target.value)} required>
                    {selectedMember.skillsTeach.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                  </select>
                </div>

              </div>

              {/* Time Commitment select */}
              <div className="form-group">
                <label className="form-label explore-style-45">Weekly Commitment Budget:</label>
                <select className="form-select explore-style-46" value={commitment} onChange={e => setCommitment(e.target.value)} required>
                  <option value="1 hour per week">1 hour per week (Light exchange)</option>
                  <option value="2 hours per week">2 hours per week (Standard balance)</option>
                  <option value="3 hours per week">3 hours per week (Accelerated learn)</option>
                  <option value="5 hours per week">5 hours per week (High intensity)</option>
                </select>
              </div>

              {/* Proposal Textarea */}
              <div className="form-group">
                <label className="form-label explore-style-47">Your Swap Pitch / Message:</label>
                <textarea className="form-input explore-style-48" value={message} onChange={e => setMessage(e.target.value)} placeholder={`Write a friendly proposal explaining what you hope to achieve and why this exchange is beneficial...`} required></textarea>
              </div>

              {/* Modal Buttons Footer */}
              <div className="explore-style-49">
                <button type="button" className="btn btn-secondary" onClick={closeRequestModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Proposal <Send size={16} />
                </button>
              </div>

            </form>

          </div>
        </div>}

    </div>;
};
export default Explore;
