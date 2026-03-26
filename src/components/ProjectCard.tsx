import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Users } from 'lucide-react';
import { Button } from './Button';
import type { Project } from '../data/projects';
import { supabase } from '../lib/supabase';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [upvotes, setUpvotes] = useState(project.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    
    const newUpvotes = upvotes + 1;
    setUpvotes(newUpvotes);
    setHasUpvoted(true);

    const { error } = await supabase
      .from('projects')
      .update({ upvotes: newUpvotes })
      .eq('id', project.id);

    if (error) {
      console.error('Error upvoting:', error);
      // Revert optimism if failed
      setUpvotes(upvotes);
      setHasUpvoted(false);
    }
  };

  return (
    <div className={`project-card ${project.featured ? 'featured' : ''}`}>
      <div className="project-card-header">
        <div className="project-card-title-group">
          <h3 className="project-name">{project.name}</h3>
          <span className="project-category">{project.category}</span>
        </div>
        <button 
          className={`upvote-btn ${hasUpvoted ? 'upvoted' : ''}`}
          onClick={handleUpvote}
        >
          <ChevronUp size={18} />
          <span>{upvotes}</span>
        </button>
      </div>

      <div className="project-card-body">
        <p className="project-short-desc">{project.shortDescription}</p>
        
        <div className="founder-info">
          <strong>{project.founderName}</strong> 
          <span className="text-muted text-sm ml-2">({project.gradeOrAge}{project.schoolName ? `, ${project.schoolName}` : ''})</span>
        </div>

        {project.recruiting && (
          <div className="recruiting-section mt-2">
            <span className="recruiting-badge"><Users size={14} className="mr-1"/> Recruiting Now</span>
            {project.rolesNeeded && project.rolesNeeded.length > 0 && (
              <div className="roles-list mt-1">
                Roles needed: <strong>{project.rolesNeeded.join(', ')}</strong>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="project-card-actions mt-4">
        <Link to={`/project/${project.id}`} className="flex-1">
          <Button variant="outline" size="sm" fullWidth>View Project</Button>
        </Link>
        {project.recruiting && (
          <a href={`mailto:${project.founderEmail}?subject=Joining the ${project.name} team!`} className="flex-1">
            <Button variant="primary" size="sm" fullWidth>Join Team</Button>
          </a>
        )}
      </div>
    </div>
  );
};
