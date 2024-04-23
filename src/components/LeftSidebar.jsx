// src/components/LeftSidebar.jsx
import React from 'react';
import Sidebar from 'react-sidebar';

const LeftSidebar = ({ isSidebarOpen, onSetSidebarOpen }) => {
  return (
    <Sidebar
      sidebar={<b>Sidebar content</b>}
      open={isSidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={{ sidebar: { background: 'white' } }}
    />
  );
};

export default LeftSidebar;