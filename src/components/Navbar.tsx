import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Menu, X, Rocket } from 'lucide-react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Flame className="logo-icon" size={28} />
          <span>StageOne</span>
        </Link>
        
        <div className="navbar-links desktop-only">
          <Link to="/browse">Browse Projects</Link>
          <Link to="/admin">Admin</Link>
        </div>
        
        <div className="navbar-actions desktop-only">
          <Link to="/submit" className="submit-btn" style={{ marginLeft: 'auto' }}>
            <Rocket size={18} /> 
            Submit Your Project
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-links">
            <Link to="/browse" onClick={toggleMenu}>Browse Projects</Link>
            <Link to="/admin" onClick={toggleMenu}>Admin</Link>
            <Link to="/submit" className="mobile-submit" onClick={toggleMenu}>Submit Your Project</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
