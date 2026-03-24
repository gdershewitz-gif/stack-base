import React, { useState } from 'react';
import { Loader2, Check, X, Trash2, Edit2, Save, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Tool, Category, PricingModel } from '../data/tools';
import { mapDbToTool } from '../data/tools';
import { Button } from '../components/Button';
import './Admin.css';

const ADMIN_PASSWORD = 'Ninja0325';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tool>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchTools();
    } else {
      alert('Incorrect password');
    }
  };

  const fetchTools = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('date_added', { ascending: false });
    
    if (data && !error) {
      setTools(data.map(mapDbToTool));
    } else {
      console.error(error);
    }
    setIsLoading(false);
  };

  const updateToolStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('tools').update({ status }).eq('id', id);
    if (!error) {
      setTools(tools.map(t => t.id === id ? { ...t, status } : t));
    } else {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    const { error } = await supabase.from('tools').delete().eq('id', id);
    if (!error) {
      setTools(tools.filter(t => t.id !== id));
    } else {
      alert('Error deleting');
    }
  };

  const startEdit = (tool: Tool) => {
    setEditingId(tool.id);
    setEditForm(tool);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from('tools').update({
      name: editForm.name,
      short_description: editForm.shortDescription,
      long_description: editForm.longDescription,
      category: editForm.category,
      pricing: editForm.pricing,
      website_url: editForm.websiteUrl,
      star_rating: editForm.starRating,
      featured: editForm.featured,
      status: editForm.status
    }).eq('id', editingId);

    if (!error) {
      setTools(tools.map(t => t.id === editingId ? { ...t, ...editForm } as Tool : t));
      setEditingId(null);
    } else {
      alert('Error saving edits');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container container">
        <div className="admin-login-box">
          <h2>Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter admin password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)}
              className="admin-input"
              autoFocus
            />
            <Button type="submit" fullWidth>Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Button onClick={fetchTools} variant="outline" size="sm">Refresh Data</Button>
      </div>
      
      {isLoading ? (
        <div className="admin-loading"><Loader2 className="animate-spin" size={32} /></div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name / Details</th>
                <th>Classification</th>
                <th>Status</th>
                <th>Date Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => {
                const isEditing = editingId === tool.id;
                
                if (isEditing) {
                  return (
                    <tr key={tool.id} className="editing-row">
                      <td>
                        <input className="edit-input w-full" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Name" />
                        <input className="edit-input w-full mt-2" value={editForm.websiteUrl || ''} onChange={e => setEditForm({...editForm, websiteUrl: e.target.value})} placeholder="URL" />
                        <textarea className="edit-input w-full mt-2" value={editForm.shortDescription || ''} onChange={e => setEditForm({...editForm, shortDescription: e.target.value})} placeholder="Short Desc" rows={2} />
                      </td>
                      <td>
                        <select className="edit-input w-full" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value as Category})}>
                          <option value="Writing & Copy">Writing & Copy</option>
                          <option value="Research">Research</option>
                          <option value="Design & Decks">Design & Decks</option>
                          <option value="Analytics">Analytics</option>
                          <option value="Cold Outreach">Cold Outreach</option>
                          <option value="Productivity">Productivity</option>
                          <option value="Video & Media">Video & Media</option>
                          <option value="Social Media">Social Media</option>
                          <option value="Other">Other</option>
                        </select>
                        <select className="edit-input w-full mt-2" value={editForm.pricing} onChange={e => setEditForm({...editForm, pricing: e.target.value as PricingModel})}>
                          <option value="Free">Free</option>
                          <option value="Freemium">Freemium</option>
                          <option value="Paid">Paid</option>
                        </select>
                        <input type="number" className="edit-input w-full mt-2" value={editForm.starRating || 5} onChange={e => setEditForm({...editForm, starRating: Number(e.target.value)})} min="1" max="5" title="Rating" />
                      </td>
                      <td>
                        <select className="edit-input w-full" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <label className="featured-toggle mt-2">
                          <input type="checkbox" checked={editForm.featured} onChange={e => setEditForm({...editForm, featured: e.target.checked})} /> Featured
                        </label>
                      </td>
                      <td>
                        <span className="text-sm text-muted">{new Date(tool.dateAdded).toLocaleDateString()}</span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons justify-end">
                          <button className="action-btn text-success" onClick={saveEdit} title="Save"><Save size={18} /></button>
                          <button className="action-btn text-muted" onClick={() => setEditingId(null)} title="Cancel"><XCircle size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr key={tool.id}>
                    <td>
                      <strong>{tool.name}</strong>
                      <div className="text-sm text-muted mt-1">{tool.websiteUrl}</div>
                      <div className="text-xs text-muted mt-1 line-clamp-1" title={tool.shortDescription}>{tool.shortDescription}</div>
                    </td>
                    <td>
                      <div className="badge-group">
                        <span className="mini-badge">{tool.category}</span>
                        <span className="mini-badge">{tool.pricing}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${tool.status || 'pending'}`}>
                        {tool.status || 'pending'}
                      </span>
                      {tool.featured && <div className="text-xs text-primary mt-1 font-medium">Featured</div>}
                    </td>
                    <td>
                      <span className="text-sm text-muted">{new Date(tool.dateAdded).toLocaleDateString()}</span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons justify-end">
                        {(tool.status !== 'approved') && (
                          <button className="action-btn text-success" onClick={() => updateToolStatus(tool.id, 'approved')} title="Approve"><Check size={18} /></button>
                        )}
                        {(tool.status !== 'rejected') && (
                          <button className="action-btn text-warning" onClick={() => updateToolStatus(tool.id, 'rejected')} title="Reject"><X size={18} /></button>
                        )}
                        <button className="action-btn text-primary" onClick={() => startEdit(tool)} title="Edit"><Edit2 size={18} /></button>
                        <button className="action-btn text-danger" onClick={() => handleDelete(tool.id)} title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {tools.length === 0 && <div className="p-8 text-center text-muted">No tools found.</div>}
        </div>
      )}
    </div>
  );
};
