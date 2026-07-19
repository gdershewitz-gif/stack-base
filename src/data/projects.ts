export type Category = 
  | 'App or Website'
  | 'Business or Brand'
  | 'Nonprofit'
  | 'Product or Ecommerce'
  | 'Newsletter or Blog'
  | 'Side Hustle'
  | 'Other';

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: Category;
  demoUrl?: string;
  socialUrl?: string;
  recruiting: boolean;
  rolesNeeded: string[];
  founderName: string;
  schoolName?: string;
  gradeOrAge: string;
  founderEmail: string;
  upvotes: number;
  featured: boolean;
  status: string;
  dateAdded: string;
  coverImageUrl?: string;
  tags: string[];
}

export interface Comment {
  id: string;
  projectId: string;
  authorName: string;
  content: string;
  dateAdded: string;
}

export const getKeywords = (desc: string, category: string): string[] => {
  const keywords = new Set<string>();
  keywords.add(category);
  
  // Use regex word boundaries for robust keyword matching
  if (/\b(ai|gpt|artificial intelligence)\b/i.test(desc)) keywords.add('AI');
  if (/\b(market|marketing|seo|grow|growth)\b/i.test(desc)) keywords.add('Marketing');
  if (/\b(tech|technology|software|app|code|coding|engineer|engineering)\b/i.test(desc)) keywords.add('Tech');
  if (/\b(business|startup|founder|founders|hustle|monetize)\b/i.test(desc)) keywords.add('Business');
  if (/\b(data|analytic|analytics|database)\b/i.test(desc)) keywords.add('Data');
  if (/\b(design|creative|art|illustration|ui|ux)\b/i.test(desc)) keywords.add('Design');
  if (/\b(social media|instagram|tiktok|youtube|twitter|facebook|linkedin)\b/i.test(desc)) keywords.add('Social Media');
  if (/\b(sustain|sustainable|sustainability|eco|green|plastic|recycle)\b/i.test(desc)) keywords.add('Sustainability');
  if (/\b(health|mental|wellness|support|medical|therapy)\b/i.test(desc)) keywords.add('Health & Wellness');
  if (/\b(tutor|tutoring|learn|learning|student|school|education|class)\b/i.test(desc)) keywords.add('Education');
  
  return Array.from(keywords).slice(0, 4);
};

export const getMappedCategory = (tag: string): Category | 'Other' => {
  const t = tag.toLowerCase();
  if (['app or website', 'tech', 'ai', 'design'].includes(t)) return 'App or Website';
  if (['business or brand', 'business', 'marketing'].includes(t)) return 'Business or Brand';
  if (['nonprofit', 'education', 'community'].includes(t)) return 'Nonprofit';
  if (['product or ecommerce', 'ecommerce'].includes(t)) return 'Product or Ecommerce';
  if (['side hustle', 'freelance'].includes(t)) return 'Side Hustle';
  return 'Other';
};

export const mapDbToProject = (dbProj: any): Project => ({
  id: dbProj.id,
  name: dbProj.name,
  shortDescription: dbProj.short_description,
  longDescription: dbProj.long_description,
  category: dbProj.category as Category,
  demoUrl: dbProj.demo_url,
  socialUrl: dbProj.social_url,
  recruiting: dbProj.recruiting,
  rolesNeeded: dbProj.roles_needed || [],
  founderName: dbProj.founder_name,
  schoolName: dbProj.school_name,
  gradeOrAge: dbProj.grade_or_age,
  founderEmail: dbProj.founder_email,
  upvotes: dbProj.upvotes,
  featured: dbProj.featured,
  status: dbProj.status,
  dateAdded: dbProj.date_added,
  coverImageUrl: dbProj.cover_image_url,
  tags: getKeywords(dbProj.long_description || dbProj.short_description || '', dbProj.category)
});

export const ROLES_AVAILABLE = [
  'Designer',
  'Developer',
  'Marketer',
  'Writer',
  'Social Media',
  'Video Editor',
  'Other'
];
