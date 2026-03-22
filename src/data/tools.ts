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
}

export const toolsData: Tool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    shortDescription: 'Write essays, brainstorm ideas, and summarize research in seconds',
    longDescription: 'ChatGPT is an AI language model developed by OpenAI, capable of generating human-like text based on context and past conversations. It is widely used for text generation, translation, summarizing, and more.',
    category: 'Writing & Copy',
    pricing: 'Freemium',
    websiteUrl: 'https://chatgpt.com',
    starRating: 5,
    featured: true,
    dateAdded: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    shortDescription: 'AI-powered search for deep market and competitor research',
    longDescription: 'Perplexity AI is a conversational search engine that answers queries using natural language predictive text. It is designed to provide direct answers with citations.',
    category: 'Research',
    pricing: 'Freemium',
    websiteUrl: 'https://perplexity.ai',
    starRating: 5,
    featured: true,
    dateAdded: new Date('2024-01-05').toISOString(),
  },
  {
    id: 'gamma',
    name: 'Gamma',
    shortDescription: 'Build stunning pitch decks from a text prompt in minutes',
    longDescription: 'Gamma is a new medium for presenting ideas, powered by AI. Create beautiful, engaging presentations, documents, or webpages without formatting and design work.',
    category: 'Design & Decks',
    pricing: 'Freemium',
    websiteUrl: 'https://gamma.app',
    starRating: 4,
    featured: true,
    dateAdded: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    shortDescription: 'Generate ad copy, email sequences, and social posts instantly',
    longDescription: 'Copy.ai is an AI writing tool that helps you create compelling copy for your business. It can write blog posts, social media content, product descriptions, and more.',
    category: 'Writing & Copy',
    pricing: 'Freemium',
    websiteUrl: 'https://copy.ai',
    starRating: 4,
    featured: false,
    dateAdded: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'apollo',
    name: 'Apollo.io',
    shortDescription: 'Find leads and automate personalized cold outreach campaigns',
    longDescription: 'Apollo is a data-first engagement platform that gives you the tools to find, engage, and close more deals. Access millions of verified contacts and companies.',
    category: 'Cold Outreach',
    pricing: 'Paid',
    websiteUrl: 'https://apollo.io',
    starRating: 4,
    featured: false,
    dateAdded: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'julius-ai',
    name: 'Julius AI',
    shortDescription: 'Upload a CSV and get instant charts, analysis, and insights',
    longDescription: 'Julius AI acts as your personal data analyst. Upload any dataset, and Julius will help you analyze it, generate charts, and uncover actionable insights.',
    category: 'Analytics',
    pricing: 'Freemium',
    websiteUrl: 'https://julius.ai',
    starRating: 5,
    featured: false,
    dateAdded: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'instantly',
    name: 'Instantly',
    shortDescription: 'AI-powered cold email tool for high-volume outreach',
    longDescription: 'Instantly helps you scale your email outreach campaigns with unlimited email sending accounts, unlimited warmup, and smart AI features.',
    category: 'Cold Outreach',
    pricing: 'Paid',
    websiteUrl: 'https://instantly.ai',
    starRating: 3,
    featured: false,
    dateAdded: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'canva-ai',
    name: 'Canva AI',
    shortDescription: 'Design social graphics and pitch decks with AI assistance',
    longDescription: 'Canva is a free-to-use online graphic design tool. Use the AI Magic Studio features to generate images, write copy, and create presentations quickly.',
    category: 'Design & Decks',
    pricing: 'Freemium',
    websiteUrl: 'https://canva.com',
    starRating: 4,
    featured: false,
    dateAdded: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'consensus',
    name: 'Consensus',
    shortDescription: 'Search 200M+ academic papers and get AI-summarized findings',
    longDescription: 'Consensus is an AI search engine that extracts findings exclusively from scientific research. It helps you find answers to questions based on peer-reviewed papers.',
    category: 'Research',
    pricing: 'Freemium',
    websiteUrl: 'https://consensus.app',
    starRating: 5,
    featured: false,
    dateAdded: new Date('2024-02-10').toISOString(),
  }
];
