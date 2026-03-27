import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Users, ChevronUp, MessageSquare, Loader2, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, Comment } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import { Button } from '../components/Button';
import { ProjectCard } from '../components/ProjectCard';
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

        // Fetch related projects
        const { data: relatedData } = await supabase
          .from('projects')
          .select('*')
          .eq('category', fetchedProject.category)
          .eq('status', 'approved')
          .neq('id', id)
          .limit(3);

        if (relatedData) {
          setRelatedProjects(relatedData.map(mapDbToProject));
        }

        // Fetch comments
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('project_id', id)
          .order('date_added', { ascending: false });

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

      <div className="project-content-grid">
        {/* Main Content */}
        <div className="project-main">
          <div className="project-hero-header">
            <div className="project-hero-icon" style={{ backgroundColor: `hsl(${project.name.charCodeAt(0) * 15 % 360}, 60%, 80%)`, color: '#1f2937' }}>
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div className="project-hero-info">
              <h1>{project.name}</h1>
              <div className="project-meta-tags">
                <span className="project-cat-tag" data-category={project.category}>{project.category}</span>
                <span className="project-badge text-muted">
                  Founder: {project.founderName} ({project.gradeOrAge})
                </span>
                {project.schoolName && <span className="project-badge text-muted">{project.schoolName}</span>}
              </div>
            </div>
          </div>

          <div className="project-about-section">
            <h2>About what we built</h2>
            <p className="project-long-desc">{project.longDescription}</p>
          </div>

          {/* Comments Section */}
          <div className="comments-section mt-12">
            <h2><MessageSquare size={20} className="inline mr-2 text-primary" style={{ display:'inline', marginRight:'8px' }}/> Feedback & Encouragement</h2>
            
            <form className="comment-form" onSubmit={handlePostComment}>
              <div className="form-group row-flex">
                <input type="text" placeholder="Your Name" required value={newCommentName} onChange={e=>setNewCommentName(e.target.value)} className="comment-input half-width" disabled={isSubmittingComment} />
              </div>
              <div className="form-group mt-2">
                <textarea placeholder="Leave a supportive comment, feedback, or ask a question!" required rows={3} value={newCommentText} onChange={e=>setNewCommentText(e.target.value)} className="comment-input" disabled={isSubmittingComment} />
              </div>
              <Button type="submit" size="sm" className="mt-2" disabled={isSubmittingComment}>
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>

            <div className="comments-list mt-8">
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="project-sidebar">
          <div className="action-card">
            <h3>{project.shortDescription}</h3>
            
            <button 
              className={`upvote-btn-massive mt-4 ${hasUpvoted ? 'upvoted' : ''} ${isBouncing ? 'bounce' : ''}`}
              onClick={handleUpvoteToggle}
            >
              <ChevronUp size={24} strokeWidth={hasUpvoted ? 3 : 2} />
              <div className="upvote-count">{upvotes}</div>
              <div className="upvote-label">{hasUpvoted ? 'Upvoted' : 'Upvote Project'}</div>
            </button>

            <div className="links-group mt-6">
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
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
                  <div className="recruiting-status active">
                    <Users size={18} /> Actively Recruiting
                  </div>
                  <p className="mt-2 text-sm text-center">
                    {project.founderName} is looking for: <br/> <strong>{project.rolesNeeded.join(', ')}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <a href={`mailto:${project.founderEmail}?subject=Interested in joining the ${project.name} team!`} className="flex-1 block" style={{ flex: 1 }}>
                      <Button variant="primary" fullWidth>Join the Team</Button>
                    </a>
                    {project.socialUrl && (
                      <a href={project.socialUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" style={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center' }}>
                          <Instagram size={20} />
                        </Button>
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="recruiting-status inactive text-muted">
                    Not currently recruiting
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

          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="related-projects-section mt-16">
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
