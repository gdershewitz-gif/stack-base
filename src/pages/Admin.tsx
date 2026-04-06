import React, { useState } from 'react';
import { Loader2, Check, X, Trash2, Edit2, Save, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, Category } from '../data/projects';
import { mapDbToProject } from '../data/projects';
import './Admin.css';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [totalProjectsCount, setTotalProjectsCount] = useState<number | string>('-');
  const [totalUpvotes, setTotalUpvotes] = useState<number | string>('-');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Ninja0325') {
      setIsAuthenticated(true);
      fetchProjects();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('date_added', { ascending: false });
    if (data && !error) {
      setProjects(data.map(mapDbToProject));
    }

    const { count: projCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    if (projCount !== null) setTotalProjectsCount(projCount);

    const { data: upvotesData } = await supabase.from('projects').select('upvotes');
    if (upvotesData) {
      const sum = upvotesData.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
      setTotalUpvotes(sum);
    }

    setIsLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm(project);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    const { error } = await supabase.from('projects').update({
      name: editForm.name,
      short_description: editForm.shortDescription,
      long_description: editForm.longDescription,
      category: editForm.category,
      demo_url: editForm.demoUrl || null,
      social_url: editForm.socialUrl || null,
      recruiting: editForm.recruiting,
      roles_needed: editForm.rolesNeeded,
      founder_name: editForm.founderName,
      school_name: editForm.schoolName || null,
      grade_or_age: editForm.gradeOrAge,
      founder_email: editForm.founderEmail || '',
      featured: editForm.featured,
      status: editForm.status
    }).eq('id', editingId);

    if (!error) {
      setProjects(projects.map(p => p.id === editingId ? { ...p, ...editForm } as Project : p));
      setEditingId(null);
      setEditForm({});
    } else {
      alert('Error updating project: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>StageOne Admin</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="refresh-btn" onClick={fetchProjects}>
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Refresh Data'}
        </button>
      </div>

      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ padding: '24px', background: 'var(--section-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Submissions</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalProjectsCount}</div>
        </div>
        <div className="stat-card" style={{ padding: '24px', background: 'var(--section-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Total Upvotes</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{totalUpvotes}</div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Project Name</th>
              <th>Category</th>
              <th>Founder</th>
              <th>Recruiting</th>
              <th>Upvotes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className={project.status === 'pending' ? 'row-pending' : ''}>
                {editingId === project.id ? (
                  <td colSpan={7} className="edit-row-cell">
                    <div className="edit-form-grid">
                      <input type="text" placeholder="Name" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      <input type="text" placeholder="Founder Name" value={editForm.founderName || ''} onChange={e => setEditForm({...editForm, founderName: e.target.value})} />
                      <input type="email" placeholder="Founder Email" value={editForm.founderEmail || ''} onChange={e => setEditForm({...editForm, founderEmail: e.target.value})} />
                      
                      <select value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value as Category})}>
                        <option value="App or Website">App or Website</option>
                        <option value="Business or Brand">Business or Brand</option>
                        <option value="Nonprofit">Nonprofit</option>
                        <option value="Product or Ecommerce">Product or Ecommerce</option>
                        <option value="Newsletter or Blog">Newsletter or Blog</option>
                        <option value="Side Hustle">Side Hustle</option>
                        <option value="Other">Other</option>
                      </select>

                      <input type="text" placeholder="Demo URL" value={editForm.demoUrl || ''} onChange={e => setEditForm({...editForm, demoUrl: e.target.value})} />
                      <input type="text" placeholder="Social URL" value={editForm.socialUrl || ''} onChange={e => setEditForm({...editForm, socialUrl: e.target.value})} />
                      
                      <div className="edit-checkbox">
                        <label>
                          <input type="checkbox" checked={editForm.recruiting || false} onChange={e => setEditForm({...editForm, recruiting: e.target.checked})} />
                          Recruiting?
                        </label>
                      </div>

                      <div className="edit-checkbox">
                        <label>
                          <input type="checkbox" checked={editForm.featured || false} onChange={e => setEditForm({...editForm, featured: e.target.checked})} />
                          Featured?
                        </label>
                      </div>

                      <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      <input type="text" placeholder="Roles (comma expr)" value={editForm.rolesNeeded?.join(', ') || ''} onChange={e => setEditForm({...editForm, rolesNeeded: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />

                      <textarea placeholder="Short Desc" value={editForm.shortDescription || ''} onChange={e => setEditForm({...editForm, shortDescription: e.target.value})} />
                      <textarea placeholder="Long Desc" value={editForm.longDescription || ''} onChange={e => setEditForm({...editForm, longDescription: e.target.value})} />
                    </div>
                    
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="btn-save"><Save size={16} /> Save</button>
                      <button onClick={cancelEdit} className="btn-cancel"><XCircle size={16} /> Cancel</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="status-cell">
                      <span className={`status-badge status-${project.status}`}>{project.status}</span>
                    </td>
                    <td className="title-cell">
                      <strong>{project.name}</strong>
                      {project.featured && <span className="featured-star">★</span>}
                    </td>
                    <td>{project.category}</td>
                    <td>
                      <div>{project.founderName}</div>
                      <div className="text-sm text-muted">{project.founderEmail}</div>
                    </td>
                    <td>{project.recruiting ? (project.rolesNeeded ? project.rolesNeeded.length : 0) + ' roles' : 'No'}</td>
                    <td>{project.upvotes}</td>
                    <td className="actions-cell">
                      {project.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(project.id, 'approved')} className="action-btn btn-approve" title="Approve"><Check size={18} /></button>
                          <button onClick={() => handleStatusChange(project.id, 'rejected')} className="action-btn btn-reject" title="Reject"><X size={18} /></button>
                        </>
                      )}
                      {project.status === 'approved' && (
                        <button onClick={() => handleStatusChange(project.id, 'rejected')} className="action-btn btn-reject" title="Revoke Approval"><X size={18} /></button>
                      )}
                      <button onClick={() => startEdit(project)} className="action-btn btn-edit" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(project.id)} className="action-btn btn-delete" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
