import React from 'react';
import { useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Upload Promotion';
      case '/calendar':
        return 'Calendar View';
      case '/checklist':
        return 'Promotion Checklist';
      case '/export':
        return 'Export Reports';
      default:
        return 'HRA Promotion Management Portal';
    }
  };
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-[#012e71]">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">Admin User</p>
          <p className="text-xs text-gray-500">HRA Management</p>
        </div>
        <UserCircle size={36} className="text-[#012e71]" />
      </div>
    </header>
  );
};

export default Header;