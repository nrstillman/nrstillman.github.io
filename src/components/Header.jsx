import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Header = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Map paths to nav items for active state detection
  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/' || currentPath === '/about';
    }
    return currentPath === path;
  };
  
  const navItems = [
    { path: '/', label: 'About' },
    { path: '/research', label: 'Research' },
    { path: '/publications', label: 'Publications' },
    { path: '/blog', label: 'Blog' }
  ];
  
  return (
    <>
      {/* Header with name and navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 pb-3 flex items-center justify-between relative">
        {/* Name */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-light tracking-wider">Namid R. Stillman</h3>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center transition-all duration-700">
          <ul className="flex space-x-8 mr-6">
            {navItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`transition-opacity ${
                    isActive(item.path) 
                      ? 'opacity-100 border-b border-current pb-1' 
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Theme toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>
        
        {/* Mobile menu controls */}
        <div className="flex items-center md:hidden">
          {/* Theme toggle - mobile */}
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 mr-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute z-50 w-full bg-white dark:bg-gray-900 shadow-lg">
          <ul className="flex flex-col w-full">
            {navItems.map(item => (
              <li key={item.path} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                <Link 
                  to={item.path} 
                  className={`block px-8 py-4 ${
                    isActive(item.path)
                      ? 'font-medium'
                      : 'opacity-80'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Signature line divider with gaps - brush/morse code style */}
      <div className="w-full relative -mt-1">
        <svg width="100%" height="30" className="text-current">
          <path 
            d="M0,15 C300,5 600,25 1200,15 C1500,10 1800,15 1900,15 M1950,15 L2050,15 M2100,15 L2250,15 M2300,15 L2400,15 M2450,15 L2550,15 M2650,15 L3000,15" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="transparent" 
          />
        </svg>
      </div>
    </>
  );
};

export default Header;