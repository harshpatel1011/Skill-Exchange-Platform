import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Globe, Hash, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Zap size={18} color="#fff" />
            </div>
            <h2>SkillSwap</h2>
          </div>
          <p className="footer-description">
            The ultimate community learning exchange. Teach what you know, learn what you don't.
            No money involved, just pure knowledge sharing.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" title="Community Chat"><MessageCircle size={18} /></a>
            <a href="#" className="social-icon" title="Website"><Globe size={18} /></a>
            <a href="#" className="social-icon" title="Socials"><Hash size={18} /></a>
            <a href="#" className="social-icon" title="Contact Us"><Mail size={18} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <div className="footer-links-col">
            <h3>Platform</h3>
            <Link to="/explore">Explore Skills</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/requests">Swap Contracts</Link>
            <Link to="/chat">Messages</Link>
          </div>
          
          <div className="footer-links-col">
            <h3>Resources</h3>
            <Link to="/">How it Works</Link>
            <Link to="/">Success Stories</Link>
            <Link to="/">Community Guidelines</Link>
            <Link to="/">Help Center</Link>
          </div>
          
          <div className="footer-links-col">
            <h3>Company</h3>
            <Link to="/">About Us</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SkillSwap Inc. All rights reserved.</p>
        <div className="footer-bottom-links">
          <span>Made with ❤️ for lifelong learners</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
