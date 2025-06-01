import React from 'react';
import { BarChart, Calendar, Upload, CheckSquare } from 'lucide-react';
import { usePromotions } from '../context/PromotionContext';
import MarketingPanel from '../components/marketing/MarketingPanel';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { promotions } = usePromotions();
  
  // Calculate statistics
  const totalPromotions = promotions.length;
  const pendingMarketing = promotions.filter(p => p.status === 'Pending Marketing').length;
  const inProgress = promotions.filter(p => p.status === 'In Progress').length;
  const completed = promotions.filter(p => p.status === 'Completed').length;
  
  // Get upcoming promotions (next 30 days)
  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);
  
  const upcomingPromotions = promotions.filter(p => {
    const startDate = new Date(p.startDate);
    return startDate >= today && startDate <= thirtyDaysLater;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Promotions</p>
              <h3 className="text-2xl font-bold text-[#012e71] mt-1">{totalPromotions}</h3>
            </div>
            <div className="p-3 bg-[#012e71] bg-opacity-10 rounded-full">
              <BarChart size={20} className="text-[#012e71]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Marketing</p>
              <h3 className="text-2xl font-bold text-amber-500 mt-1">{pendingMarketing}</h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <Upload size={20} className="text-amber-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <h3 className="text-2xl font-bold text-blue-500 mt-1">{inProgress}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar size={20} className="text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold text-green-500 mt-1">{completed}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckSquare size={20} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketing Panel */}
        <div className="lg:col-span-2">
          <MarketingPanel />
        </div>
        
        {/* Upcoming Promotions */}
        <div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#012e71]">Upcoming Promotions</h2>
              <Link to="/calendar" className="text-sm text-[#012e71] hover:underline">
                View Calendar
              </Link>
            </div>
            
            <div className="divide-y">
              {upcomingPromotions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Calendar size={32} className="mx-auto text-gray-300 mb-2" />
                  <p>No upcoming promotions in the next 30 days</p>
                </div>
              ) : (
                upcomingPromotions.slice(0, 5).map(promotion => (
                  <div key={promotion.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{promotion.brand}</h3>
                        <p className="text-sm text-gray-500">{promotion.company}</p>
                      </div>
                      <span className="text-xs text-[#012e71] bg-[#012e71] bg-opacity-10 px-2 py-1 rounded">
                        {new Date(promotion.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {promotion.details}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            {upcomingPromotions.length > 5 && (
              <div className="p-3 border-t text-center">
                <Link to="/calendar" className="text-sm text-[#012e71] hover:underline">
                  View {upcomingPromotions.length - 5} more
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;