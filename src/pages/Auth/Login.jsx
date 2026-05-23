import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import './Login.css';
const Login = () => {
  const {
    loginUser,
    users
  } = useContext(AppContext);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const handleLoginSubmit = e => {
    e.preventDefault();
    if (!users || users.length === 0) {
      toast.info('💡 No registered accounts found in LocalStorage. Please create an account first!', {
        theme: 'dark'
      });
      return;
    }
    loginUser(loginEmail, loginPassword);
  };
  return <div className="login-style-1">
      <div className="glow-sphere login-style-2"></div>
      <div className="glow-sphere login-style-3"></div>

      {/* Main Glass Card Form */}
      <div className="glass-panel auth-card">
        
        {/* Brand Logo Header */}
        <div className="login-style-4">
          <div className="login-style-5">
            <Zap size={24} color="#fff" />
          </div>
          <h2 className="login-style-6">
            Welcome Back
          </h2>
          <span className="text-gradient login-style-7">
            Login to SkillSwap
          </span>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="auth-input-container">
            <Mail className="auth-input-icon" size={18} />
            <input type="email" className="form-input auth-input" placeholder="Account Email Address" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
          </div>

          <div className="auth-input-container login-style-8">
            <Lock className="auth-input-icon" size={18} />
            <input type="password" className="form-input auth-input" placeholder="Account Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary login-style-9">
            Access Account <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-style-10">
          Don't have an account? <Link to="/signup" className="text-gradient login-style-11">Sign Up</Link>
        </div>
      </div>
    </div>;
};
export default Login;
