import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  FileText, 
  Download, 
  FileSpreadsheet 
} from 'lucide-react';
import { usePromotions } from '../../context/PromotionContext';
import { FilterStatus } from '../../types';

const ExportReports: React.FC = () => {
  const { promotions, filterStatus, setFilterStatus } = usePromotions();
  
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [brand, setBrand] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'excel' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Get unique brands for filter
  const brands = Array.from(new Set(promotions.map(p => p.brand)));
  
  // Handle status filter change
  const handleStatusChange = (status: FilterStatus) => {
    setFilterStatus(status);
  };
  
  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    setDateRange({
      ...dateRange,
      [field]: e.target.value
    });
  };
  
  // Handle brand filter change
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(e.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilterStatus('All');
    setDateRange({ startDate: '', endDate: '' });
    setBrand('');
  };
  
  // Calculate filtered promotions count
  const getFilteredCount = () => {
    return promotions.filter(p => {
      // Filter by status
      if (filterStatus !== 'All' && p.status !== filterStatus) {
        return false;
      }
      
      // Filter by date range
      if (dateRange.startDate && dateRange.endDate) {
        const promotionStart = new Date(p.startDate);
        const promotionEnd = new Date(p.endDate);
        const filterStart = new Date(dateRange.startDate);
        const filterEnd = new Date(dateRange.endDate);
        
        // Check if there's any overlap between the date ranges
        if (promotionEnd < filterStart || promotionStart > filterEnd) {
          return false;
        }
      }
      
      // Filter by brand
      if (brand && p.brand !== brand) {
        return false;
      }
      
      return true;
    }).length;
  };
  
  // Handle export
  const handleExport = (type: 'pdf' | 'excel') => {
    setExportType(type);
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setExportType(null);
      }, 3000);
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#012e71] mb-6">Export Promotion Reports</h2>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          Report successfully exported as {exportType === 'pdf' ? 'PDF' : 'Excel'} file!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Filters Section */}
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Filter Reports</h3>
          
          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => handleDateRangeChange(e, 'startDate')}
                    className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71]"
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => handleDateRangeChange(e, 'endDate')}
                    className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71]"
                  />
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <div className="relative">
                <select
                  value={brand}
                  onChange={handleBrandChange}
                  className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71]"
                >
                  <option value="">All Brands</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Status
              </label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => handleStatusChange(e.target.value as FilterStatus)}
                  className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending Marketing">Pending Marketing</option>
                </select>
                <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Clear Filters */}
            {(filterStatus !== 'All' || dateRange.startDate || dateRange.endDate || brand) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#012e71] hover:text-[#01235a] font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Export Options */}
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Export Options</h3>
          
          <div className="p-5 border border-gray-200 rounded-md bg-gray-50">
            <div className="text-center mb-4">
              <p className="text-gray-700">
                <span className="font-medium">{getFilteredCount()}</span> promotions match your filters
              </p>
            </div>
            
            <div className="space-y-4">
              {/* PDF Export */}
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className={`flex items-center justify-between w-full p-4 border ${
                  exportType === 'pdf' 
                    ? 'border-[#012e71] bg-[#012e71] bg-opacity-5' 
                    : 'border-gray-200 bg-white'
                } rounded-md hover:border-[#012e71] hover:bg-[#012e71] hover:bg-opacity-5 transition-colors`}
              >
                <div className="flex items-center">
                  <FileText size={24} className={exportType === 'pdf' ? 'text-[#012e71]' : 'text-gray-500'} />
                  <div className="ml-3 text-left">
                    <p className={`font-medium ${exportType === 'pdf' ? 'text-[#012e71]' : 'text-gray-700'}`}>
                      PDF Report
                    </p>
                    <p className="text-xs text-gray-500">
                      Formatted, printable summary with checklist statuses
                    </p>
                  </div>
                </div>
                <Download size={18} className={exportType === 'pdf' ? 'text-[#012e71]' : 'text-gray-400'} />
              </button>
              
              {/* Excel Export */}
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className={`flex items-center justify-between w-full p-4 border ${
                  exportType === 'excel' 
                    ? 'border-[#012e71] bg-[#012e71] bg-opacity-5' 
                    : 'border-gray-200 bg-white'
                } rounded-md hover:border-[#012e71] hover:bg-[#012e71] hover:bg-opacity-5 transition-colors`}
              >
                <div className="flex items-center">
                  <FileSpreadsheet size={24} className={exportType === 'excel' ? 'text-[#012e71]' : 'text-gray-500'} />
                  <div className="ml-3 text-left">
                    <p className={`font-medium ${exportType === 'excel' ? 'text-[#012e71]' : 'text-gray-700'}`}>
                      Excel Report
                    </p>
                    <p className="text-xs text-gray-500">
                      Structured table with all promotion fields
                    </p>
                  </div>
                </div>
                <Download size={18} className={exportType === 'excel' ? 'text-[#012e71]' : 'text-gray-400'} />
              </button>
            </div>
            
            {isExporting && (
              <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded text-center text-sm text-blue-700">
                Preparing your {exportType === 'pdf' ? 'PDF' : 'Excel'} report...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;