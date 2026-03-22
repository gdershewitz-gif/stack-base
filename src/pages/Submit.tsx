import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { toolsData } from '../data/tools';
import type { Tool, Category, PricingModel } from '../data/tools';
import './Submit.css';

export const Submit: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    category: 'Writing & Copy',
    pricing: 'Free',
    shortDescription: '',
    whyUse: '',
    submitterName: '',
    submitterEmail: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTool: Tool = {
      id: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: formData.name,
      shortDescription: formData.shortDescription,
      longDescription: formData.whyUse,
      category: formData.category as Category,
      pricing: formData.pricing as PricingModel,
      websiteUrl: formData.websiteUrl,
      starRating: 5, // Start new tools with 5 star default rating
      featured: false,
      dateAdded: new Date().toISOString(),
      submittedBy: formData.submitterName
    };

    toolsData.unshift(newTool); // Add to the top of the directory
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="submit-page container">
        <div className="success-container">
          <CheckCircle size={64} className="success-icon" />
          <h2>Thanks for your submission!</h2>
          <p>We've received your tool recommendation and will review it within 48 hours.</p>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>Submit another tool</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page container">
      <div className="submit-header">
        <h1>Submit a Tool</h1>
        <p>Know a great AI tool for students? Let us know and we'll add it to the directory.</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tool Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. ChatGPT"
          />
        </div>

        <div className="form-group">
          <label htmlFor="websiteUrl">Tool Website URL *</label>
          <input 
            type="url" 
            id="websiteUrl" 
            name="websiteUrl" 
            required 
            value={formData.websiteUrl} 
            onChange={handleChange} 
            placeholder="https://..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select 
              id="category" 
              name="category" 
              required 
              value={formData.category} 
              onChange={handleChange}
            >
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
          </div>

          <div className="form-group">
            <label htmlFor="pricing">Pricing Model *</label>
            <select 
              id="pricing" 
              name="pricing" 
              required 
              value={formData.pricing} 
              onChange={handleChange}
            >
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="shortDescription">Short Description (max 120 chars) *</label>
          <textarea 
            id="shortDescription" 
            name="shortDescription" 
            required 
            maxLength={120}
            rows={2}
            value={formData.shortDescription} 
            onChange={handleChange}
            placeholder="Describe what the tool does in one sentence."
          />
          <div className="char-count">
            {formData.shortDescription.length}/120
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="whyUse">Why should students use this? *</label>
          <textarea 
            id="whyUse" 
            name="whyUse" 
            required 
            rows={4}
            value={formData.whyUse} 
            onChange={handleChange}
            placeholder="Explain how this helps with essays, research, decks, etc."
          />
        </div>

        <hr className="form-divider" />
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="submitterName">Your Name (optional)</label>
            <input 
              type="text" 
              id="submitterName" 
              name="submitterName" 
              value={formData.submitterName} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="submitterEmail">Your Email (optional)</label>
            <input 
              type="email" 
              id="submitterEmail" 
              name="submitterEmail" 
              value={formData.submitterEmail} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth>Submit Tool for Review</Button>
      </form>
    </div>
  );
};
