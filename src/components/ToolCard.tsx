import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Tool } from '../data/tools';
import { Badge } from './Badge';
import { Button } from './Button';
import './ToolCard.css';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="tool-card transition-all">
      <div className="tool-card-header">
        <div className="tool-card-title-group">
          {/* Mockicon since we don't have real images uploaded yet, 
              we can just use first letter of the name as a placeholder icon */}
          <div className="tool-icon">
            {tool.name.charAt(0)}
          </div>
          <div>
            <h3 className="tool-name">{tool.name}</h3>
            <div className="tool-rating">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < tool.starRating ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
          </div>
        </div>
        <Badge model={tool.pricing} />
      </div>
      
      <p className="tool-description">{tool.shortDescription}</p>
      
      <div className="tool-card-footer">
        <span className="tool-category">{tool.category}</span>
        <div className="tool-card-actions">
          <Link to={`/tool/${tool.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">Visit Site</Button>
          </a>
        </div>
      </div>
    </div>
  );
};
