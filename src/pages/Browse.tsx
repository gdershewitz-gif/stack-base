import React, { useState, useEffect } from 'react';
import { Search, Loader2, Users, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { Category, Project } from '../data/projects';
import { mapDbToProject, ROLES_AVAILABLE } from '../data/projects';
import { supabase } from '../lib/supabase';
import './Browse.css';

export const Browse: React.FC = () => {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [recruitingOnly, setRecruitingOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'upvotes' | 'newest' | 'recruiting'>('upvotes');
  
  const [activeSidebarTab, setActiveSidebarTab] = useState<'Category' | 'Roles'>('Category');

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCategories, selectedRoles, recruitingOnly, activeTab]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (page === 0) setIsLoading(true);
      else setIsLoadingMore(true);
      
      let query = supabase
        .from('projects')
        .select('id, name, short_description, category, demo_url, social_url, recruiting, roles_needed, founder_name, school_name, grade_or_age, upvotes, featured, status, date_added, cover_image_url', { count: 'exact' })
        .eq('status', 'approved');

      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories);
      }

      if (selectedRoles.length > 0) {
        query = query.overlaps('roles_needed', selectedRoles);
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

      const { data, error, count } = await query;
        
      if (data && !error) {
        const mapped = data.map(mapDbToProject);
        if (page === 0) {
          setProjectsData(mapped);
          setTotalCount(count);
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
  }, [searchQuery, selectedCategories, selectedRoles, recruitingOnly, activeTab, page]);

  const categoriesList: Category[] = [
    'App or Website', 
    'Business or Brand', 
    'Nonprofit', 
    'Product or Ecommerce', 
    'Newsletter or Blog',
    'Side Hustle', 
    'Other'
  ];

  const handleCategoryToggle = (cat: Category) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedRoles([]);
    setRecruitingOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="browse-page container">
      <SEO
        title="Browse Student Projects | FoundrBoard"
        description="Explore startups, apps, and businesses built by student founders. Filter by category, search by name, and discover projects that are actively recruiting."
        canonicalUrl="https://foundrboard.com/browse"
      />
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
          <Card padding="md" className="filters-card">
            <div className="filters-header">
              <div className="filters-header-title">
                <h3><SlidersHorizontal size={18} /> Filters</h3>
                <span className="results-count">
                  {totalCount !== null ? `${totalCount} results` : '...'}
                </span>
              </div>
              <button className="reset-filters-btn" onClick={resetFilters} aria-label="Reset Filters">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
            
            <div className="filter-group">
              <label className="checkbox-label recruiting-toggle">
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

            <div className="sidebar-tabs">
              <button 
                className={`sidebar-tab ${activeSidebarTab === 'Category' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Category')}
              >
                Category
              </button>
              <button 
                className={`sidebar-tab ${activeSidebarTab === 'Roles' ? 'active' : ''}`}
                onClick={() => setActiveSidebarTab('Roles')}
              >
                Looking for
              </button>
            </div>

            {activeSidebarTab === 'Category' && (
              <div className="filter-group">
                <div className="filter-section-header">Top Categories</div>
                <div className="checkbox-list">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeSidebarTab === 'Roles' && (
              <div className="filter-group">
                <div className="filter-section-header">Common Roles</div>
                <div className="checkbox-list">
                  {ROLES_AVAILABLE.map((role) => (
                    <label key={role} className="checkbox-label">
                      <input 
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
          </Card>
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
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                  <Button 
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLoadingMore}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isLoadingMore ? <Loader2 className="animate-spin" size={18} /> : null}
                    {isLoadingMore ? 'Loading...' : 'Load More Projects'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card padding="lg" className="no-results" style={{ textAlign: 'center' }}>
              <h3>No projects found</h3>
              <p className="text-muted mt-2">Try adjusting your search or filters.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
