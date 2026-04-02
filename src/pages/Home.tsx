import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
import type { Category, Project } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { supabase } from '../lib/supabase';
import './Home.css';

const CATEGORIES: { label: string; value: Category | 'All' }[] = [
  { label: 'All Projects', value: 'All' },
  { label: 'App or Website', value: 'App or Website' },
  { label: 'Business or Brand', value: 'Business or Brand' },
  { label: 'Nonprofit', value: 'Nonprofit' },
  { label: 'Product or Ecommerce', value: 'Product or Ecommerce' },
  { label: 'Side Hustle', value: 'Side Hustle' },
  { label: 'Newsletter or Blog', value: 'Newsletter or Blog' },
  { label: 'Other', value: 'Other' }
];

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .order('upvotes', { ascending: false })
        .order('date_added', { ascending: false });
        
      if (data && !error) {
        setProjectsData(data.map(mapDbToProject));
      } else if (error) {
        console.error('Error fetching projects:', error);
      }

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { data: trendingData } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .gte('date_added', oneWeekAgo.toISOString())
        .order('upvotes', { ascending: false })
        .limit(5);
        
      if (trendingData) {
        setTrendingProjects(trendingData.map(mapDbToProject));
      }

      setIsLoading(false);
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = projectsData.filter(proj => {
    if (activeCategory === 'All') return true;
    return proj.category === activeCategory;
  });

  // Calculate dynamic stats from actual data
  const totalFounders = useMemo(() => new Set(projectsData.map(p => p.founderName)).size, [projectsData]);
  const openRoles = useMemo(() => projectsData.reduce((acc, p) => p.recruiting && p.rolesNeeded ? acc + p.rolesNeeded.length : acc, 0), [projectsData]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <Badge />
          <h1 className="hero-title">
            The Premier Platform for <span className="text-primary">Young Founders</span>
          </h1>
          <p className="hero-subtitle">
            A community for the next generation of founders — share your project, inspire others, and find your team.
          </p>
          <div className="hero-cta-group">
            <Link to="/browse">
              <Button size="lg" className="hero-btn">
                Browse Projects <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/submit">
              <Button variant="outline" size="lg">Submit Your Project</Button>
            </Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">{isLoading ? '...' : projectsData.length}</div>
              <div className="stat-label">Projects Listed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{isLoading ? '...' : totalFounders}</div>
              <div className="stat-label">Founders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{isLoading ? '...' : openRoles}</div>
              <div className="stat-label">Open Roles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      {trendingProjects.length > 0 && (
        <section className="trending-section container">
          <div className="trending-header">
            <h2>🔥 Trending This Week</h2>
            <p>The highest upvoted projects submitted in the last 7 days.</p>
          </div>
          
          <div className="trending-horizontal-scroll">
            {trendingProjects.map(proj => (
              <div key={proj.id} className="trending-card-wrapper">
                <ProjectCard project={proj} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid Section */}
      <section className="tools-section container">
        <div className="tools-header">
          <h2>All Student Projects</h2>
          <p>Discover what other students are building right now.</p>
        </div>

        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.value}
              className={`filter-pill ${activeCategory === cat.value ? 'active' : ''}`}
              data-active-cat={cat.value}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="empty-state">
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="tools-grid">
            {filteredProjects.map(proj => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No projects found in this category.</p>
            <Button variant="outline" onClick={() => setActiveCategory('All')}>View All Projects</Button>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bottom-cta-section container">
        <div className="bottom-cta-box">
          <div className="bottom-cta-content">
            <h2>Are you building something?</h2>
            <p>Share your startup, app, or side hustle with a community of student builders.</p>
          </div>
          <Link to="/submit">
            <Button size="lg" className="submit-btn-cta">Submit Your Project</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const Badge = () => (
  <div className="hero-badge">
    <Users size={14} className="hero-badge-icon" />
    <span>Join the #1 Student Founder Community</span>
  </div>
);
