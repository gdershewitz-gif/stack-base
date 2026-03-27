import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';
import { ROLES_AVAILABLE } from '../data/projects';
import type { Category } from '../data/projects';
import './Submit.css';

export const Submit: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    shortDescription: string;
    longDescription: string;
    category: Category;
    demoUrl: string;
    socialUrl: string;
    recruiting: boolean;
    rolesNeeded: string[];
    founderName: string;
    schoolName: string;
    gradeOrAge: string;
    founderEmail: string;
  }>({
    name: '',
    shortDescription: '',
    longDescription: '',
    category: 'App or Website',
    demoUrl: '',
    socialUrl: '',
    recruiting: false,
    rolesNeeded: [],
    founderName: '',
    schoolName: '',
    gradeOrAge: '',
    founderEmail: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'recruiting') {
      setFormData(prev => ({ ...prev, recruiting: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => {
      if (prev.rolesNeeded.includes(role)) {
        return { ...prev, rolesNeeded: prev.rolesNeeded.filter(r => r !== role) };
      } else {
        return { ...prev, rolesNeeded: [...prev.rolesNeeded, role] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    const { error } = await supabase.from('projects').insert([
      {
        name: formData.name,
        short_description: formData.shortDescription,
        long_description: formData.longDescription,
        category: formData.category,
        demo_url: formData.demoUrl || null,
        social_url: formData.socialUrl || null,
        recruiting: formData.recruiting,
        roles_needed: formData.recruiting ? formData.rolesNeeded : [],
        founder_name: formData.founderName,
        school_name: formData.schoolName || null,
        grade_or_age: formData.gradeOrAge,
        founder_email: formData.founderEmail,
        upvotes: 0,
        status: 'pending'
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error inserting project:', error);
      setErrorMsg('There was an error communicating with the database. Please check your connection.');
    } else {
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="submit-page container">
        <div className="success-container">
          <CheckCircle size={64} className="success-icon" />
          <h2>Thanks for submitting!</h2>
          <p>Your project has been submitted to StageOne. It will appear on the browse page once an admin approves it.</p>
          <Button variant="outline" onClick={() => {
            setIsSubmitted(false);
            setFormData(prev => ({ ...prev, name: '', shortDescription: '', longDescription: '', demoUrl: '' }));
          }}>Submit another project</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page container">
      <div className="submit-header">
        <h1>Submit Your Project</h1>
        <p>Share what you're building with the largest community of student founders.</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
            {errorMsg}
          </div>
        )}

        <section className="form-section">
          <h3>1. Project Details</h3>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">One-Line Description (100 chars max) *</label>
            <input type="text" id="shortDescription" name="shortDescription" required maxLength={100} value={formData.shortDescription} onChange={handleChange} disabled={isSubmitting} />
          </div>

          <div className="form-group">
            <label htmlFor="longDescription">Full Description *</label>
            <textarea id="longDescription" name="longDescription" required rows={5} value={formData.longDescription} onChange={handleChange} disabled={isSubmitting} placeholder="What did you build? Why did you build it? What stage are you at?" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" required value={formData.category} onChange={handleChange} disabled={isSubmitting}>
                <option value="App or Website">App or Website</option>
                <option value="Business or Brand">Business or Brand</option>
                <option value="Nonprofit">Nonprofit</option>
                <option value="Product or Ecommerce">Product or Ecommerce</option>
                <option value="Newsletter or Blog">Newsletter or Blog</option>
                <option value="Side Hustle">Side Hustle</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="demoUrl">Website or Demo Link</label>
              <input type="url" id="demoUrl" name="demoUrl" value={formData.demoUrl} onChange={handleChange} disabled={isSubmitting} placeholder="https://" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="socialUrl">Instagram or Social Link</label>
            <input type="url" id="socialUrl" name="socialUrl" value={formData.socialUrl} onChange={handleChange} disabled={isSubmitting} placeholder="https://instagram.com/..." />
          </div>
        </section>

        <hr className="form-divider" />

        <section className="form-section">
          <h3>2. Team & Recruiting</h3>
          <div className="form-group">
            <label className="checkbox-label" style={{ fontWeight: 600 }}>
              <input type="checkbox" name="recruiting" checked={formData.recruiting} onChange={handleChange} disabled={isSubmitting} />
              Are you currently looking for team members?
            </label>
          </div>

          {formData.recruiting && (
            <div className="form-group role-selection">
              <label>What roles do you need? *</label>
              <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                {ROLES_AVAILABLE.map(role => (
                  <label key={role} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.rolesNeeded.includes(role)} 
                      onChange={() => handleRoleToggle(role)} 
                      disabled={isSubmitting}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>

        <hr className="form-divider" />

        <section className="form-section">
          <h3>3. Founder Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="founderName">Your Name *</label>
              <input type="text" id="founderName" name="founderName" required value={formData.founderName} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="form-group">
              <label htmlFor="gradeOrAge">Grade or Age (Optional)</label>
              <input type="text" id="gradeOrAge" name="gradeOrAge" value={formData.gradeOrAge} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 11th Grade, High School Junior, 16" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="schoolName">School Name</label>
              <input type="text" id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className="form-group">
              <label htmlFor="founderEmail">Contact Email *</label>
              <input type="email" id="founderEmail" name="founderEmail" required value={formData.founderEmail} onChange={handleChange} disabled={isSubmitting} />
              <p className="text-sm text-muted mt-1">Needed if someone wants to join your team!</p>
            </div>
          </div>
        </section>

        <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={18} style={{ marginRight: '8px' }} /> Submitting...</>
          ) : (
            'Submit Project'
          )}
        </Button>
      </form>
    </div>
  );
};
