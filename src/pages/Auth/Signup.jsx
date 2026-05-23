import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Zap, Mail, Lock, User, Bookmark, ArrowRight } from 'lucide-react';
import './Signup.css';
const Signup = () => {
  const {
    signupUser
  } = useContext(AppContext);
  const [signupName, setSignupName] = useState('');
  const [signupTitle, setSignupTitle] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTeach, setSignupTeach] = useState('');
  const [signupLearn, setSignupLearn] = useState('');
  const handleSignupSubmit = e => {
    e.preventDefault();

    // Parse skills from comma-separated inputs
    const skillsTeach = signupTeach.split(',').map(s => s.trim()).filter(Boolean);
    const skillsLearn = signupLearn.split(',').map(s => s.trim()).filter(Boolean);
    signupUser({
      name: signupName,
      title: signupTitle,
      email: signupEmail,
      password: signupPassword,
      skillsTeach: skillsTeach.length > 0 ? skillsTeach : ['Web Design'],
      skillsLearn: skillsLearn.length > 0 ? skillsLearn : ['Coding']
    });
  };
  return <div className="signup-style-1">
      {/* Futuristic Background Glowing Spheres */}
      <div className="glow-sphere signup-style-2"></div>
      <div className="glow-sphere signup-style-3"></div>

      {/* Main Glass Card Form */}
      <div className="glass-panel auth-card">
        
        {/* Brand Logo Header */}
        <div className="signup-style-4">
          <div className="signup-style-5">
            <Zap size={24} color="#fff" />
          </div>
          <h2 className="signup-style-6">
            Join SkillSwap
          </h2>
          <span className="text-gradient signup-style-7">
            Create Your Account
          </span>
        </div>

        <form onSubmit={handleSignupSubmit}>
          <div className="auth-input-container">
            <User className="auth-input-icon" size={18} />
            <input type="text" className="form-input auth-input" placeholder="Full Name (e.g. Liam Vance)" value={signupName} onChange={e => setSignupName(e.target.value)} required />
          </div>

          <div className="auth-input-container">
            <Bookmark className="auth-input-icon" size={18} />
            <input type="text" className="form-input auth-input" placeholder="Professional Tag (e.g. English Lecturer)" value={signupTitle} onChange={e => setSignupTitle(e.target.value)} required />
          </div>

          <div className="auth-input-container">
            <Mail className="auth-input-icon" size={18} />
            <input type="email" className="form-input auth-input" placeholder="Email Address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
          </div>

          <div className="auth-input-container signup-style-8">
            <Lock className="auth-input-icon" size={18} />
            <input type="password" className="form-input auth-input" placeholder="Choose Secure Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required />
          </div>

          <div className="form-group signup-style-9">
            <label className="form-label signup-style-10">Skills I Can Teach (comma separated):</label>
            <input type="text" className="form-input" placeholder="e.g. English Speaking, Creative Writing" value={signupTeach} onChange={e => setSignupTeach(e.target.value)} required />
          </div>

          <div className="form-group signup-style-11">
            <label className="form-label signup-style-12">Skills I Want to Learn (comma separated):</label>
            <input type="text" className="form-input" placeholder="e.g. React JS, Figma (UI/UX)" value={signupLearn} onChange={e => setSignupLearn(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary signup-style-13">
            Register & Begin Swapping <ArrowRight size={18} />
          </button>
        </form>

        <div className="signup-style-14">
          Already have an account? <Link to="/login" className="text-gradient signup-style-15">Log In</Link>
        </div>
      </div>
    </div>;
};
export default Signup;
