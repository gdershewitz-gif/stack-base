import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" id="newsletter">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info" style={{ textAlign: 'center', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <img src="/logo.png" alt="FoundrBoard" style={{ width: '28px', height: '28px', borderRadius: '7px', display: 'block' }} />
              <h3 className="footer-logo" style={{ margin: 0 }}>FoundrBoard</h3>
            </div>
            <p className="footer-tagline">Where student founders share what they built — and find their team.</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FoundrBoard. Built by students, for students.</p>
        </div>
      </div>
    </footer>
  );
};
