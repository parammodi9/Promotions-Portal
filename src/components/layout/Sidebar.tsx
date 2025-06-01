import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Calendar, 
  CheckSquare, 
  FileText,
  Database
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/promotions', label: 'Manage Promotions', icon: <Database size={20} /> },
    { path: '/upload', label: 'Upload Promotion', icon: <Upload size={20} /> },
    { path: '/calendar', label: 'Calendar View', icon: <Calendar size={20} /> },
    { path: '/checklist', label: 'Promotion Checklist', icon: <CheckSquare size={20} /> },
    { path: '/export', label: 'Export Reports', icon: <FileText size={20} /> }
  ];
  
  return (
    <div className="h-full bg-[#012e71] text-white w-64 flex-shrink-0">
      <div className="p-6 border-b border-[#1a4585]">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <span className="text-[#e2b969]">HRA</span> Promotions
        </h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-[#1a4585] text-[#e2b969]' 
                    : 'hover:bg-[#1a4585] text-gray-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar