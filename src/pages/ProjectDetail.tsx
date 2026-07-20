import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ChevronUp, MessageSquare, Loader2, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, Comment } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Avatar } from '../components/Avatar';
import './ProjectDetail.css';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      if (!id) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('status', 'approved')
        .single();

      if (data && !error) {
        const fetchedProject = mapDbToProject(data);
        setProject(fetchedProject);
        setUpvotes(fetchedProject.upvotes);

        const list = JSON.parse(localStorage.getItem('stagone_upvotes') || '[]');
        if (list.includes(fetchedProject.id)) {
          setHasUpvoted(true);
        }

        // Fetch related projects and comments in parallel
        const [
          { data: relatedData },
          { data: commentsData }
        ] = await Promise.all([
          supabase
            .from('projects')
            .select('id, name, short_description, category, demo_url, social_url, recruiting, roles_needed, founder_name, school_name, grade_or_age, upvotes, featured, status, date_added, cover_image_url')
            .eq('category', fetchedProject.category)
            .eq('status', 'approved')
            .neq('id', id)
            .limit(3),
          supabase
            .from('comments')
            .select('*')
            .eq('project_id', id)
            .order('date_added', { ascending: false })
        ]);

        if (relatedData) {
          setRelatedProjects(relatedData.map(mapDbToProject));
        }

        if (commentsData) {
          setComments(commentsData.map(c => ({
            id: c.id,
            projectId: c.project_id,
            authorName: c.author_name,
            content: c.content,
            dateAdded: c.date_added
          })));
        }

      } else {
        console.error('Error fetching project details:', error);
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [id]);

  const handleUpvoteToggle = async () => {
    if (!project) return;

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

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim() || !project) return;

    setIsSubmittingComment(true);
    const { data, error } = await supabase.from('comments').insert([{
      project_id: project.id,
      author_name: newCommentName,
      content: newCommentText
    }]).select();

    if (data && !error) {
      const newC: Comment = {
        id: data[0].id,
        projectId: data[0].project_id,
        authorName: data[0].author_name,
        content: data[0].content,
        dateAdded: data[0].date_added
      };
      setComments([newC, ...comments]);
      setNewCommentName('');
      setNewCommentText('');
    }
    setIsSubmittingComment(false);
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '120px 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ padding: '80px 1.5rem', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <p>Sorry, we couldn't find the project you're looking for. It may have been removed or is still pending review.</p>
        <Link to="/browse">
          <Button variant="primary" style={{ marginTop: '20px' }}>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page container">
      <Link to="/browse" className="back-link">
        <ArrowLeft size={16} /> Back to all projects
      </Link>

      <SEO
        title={`${project.name} | FoundrBoard`}
        description={project.shortDescription || `${project.name} — a ${project.category} project on FoundrBoard by ${project.founderName}.`}
        canonicalUrl={`https://foundrboard.com/project/${project.id}`}
        type="article"
        imageUrl={project.coverImageUrl || 'https://foundrboard.com/favicon.svg'}
      />

      <div className="project-content-grid">
        {/* Main Content */}
        <div className="project-main">
          <div className="project-hero-header">
            <Avatar 
              src={project.coverImageUrl} 
              name={project.name} 
              size="lg" 
              variant="project" 
              category={project.category}
              className="project-hero-avatar"
            />
            <div className="project-hero-info">
              <h1>{project.name}</h1>
              <div className="project-meta-tags" style={{ marginBottom: '12px' }}>
                <span className="project-badge text-muted">
                  Founder: {project.founderName}{project.gradeOrAge?.trim() ? ` (${project.gradeOrAge.trim()})` : ''}
                </span>
                {project.schoolName && <span className="project-badge text-muted">{project.schoolName}</span>}
              </div>
              <div className="project-meta-tags">
                {project.tags.map(tag => (
                  <Tag key={tag} variant="category" value={tag} />
                ))}
              </div>
            </div>
          </div>

          <Card padding="md" className="project-about-section">
            <h2>About what we built</h2>
            <p className="project-long-desc">{project.longDescription}</p>
          </Card>

          {/* Comments Section */}
          <Card padding="md" className="comments-section mt-8">
            <h2>
              <MessageSquare size={20} className="inline mr-2 text-primary" style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> 
              Feedback & Encouragement
            </h2>

            <form className="comment-form mt-4" onSubmit={handlePostComment}>
              <div className="form-group row-flex">
                <input type="text" placeholder="Your Name" required value={newCommentName} onChange={e => setNewCommentName(e.target.value)} className="comment-input half-width" disabled={isSubmittingComment} />
              </div>
              <div className="form-group mt-2">
                <textarea placeholder="Leave a supportive comment, feedback, or ask a question!" required rows={3} value={newCommentText} onChange={e => setNewCommentText(e.target.value)} className="comment-input" disabled={isSubmittingComment} />
              </div>
              <Button type="submit" size="sm" className="mt-2" disabled={isSubmittingComment}>
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            <div className="comments-list mt-6">
              {comments.length > 0 ? comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.authorName}</strong>
                    <span className="text-muted text-sm">{new Date(comment.dateAdded).toLocaleDateString()}</span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              )) : (
                <p className="text-muted italic">No comments yet. Be the first to encourage {project.founderName}!</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="project-sidebar">
          <Card padding="md" className="action-card">
            <h3>{project.shortDescription}</h3>

            <button
              className={`upvote-btn-massive mt-4 ${hasUpvoted ? 'upvoted' : ''} ${isBouncing ? 'bounce' : ''}`}
              onClick={handleUpvoteToggle}
            >
              <ChevronUp size={24} strokeWidth={hasUpvoted ? 3 : 2} />
              <div className="upvote-count">{upvotes}</div>
              <div className="upvote-label">{hasUpvoted ? 'Upvoted' : 'Upvote Project'}</div>
            </button>

            <div className="links-group mt-4">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%' }}>
                  <Button variant="outline" fullWidth>
                    {project.category === 'App or Website' ? 'Visit Website' : 'View Demo/Product'} <ExternalLink size={16} className="ml-2" />
                  </Button>
                </a>
              )}
            </div>

            <hr className="sidebar-divider" />

            <div className="recruiting-box">
              {project.recruiting ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Tag variant="status" value="Actively Recruiting" />
                  </div>
                  <p className="mt-2 text-sm text-center">
                    {project.founderName} is looking for:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                    {project.rolesNeeded.map((role, idx) => (
                      <Tag key={role} variant="role" value={role} colorIndex={idx} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <a href={`mailto:${project.founderEmail}?subject=Interested in joining the ${project.name} team!`} className="flex-1 block" style={{ flex: 1 }}>
                      <Button variant="primary" fullWidth style={{ fontSize: '0.9rem', padding: '8px 12px' }}>Join the Team</Button>
                    </a>
                    {project.socialUrl && (
                      <a href={project.socialUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'center' }}>
                          <Instagram size={18} />
                        </Button>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <Tag variant="status" value="Not recruiting" />
                  </div>
                  {project.socialUrl && (
                    <div style={{ marginTop: '16px' }}>
                      <a href={project.socialUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button variant="outline" fullWidth style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Instagram size={18} /> Founder's Instagram
                        </Button>
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="related-projects-section mt-12">
          <h2>More {project.category} Projects</h2>
          <div className="tools-grid">
            {relatedProjects.map(t => (
              <ProjectCard key={t.id} project={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
