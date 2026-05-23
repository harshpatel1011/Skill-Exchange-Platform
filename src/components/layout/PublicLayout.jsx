import './PublicLayout.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
const PublicLayout = ({
  children
}) => <div className="pub-layout-style-1">
    <header className="glass-panel pub-layout-style-2">
      <div className="pub-layout-style-3">
        <div className="pub-layout-style-4">
          <Zap size={16} color="#fff" />
        </div>
        <h2 className="pub-layout-style-5">
          SkillSwap
        </h2>
      </div>
      <div className="pub-layout-style-6" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary pub-layout-style-7">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary pub-layout-style-8">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
    
    <main className="pub-layout-style-9">
      {children}
    </main>
    <Footer />
  </div>;
export default PublicLayout;