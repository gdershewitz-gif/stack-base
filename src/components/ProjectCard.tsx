import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Youtube, Linkedin, Link as LinkIcon, MessageCircle, FileText, Video, ExternalLink, ChevronUp } from 'lucide-react';
import type { Project } from '../data/projects';
import { supabase } from '../lib/supabase';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(project.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const getKeywords = (desc: string, category: string) => {
    const keywords = new Set<string>();
    keywords.add(category);
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('ai ') || lowerDesc.includes('artificial intelligence') || lowerDesc.includes('gpt')) keywords.add('AI');
    if (lowerDesc.includes('market') || lowerDesc.includes('seo') || lowerDesc.includes('grow')) keywords.add('Marketing');
    if (lowerDesc.includes('tech') || lowerDesc.includes('software') || lowerDesc.includes('app') || lowerDesc.includes('code')) keywords.add('Tech');
    if (lowerDesc.includes('business') || lowerDesc.includes('startup') || lowerDesc.includes('founder') || lowerDesc.includes('hustle')) keywords.add('Business');
    if (lowerDesc.includes('data') || lowerDesc.includes('analytic')) keywords.add('Data');
    if (lowerDesc.includes('design') || lowerDesc.includes('creative') || lowerDesc.includes('art')) keywords.add('Design');
    if (lowerDesc.includes('social media') || lowerDesc.includes('instagram') || lowerDesc.includes('tiktok')) keywords.add('Social Media');
    if (lowerDesc.includes('sustainabl') || lowerDesc.includes('eco') || lowerDesc.includes('green') || lowerDesc.includes('plastic')) keywords.add('Sustainability');
    if (lowerDesc.includes('health') || lowerDesc.includes('mental') || lowerDesc.includes('wellness') || lowerDesc.includes('support')) keywords.add('Health & Wellness');
    if (lowerDesc.includes('tutor') || lowerDesc.includes('learn') || lowerDesc.includes('student') || lowerDesc.includes('school')) keywords.add('Education');
    return Array.from(keywords).slice(0, 4);
  };

  const getMappedCategory = (tag: string) => {
    const t = tag.toLowerCase();
    if (['app or website', 'tech', 'ai', 'design'].includes(t)) return 'App or Website';
    if (['business or brand', 'business', 'marketing'].includes(t)) return 'Business or Brand';
    if (['nonprofit', 'education', 'community'].includes(t)) return 'Nonprofit';
    if (['product or ecommerce', 'ecommerce'].includes(t)) return 'Product or Ecommerce';
    if (['side hustle', 'freelance'].includes(t)) return 'Side Hustle';
    return 'Other';
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

  const tags = getKeywords(project.longDescription || project.shortDescription, project.category);
  const socialPlat = getSocialPlatform(project.socialUrl);

  return (
    <div 
      className={`project-card-v2 ${project.featured ? 'featured' : ''}`}
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="pc2-header">
        <div className="pc2-title-group">
          <div className="pc2-thumbnail-container">
            {project.coverImageUrl && !imageError ? (
              <img 
                src={project.coverImageUrl} 
                alt={`${project.name} logo`} 
                className="pc2-thumbnail-image" 
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="pc2-thumbnail-placeholder" data-category={project.category}>
                {project.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="pc2-title">{project.name}</h3>
        </div>
        <span className="pc2-cat-badge" data-category={project.category}>
          {project.category}
        </span>
      </div>

      <div className="pc2-founder">
        <strong>{project.founderName}</strong> 
        {project.gradeOrAge && (
          <span className="text-muted ml-2">
            ({project.gradeOrAge}{project.schoolName ? `, ${project.schoolName}` : ''})
          </span>
        )}
      </div>

      <p className="pc2-desc">{project.longDescription || project.shortDescription}</p>

      {project.recruiting && project.rolesNeeded && project.rolesNeeded.length > 0 && (
        <div className="pc2-roles-section">
          <span className="pc2-section-label">Looking for:</span>
          <div className="pc2-roles-list">
            {project.rolesNeeded.map((role, idx) => (
              <span key={role} className={`pc2-role-pill role-pill-${idx % 5}`}>
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pc2-tags-section">
        {tags.map(tag => (
          <span key={tag} className="pc2-topic-tag" data-category={getMappedCategory(tag)}>{tag}</span>
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
    </div>
  );
};
