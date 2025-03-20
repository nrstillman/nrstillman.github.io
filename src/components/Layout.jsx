// Layout.js - modified
import React, { useState, useEffect } from 'react';
import Header from './Header';

const Layout = ({ children, className = "" }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Animation on component mount
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  // Clone children with darkMode props
  const childrenWithProps = React.Children.map(children, child => {
    // Check if child is a valid React element
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { darkMode, setDarkMode });
    }
    return child;
  });
  
  return (
    <div className={`w-full min-h-screen flex flex-col ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
    } transition-colors duration-500`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className={`flex-grow ${className} ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } transition-all duration-1000`}>
        {childrenWithProps}
      </main>
    </div>
  );
};

export default Layout;