import React from 'react';
import './ProjectCardSkeleton.css';

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="project-card-skeleton">
      <div className="pcs-header">
        <div className="pcs-title-group">
          <div className="pcs-thumbnail pulse"></div>
          <div className="pcs-title pulse"></div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <div className="pcs-badge pulse"></div>
      </div>
      
      <div className="pcs-founder pulse"></div>
      
      <div className="pcs-desc">
        <div className="pcs-line pulse" style={{ width: '100%' }}></div>
        <div className="pcs-line pulse" style={{ width: '95%' }}></div>
        <div className="pcs-line pulse" style={{ width: '85%' }}></div>
        <div className="pcs-line pulse" style={{ width: '40%' }}></div>
      </div>
      
      <div className="pcs-tags-section">
        <div className="pcs-tag pulse"></div>
        <div className="pcs-tag pulse" style={{ width: '60px' }}></div>
        <div className="pcs-tag pulse" style={{ width: '90px' }}></div>
      </div>
      
      <div className="pcs-footer">
        <div className="pcs-upvote pulse"></div>
        <div className="pcs-links">
          <div className="pcs-link pulse"></div>
        </div>
      </div>
    </div>
  );
};
