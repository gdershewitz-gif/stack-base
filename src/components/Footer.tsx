import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" id="newsletter">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info" style={{ textAlign: 'center', margin: '0 auto' }}>
            <h3 className="footer-logo">StageOne</h3>
            <p className="footer-tagline">Where student founders share what they built — and find their team.</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StageOne. Built by students, for students.</p>
        </div>
      </div>
    </footer>
  );
};
