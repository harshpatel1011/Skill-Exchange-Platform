import React, { useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Compass, GitPullRequest, BarChart3, MessageSquare, Award, Zap, LogOut } from 'lucide-react';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const navStyle = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '12px',
  gap: '12px',
  color: 'var(--text-secondary)',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  width: '100%',
  textDecoration: 'none'
};
const Layout = ({
  children
}) => {
  const {
    currentUser,
    requests,
    logoutUser
  } = useContext(AppContext);
  const location = useLocation();
  const hideFooterRoutes = ['/requests', '/chat', '/profile', '/dashboard'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  if (!currentUser) return null;

  // Calculate pending incoming requests count for badge
  const pendingCount = requests.filter(req => req.receiverId === currentUser.id && req.status === 'pending').length;
  return <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <Link to="/" className="layout-style-1">
          <div className="layout-style-2">
            <div className="layout-style-3">
              <Zap size={20} color="#fff" />
            </div>
            <div className="layout-style-4">
              <h2 className="logo-text layout-style-5">
                SkillSwap
              </h2>
              <span className="logo-text text-gradient layout-style-6">
                Exchange Hub
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="layout-style-7">
          <NavLink to="/dashboard" className={({
          isActive
        }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={navStyle}>
            <BarChart3 size={18} />
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink to="/explore" className={({
          isActive
        }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={navStyle}>
            <Compass size={18} />
            <span className="nav-text">Explore Skills</span>
          </NavLink>

          <NavLink to="/requests" className={({
          isActive
        }) => `btn btn-secondary ${isActive ? 'active-nav' : ''} layout-style-8`} style={{
          ...navStyle
        }}>
            <GitPullRequest size={18} />
            <span className="nav-text">Requests</span>
            {pendingCount > 0 && <span className="badge-notification">{pendingCount}</span>}
          </NavLink>

          <NavLink to="/chat" className={({
          isActive
        }) => `btn btn-secondary ${isActive ? 'active-nav' : ''}`} style={navStyle}>
            <MessageSquare size={18} />
            <span className="nav-text">Chat Arena</span>
          </NavLink>

        </nav>

        {/* User Mini Profile Panel */}
        <div className="profile-details glass-panel layout-style-9">
          <Link to="/profile" className="profile-info-hover layout-style-10">
            <div className="layout-style-11">
              <div className="layout-style-12">
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="layout-style-13">
                <h4 className="layout-style-14">
                  {currentUser.name}
                </h4>
                <div className="layout-style-15">
                  <Award size={12} className="text-gradient" />
                  <span className="layout-style-16">
                    Lvl {currentUser.level}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Level progress bar */}
            <div className="layout-style-17">
              <div style={{
              width: `${currentUser.xp / currentUser.xpToNextLevel * 100}%`
            }} className="layout-style-18"></div>
            </div>
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />
            {/* Logout Button */}
            <button onClick={logoutUser} className="btn btn-secondary layout-style-19" style={{ margin: 0, flex: 1 }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
        {!shouldHideFooter && <Footer />}
      </main>
    </div>;
};
export default Layout;