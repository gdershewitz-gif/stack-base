import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" id="newsletter">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info" style={{ textAlign: 'center', margin: '0 auto' }}>
            <h3 className="footer-logo">StackBase</h3>
            <p className="footer-tagline">The AI toolkit for business & marketing students</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StackBase. Built for students.</p>
        </div>
      </div>
    </footer>
  );
};
