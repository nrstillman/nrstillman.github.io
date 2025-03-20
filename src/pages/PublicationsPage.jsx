import Layout from '../components/Layout';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Filter, FileCode, BookOpen, FileText, Users, ArrowUpDown } from 'lucide-react';
import { Cite } from '@citation-js/core';
import '@citation-js/plugin-bibtex';

const PublicationsPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    year: 'all',
    searchTerm: ''
  });
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation on component mount
  useEffect(() => {
    setLoaded(true);
    fetchBibTexFile();
  }, []);
  
  // Fetch and parse BibTeX file
  const fetchBibTexFile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/publications.bib');
      if (!response.ok) {
        throw new Error(`Failed to fetch BibTeX file: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log('BibTeX file content:', text.substring(0, 200) + '...');
      
      // Parse with citation-js
      const cite = new Cite(text);
      const citationData = cite.data;
      console.log('Citation.js parsed data:', citationData);
      
      // Convert to your format
      const parsedPublications = citationData.map(item => {
        // Map type from citation-js to your component type
        let pubType = 'article';
        if (item.type === 'article-journal' || item.type === 'article') pubType = 'article';
        else if (item.type === 'paper-conference' || item.type === 'inproceedings') pubType = 'conference';
        else if (item.type === 'book') pubType = 'book';
        else if (item.type === 'chapter' || item.type === 'incollection') pubType = 'book_chapter';
        
        // Extract authors names
        const authors = [];
        if (item.author) {
          item.author.forEach(author => {
            if (author.family && author.given) {
              authors.push(`${author.family}, ${author.given.charAt(0)}.`);
            } else if (author.literal) {
              authors.push(author.literal);
            }
          });
        } else if (typeof item.author === 'string') {
          // Handle string format if needed
          const authorString = item.author;
          authorString.split(' and ').forEach(author => {
            authors.push(author.trim());
          });
        }
        
        // Extract editors if present
        const editors = [];
        if (item.editor) {
          if (Array.isArray(item.editor)) {
            item.editor.forEach(editor => {
              if (editor.family && editor.given) {
                editors.push(`${editor.family}, ${editor.given.charAt(0)}.`);
              } else if (editor.literal) {
                editors.push(editor.literal);
              }
            });
          }
        }
        
        return {
          id: item.id || `pub-${Math.random().toString(36).substr(2, 9)}`,
          type: pubType,
          title: item.title || '',
          authors: authors,
          journal: item['container-title'] || item.journal || '',
          booktitle: item['container-title'] || item.booktitle || '',
          year: item.issued?.['date-parts']?.[0]?.[0] || item.year || 0,
          volume: item.volume || '',
          number: item.issue || item.number || '',
          pages: item.page || item.pages || '',
          publisher: item.publisher || '',
          doi: item.DOI || item.doi || '',
          isbn: item.ISBN || item.isbn || '',
          abstract: item.abstract || '',
          editor: editors
        };
      });
      
      console.log('Mapped publications:', parsedPublications);
      
      if (parsedPublications.length === 0) {
        throw new Error('No publications were parsed from the BibTeX file.');
      }
      
      // Sort by year (descending) by default
      parsedPublications.sort((a, b) => b.year - a.year);
      
      setPublications(parsedPublications);
      setFilteredPublications(parsedPublications);
    } catch (error) {
      console.error('Error in BibTeX processing:', error);
      
      // Fallback to sample data
      console.log('Falling back to sample data due to error:', error.message);
      const sampleData = [
        {
          id: 'sample1',
          type: 'conference',
          title: 'Deep Calibration of Market Simulations using Neural Density Estimators and Embedding Networks',
          authors: ['Stillman, N.', 'Baggott, R.', 'Lyon, J.', 'Zhang, J.', 'Zhu, D.', 'Chen, T.', 'Vytelingum, P.'],
          booktitle: 'Proceedings of the Fourth ACM International Conference on AI in Finance',
          year: 2023,
          pages: '46-54',
          publisher: 'ACM',
          abstract: ''
        },
        {
          id: 'sample2',
          type: 'conference',
          title: 'Deeper Hedging: A New Agent-based Model for Effective Deep Hedging',
          authors: ['Gao, K.', 'Weston, S.', 'Vytelingum, P.', 'Stillman, N.', 'Luk, W.', 'Guo, C.'],
          booktitle: 'Proceedings of the Fourth ACM International Conference on AI in Finance',
          year: 2023,
          pages: '270-278',
          publisher: 'ACM',
          abstract: ''
        }
      ];
      
      setPublications(sampleData);
      setFilteredPublications(sampleData);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters to publications
  useEffect(() => {
    let results = [...publications];
    
    // Filter by type
    if (filters.type !== 'all') {
      results = results.filter(pub => pub.type === filters.type);
    }
    
    // Filter by year
    if (filters.year !== 'all') {
      results = results.filter(pub => pub.year.toString() === filters.year);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(pub => 
        pub.title.toLowerCase().includes(term) ||
        pub.authors.some(author => author.toLowerCase().includes(term)) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(term))
      );
    }
    
    // Sort by year
    results.sort((a, b) => {
      return sortOrder === 'desc' ? b.year - a.year : a.year - b.year;
    });
    
    setFilteredPublications(results);
  }, [filters, publications, sortOrder]);
  
  // Get unique years from publications
  const getYears = () => {
    const years = [...new Set(publications.map(pub => pub.year))];
    return years.sort((a, b) => b - a); // Sort descending
  };
  
  // Format citation based on publication type
  const formatCitation = (pub) => {
    const authors = pub.authors.join(', ');
    
    switch (pub.type) {
      case 'article':
        return (
          <>
            {authors} ({pub.year}). <span className="italic">{pub.title}</span>. {pub.journal}, <span className="italic">{pub.volume}</span>({pub.number}), {pub.pages}.
          </>
        );
      case 'conference':
        return (
          <>
            {authors} ({pub.year}). <span className="italic">{pub.title}</span>. In {pub.booktitle} (pp. {pub.pages}).
          </>
        );
      case 'book':
        return (
          <>
            {authors} ({pub.year}). <span className="italic">{pub.title}</span>. {pub.publisher}.
          </>
        );
      case 'book_chapter':
        return (
          <>
            {authors} ({pub.year}). {pub.title}. In {pub.editor.join(', ')} (Eds.), <span className="italic">{pub.booktitle}</span> (pp. {pub.pages}). {pub.publisher}.
          </>
        );
      default:
        return (
          <>
            {authors} ({pub.year}). <span className="italic">{pub.title}</span>.
          </>
        );
    }
  };
  
  // Get icon for publication type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <FileText size={16} className="mr-2" />;
      case 'conference':
        return <Users size={16} className="mr-2" />;
      case 'book':
        return <BookOpen size={16} className="mr-2" />;
      case 'book_chapter':
        return <BookOpen size={16} className="mr-2" />;
      default:
        return <FileText size={16} className="mr-2" />;
    }
  };
  
  return (
    <Layout>      
      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto px-8 py-12 flex-grow">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-left">Publications</h1>
            <div className="flex items-center">
              <FileCode size={20} className="mr-2" />
              <a 
                href="/publications.bib" 
                download
                className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} hover:underline`}
              >
                Download BibTeX
              </a>
            </div>
          </div>
          
          {/* Featured Book Section */}
        <div className={`mb-12 p-8 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <h2 className="text-2xl font-bold mb-6 text-left">Featured Publication</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className={`aspect-[2/3] rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-black-100'} flex items-center justify-center`}>
                  <img 
                    src="/images/gnnia-cover.png" 
                    alt="Graph Neural Networks in Action book cover" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-3/4 text-left">
                <h3 className="text-xl font-bold mb-2">Graph Neural Networks in Action</h3>
                <p className="mb-4">Keita Broadwater & Namid Stillman (2025). <span className="italic">GNNs in Action</span>. Manning Press.</p>
                <p className="mb-4">ISBN: 978-1-6172-9905-6</p>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-100' : 'bg-gray-100'}`}>
                  <p className="mb-2 font-semibold">About this book:</p>
                  <p className="text-sm">Graph Neural Networks in Action teaches you how to analyze and make predictions on data structured as graphs. You’ll work with graph convolutional networks, attention networks, and auto-encoders to take on tasks like node classification, link prediction, working with temporal data, and object classification. Along the way, you’ll learn the best methods for training and deploying GNNs at scale—all clearly illustrated with well-annotated Python code!
                  </p>
                </div>
                <div className="mt-4">
                  <a 
                    href="https://shortener.manning.com/eyvV" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
                  >
                    View on Publisher's Website
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Academic Publications Heading */}
          <h2 className="text-2xl font-bold mb-6 text-left">Academic Publications</h2>
          
          {/* Filters */}
          <div className={`p-4 mb-8 rounded-lg flex flex-wrap gap-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} shadow-sm text-left`}>
            <div className="flex items-center">
              <Filter size={16} className="mr-2" />
              <span className="text-sm mr-2">Filter:</span>
            </div>
            
            {/* Type filter */}
            <div className="flex items-center">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className={`py-1 px-2 rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="conference">Conferences</option>
                <option value="book">Books</option>
                <option value="book_chapter">Book Chapters</option>
              </select>
            </div>
            
            {/* Year filter */}
            <div className="flex items-center">
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className={`py-1 px-2 rounded text-sm ${darkMode ? 'bg-white text-gray-800 border-gray-300' : 'bg-white text-gray-800 border-gray-300'} border`}
              >
                <option value="all">All Years</option>
                {getYears().map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>
            
            {/* Search */}
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search publications..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className={`w-full py-1 px-3 rounded text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
              />
            </div>
            
            {/* Sort order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className={`flex items-center py-1 px-3 rounded text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-gray-800 bg-gray-800 hover:bg-gray-300'}`}
            >
              <span className="mr-1">Year</span>
              <ArrowUpDown size={14} />
            </button>
          </div>
          
          {/* Publications list */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPublications.length === 0 ? (
                <p className="py-8 opacity-60 text-left">No publications match your filters.</p>
              ) : (
                filteredPublications.map((pub) => (
                  <div 
                    key={pub.id} 
                    className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-sm transition-all duration-300 hover:shadow-md text-left`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-1 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {getTypeIcon(pub.type)}
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="text-xl font-bold mb-2">{pub.title}</h3>
                        <p className="mb-3">{formatCitation(pub)}</p>
                        
                        {pub.doi && (
                          <a 
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} hover:underline`}
                          >
                            DOI: {pub.doi}
                          </a>
                        )}
                        
                        {pub.abstract && (
                          <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong>Abstract:</strong> {pub.abstract}
                          </p>
                        )}
                      </div>
                      <div className={`ml-4 text-lg font-bold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {pub.year}
                      </div>
                    </div>
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

export default PublicationsPage;