import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Submit } from './pages/Submit';
import { ProjectDetail } from './pages/ProjectDetail';
import { Admin } from './pages/Admin';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;
