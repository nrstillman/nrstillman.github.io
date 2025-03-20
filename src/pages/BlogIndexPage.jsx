import Layout from '../components/Layout';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Tag, Calendar, ArrowRight } from 'lucide-react';

// Helper function to parse frontmatter
const parseFrontMatter = (content) => {
  const frontMatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontMatterRegex.exec(content);
  
  if (!match) return { frontMatter: {}, content };
  
  const frontMatterStr = match[1];
  const mainContent = content.replace(frontMatterRegex, '').trim();
  
  // Parse the YAML frontmatter
  const frontMatter = {};
  frontMatterStr.split('\n').forEach(line => {
    if (line.trim() === '') return;
    
    // Handle nested properties (indentation)
    if (line.startsWith('  - ')) {
      const key = frontMatter._lastKey;
      if (!frontMatter[key]) frontMatter[key] = [];
      frontMatter[key].push(line.replace('  - ', '').trim());
      return;
    }
    
    const [key, ...values] = line.split(':');
    if (!key) return;
    
    const value = values.join(':').trim();
    frontMatter[key.trim()] = value;
    frontMatter._lastKey = key.trim();
  });
  
  // Clean up helper property
  delete frontMatter._lastKey;
  
  return { frontMatter, content: mainContent };
};

// Helper to extract a brief excerpt from markdown
const extractExcerpt = (markdown, maxLength = 150) => {
  // Remove headers, links, images, and other markdown syntax
  const plainText = markdown
    .replace(/#+\s+/g, '') // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just their text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  // Create excerpt, not cutting words in the middle
  if (plainText.length <= maxLength) return plainText;
  
  const excerpt = plainText.substr(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  
  return excerpt.substr(0, lastSpaceIndex) + '...';
};

const BlogIndexPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  
  // Animation on component mount
  useEffect(() => {
    setLoaded(true);
    loadBlogPosts();
  }, []);
  
  // Load all blog posts from the public/blog-posts directory
  const loadBlogPosts = async () => {
    setIsLoading(true);
    
    try {
      const postsManifest = [
        'blackboxes-blackswans',
        // 'neural-networks-explained',
        // 'financial-modeling-with-python',
        'whatisamodel'
      ];
      
      const posts = [];
      
      // Load each post
      for (const postId of postsManifest) {
        try {
          const response = await fetch(`/blog-posts/${postId}.md`);
          
          if (!response.ok) {
            console.warn(`Failed to load blog post: ${postId}`);
            continue;
          }
          
          const markdownText = await response.text();
          const { frontMatter, content } = parseFrontMatter(markdownText);
          
          // Create post object
          const post = {
            id: postId,
            title: frontMatter.title || 'Untitled Post',
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            excerpt: extractExcerpt(content),
            readTime: frontMatter.readTime || '5 min read',
            tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : []
          };
          
          posts.push(post);
        } catch (error) {
          console.error(`Error loading post ${postId}:`, error);
        }
      }
      
      // Sort by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setBlogPosts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get all unique tags
  const getAllTags = () => {
    const tags = new Set();
    tags.add('All');
    
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    
    return Array.from(tags);
  };
  
  // Filter posts by tag
  const getFilteredPosts = () => {
    if (activeTag === 'All') {
      return blogPosts;
    }
    return blogPosts.filter(post => post.tags.includes(activeTag));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto px-8 py-12 flex-grow">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Blog header */}
          <div className="mb-10 text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3">Blog</h1>
            <p className="text-lg opacity-80">Thoughts on science, AI, and technology</p>
          </div>
          
          {/* Tags filter */}
          <div className={`py-3 px-4 mb-8 rounded-lg flex flex-wrap gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm text-left overflow-x-auto`}>
            {getAllTags().map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeTag === tag
                    ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                    : (darkMode ? 'bg-gray-200 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300')
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Blog posts list */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {getFilteredPosts().length === 0 ? (
                <p className="text-center py-8 opacity-60">No blog posts found. Check back soon!</p>
              ) : (
                getFilteredPosts().map((post) => (
              <div 
                key={post.id} 
                className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-sm transition-all duration-300 hover:shadow-md text-left`}
              >
                {/* Tags with explicit text colors */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Title with explicit text color */}
                <Link to={`/blog/${post.id}`}>
                  <h2 className={`text-2xl font-bold mb-2 hover:underline ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h2>
                </Link>
                
                {/* Date/time info with explicit text color */}
                <div className={`flex items-center text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(post.date)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                {/* Excerpt with explicit text color */}
                <p className={`mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {post.excerpt}
                </p>
                
                {/* Link remains the same */}
                <Link 
                  to={`/blog/${post.id}`}
                  className={`inline-flex items-center text-sm font-medium ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Read more
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
                ))
              )}
            </div>
          )}

          <Footer className="mt-16" />
        </div>
      </div>
    </Layout>
  );
};

export default BlogIndexPage;