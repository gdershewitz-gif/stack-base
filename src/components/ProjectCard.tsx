import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Linkedin, Link as LinkIcon, MessageCircle, FileText, Video, ExternalLink, ChevronUp } from 'lucide-react';
import type { Project } from '../data/projects';
import { supabase } from '../lib/supabase';
import { Card } from './Card';
import { Tag } from './Tag';
import { Avatar } from './Avatar';
import './ProjectCard.css';

export const ProjectCard: React.FC<{ project: Project }> = React.memo(({ project }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(project.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('stagone_upvotes') || '[]');
    if (list.includes(project.id)) {
      setHasUpvoted(true);
    }
    setUpvotes(project.upvotes || 0);
  }, [project.id, project.upvotes]);

  const handleUpvoteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    const list = JSON.parse(localStorage.getItem('stagone_upvotes') || '[]');

    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
      const filteredList = list.filter((id: string) => id !== project.id);
      localStorage.setItem('stagone_upvotes', JSON.stringify(filteredList));
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      if (!list.includes(project.id)) {
        list.push(project.id);
        localStorage.setItem('stagone_upvotes', JSON.stringify(list));
      }
    }

    const { data: current } = await supabase.from('projects').select('upvotes').eq('id', project.id).single();
    if (current) {
      const finalCount = hasUpvoted ? current.upvotes - 1 : current.upvotes + 1;
      await supabase.from('projects').update({ upvotes: Math.max(0, finalCount) }).eq('id', project.id);
    }
  };

  const getSocialPlatform = (url?: string) => {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('instagram.com')) return { name: 'Instagram', icon: Instagram };
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return { name: 'YouTube', icon: Youtube };
    if (lowerUrl.includes('tiktok.com')) return { name: 'TikTok', icon: Video };
    if (lowerUrl.includes('linkedin.com')) return { name: 'LinkedIn', icon: Linkedin };
    if (lowerUrl.includes('discord.gg') || lowerUrl.includes('discord.com')) return { name: 'Discord', icon: MessageCircle };
    if (lowerUrl.includes('form') || lowerUrl.includes('typeform') || lowerUrl.includes('tally')) return { name: 'Application', icon: FileText };
    return { name: 'Social', icon: LinkIcon };
  };

  const tags = project.tags || [];
  const socialPlat = getSocialPlatform(project.socialUrl);

  return (
    <Card 
      hoverable 
      padding="none"
      className={`project-card-v2 ${project.featured ? 'featured' : ''}`}
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="pc2-header">
        <div className="pc2-title-group">
          <Avatar 
            src={project.coverImageUrl} 
            name={project.name} 
            size="md" 
            variant="project" 
            category={project.category} 
          />
          <h3 className="pc2-title">{project.name}</h3>
        </div>
      </div>

      <div className="pc2-cat-tags-container">
        {project.featured && (
          <Tag variant="default" value="Featured" className="pc2-featured-badge" />
        )}
        <Tag variant="category" value={project.category} />
      </div>

      <div className="pc2-founder">
        <strong>{project.founderName}</strong> 
        {(project.gradeOrAge?.trim() || project.schoolName?.trim()) && (
          <span className="text-muted ml-2">
            ({[project.gradeOrAge?.trim(), project.schoolName?.trim()].filter(Boolean).join(', ')})
          </span>
        )}
      </div>

      <p className="pc2-desc">{project.longDescription || project.shortDescription}</p>

      {project.recruiting && project.rolesNeeded && project.rolesNeeded.length > 0 && (
        <div className="pc2-roles-section">
          <span className="pc2-section-label">Looking for:</span>
          <div className="pc2-roles-list">
            {project.rolesNeeded.map((role, idx) => (
              <Tag key={role} variant="role" value={role} colorIndex={idx} />
            ))}
          </div>
        </div>
      )}

      <div className="pc2-tags-section">
        {tags.map(tag => (
          <Tag key={tag} variant="category" value={tag} />
        ))}
      </div>

      <div className="pc2-footer">
        <div className="pc2-action-bar">
          <button 
            className={`pc2-upvote-toggle ${hasUpvoted ? 'upvoted' : ''} ${isBouncing ? 'bounce' : ''}`}
            onClick={handleUpvoteToggle}
          >
            <div className="upvote-toggle-left">
              <ChevronUp size={18} strokeWidth={hasUpvoted ? 3 : 2} />
              <span>{hasUpvoted ? 'Upvoted' : 'Upvote'}</span>
            </div>
            <div className="upvote-toggle-badge">
              {upvotes}
            </div>
          </button>

          {(project.demoUrl || project.socialUrl) && (
            <div className="pc2-links-row">
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="pc2-social-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} /> Website
                </a>
              )}
              {socialPlat && project.socialUrl && (
                <a 
                  href={project.socialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="pc2-social-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <socialPlat.icon size={14} /> {socialPlat.name}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
