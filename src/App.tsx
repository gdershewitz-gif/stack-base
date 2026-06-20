import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Analytics } from '@vercel/analytics/react';
import { Loader2 } from 'lucide-react';
import './index.css';

// Lazy load route components
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Browse = React.lazy(() => import('./pages/Browse').then(module => ({ default: module.Browse })));
const Submit = React.lazy(() => import('./pages/Submit').then(module => ({ default: module.Submit })));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail').then(module => ({ default: module.ProjectDetail })));
const Admin = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 20px' }}>
    <Loader2 className="animate-spin text-primary" size={48} />
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;
