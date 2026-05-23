import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { TrendingUp, Clock, BookOpen, Calendar, PlusCircle, Award, ChevronRight, TrendingDown, Info, Check, X } from 'lucide-react';
import './Dashboard.css';
const Dashboard = () => {
  const {
    sessionLogs,
    requests,
    users,
    logSession,
    approveSessionLog,
    rejectSessionLog,
    currentUser
  } = useContext(AppContext);

  // Log Session Form State
  const [activeReqId, setActiveReqId] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('2');
  const [type, setType] = useState('learn');

  // Filter only active contracts for logging sessions
  const activeContracts = requests.filter(r => r.status === 'approved');
  const getPartnerName = req => {
    const partnerId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
    const partner = users.find(u => u.id === partnerId);
    return partner ? partner.name : 'Exchange Partner';
  };
  const handleLogSubmit = e => {
    e.preventDefault();
    if (!activeReqId) return;
    logSession(activeReqId, topic, duration, type);

    // Reset Form
    setTopic('');
  };

  // Helper values for Stats from current user's perspective
  const userRequests = requests.filter(r => r.senderId === currentUser.id || r.receiverId === currentUser.id);
  const userRequestIds = new Set(userRequests.map(r => r.id));

  // Filter session logs involving current user's requests
  const relevantLogs = sessionLogs.filter(log => userRequestIds.has(log.requestId));

  // Map logs to current user's perspective
  const userSessionLogs = relevantLogs.map(log => {
    const isLogger = log.loggedById === currentUser.id;
    // If current user is logger, the type is exactly what they logged
    // If current user is NOT logger, the type is the opposite of what the partner logged
    let resolvedType = log.type;
    if (!isLogger) {
      resolvedType = log.type === 'teach' ? 'learn' : 'teach';
    }
    return {
      ...log,
      resolvedType
    };
  });

  // Calculate pending approvals waiting for CURRENT user
  const pendingLogsForMe = sessionLogs.filter(log => {
    return log.status === 'pending' && 
           log.loggedById !== currentUser.id && 
           userRequestIds.has(log.requestId);
  });

  // Stats and charts should only include APPROVED logs
  const approvedUserLogs = userSessionLogs.filter(log => log.status === 'approved' || !log.status);

  const totalLearnHours = approvedUserLogs.filter(log => log.resolvedType === 'learn').reduce((sum, log) => sum + log.duration, 0);
  const totalTeachHours = approvedUserLogs.filter(log => log.resolvedType === 'teach').reduce((sum, log) => sum + log.duration, 0);

  // SVG Chart 1 (Hours Swapped Line Chart) Data mapping
  // We'll plot last 6 session logs as trend points
  const reversedLogs = [...approvedUserLogs].reverse().slice(-6);
  const chartWidth = 500;
  const chartHeight = 180;
  const padding = 30;

  // Compute points
  const pointsLearn = reversedLogs.filter(l => l.resolvedType === 'learn').map((l, i, arr) => {
    const x = padding + i * (chartWidth - 2 * padding) / Math.max(1, arr.length - 1);
    const y = chartHeight - padding - l.duration * (chartHeight - 2 * padding) / 5; // scaled max = 5 hours
    return {
      x,
      y,
      dur: l.duration,
      date: l.date
    };
  });
  const pointsTeach = reversedLogs.filter(l => l.resolvedType === 'teach').map((l, i, arr) => {
    const x = padding + i * (chartWidth - 2 * padding) / Math.max(1, arr.length - 1);
    const y = chartHeight - padding - l.duration * (chartHeight - 2 * padding) / 5;
    return {
      x,
      y,
      dur: l.duration,
      date: l.date
    };
  });
  const makePathString = pts => {
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };
  const makeAreaString = pts => {
    if (pts.length === 0) return '';
    const first = pts[0];
    const last = pts[pts.length - 1];
    const path = makePathString(pts);
    return `${path} L ${last.x} ${chartHeight - padding} L ${first.x} ${chartHeight - padding} Z`;
  };

  // SVG Chart 2 (Category Donut Chart)
  // Let's compute actual learn hours vs teach hours ratio
  const totalHours = totalLearnHours + totalTeachHours;
  let learnPercentage = 0;
  let teachPercentage = 0;
  
  if (totalHours > 0) {
    learnPercentage = Math.round((totalLearnHours / totalHours) * 100);
    teachPercentage = 100 - learnPercentage;
  }

  // Donut values (radius = 50, circumference = 2 * pi * 50 = 314.16)
  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const learnDashOffset = circ - learnPercentage / 100 * circ;
  const teachDashOffset = circ - teachPercentage / 100 * circ;
  return <div className="dash-style-1">
      

      {/* Page Header */}
      <div className="dash-style-2">
        <h1 className="dash-style-3">Dashboard & Progress Analytics</h1>
        <p className="dash-style-4">Track your swapped hours, log new mutual sessions, and visualize your progress tags.</p>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="glass-panel dash-style-5">
          <div className="dash-style-6">
            <TrendingDown size={22} />
          </div>
          <div>
            <span className="dash-style-7">LEARNED HOURS</span>
            <h3 className="dash-style-8">{totalLearnHours} Hrs</h3>
          </div>
        </div>

        <div className="glass-panel dash-style-9">
          <div className="dash-style-10">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="dash-style-11">TEACHING HOURS</span>
            <h3 className="dash-style-12">{totalTeachHours} Hrs</h3>
          </div>
        </div>

        <div className="glass-panel dash-style-13">
          <div className="dash-style-14">
            <Clock size={22} />
          </div>
          <div>
            <span className="dash-style-15">TOTAL SWAPPED</span>
            <h3 className="dash-style-16">{totalLearnHours + totalTeachHours} Hrs</h3>
          </div>
        </div>

        <div className="glass-panel dash-style-17">
          <div className="dash-style-18">
            <Award size={22} />
          </div>
          <div>
            <span className="dash-style-19">CONTRIBUTION RANK</span>
            <h3 className="dash-style-20">Level {currentUser.level}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="dashboard-layout">
        
        {/* LEFT COLUMN: CHARTS & LOG TIMELINE */}
        <div>
          
          {/* Custom SVG Charts Widget Card */}
          <div className="glass-panel widget-card dash-style-21">
            <h3 className="dash-style-22">Hourly Swapping Progress Trend</h3>
            
            <div className="dash-style-23">
              
              {/* LINE CHART GRAPH */}
              <div>
                <h4 className="dash-style-24">Recent Sessions Duration (Hours Logged)</h4>
                
                {reversedLogs.length === 0 ? <div className="dash-style-25">
                    <Info size={16} className="dash-style-26" /> Log some study sessions below to plot trends!
                  </div> : <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="dash-style-27">
                    <defs>
                      <linearGradient id="learnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="teachGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(0,0,0,0.04)" />
                    <line x1={padding} y1={(chartHeight - 2 * padding) / 2 + padding} x2={chartWidth - padding} y2={(chartHeight - 2 * padding) / 2 + padding} stroke="rgba(0,0,0,0.04)" />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(0,0,0,0.08)" />

                    {/* Shaded Areas */}
                    {pointsLearn.length > 0 && <path d={makeAreaString(pointsLearn)} fill="url(#learnGrad)" />}
                    {pointsTeach.length > 0 && <path d={makeAreaString(pointsTeach)} fill="url(#teachGrad)" />}

                    {/* Trend Paths */}
                    {pointsLearn.length > 0 && <path d={makePathString(pointsLearn)} fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeLinecap="round" />}
                    {pointsTeach.length > 0 && <path d={makePathString(pointsTeach)} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />}

                    {/* Dots / Interactive points */}
                    {pointsLearn.map((p, i) => <g key={`l-${i}`}>
                        <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-deep)" stroke="var(--color-secondary)" strokeWidth="2" />
                        <text x={p.x} y={p.y - 10} fill="var(--text-secondary)" fontSize="9" textAnchor="middle">{p.dur}h</text>
                      </g>)}
                    {pointsTeach.map((p, i) => <g key={`t-${i}`}>
                        <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-deep)" stroke="var(--color-primary)" strokeWidth="2" />
                        <text x={p.x} y={p.y - 10} fill="var(--text-secondary)" fontSize="9" textAnchor="middle">{p.dur}h</text>
                      </g>)}

                    {/* Y-axis labels */}
                    <text x={padding - 8} y={padding + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">5h</text>
                    <text x={padding - 8} y={(chartHeight - 2 * padding) / 2 + padding + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">2.5h</text>
                    <text x={padding - 8} y={chartHeight - padding + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">0h</text>
                  </svg>}

                <div className="dash-style-28">
                  <div className="dash-style-29">
                    <span className="dash-style-30"></span>
                    <span className="dash-style-31">Learning Trend</span>
                  </div>
                  <div className="dash-style-32">
                    <span className="dash-style-33"></span>
                    <span className="dash-style-34">Teaching Trend</span>
                  </div>
                </div>
              </div>

              {/* DONUT CHART */}
              <div className="dash-style-35">
                <h4 className="dash-style-36">Balance Distribution</h4>
                
                <svg width="100%" height="110" viewBox="0 0 120 120" className="dash-style-37">
                  {/* Outer circle (Teach) */}
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="10" />
                  
                  {/* Learn Segment */}
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-secondary)" strokeWidth="10" strokeDasharray={circ} strokeDashoffset={learnDashOffset} strokeLinecap="round" />

                  {/* Teach Segment */}
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeDasharray={circ} strokeDashoffset={teachDashOffset} style={{
                  transform: `rotate(${learnPercentage / 100 * 360}deg)`
                }} strokeLinecap="round" className="dash-style-38" />
                </svg>

                <div className="dash-style-39">
                  <span className="dash-style-40">
                    {learnPercentage}% Learn / {teachPercentage}% Teach
                  </span>
                  <p className="dash-style-41">
                    Ratio score: {(totalLearnHours / (totalTeachHours || 1)).toFixed(2)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Session logs Timeline Widget */}
          <div className="glass-panel widget-card dash-style-42">
            <h3 className="dash-style-43">Swap Session History Log</h3>
            
            <div className="log-list-container">
              {userSessionLogs.length === 0 ? <p className="dash-style-44">
                  No sessions logged yet. Complete mutual hours to generate log files.
                </p> : userSessionLogs.map(log => {
              const req = requests.find(r => r.id === log.requestId) || {
                senderId: '',
                receiverId: ''
              };
              const partnerId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
              const partner = users.find(u => u.id === partnerId) || {
                name: 'Exchange Partner'
              };
              return <div key={log.id} className="log-item">
                      <div className="dash-style-45">
                        <div style={{
                    background: log.resolvedType === 'teach' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                    color: log.resolvedType === 'teach' ? 'var(--color-primary)' : 'var(--color-secondary)'
                  }} className="dash-style-46">
                          {log.resolvedType === 'teach' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div>
                          <h4 className="dash-style-47">{log.topic}</h4>
                          <span className="dash-style-48">
                            With {partner.name} • {log.date}
                          </span>
                        </div>
                      </div>

                      <div className="dash-style-49">
                        {log.status === 'pending' && <span className="badge" style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }}>Pending</span>}
                        {log.status === 'rejected' && <span className="badge" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>Rejected</span>}
                        <span className={`badge ${log.resolvedType === 'teach' ? 'badge-tech' : 'badge-creative'} dash-style-50`}>
                          {log.resolvedType === 'teach' ? 'Taught' : 'Learned'}
                        </span>
                        <span className="dash-style-51">
                          +{log.duration} hrs
                        </span>
                      </div>
                    </div>;
            })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LOG SESSION ACTION CARD */}
        <div>
          
          {/* PENDING APPROVALS WIDGET */}
          {pendingLogsForMe.length > 0 && (
            <div className="glass-panel widget-card dash-style-52" style={{ marginBottom: '24px', borderLeft: '4px solid #fbbf24' }}>
              <h3 className="dash-style-53" style={{ color: '#d97706' }}>
                <Clock size={20} /> Pending Approvals ({pendingLogsForMe.length})
              </h3>
              <p className="dash-style-54">
                Your exchange partners have logged hours. Please review them.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {pendingLogsForMe.map(log => {
                  const partner = users.find(u => u.id === log.loggedById) || { name: 'Partner' };
                  const actionType = log.type === 'teach' ? 'taught you' : 'learned from you';
                  
                  return (
                    <div key={log.id} style={{ background: 'var(--bg-shallow)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{partner.name} logged {log.duration} hrs ({actionType})</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Topic: {log.topic}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={() => approveSessionLog(log.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <Check size={14} /> Approve
                        </button>
                        <button type="button" onClick={() => rejectSessionLog(log.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="glass-panel widget-card dash-style-52">
            <h3 className="dash-style-53">
              <PlusCircle size={20} color="var(--color-primary)" /> Log Skill Exchange Hours
            </h3>
            <p className="dash-style-54">
              Complete mutual study hours? Log them below to update your analytics and level up!
            </p>

            {activeContracts.length === 0 ? <div className="dash-style-55">
                <div className="dash-style-55-header">
                  <Info size={18} />
                  <span>Action Required</span>
                </div>
                <p className="dash-style-55-text">
                  You must have at least one <strong>Active Exchange Contract</strong> running before you can log study hours. Approve incoming proposals under the Requests tab!
                </p>
              </div> : <form onSubmit={handleLogSubmit}>
                
                {/* Select Active Contract */}
                <div className="form-group">
                  <label className="form-label">Select Active Contract Partner:</label>
                  <select className="form-select" value={activeReqId} onChange={e => setActiveReqId(e.target.value)} required>
                    <option value="">-- Choose Contract Partner --</option>
                    {activeContracts.map(req => <option key={req.id} value={req.id}>
                        {getPartnerName(req)} (Swap: {req.skillOffered} ⇄ {req.skillRequested})
                      </option>)}
                  </select>
                </div>

                {/* Session Type */}
                <div className="form-group">
                  <label className="form-label">Session Exchange Action Type:</label>
                  <div className="dash-style-56">
                    <button type="button" className={`btn ${type === 'learn' ? 'btn-cyan' : 'btn-secondary'} dash-style-57`} onClick={() => setType('learn')}>
                      I was Learning
                    </button>
                    <button type="button" className={`btn ${type === 'teach' ? 'btn-primary' : 'btn-secondary'} dash-style-58`} onClick={() => setType('teach')}>
                      I was Teaching
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label className="form-label">Session Duration (Hours):</label>
                  <select className="form-select" value={duration} onChange={e => setDuration(e.target.value)} required>
                    <option value="0.5">30 Minutes (0.5 hrs)</option>
                    <option value="1">1 Hour (1.0 hr)</option>
                    <option value="1.5">1.5 Hours (1.5 hrs)</option>
                    <option value="2">2 Hours (2.0 hrs)</option>
                    <option value="3">3 Hours (3.0 hrs)</option>
                    <option value="4">4 Hours (4.0 hrs)</option>
                  </select>
                </div>

                {/* Topic description */}
                <div className="form-group">
                  <label className="form-label">What Topic Did You Cover?</label>
                  <input type="text" className="form-input" placeholder="e.g. Setting up ESLint, Speaking drills..." value={topic} onChange={e => setTopic(e.target.value)} required />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary dash-style-59">
                  Confirm & Log Session
                </button>

              </form>}
          </div>

        </div>

      </div>

    </div>;
};
export default Dashboard;
