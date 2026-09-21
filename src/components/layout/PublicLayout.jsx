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
      <div className="pub-layout-actions">
        <ThemeToggle />
        <div className="pub-layout-buttons">
          <Link to="/login" className="btn btn-secondary pub-layout-style-7">
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary pub-layout-style-8 pub-signup-btn">
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