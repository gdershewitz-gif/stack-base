import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tool } from '../data/tools';
import { mapDbToTool } from '../data/tools';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ToolCard } from '../components/ToolCard';
import './ToolDetail.css';

export const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTool = async () => {
      setIsLoading(true);
      if (!id) return;

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (data && !error) {
        const fetchedTool = mapDbToTool(data);
        setTool(fetchedTool);

        // Fetch related tools
        const { data: relatedData } = await supabase
          .from('tools')
          .select('*')
          .eq('category', fetchedTool.category)
          .eq('status', 'approved')
          .neq('id', id)
          .limit(3);

        if (relatedData) {
          setRelatedTools(relatedData.map(mapDbToTool));
        }
      } else {
        console.error('Error fetching tool details:', error);
      }
      setIsLoading(false);
    };

    fetchTool();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '120px 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <h2>Tool not found</h2>
        <p>Sorry, we couldn't find the tool you're looking for. It may have been removed or is still pending review.</p>
        <Link to="/browse">
          <Button variant="primary" style={{ marginTop: '20px' }}>Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="tool-detail-page container">
      <Link to="/browse" className="back-link">
        <ArrowLeft size={16} /> Back to all tools
      </Link>

      <div className="tool-content-grid">
        {/* Main Content */}
        <div className="tool-main">
          <div className="tool-hero-header">
            <div className="tool-hero-icon">
              {tool.name.charAt(0)}
            </div>
            <div className="tool-hero-info">
              <h1>{tool.name}</h1>
              <div className="tool-meta-tags">
                <span className="tool-cat-tag">{tool.category}</span>
                <Badge model={tool.pricing} />
                <div className="tool-stars-tag">
                  <Star size={16} className="star-filled" />
                  <span>{tool.starRating}.0 Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tool-about-section">
            <h2>About {tool.name}</h2>
            <p className="tool-long-desc">{tool.longDescription}</p>
            
            <div className="tool-features">
              <h3>Why students love it</h3>
              <ul>
                <li><CheckCircle2 size={18} className="text-primary" /> Helps save hours of manual work</li>
                <li><CheckCircle2 size={18} className="text-primary" /> Easy to use interface</li>
                <li><CheckCircle2 size={18} className="text-primary" /> Great value for students</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="tool-sidebar">
          <div className="action-card">
            <h3>Ready to try it?</h3>
            <p>{tool.shortDescription}</p>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" fullWidth className="visit-btn">
                Visit Website <ExternalLink size={18} className="ml-2" />
              </Button>
            </a>
            <div className="date-added">
              Added: {new Date(tool.dateAdded).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="related-tools-section">
          <h2>Similar Tools in {tool.category}</h2>
          <div className="tools-grid">
            {relatedTools.map(t => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
