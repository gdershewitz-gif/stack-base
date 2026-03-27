import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, Users } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import type { Category, Project } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { supabase } from '../lib/supabase';
import './Browse.css';

export const Browse: React.FC = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'upvotes' | 'newest' | 'recruiting'>('upvotes');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'approved')
        .order('date_added', { ascending: false });
        
      if (data && !error) {
        setProjectsData(data.map(mapDbToProject));
      } else if (error) {
        console.error('Error fetching projects:', error);
      }
      setIsLoading(false);
    };
    
    fetchProjects();
  }, []);

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

  const processedProjects = useMemo(() => {
    let result = projectsData.filter((proj) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        proj.name.toLowerCase().includes(query) || 
        proj.shortDescription.toLowerCase().includes(query) ||
        (proj.longDescription && proj.longDescription.toLowerCase().includes(query)) ||
        proj.category.toLowerCase().includes(query) ||
        proj.founderName.toLowerCase().includes(query);
        
      const matchesCategory = selectedCategory === 'All' || proj.category === selectedCategory;
      const matchesRecruiting = !recruitingOnly || proj.recruiting;
      
      return matchesSearch && matchesCategory && matchesRecruiting;
    });

    if (activeTab === 'recruiting') {
      result = result.filter(p => p.recruiting);
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (activeTab === 'newest') {
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else {
      result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    return result;
  }, [projectsData, searchQuery, selectedCategory, recruitingOnly, activeTab]);

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
        {/* Sidebar Filters */}
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

        {/* Results Area */}
        <div className="browse-results">
          {isLoading ? (
            <div className="no-results" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: 'none', background: 'transparent' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
              <p>Loading projects database...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <span>Showing {processedProjects.length} project{processedProjects.length !== 1 ? 's' : ''}</span>
                <div className="sort-toggle">
                  <button className={`sort-tab ${activeTab === 'upvotes' ? 'active' : ''}`} onClick={() => setActiveTab('upvotes')}>Most Upvoted</button>
                  <button className={`sort-tab ${activeTab === 'newest' ? 'active' : ''}`} onClick={() => setActiveTab('newest')}>Newest</button>
                  <button className={`sort-tab ${activeTab === 'recruiting' ? 'active' : ''}`} onClick={() => setActiveTab('recruiting')}>Recruiting Now</button>
                </div>
              </div>

              {processedProjects.length > 0 ? (
                <div className="tools-grid">
                  {processedProjects.map(proj => (
                    <ProjectCard key={proj.id} project={proj} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <h3>No projects found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
