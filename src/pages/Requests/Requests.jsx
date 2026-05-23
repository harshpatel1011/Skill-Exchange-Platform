import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, X, Trash2, Edit3, Award, Star, Clock, ArrowRight, TrendingUp, Inbox, Send, CheckCircle, FileCheck } from 'lucide-react';
import './Requests.css';

const Requests = () => {
  const {
    requests,
    users,
    currentUser,
    updateRequestStatus,
    cancelExchangeRequest,
    editExchangeRequest,
    toggleMilestone,
    submitExchangeRating,
    approveMilestone,
    rejectMilestone
  } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('active');

  // Edit Request State
  const [editingRequest, setEditingRequest] = useState(null);
  const [editCommitment, setEditCommitment] = useState('');
  const [editMessage, setEditMessage] = useState('');

  // Rating Feedback State
  const [ratingRequest, setRatingRequest] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);

  const getMemberDetails = userId => {
    return users.find(u => u.id === userId) || {
      name: 'External Member',
      title: 'Expert Peer'
    };
  };

  const receivedProposals = requests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');
  const sentProposals = requests.filter(r => r.senderId === currentUser.id && r.status === 'pending');
  const activeContracts = requests.filter(r => (r.status === 'approved' || r.status === 'pending_completion') && (r.senderId === currentUser.id || r.receiverId === currentUser.id));
  const completedContracts = requests.filter(r => r.status === 'completed' && (r.senderId === currentUser.id || r.receiverId === currentUser.id));

  const handleEditClick = req => {
    setEditingRequest(req);
    setEditCommitment(req.commitment);
    setEditMessage(req.message);
  };
  const handleEditSave = e => {
    e.preventDefault();
    if (!editingRequest) return;
    editExchangeRequest(editingRequest.id, {
      commitment: editCommitment,
      message: editMessage
    });
    setEditingRequest(null);
  };
  const handleRatingSubmit = e => {
    e.preventDefault();
    if (!ratingRequest) return;
    submitExchangeRating(ratingRequest.id, ratingVal);
    setRatingRequest(null);
  };

  return (
    <div className="requests-container">
      {/* Header Info */}
      <div className="requests-header">
        <h1 className="requests-title">Swap Contracts Manager</h1>
        <p className="requests-subtitle">Manage your active swap contracts, approve incoming offers, or log weekly commitments.</p>
      </div>

      {/* Navigation tabs */}
      <div className="requests-tabs">
        <button className={`tab-button ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          Active Exchanges ({activeContracts.length})
        </button>
        <button className={`tab-button ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>
          Received Proposals ({receivedProposals.length})
        </button>
        <button className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
          Sent Proposals ({sentProposals.length})
        </button>
        <button className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed Swaps ({completedContracts.length})
        </button>
      </div>

      {/* Tab Streams */}
      <div className="requests-stream">
        {/* ================= RECEIVED PROPOSALS ================= */}
        {activeTab === 'received' && (
          receivedProposals.length === 0 ? (
            <div className="empty-state-card">
              <Inbox size={48} className="empty-state-icon" />
              <h3>No incoming proposals pending</h3>
              <p>Offers sent by community members will appear here.</p>
            </div>
          ) : (
            receivedProposals.map(req => {
              const sender = getMemberDetails(req.senderId);
              return (
                <div key={req.id} className="proposal-card">
                  <div className="proposal-card-header">
                    <div className="member-info">
                      <div className="member-avatar">
                        {sender.name ? sender.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="member-details">
                        <h4>{sender.name}</h4>
                        <p>{sender.title}</p>
                      </div>
                    </div>
                    <span className="badge badge-incoming">INCOMING SWAP</span>
                  </div>

                  <div className="proposal-skills-grid">
                    <div className="skill-box">
                      <span className="skill-label">They offer:</span>
                      <h4 className="skill-name">{req.skillOffered}</h4>
                    </div>
                    <div className="skill-box">
                      <span className="skill-label">In exchange for your:</span>
                      <h4 className="skill-name color-secondary">{req.skillRequested}</h4>
                    </div>
                  </div>

                  <div className="proposal-pitch">
                    <h5>Swap Pitch Statement:</h5>
                    <p>"{req.message}"</p>
                  </div>

                  <div className="proposal-actions-footer">
                    <div className="proposal-commitment">
                      <Clock size={14} />
                      <span>Proposed Commitment: <strong>{req.commitment}</strong></span>
                    </div>
                    <div className="proposal-actions">
                      <button className="btn btn-outline" onClick={() => updateRequestStatus(req.id, 'declined')}>
                        <X size={16} /> Decline
                      </button>
                      <button className="btn btn-primary" onClick={() => updateRequestStatus(req.id, 'approved')}>
                        <Check size={16} /> Approve & Start
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* ================= SENT PROPOSALS ================= */}
        {activeTab === 'sent' && (
          sentProposals.length === 0 ? (
            <div className="empty-state-card">
              <Send size={48} className="empty-state-icon" />
              <h3>No outgoing proposals pending</h3>
              <p>Go to explore page to send a skill swap proposal.</p>
            </div>
          ) : (
            sentProposals.map(req => {
              const receiver = getMemberDetails(req.receiverId);
              return (
                <div key={req.id} className="proposal-card">
                  <div className="proposal-card-header">
                    <div className="member-info">
                      <div className="member-avatar">
                        {receiver.name ? receiver.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="member-details">
                        <h4>{receiver.name}</h4>
                        <p>{receiver.title}</p>
                      </div>
                    </div>
                    <span className="badge badge-outgoing">OUTGOING PROPOSAL</span>
                  </div>

                  <div className="proposal-skills-grid">
                    <div className="skill-box">
                      <span className="skill-label">You offer to teach:</span>
                      <h4 className="skill-name color-primary">{req.skillOffered}</h4>
                    </div>
                    <div className="skill-box">
                      <span className="skill-label">You want to learn:</span>
                      <h4 className="skill-name color-secondary">{req.skillRequested}</h4>
                    </div>
                  </div>

                  <div className="proposal-pitch">
                    <h5>Your Swap Pitch Statement:</h5>
                    <p>"{req.message}"</p>
                  </div>

                  <div className="proposal-actions-footer">
                    <div className="proposal-commitment">
                      <Clock size={14} />
                      <span>Commitment Proposed: <strong>{req.commitment}</strong></span>
                    </div>
                    <div className="proposal-actions">
                      <button className="btn btn-outline" onClick={() => handleEditClick(req)}>
                        <Edit3 size={16} /> Edit Details
                      </button>
                      <button className="btn btn-danger-outline" onClick={() => cancelExchangeRequest(req.id)}>
                        <Trash2 size={16} /> Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* ================= ACTIVE CONTRACTS ================= */}
        {activeTab === 'active' && (
          activeContracts.length === 0 ? (
            <div className="empty-state-card">
              <TrendingUp size={48} className="empty-state-icon" />
              <h3>No active learning contracts</h3>
              <p>Once proposals are approved manually, they will list active checklists here.</p>
            </div>
          ) : (
            activeContracts.map(req => {
              const partnerId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
              const partner = getMemberDetails(partnerId);
              return (
                <div key={req.id} className="proposal-card border-success">
                  <div className="proposal-card-header">
                    <div className="member-info">
                      <div className="member-avatar">
                        {partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="member-details">
                        <h4>Swap Contract with {partner.name}</h4>
                        <p>{partner.title}</p>
                      </div>
                    </div>
                    <span className="badge badge-success">RUNNING EXCHANGE</span>
                  </div>

                  <div className="active-skills-flow">
                    <div className="skill-node">
                      <span className="skill-label">{req.senderId === currentUser.id ? 'YOU TEACH' : 'THEY TEACH'}</span>
                      <h4 className="skill-name color-primary">{req.skillOffered}</h4>
                      <span className="skill-logged">Logged: <strong>{req.hoursTaught || 0} hrs</strong></span>
                    </div>
                    <div className="skill-flow-icon">
                      <ArrowRight size={24} />
                    </div>
                    <div className="skill-node">
                      <span className="skill-label">{req.senderId === currentUser.id ? 'YOU LEARN' : 'THEY LEARN'}</span>
                      <h4 className="skill-name color-secondary">{req.skillRequested}</h4>
                      <span className="skill-logged">Logged: <strong>{req.hoursLearned || 0} hrs</strong></span>
                    </div>
                  </div>

                  <div className="milestones-container">
                    <h5>
                      <FileCheck size={16} /> Course Syllabus & Milestones
                    </h5>
                    <div className="milestones-list">
                      {req.milestones && req.milestones.map(mile => {
                        const isCompleted = mile.completed;
                        const isPending = mile.status === 'pending';
                        const iToggled = mile.toggledBy === currentUser.id;
                        
                        return (
                          <div key={mile.id} className={`milestone-item ${isCompleted ? 'completed' : ''}`}>
                            <span className="milestone-title">{mile.title}</span>
                            {isCompleted ? (
                              <CheckCircle size={20} color="var(--color-success)" style={{ flexShrink: 0 }} />
                            ) : isPending ? (
                              iToggled ? (
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  <span style={{fontSize: '11px', color: '#d97706', fontWeight: 600, padding: '2px 6px', background: '#fef3c7', borderRadius: '10px', whiteSpace: 'nowrap'}}>Pending...</span>
                                  <button type="button" onClick={() => toggleMilestone(req.id, mile.id)} style={{ padding: '2px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }} title="Cancel Request"><X size={14}/></button>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button type="button" onClick={() => approveMilestone(req.id, mile.id)} className="btn btn-primary" style={{ padding: '4px', background: 'var(--color-success)', borderColor: 'var(--color-success)' }} title="Approve"><Check size={14}/></button>
                                  <button type="button" onClick={() => rejectMilestone(req.id, mile.id)} className="btn btn-danger-outline" style={{ padding: '4px' }} title="Reject"><X size={14}/></button>
                                </div>
                              )
                            ) : (
                              <input 
                                type="checkbox" 
                                className="milestone-checkbox" 
                                checked={false} 
                                onChange={() => toggleMilestone(req.id, mile.id)} 
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="proposal-actions-footer">
                    <span className="commitment-rate">Commitment Rate: <strong>{req.commitment}</strong></span>
                    {req.status === 'pending_completion' ? (
                      req.completionRequestedBy === currentUser.id ? (
                        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', color: '#d97706', fontSize: '13px', textAlign: 'center', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                          <span>Waiting for partner to approve contract completion...</span>
                          <button className="btn" style={{ border: '1px solid #d97706', color: '#d97706', padding: '4px 12px', fontSize: '12px', background: 'transparent', borderRadius: '6px', cursor: 'pointer' }} onClick={() => updateRequestStatus(req.id, 'approved')}>
                            Cancel Request
                          </button>
                        </div>
                      ) : (
                        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>Partner wants to finish the contract!</span>
                          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                            <button className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '4px', fontSize: '13px' }} onClick={() => updateRequestStatus(req.id, 'completed')}>
                              <CheckCircle size={16} /> Approve Completion
                            </button>
                            <button className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '4px', fontSize: '13px' }} onClick={() => updateRequestStatus(req.id, 'approved')}>
                              <X size={16} /> Reject
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => updateRequestStatus(req.id, 'pending_completion')} 
                        disabled={req.milestones && !req.milestones.every(m => m.completed)}
                        style={{ opacity: (req.milestones && !req.milestones.every(m => m.completed)) ? 0.5 : 1 }}
                        title={(req.milestones && !req.milestones.every(m => m.completed)) ? "Complete all milestones first" : ""}
                      >
                        <CheckCircle size={16} /> Mark Exchange Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        )}

        {/* ================= COMPLETED SWAPS ================= */}
        {activeTab === 'completed' && (
          completedContracts.length === 0 ? (
            <div className="empty-state-card">
              <Award size={48} className="empty-state-icon" />
              <h3>No completed exchanges yet</h3>
              <p>Contracts marked finished by both sides will list history logs here.</p>
            </div>
          ) : (
            completedContracts.map(req => {
              const partnerId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
              const partner = getMemberDetails(partnerId);
              return (
                <div key={req.id} className="proposal-card border-primary">
                  <div className="proposal-card-header">
                    <div className="member-info">
                      <div className="member-avatar">
                        {partner.name ? partner.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="member-details">
                        <h4>Exchange Contract with {partner.name}</h4>
                        <p>Completed on {req.date}</p>
                      </div>
                    </div>
                    <span className="badge badge-primary">SWAP SUCCESS</span>
                  </div>

                  <div className="completed-summary">
                    <span>Teach Skill: <strong>{req.skillOffered}</strong> ({req.hoursTaught || 0} hrs)</span>
                    <span className="separator">|</span>
                    <span>Learn Skill: <strong>{req.skillRequested}</strong> ({req.hoursLearned || 0} hrs)</span>
                  </div>

                  <div className="feedback-section">
                    <div>
                      {req.ratingGiven ? (
                        <div className="rating-given">
                          <span>You rated {partner.name}:</span>
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} size={14} fill={star <= req.ratingGiven ? '#fbbf24' : 'none'} stroke={star <= req.ratingGiven ? '#fbbf24' : 'var(--text-muted)'} />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn-outline" onClick={() => {
                          setRatingRequest(req);
                          setRatingVal(5);
                        }}>
                          ⭐ Rate & Leave Feedback
                        </button>
                      )}
                    </div>
                    <div className="xp-gained">
                      <Award size={14} color="#4f46e5" />
                      <span>Gained +150 XP achievements!</span>
                    </div>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>

      {/* ================= EDIT OUTGOING PROPOSAL MODAL ================= */}
      {editingRequest && (
        <div className="modal-overlay">
          <div className="modal-body">
            <div className="modal-header">
              <h3>Modify Outgoing Swap Offer</h3>
              <button onClick={() => setEditingRequest(null)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSave}>
              <div className="form-group">
                <label className="form-label">Weekly Hour Budget:</label>
                <select className="form-select" value={editCommitment} onChange={e => setEditCommitment(e.target.value)} required>
                  <option value="1 hour per week">1 hour per week (Light exchange)</option>
                  <option value="2 hours per week">2 hours per week (Standard balance)</option>
                  <option value="3 hours per week">3 hours per week (Accelerated learn)</option>
                  <option value="5 hours per week">5 hours per week (High intensity)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Personal Swap Statement Pitch:</label>
                <textarea className="form-input text-area" value={editMessage} onChange={e => setEditMessage(e.target.value)} required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditingRequest(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Offer Upgrades</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SUBMIT RATING FEEDBACK MODAL ================= */}
      {ratingRequest && (
        <div className="modal-overlay">
          <div className="modal-body">
            <div className="modal-header">
              <h3>Submit Feedback review</h3>
              <button onClick={() => setRatingRequest(null)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleRatingSubmit}>
              <p className="rating-prompt">
                How was your learning experience swapping skills with {getMemberDetails(ratingRequest.senderId === currentUser.id ? ratingRequest.receiverId : ratingRequest.senderId).name}?
              </p>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRatingVal(star)} className="star-btn">
                    <Star size={32} fill={star <= ratingVal ? '#fbbf24' : 'none'} stroke={star <= ratingVal ? '#fbbf24' : 'var(--text-muted)'} />
                  </button>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setRatingRequest(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
