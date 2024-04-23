// src/components/Header.jsx
import React from 'react';

const Header = ({ isSidebarOpen, setSidebarOpen }) => {
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="bg-blue-500 p-8">
      <button onClick={toggleSidebar} className="mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-white text-2xl font-bold">Ride Share Tracking</h1>
    </header>
  );
};

export default Header;