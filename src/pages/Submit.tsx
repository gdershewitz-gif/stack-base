import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { ROLES_AVAILABLE, SKILLS_AVAILABLE } from '../data/projects';
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
    founderMajor: string;
    founderExperience: string[];
    founderSkills: string[];
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
    founderMajor: '',
    founderExperience: [],
    founderSkills: [],
    schoolName: '',
    gradeOrAge: '',
    founderEmail: ''
  });

  const [experienceInput, setExperienceInput] = useState('');
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

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => {
      if (prev.founderSkills.includes(skill)) {
        return { ...prev, founderSkills: prev.founderSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, founderSkills: [...prev.founderSkills, skill] };
      }
    });
  };

  const handleExperienceAdd = () => {
    if (experienceInput.trim() && formData.founderExperience.length < 3) {
      setFormData(prev => ({
        ...prev,
        founderExperience: [...prev.founderExperience, experienceInput.trim()]
      }));
      setExperienceInput('');
    }
  };

  const handleExperienceRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      founderExperience: prev.founderExperience.filter((_, i) => i !== index)
    }));
  };

  const normalizeSocialUrl = (input: string) => {
    if (!input) return null;
    const trimmed = input.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.includes('.com/') || trimmed.includes('.co/')) return `https://${trimmed}`;
    
    const username = trimmed.startsWith('@') ? trimmed.substring(1) : trimmed;
    return `https://instagram.com/${username}`;
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
        social_url: normalizeSocialUrl(formData.socialUrl),
        recruiting: formData.recruiting,
        roles_needed: formData.recruiting ? formData.rolesNeeded : [],
        founder_name: formData.founderName,
        founder_major: formData.founderMajor || null,
        founder_experience: formData.founderExperience,
        founder_skills: formData.founderSkills,
        school_name: formData.schoolName || null,
        grade_or_age: formData.gradeOrAge,
        founder_email: formData.founderEmail || '',
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
        <Card padding="lg" className="success-container" style={{ textAlign: 'center' }}>
          <CheckCircle size={64} className="success-icon" />
          <h2>Thanks for submitting!</h2>
          <p className="text-muted mt-2 mb-4">Your project has been submitted to FoundrBoard. It will appear on the browse page once an admin approves it.</p>
          <Button variant="outline" onClick={() => {
            setIsSubmitted(false);
            setFormData(prev => ({ ...prev, name: '', shortDescription: '', longDescription: '', demoUrl: '' }));
          }}>Submit another project</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="submit-page container">
      <SEO
        title="Submit Your Project | FoundrBoard"
        description="Share your startup, app, or side project with the largest community of student founders. Get discovered, find teammates, and grow your project."
        canonicalUrl="https://foundrboard.com/submit"
      />
      <div className="submit-header">
        <h1>Submit Your Project</h1>
        <p>Share what you're building with the largest community of student founders.</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        {errorMsg && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        <div className="submit-sections-container">
          <Card padding="md">
            <section className="form-section">
              <h3>1. Project Details</h3>
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} disabled={isSubmitting} placeholder="What is your project called?" />
              </div>

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
                <label htmlFor="shortDescription">One-Line Description (Optional)</label>
                <input type="text" id="shortDescription" name="shortDescription" maxLength={100} value={formData.shortDescription} onChange={handleChange} disabled={isSubmitting} placeholder="A short, catchy summary of your project." />
              </div>

              <div className="form-group">
                <label htmlFor="longDescription">Full Description (Optional)</label>
                <textarea id="longDescription" name="longDescription" rows={4} value={formData.longDescription} onChange={handleChange} disabled={isSubmitting} placeholder="What did you build? Why did you build it? What stage are you at?" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="demoUrl">Website or Demo Link (Optional)</label>
                  <input type="url" id="demoUrl" name="demoUrl" value={formData.demoUrl} onChange={handleChange} disabled={isSubmitting} placeholder="https://" />
                </div>
                <div className="form-group">
                  <label htmlFor="socialUrl">Instagram or Social Link (Optional)</label>
                  <input type="text" id="socialUrl" name="socialUrl" value={formData.socialUrl} onChange={handleChange} disabled={isSubmitting} placeholder="@username or URL" />
                </div>
              </div>
            </section>
          </Card>

          <Card padding="md">
            <section className="form-section">
              <h3>2. Team & Recruiting</h3>
              <div className="form-group">
                <label className="checkbox-label" style={{ fontWeight: 600 }}>
                  <input type="checkbox" name="recruiting" checked={formData.recruiting} onChange={handleChange} disabled={isSubmitting} />
                  Are you currently looking for team members? (Optional)
                </label>
              </div>

              {formData.recruiting && (
                <div className="form-group role-selection">
                  <label>What roles do you need?</label>
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
          </Card>

          <Card padding="md">
            <section className="form-section">
              <h3>3. Founder Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="founderName">Your Name (Optional)</label>
                  <input type="text" id="founderName" name="founderName" value={formData.founderName} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label htmlFor="gradeOrAge">Grade or Age (Optional)</label>
                  <input type="text" id="gradeOrAge" name="gradeOrAge" value={formData.gradeOrAge} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 11th Grade, High School Junior, 16" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="schoolName">School Name (Optional)</label>
                  <input type="text" id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label htmlFor="founderMajor">Focus Area / Major (Optional)</label>
                  <input type="text" id="founderMajor" name="founderMajor" value={formData.founderMajor} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. Computer Science, Business" />
                </div>
              </div>

              <div className="form-group">
                <label>Experience (Optional, max 3)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    value={experienceInput} 
                    onChange={e => setExperienceInput(e.target.value)} 
                    disabled={isSubmitting || formData.founderExperience.length >= 3} 
                    placeholder="e.g. Founder @ Pact, Marketing Intern @ X" 
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleExperienceAdd(); } }}
                  />
                  <Button type="button" onClick={handleExperienceAdd} disabled={isSubmitting || formData.founderExperience.length >= 3 || !experienceInput.trim()} style={{ whiteSpace: 'nowrap' }}>Add</Button>
                </div>
                {formData.founderExperience.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {formData.founderExperience.map((exp, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--section-bg)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                        <span>{exp}</span>
                        <button type="button" onClick={() => handleExperienceRemove(idx)} style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Skills & Interests (Optional)</label>
                <div className="checkbox-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', maxHeight: '200px', overflowY: 'auto', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--section-bg)' }}>
                  {SKILLS_AVAILABLE.map(skill => (
                    <label key={skill} className="checkbox-label" style={{ fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.founderSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        disabled={isSubmitting}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="founderEmail">Contact Email (Optional)</label>
                <input type="email" id="founderEmail" name="founderEmail" value={formData.founderEmail} onChange={handleChange} disabled={isSubmitting} />
                <p className="text-sm text-muted mt-1">Needed if someone wants to join your team!</p>
              </div>
            </section>
          </Card>
        </div>

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
