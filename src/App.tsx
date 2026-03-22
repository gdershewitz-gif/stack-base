import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Submit } from './pages/Submit';
import { ToolDetail } from './pages/ToolDetail';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/tool/:id" element={<ToolDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
