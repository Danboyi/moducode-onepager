"use client";

import React from 'react';

interface HeaderProps {
  className?: string;
  sticky?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', sticky = true }) => {
  const handleRequestTalentClick = () => {
    const formSection = document.getElementById('request-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`w-full bg-white shadow-sm border-b border-gray-200 ${
        sticky ? 'fixed top-0 z-50' : ''
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="text-xl font-bold text-gray-900">
            Moducode
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex items-center">
          <button
            onClick={handleRequestTalentClick}
            className="text-gray-700 hover:text-green-600 font-medium px-3 py-2 rounded-md transition-colors duration-200"
            aria-label="Navigate to request talent form"
          >
            Request Talent
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;