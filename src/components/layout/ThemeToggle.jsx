import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useContext(AppContext);

  return (
    <button 
      className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`} 
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="toggle-thumb">
        {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
      </div>
    </button>
  );
};

export default ThemeToggle;
