export type Category = 
  | 'Writing & Copy'
  | 'Research'
  | 'Design & Decks'
  | 'Analytics'
  | 'Cold Outreach'
  | 'Productivity'
  | 'Video & Media'
  | 'Social Media'
  | 'Other';

export type PricingModel = 'Free' | 'Freemium' | 'Paid';

export interface Tool {
  id: string;
  name: string;
  icon?: string;
  shortDescription: string;
  longDescription: string;
  category: Category;
  pricing: PricingModel;
  websiteUrl: string;
  starRating: number;
  featured: boolean;
  dateAdded: string;
  submittedBy?: string;
  status?: string;
}

export const mapDbToTool = (dbTool: any): Tool => ({
  id: dbTool.id,
  name: dbTool.name,
  shortDescription: dbTool.short_description,
  longDescription: dbTool.long_description,
  category: dbTool.category as Category,
  pricing: dbTool.pricing as PricingModel,
  websiteUrl: dbTool.website_url,
  starRating: dbTool.star_rating,
  featured: dbTool.featured,
  dateAdded: dbTool.date_added,
  submittedBy: dbTool.submitted_by,
  status: dbTool.status,
});
