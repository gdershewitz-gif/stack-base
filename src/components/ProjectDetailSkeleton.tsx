import React from 'react';
import { Card } from './Card';
import './ProjectCardSkeleton.css';

export const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="project-detail-page container" style={{ opacity: 0.7 }}>
      <div className="skeleton-line" style={{ width: '140px', height: '20px', marginBottom: '24px' }} />

      <div className="project-content-grid">
        <div className="project-main">
          {/* Hero Header Skeleton */}
          <div className="project-hero-header" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="skeleton-avatar" style={{ width: '80px', height: '80px', borderRadius: '12px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="skeleton-line" style={{ width: '60%', height: '32px' }} />
              <div className="skeleton-line" style={{ width: '40%', height: '18px' }} />
            </div>
          </div>

          {/* About Section Skeleton */}
          <Card padding="md" className="project-about-section mt-8">
            <div className="skeleton-line" style={{ width: '30%', height: '24px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '95%', height: '16px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '80%', height: '16px' }} />
          </Card>

          {/* Founder Section Skeleton */}
          <Card padding="md" className="project-founder-section mt-8">
            <div className="skeleton-line" style={{ width: '25%', height: '24px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="skeleton-avatar" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton-line" style={{ width: '40%', height: '20px' }} />
                <div className="skeleton-line" style={{ width: '30%', height: '16px' }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="project-sidebar">
          <Card padding="md">
            <div className="skeleton-line" style={{ width: '80%', height: '20px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '56px', borderRadius: '12px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '40px', borderRadius: '8px' }} />
          </Card>
        </div>
      </div>
    </div>
  );
};
