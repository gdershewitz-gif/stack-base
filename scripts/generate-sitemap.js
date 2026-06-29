import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
  
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });
  return env;
};

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase credentials. Sitemap will only contain static pages.');
}

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const BASE_URL = 'https://foundrboard.com';

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  let dynamicUrls = '';
  
  if (supabase) {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, date_added')
      .eq('status', 'approved');
      
    if (error) {
      console.error('Error fetching projects for sitemap:', error);
    } else if (projects) {
      dynamicUrls = projects.map(p => `
  <url>
    <loc>${BASE_URL}/project/${p.id}</loc>
    <lastmod>${new Date(p.date_added).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/browse</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/submit</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>${dynamicUrls}
</urlset>`;

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap().catch(console.error);
