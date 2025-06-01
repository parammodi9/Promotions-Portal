import React from 'react';
import { Check, X, Calendar, Search, Filter } from 'lucide-react';
import { usePromotions } from '../../context/PromotionContext';
import { FilterStatus, DateRange } from '../../types';

const ChecklistTable: React.FC = () => {
  const { 
    filterPromotions, 
    filterStatus, 
    setFilterStatus, 
    dateRange, 
    setDateRange 
  } = usePromotions();
  
  const filteredPromotions = filterPromotions();
  
  // Handle status filter change
  const handleStatusChange = (status: FilterStatus) => {
    setFilterStatus(status);
  };
  
  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'startDate' | 'endDate') => {
    const newRange = dateRange 
      ? { ...dateRange, [field]: e.target.value }
      : { startDate: '', endDate: '', [field]: e.target.value };
      
    setDateRange(newRange.startDate && newRange.endDate ? newRange : null);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilterStatus('All');
    setDateRange(null);
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending Marketing':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-xl font-semibold text-[#012e71]">Promotion Checklist</h2>
          
          <div className="flex flex-wrap gap-3 items-center">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => handleStatusChange(e.target.value as FilterStatus)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71] text-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Marketing">Pending Marketing</option>
              </select>
              <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={dateRange?.startDate || ''}
                  onChange={(e) => handleDateRangeChange(e, 'startDate')}
                  placeholder="Start Date"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71] text-sm"
                />
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative">
                <input
                  type="date"
                  value={dateRange?.endDate || ''}
                  onChange={(e) => handleDateRangeChange(e, 'endDate')}
                  placeholder="End Date"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[#012e71] text-sm"
                />
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Clear Filters */}
            {(filterStatus !== 'All' || dateRange) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Range
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flyer Uploaded
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Sent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Portal Uploaded
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WhatsApp Shared
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>No promotions found matching your filters</p>
                </td>
              </tr>
            ) : (
              filteredPromotions.map(promotion => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promotion.brand}</div>
                    <div className="text-xs text-gray-500">{promotion.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(promotion.status)}`}>
                      {promotion.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {promotion.flyer ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {promotion.checklist.emailSent ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {promotion.checklist.portalUploaded ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {promotion.checklist.whatsappShared ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-red-500" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChecklistTable;