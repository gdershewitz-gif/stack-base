import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, Users } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import type { Category, Project } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { supabase } from '../lib/supabase';
import './Browse.css';

export const Browse: React.FC = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'upvotes' | 'newest' | 'recruiting'>('upvotes');
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCategory, recruitingOnly, activeTab]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (page === 0) setIsLoading(true);
      else setIsLoadingMore(true);
      
      let query = supabase
        .from('projects')
        .select('id, name, short_description, category, demo_url, social_url, recruiting, roles_needed, founder_name, school_name, grade_or_age, upvotes, featured, status, date_added, cover_image_url')
        .eq('status', 'approved');

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      
      if (recruitingOnly || activeTab === 'recruiting') {
        query = query.eq('recruiting', true);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,founder_name.ilike.%${searchQuery}%`);
      }

      if (activeTab === 'newest') {
        query = query.order('date_added', { ascending: false });
      } else if (activeTab === 'recruiting') {
        query = query.order('date_added', { ascending: false });
      } else {
        query = query.order('upvotes', { ascending: false });
      }

      query = query.order('id', { ascending: false }); // stable pagination

      const from = page * 12;
      const to = from + 11;
      query = query.range(from, to);

      const { data, error } = await query;
        
      if (data && !error) {
        const mapped = data.map(mapDbToProject);
        if (page === 0) {
          setProjectsData(mapped);
        } else {
          setProjectsData(prev => [...prev, ...mapped]);
        }
        setHasMore(data.length === 12);
      } else if (error) {
        console.error('Error fetching projects:', error);
      }
      
      setIsLoading(false);
      setIsLoadingMore(false);
    };
    
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, recruitingOnly, activeTab, page]);

  const categories: (Category | 'All')[] = [
    'All', 
    'App or Website', 
    'Business or Brand', 
    'Nonprofit', 
    'Product or Ecommerce', 
    'Newsletter or Blog',
    'Side Hustle', 
    'Other'
  ];

  return (
    <div className="browse-page container">
      <div className="browse-header">
        <h1>Browse Student Projects</h1>
        <p>Discover startups, apps, and businesses built by students across the country.</p>
        
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by project name, description, founder..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="browse-layout">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3><SlidersHorizontal size={18} /> Filters</h3>
          </div>
          
          <div className="filter-group">
            <h4>Hiring Status</h4>
            <label className="filter-label" style={{ cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={recruitingOnly} 
                onChange={(e) => setRecruitingOnly(e.target.checked)} 
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} className="text-primary"/> Recruiting Now
              </span>
            </label>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  data-active-cat={cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="reset-btn"
            onClick={() => {
              setSelectedCategory('All');
              setRecruitingOnly(false);
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </aside>

        <div className="browse-results">
          <div className="results-header">
            <span>
              {isLoading && page === 0 ? 'Searching...' : `Showing results`}
            </span>
            <div className="sort-toggle">
              <button className={`sort-tab ${activeTab === 'upvotes' ? 'active' : ''}`} onClick={() => setActiveTab('upvotes')}>Most Upvoted</button>
              <button className={`sort-tab ${activeTab === 'newest' ? 'active' : ''}`} onClick={() => setActiveTab('newest')}>Newest</button>
              <button className={`sort-tab ${activeTab === 'recruiting' ? 'active' : ''}`} onClick={() => setActiveTab('recruiting')}>Recruiting Now</button>
            </div>
          </div>

          {isLoading && page === 0 ? (
            <div className="tools-grid">
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : projectsData.length > 0 ? (
            <>
              <div className="tools-grid">
                {projectsData.map(proj => (
                  <ProjectCard key={proj.id} project={proj} />
                ))}
              </div>
              
              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <button 
                    className="load-more-btn" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoadingMore}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '2px solid var(--border-color)',
                      fontWeight: 600,
                      cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLoadingMore ? <Loader2 className="animate-spin" size={18} /> : null}
                    {isLoadingMore ? 'Loading...' : 'Load More Projects'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <h3>No projects found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
