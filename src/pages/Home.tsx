import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import type { Category, Project } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { supabase } from '../lib/supabase';
import { getCache, setCache } from '../lib/cache';
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
  const [hiringProjects, setHiringProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const cached = getCache<Project[]>('home_projects');
      if (cached) {
        setProjectsData(cached);
        const hiring = cached.filter(p => p.recruiting).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        setHiringProjects(hiring);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, short_description, category, demo_url, social_url, recruiting, roles_needed, founder_name, school_name, grade_or_age, upvotes, featured, status, date_added, cover_image_url')
        .eq('status', 'approved')
        .order('upvotes', { ascending: false })
        .order('date_added', { ascending: false });
        
      if (data && !error) {
        const mappedData = data.map(mapDbToProject);
        setProjectsData(mappedData);
        
        // Projects that are hiring, sorted by upvotes descending
        const hiring = mappedData.filter(p => p.recruiting).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        setHiringProjects(hiring);
        
        setCache('home_projects', mappedData);
      } else if (error) {
        console.error('Error fetching projects:', error);
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

      {/* Hiring Section */}
      {hiringProjects.length > 0 && (
        <section className="trending-section container">
          <div className="trending-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users className="text-primary" size={28} /> Projects Hiring Now</h2>
            <p>Discover student projects that are actively recruiting and looking for teammates.</p>
          </div>
          
          <div className="trending-horizontal-scroll">
            {hiringProjects.map(proj => (
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
          <div className="tools-grid">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
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
