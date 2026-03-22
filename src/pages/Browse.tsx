import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { ToolCard } from '../components/ToolCard';
import type { Category, PricingModel, Tool } from '../data/tools';
import { mapDbToTool } from '../data/tools';
import { supabase } from '../lib/supabase';
import './Browse.css';

export const Browse: React.FC = () => {
  const [toolsData, setToolsData] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'All'>('All');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('status', 'approved')
        .order('date_added', { ascending: false });
        
      if (data && !error) {
        setToolsData(data.map(mapDbToTool));
      } else if (error) {
        console.error('Error fetching tools:', error);
      }
      setIsLoading(false);
    };
    
    fetchTools();
  }, []);

  const categories: (Category | 'All')[] = ['All', 'Writing & Copy', 'Research', 'Design & Decks', 'Analytics', 'Cold Outreach', 'Productivity', 'Video & Media', 'Social Media', 'Other'];
  const pricingModels: (PricingModel | 'All')[] = ['All', 'Free', 'Freemium', 'Paid'];

  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        tool.name.toLowerCase().includes(query) || 
        tool.shortDescription.toLowerCase().includes(query) ||
        (tool.longDescription && tool.longDescription.toLowerCase().includes(query)) ||
        tool.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing;
      const matchesRating = tool.starRating >= minRating;
      
      return matchesSearch && matchesCategory && matchesPricing && matchesRating;
    });
  }, [toolsData, searchQuery, selectedCategory, selectedPricing, minRating]);

  return (
    <div className="browse-page container">
      <div className="browse-header">
        <h1>Browse All AI Tools</h1>
        <p>Discover the best AI tools to boost your productivity and get better grades.</p>
        
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or description..." 
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
            <h4>Category</h4>
            <div className="filter-options">
              {categories.map((cat) => (
                <label key={cat} className="filter-label">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat} 
                    onChange={() => setSelectedCategory(cat)} 
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h4>Pricing</h4>
            <div className="filter-options">
              {pricingModels.map((price) => (
                <label key={price} className="filter-label">
                  <input 
                    type="radio" 
                    name="pricing" 
                    checked={selectedPricing === price} 
                    onChange={() => setSelectedPricing(price)} 
                  />
                  <span>{price}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <h4>Minimum Rating</h4>
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rating-select"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={5}>5 Stars purely</option>
            </select>
          </div>
          
          <button 
            className="reset-btn"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedPricing('All');
              setMinRating(0);
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
              <p>Loading tools database...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <span>Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}</span>
              </div>

              {filteredTools.length > 0 ? (
                <div className="tools-grid">
                  {filteredTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <h3>No tools found</h3>
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
