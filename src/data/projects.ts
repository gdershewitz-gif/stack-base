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
}

export interface Comment {
  id: string;
  projectId: string;
  authorName: string;
  content: string;
  dateAdded: string;
}

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
  dateAdded: dbProj.date_added
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
