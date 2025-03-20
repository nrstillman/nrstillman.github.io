import React from 'react';

const Footer = ({ className = "" }) => {
  // Access environment variables with fallbacks
  const buildDate = process.env.REACT_APP_BUILD_DATE || 'March 12, 2025';
  const version = process.env.REACT_APP_VERSION || 'v1.0';
  
  return (
    <div className={`pt-8 border-t border-gray-300 flex justify-between opacity-70 ${className}`}>
      <span>Last updated {buildDate}</span>
      <span>{version}</span>
    </div>
  );
};

export default Footer;