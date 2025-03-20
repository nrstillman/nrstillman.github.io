import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import ResearchPage from './pages/ResearchPage';
import PublicationsPage from './pages/PublicationsPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;