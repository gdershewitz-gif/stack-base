import React from 'react';
import { Button } from './Button';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container" id="newsletter">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-logo">StackBase</h3>
            <p className="footer-tagline">The AI toolkit for business & marketing students</p>
          </div>
          
          <div className="footer-newsletter">
            <h4>Join the Newsletter</h4>
            <p>Get the latest AI tools and growth tactics delivered to your inbox.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="student@university.edu" required className="newsletter-input" />
              <Button type="submit" variant="primary">Subscribe</Button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} StackBase. Built for students.</p>
        </div>
      </div>
    </footer>
  );
};
