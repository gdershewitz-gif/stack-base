import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { ToolCard } from '../components/ToolCard';
import { toolsData } from '../data/tools';
import type { Category } from '../data/tools';
import './Home.css';

const CATEGORIES: { label: string; value: Category | 'All' }[] = [
  { label: 'All Tools', value: 'All' },
  { label: 'Writing & Copy', value: 'Writing & Copy' },
  { label: 'Research', value: 'Research' },
  { label: 'Design & Decks', value: 'Design & Decks' },
  { label: 'Analytics', value: 'Analytics' },
  { label: 'Cold Outreach', value: 'Cold Outreach' }
];

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const filteredTools = toolsData.filter(tool => {
    if (activeCategory === 'All') return true;
    return tool.category === activeCategory;
  });

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <Badge />
          <h1 className="hero-title">
            Find The <span className="text-primary">Exact AI Tool</span> Your Business Needs, In Seconds.
          </h1>
          <p className="hero-subtitle">
            300+ AI tools for online business. Searchable, rated, and updated weekly by operators who actually use them.
          </p>
          <div className="hero-cta-group">
            <Link to="/browse">
              <Button size="lg" className="hero-btn">
                Browse All Tools <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" size="lg">Submit a Tool</Button>
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{toolsData.length}+</div>
              <div className="stat-label">Tools Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">9</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12k</div>
              <div className="stat-label">Monthly Visitors</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Weekly</div>
              <div className="stat-label">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="tools-section container">
        <div className="tools-header">
          <h2>Featured AI Tools</h2>
          <p>The most popular tools right now.</p>
        </div>

        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.value}
              className={`filter-pill ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredTools.length > 0 ? (
          <div className="tools-grid">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No tools found in this category.</p>
            <Button variant="outline" onClick={() => setActiveCategory('All')}>View All Tools</Button>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bottom-cta-section container">
        <div className="bottom-cta-box">
          <div className="bottom-cta-content">
            <h2>Know a tool we're missing?</h2>
            <p>Help other students discover the best AI tools by submitting your favorites.</p>
          </div>
          <Link to="/submit">
            <Button size="lg" className="submit-btn-cta">Submit it here</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const Badge = () => (
  <div className="hero-badge">
    <Zap size={14} className="hero-badge-icon" />
    <span>Updated for Spring 2026</span>
  </div>
);
