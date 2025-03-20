import Layout from '../components/Layout';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, Calendar, Clock, Tag, Info, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// YAML frontmatter parser
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

// Parse JSON footnotes/notes
const parseNotes = (content) => {
  // Match [^1]: {JSON} style footnotes
  const notesRegex = /\[\^(\d+)\]:\s*({[\s\S]*?})/g;
  const notes = [];
  let contentWithoutNotes = content;
  
  let match;
  while ((match = notesRegex.exec(content)) !== null) {
    const id = parseInt(match[1], 10);
    const jsonStr = match[2];
    
    try {
      const noteData = JSON.parse(jsonStr);
      notes.push({ id, ...noteData });
      
      // Remove note definitions from the content
      contentWithoutNotes = contentWithoutNotes.replace(match[0], '');
    } catch (error) {
      console.error('Error parsing note JSON:', error);
    }
  }
  
  return { notes, contentWithoutNotes };
};

const BlogPostPage = () => {
  const { postId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Use an array to track active notes instead of a single index
  const [activeNotes, setActiveNotes] = useState([]);
  
  // Animation on component mount
  useEffect(() => {
    setLoaded(true);
    loadBlogPost();
  }, [postId]);
  
  // Load blog post from Markdown file
  const loadBlogPost = async () => {
    setIsLoading(true);
    
    try {
      // Fetch the Markdown file
      const response = await fetch(`/blog-posts/${postId}.md`);
      
      if (!response.ok) {
        throw new Error(`Blog post not found: ${response.status}`);
      }
      
      const markdownText = await response.text();
      
      // Parse frontmatter and content
      const { frontMatter, content } = parseFrontMatter(markdownText);
      
      // Parse notes
      const { notes, contentWithoutNotes } = parseNotes(content);
      
      // Construct the post object
      const blogPost = {
        id: postId,
        title: frontMatter.title || 'Untitled Post',
        date: frontMatter.date || new Date().toISOString().split('T')[0],
        readTime: frontMatter.readTime || '5 min read',
        tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
        content: contentWithoutNotes,
        notes: notes
      };
      
      setPost(blogPost);
    } catch (error) {
      console.error('Error loading blog post:', error);
      // Post not found or error occurred
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Toggle a note in the active notes array
  const toggleNote = (noteIndex) => {
    if (activeNotes.includes(noteIndex)) {
      // Remove note if already active
      setActiveNotes(activeNotes.filter(idx => idx !== noteIndex));
    } else {
      // Add note to active notes
      setActiveNotes([...activeNotes, noteIndex]);
    }
  };
  
  // Remove a note from active notes
  const removeNote = (noteIndex) => {
    setActiveNotes(activeNotes.filter(idx => idx !== noteIndex));
  };
  
  // Custom renderer components for ReactMarkdown
  const MarkdownComponents = {

    // Custom paragraph renderer
    p: ({ node, children }) => {
      return (
        <p className="mb-4 whitespace-pre-line">
          {children}
        </p>
      );
    },
    
    // Handle strong/bold text as interactive
    strong: ({ node, children }) => {
      // Find if this bold text has a reference marker
      const text = String(children);
      const referenceMatch = text.match(/^(.*)\[#(\d+)\]$/);
      
      if (!referenceMatch) {
        // Regular bold text, no reference
        return <strong>{children}</strong>;
      }
      
      const actualText = referenceMatch[1];
      const noteId = parseInt(referenceMatch[2], 10);
      const noteIndex = post.notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        return <strong>{actualText}</strong>;
      }
      
      return (
        <strong 
          className="cursor-pointer border-b border-current hover:opacity-80 transition-opacity"
          onClick={() => toggleNote(noteIndex)}
        >
          {actualText}
        </strong>
      );
    },
    
    // Handle emphasis/italic text as interactive (optional)
    em: ({ node, children }) => {
      // Find if this italic text has a reference marker
      const text = String(children);
      const referenceMatch = text.match(/^(.*)\[#(\d+)\]$/);
      
      if (!referenceMatch) {
        // Regular italic text, no reference
        return <em>{children}</em>;
      }
      
      const actualText = referenceMatch[1];
      const noteId = parseInt(referenceMatch[2], 10);
      const noteIndex = post.notes.findIndex(note => note.id === noteId);
      
      if (noteIndex === -1) {
        return <em>{actualText}</em>;
      }
      
      return (
        <em 
          className="cursor-pointer border-b border-current hover:opacity-80 transition-opacity"
          onClick={() => toggleNote(noteIndex)}
        >
          {actualText}
        </em>
      );
    },
    
    // Process links that are actually note references
    a: ({ node, href, children }) => {
      if (href && href.startsWith('#note-')) {
        const noteId = parseInt(href.replace('#note-', ''), 10);
        const noteIndex = post.notes.findIndex(note => note.id === noteId);
        
        if (noteIndex !== -1) {
          return (
            <span 
              className="cursor-pointer underline text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => toggleNote(noteIndex)}
            >
              {children}
            </span>
          );
        }
      }
      
      // Regular link
      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    }
  };
  
  return (
    <Layout>
      
      {/* Main content */}
      {isLoading ? (
        <div className="w-full max-w-7xl mx-auto px-8 py-12 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
        </div>
      ) : post ? (
        <div className="w-full max-w-7xl mx-auto px-8 py-6 flex-grow flex flex-col lg:flex-row">
          {/* Left side - Blog post content (2/3) */}
          <div className="w-full lg:w-3/5 pr-0 lg:pr-12 text-left">
            <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Blog post header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">{post.title}</h1>
                
                <div className="flex items-center text-sm mb-6 opacity-70">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(post.date)}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              
              {/* Blog post content */}
              <div className={`prose prose-lg ${darkMode ? 'prose-invert' : ''} max-w-none text-left`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
              
              <Footer className="mt-16" />
            </div>
          </div>
          
          {/* Right side - Additional notes (1/3) */}
          <div className={`hidden lg:block lg:w-2/5 transition-all duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } bg-gray-200 text-gray-800`}>
            <div className="sticky top-0 max-h-screen w-full flex flex-col items-start justify-start overflow-y-auto">
              <div className="p-6 w-full text-left">
                <div className="flex items-center justify-between mb-6 w-full">
                  <div className="flex items-center">
                    <Info size={18} className="mr-2" />
                    <h3 className="text-xl font-bold">Additional Information</h3>
                  </div>
                  
                  {activeNotes.length > 0 && (
                    <button 
                      onClick={() => setActiveNotes([])}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {activeNotes.length === 0 ? (
                  <div className="p-6 opacity-70 text-left">
                    <p>Click on highlighted text in the article to see additional information.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeNotes.map((noteIndex, i) => (
                      <div 
                        key={`note-${noteIndex}`}
                        className={`p-4 rounded-lg relative -mt-2 first:mt-0 ${
                          post.notes[noteIndex].type === 'code'
                            ? (darkMode ? 'bg-gray-900' : 'bg-gray-100') 
                            : (darkMode ? 'bg-gray-700' : 'bg-white')
                        } transition-all duration-300 shadow-md`}
                        style={{ zIndex: activeNotes.length - i }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-left">{post.notes[noteIndex].title}</h4>
                          <button 
                            onClick={() => removeNote(noteIndex)}
                            className="p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-20 transition-colors"
                            aria-label="Close"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        
                        <div className={`${post.notes[noteIndex].type === 'code' ? 'font-mono text-sm' : ''} text-left`}>
                          {post.notes[noteIndex].type === 'code' ? (
                            <div className="text-left">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.notes[noteIndex].content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-left">{post.notes[noteIndex].content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto px-8 py-12 flex-grow">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="mb-6">Sorry, the blog post you're looking for doesn't exist.</p>
            <Link 
              to="/blog" 
              className={`inline-flex items-center px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BlogPostPage;