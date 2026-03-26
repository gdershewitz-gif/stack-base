import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from './Button';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar-container">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="navbar-logo">
            <Layers className="logo-icon text-primary" size={28} />
            <span className="logo-text">StageOne</span>
          </Link>
          
          <div className="navbar-links">
            <Link to="/browse" className="nav-link">Browse Projects</Link>
            <Link to="/submit">
              <Button variant="primary" size="sm">Submit Your Project</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
