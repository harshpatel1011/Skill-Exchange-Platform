import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Registered Users database state (derived purely from LocalStorage with auto self-healing for legacy "Alex Carter" references)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('se_registered_users');
    const parsed = saved ? JSON.parse(saved) : [];
    // Self-heal: Filter out legacy "Alex Carter" users or emails
    const cleaned = parsed.filter(u => 
      u && 
      u.name && 
      u.name.trim().toLowerCase() !== 'alex carter' &&
      u.email && 
      u.email.trim().toLowerCase() !== 'alex@skillswap.com'
    );
    if (saved && parsed.length !== cleaned.length) {
      localStorage.setItem('se_registered_users', JSON.stringify(cleaned));
    }
    return cleaned;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('se_logged_in_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.name && parsed.name.trim().toLowerCase() === 'alex carter') {
        localStorage.removeItem('se_logged_in_user');
        return null;
      }
      return parsed;
    }
    return null;
  });

  // 3. Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('se_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('se_requests');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // Self-heal: Only keep requests involving active, non-Alex Carter users
    const savedUsers = localStorage.getItem('se_registered_users');
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
    const validUserIds = new Set(parsedUsers
      .filter(u => u && u.name && u.name.trim().toLowerCase() !== 'alex carter')
      .map(u => u.id)
    );

    const cleaned = parsed.filter(req => 
      req && 
      validUserIds.has(req.senderId) && 
      validUserIds.has(req.receiverId)
    );

    if (saved && parsed.length !== cleaned.length) {
      localStorage.setItem('se_requests', JSON.stringify(cleaned));
    }
    return cleaned;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('se_chats');
    const parsed = saved ? JSON.parse(saved) : [];

    // Self-heal: Only keep chats involving active, non-Alex Carter users
    const savedUsers = localStorage.getItem('se_registered_users');
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
    const validUserIds = new Set(parsedUsers
      .filter(u => u && u.name && u.name.trim().toLowerCase() !== 'alex carter')
      .map(u => u.id)
    );

    const cleaned = parsed.filter(chat => 
      chat && 
      validUserIds.has(chat.memberId) &&
      chat.messages && 
      chat.messages.every(msg => validUserIds.has(msg.senderId))
    );

    if (saved && parsed.length !== cleaned.length) {
      localStorage.setItem('se_chats', JSON.stringify(cleaned));
    }
    return cleaned;
  });

  const [sessionLogs, setSessionLogs] = useState(() => {
    const saved = localStorage.getItem('se_session_logs');
    const parsed = saved ? JSON.parse(saved) : [];

    // Self-heal: Only keep logs from active, non-Alex Carter users
    const savedUsers = localStorage.getItem('se_registered_users');
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
    const validUserIds = new Set(parsedUsers
      .filter(u => u && u.name && u.name.trim().toLowerCase() !== 'alex carter')
      .map(u => u.id)
    );

    const cleaned = parsed.filter(log => 
      log && 
      validUserIds.has(log.loggedById)
    );

    if (saved && parsed.length !== cleaned.length) {
      localStorage.setItem('se_session_logs', JSON.stringify(cleaned));
    }
    return cleaned;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('se_registered_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('se_logged_in_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('se_logged_in_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('se_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('se_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('se_session_logs', JSON.stringify(sessionLogs));
  }, [sessionLogs]);

  // Handle Theme Toggle
  useEffect(() => {
    localStorage.setItem('se_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  // Login
  const loginUser = (email, password) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      toast.success(`👋 Welcome back, ${foundUser.name}!`, { theme: 'dark' });
      return true;
    } else {
      toast.error('❌ Invalid email or password credentials.', { theme: 'dark' });
      return false;
    }
  };

  // Sign Up
  const signupUser = (details) => {
    const emailExists = users.some(u => u.email.toLowerCase() === details.email.toLowerCase());
    if (emailExists) {
      toast.error('❌ An account with this email already exists.', { theme: 'dark' });
      return false;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: details.email,
      password: details.password,
      name: details.name,
      title: details.title,
      bio: 'Ready to exchange skills and connect with a learning community!',
      rating: 5.0,
      reviewsCount: 0,
      completedExchanges: 0,
      skillsTeach: details.skillsTeach || ['Web Design'],
      skillsLearn: details.skillsLearn || ['Coding'],
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      achievements: [
        { id: 'first_step', name: 'First Contact', desc: 'Send your first exchange request', icon: '🎯', unlocked: false },
        { id: 'mentor', name: 'Elite Mentor', desc: 'Log 10 hours of teaching', icon: '🎓', unlocked: false },
        { id: 'learner', name: 'Fast Learner', desc: 'Log 10 hours of learning', icon: '🧠', unlocked: false },
        { id: 'community', name: 'Exchange Pioneer', desc: 'Complete 3 full exchange contracts', icon: '🤝', unlocked: false }
      ]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    toast.success(`🎉 Welcome to SkillSwap, ${newUser.name}!`, { theme: 'dark' });
    return true;
  };

  // Log Out
  const logoutUser = () => {
    setCurrentUser(null);
    toast.info('🔓 Logged out successfully.', { theme: 'dark' });
  };

  // Dynamic user XP and level engine
  const addXP = (amount) => {
    if (!currentUser) return;
    
    let newXp = currentUser.xp + amount;
    let newLevel = currentUser.level;
    let newXpToNext = currentUser.xpToNextLevel;
    let leveledUp = false;
    
    if (newXp >= newXpToNext) {
      newXp = newXp - newXpToNext;
      newLevel += 1;
      newXpToNext = Math.round(newXpToNext * 1.5);
      leveledUp = true;
    }

    const updatedUser = { ...currentUser, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext };
    
    setCurrentUser(updatedUser);
    setUsers(uList => uList.map(u => u.id === currentUser.id ? updatedUser : u));

    if (leveledUp) {
      toast.success(`🎉 Level Up! You reached Level ${newLevel}!`, { theme: 'dark' });
    }
  };

  // Trigger Achievement unlock in real time
  const unlockAchievement = (id) => {
    if (!currentUser) return;
    
    const targetAch = currentUser.achievements.find(ach => ach.id === id);
    if (!targetAch || targetAch.unlocked) return;

    const achievements = currentUser.achievements.map(ach => 
      ach.id === id ? { ...ach, unlocked: true } : ach
    );
    
    const updatedUser = { ...currentUser, achievements };
    
    setCurrentUser(updatedUser);
    setUsers(uList => uList.map(u => u.id === currentUser.id ? updatedUser : u));
    toast.info(`🏆 Achievement Unlocked: ${targetAch.name}!`, { theme: 'dark' });
  };

  // ==========================================
  // REQUEST ACTIONS (CRUD)
  // ==========================================

  // Create (Send Exchange Request)
  const sendExchangeRequest = (targetMemberId, data) => {
    const newRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetMemberId,
      skillOffered: data.skillOffered,
      skillRequested: data.skillRequested,
      commitment: data.commitment,
      message: data.message,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };

    setRequests(prev => [newRequest, ...prev]);
    
    // Create an empty chat for this request automatically
    const newChat = {
      id: `chat_${Date.now()}`,
      requestId: newRequest.id,
      memberId: targetMemberId,
      messages: [
        {
          id: Date.now(),
          senderId: currentUser.id,
          text: `Request exchange: Can teach "${data.skillOffered}", wants to learn "${data.skillRequested}". Note: "${data.message}"`,
          timestamp: new Date().toISOString()
        }
      ]
    };
    setChats(prev => [newChat, ...prev]);

    unlockAchievement('first_step');
    addXP(50);
    toast.success('✈️ Exchange Request sent successfully!', { theme: 'dark' });
  };

  // Update Request Status (Approve / Decline / Complete)
  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        let extraFields = {};
        if (newStatus === 'approved' && req.status === 'pending') {
          extraFields = {
            hoursTaught: 0,
            hoursLearned: 0,
            milestones: [
              { id: 1, title: 'Initial alignment meeting', completed: false },
              { id: 2, title: 'Basics & setup', completed: false },
              { id: 3, title: 'First practical task', completed: false },
              { id: 4, title: 'Intermediate level exercises', completed: false },
              { id: 5, title: 'Independent project session', completed: false }
            ]
          };
        } else if (newStatus === 'approved' && req.status === 'pending_completion') {
          // Just reverting back to approved, clear the completionRequestedBy field
          extraFields = { completionRequestedBy: null };
        } else if (newStatus === 'pending_completion') {
           extraFields = { completionRequestedBy: currentUser.id };
        }
        return { ...req, status: newStatus, ...extraFields };
      }
      return req;
    }));

    const originalReq = requests.find(r => r.id === requestId);
    const oldStatus = originalReq ? originalReq.status : null;

    if (newStatus === 'approved') {
      if (oldStatus === 'pending') {
        toast.success('🤝 Request accepted! Let the learning begin!', { theme: 'dark' });
        addXP(40);
      } else if (oldStatus === 'pending_completion') {
        toast.warn('❌ Contract completion was rejected.', { theme: 'dark' });
      }
    } else if (newStatus === 'pending_completion') {
      toast.info('Sent completion request to partner.', { theme: 'dark' });
    } else if (newStatus === 'completed') {
      toast.success('🏁 Exchange contract completed! Give your feedback.', { theme: 'dark' });
      setCurrentUser(c => ({ ...c, completedExchanges: c.completedExchanges + 1 }));
      setUsers(uList => uList.map(u => u.id === currentUser.id ? { ...u, completedExchanges: u.completedExchanges + 1 } : u));
      addXP(150);
      
      // Check completed Exchanges achievement
      setTimeout(() => {
        const completedCount = requests.filter(r => r.status === 'completed').length + 1;
        if (completedCount >= 3) {
          unlockAchievement('community');
        }
      }, 500);
    } else if (newStatus === 'declined') {
      toast.warn('Request declined.', { theme: 'dark' });
    }
  };

  // Update active request milestones
  const toggleMilestone = (requestId, milestoneId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const milestones = req.milestones.map(m => {
          if (m.id === milestoneId) {
            if (m.status === 'pending' && m.toggledBy === currentUser.id) {
              return { ...m, status: 'uncompleted', toggledBy: null };
            } else if (!m.status || m.status === 'uncompleted') {
              return { ...m, status: 'pending', toggledBy: currentUser.id };
            }
          }
          return m;
        });
        return { ...req, milestones };
      }
      return req;
    }));
    toast.info('Milestone sent for approval!', { theme: 'dark' });
  };

  const approveMilestone = (requestId, milestoneId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const milestones = req.milestones.map(m => 
          m.id === milestoneId ? { ...m, status: 'completed', completed: true } : m
        );
        return { ...req, milestones };
      }
      return req;
    }));
    toast.success('Milestone approved!', { theme: 'dark' });
  };

  const rejectMilestone = (requestId, milestoneId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const milestones = req.milestones.map(m => 
          m.id === milestoneId ? { ...m, status: 'uncompleted', toggledBy: null } : m
        );
        return { ...req, milestones };
      }
      return req;
    }));
    toast.warn('Milestone rejected.', { theme: 'dark' });
  };

  // Edit Pending Outgoing Request
  const editExchangeRequest = (requestId, updatedData) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId && req.status === 'pending' && req.senderId === currentUser.id) {
        return { ...req, ...updatedData };
      }
      return req;
    }));
    toast.success('✏️ Request updated successfully!', { theme: 'dark' });
  };

  // Delete/Cancel Pending Outgoing Request
  const cancelExchangeRequest = (requestId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
    setChats(prev => prev.filter(c => c.requestId !== requestId));
    toast.info('🗑️ Exchange Request cancelled.', { theme: 'dark' });
  };

  // Complete exchange and submit rating feedback
  const submitExchangeRating = (requestId, rating) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, ratingGiven: rating };
      }
      return req;
    }));

    // Update target member's stats slightly based on feedback
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const partnerId = request.senderId === currentUser.id ? request.receiverId : request.senderId;
      setUsers(prev => prev.map(u => {
        if (u.id === partnerId) {
          const totalRating = (u.rating * u.reviewsCount) + rating;
          const newReviewsCount = u.reviewsCount + 1;
          const newRating = Math.round((totalRating / newReviewsCount) * 10) / 10;
          return { ...u, rating: newRating, reviewsCount: newReviewsCount };
        }
        return u;
      }));
    }
    toast.success('⭐ Thank you for your review!', { theme: 'dark' });
    addXP(30);
  };

  // ==========================================
  // PROGRESS TRACKER (CRUD)
  // ==========================================

  // Log a new session (now defaults to 'pending')
  const logSession = (requestId, topic, duration, type) => {
    const newLog = {
      id: `log_${Date.now()}`,
      requestId,
      loggedById: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      topic,
      duration: parseFloat(duration),
      type, // 'teach' or 'learn'
      status: 'pending'
    };

    setSessionLogs(prev => [newLog, ...prev]);
    toast.success(`⚡ Session logged! Waiting for partner's approval.`, { theme: 'dark' });
  };

  // Approve a pending session log
  const approveSessionLog = (logId) => {
    const log = sessionLogs.find(l => l.id === logId);
    if (!log || log.status !== 'pending') return;

    // 1. Mark log as approved
    setSessionLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'approved' } : l));

    // 2. Add hours to the exchange request
    setRequests(prev => prev.map(req => {
      if (req.id === log.requestId) {
        if (log.type === 'teach') {
          return { ...req, hoursTaught: (req.hoursTaught || 0) + log.duration };
        } else {
          return { ...req, hoursLearned: (req.hoursLearned || 0) + log.duration };
        }
      }
      return req;
    }));

    // 3. Award XP to the user who originally logged the session
    const xpReward = Math.round(log.duration * 25);
    setUsers(prev => prev.map(u => {
      if (u.id === log.loggedById) {
        let newXp = u.xp + xpReward;
        let newLevel = u.level;
        let newXpToNext = u.xpToNextLevel;
        
        if (newXp >= newXpToNext) {
          newXp = newXp - newXpToNext;
          newLevel += 1;
          newXpToNext = Math.round(newXpToNext * 1.5);
        }
        return { ...u, xp: newXp, level: newLevel, xpToNextLevel: newXpToNext };
      }
      return u;
    }));

    // 4. Check achievements for the logger retroactively
    setTimeout(() => {
      const loggerTeachLogs = sessionLogs.filter(
        l => l.loggedById === log.loggedById && l.type === 'teach' && (l.status === 'approved' || l.id === logId)
      );
      const totalTeach = loggerTeachLogs.reduce((sum, l) => sum + l.duration, 0);
      
      const loggerLearnLogs = sessionLogs.filter(
        l => l.loggedById === log.loggedById && l.type === 'learn' && (l.status === 'approved' || l.id === logId)
      );
      const totalLearn = loggerLearnLogs.reduce((sum, l) => sum + l.duration, 0);

      setUsers(prev => prev.map(u => {
        if (u.id === log.loggedById) {
          const achievements = u.achievements.map(ach => ({ ...ach }));
          if (totalTeach >= 10) {
            const ach = achievements.find(a => a.id === 'mentor');
            if (ach && !ach.unlocked) ach.unlocked = true;
          }
          if (totalLearn >= 10) {
            const ach = achievements.find(a => a.id === 'learner');
            if (ach && !ach.unlocked) ach.unlocked = true;
          }
          return { ...u, achievements };
        }
        return u;
      }));
    }, 500);

    toast.success('✅ Session approved successfully!', { theme: 'dark' });
  };

  // Reject a pending session log
  const rejectSessionLog = (logId) => {
    setSessionLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'rejected' } : l));
    toast.warn('❌ Session log rejected.', { theme: 'dark' });
  };

  // ==========================================
  // CHAT ACTIONS
  // ==========================================
  const sendMessage = (requestId, text) => {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };

    setChats(prev => prev.map(c => {
      if (c.requestId === requestId) {
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    }));
  };

  // Edit current user's profile details (CRUD skills)
  const updateProfile = (data) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        name: data.name || prev.name,
        title: data.title || prev.title,
        bio: data.bio || prev.bio,
        skillsTeach: data.skillsTeach || prev.skillsTeach,
        skillsLearn: data.skillsLearn || prev.skillsLearn
      };
      
      // Update registered users database too
      setUsers(uList => uList.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
    toast.success('👤 Profile updated successfully!', { theme: 'dark' });
  };

  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleTheme,
      currentUser,
      users,
      requests,
      chats,
      sessionLogs,
      loginUser,
      signupUser,
      logoutUser,
      sendExchangeRequest,
      updateRequestStatus,
      toggleMilestone,
      editExchangeRequest,
      cancelExchangeRequest,
      submitExchangeRating,
      logSession,
      approveSessionLog,
      rejectSessionLog,
      approveMilestone,
      rejectMilestone,
      sendMessage,
      updateProfile,
      addXP
    }}>
      {children}
    </AppContext.Provider>
  );
};
