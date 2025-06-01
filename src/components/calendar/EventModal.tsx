import React from 'react';
import { X, FileText, CheckSquare, Calendar } from 'lucide-react';
import { Promotion } from '../../types';
import { usePromotions } from '../../context/PromotionContext';

interface EventModalProps {
  promotion: Promotion;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ promotion, onClose }) => {
  const { updateChecklistItem } = usePromotions();
  
  // Get formatted date range
  const formatDateRange = () => {
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };
  
  // Handle checklist item toggle
  const handleChecklistToggle = (item: keyof Promotion['checklist']) => {
    updateChecklistItem(promotion.id, item, !promotion.checklist[item]);
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (promotion.status) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold text-[#012e71]">{promotion.brand} Promotion</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {promotion.status}
              </span>
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <Calendar size={16} className="mr-1" />
                {formatDateRange()}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{promotion.company}</p>
            </div>
          </div>
          
          {/* Details */}
          <div>
            <h4 className="font-medium mb-2">Promotion Details</h4>
            <p className="text-gray-700">{promotion.details}</p>
            
            {promotion.comments && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Additional Comments</h4>
                <p className="text-gray-700">{promotion.comments}</p>
              </div>
            )}
          </div>
          
          {/* Supporting Documents */}
          {promotion.supportingDocs && promotion.supportingDocs.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Supporting Documents</h4>
              <div className="space-y-2">
                {promotion.supportingDocs.map((doc, index) => (
                  <a 
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 border rounded hover:bg-gray-50"
                  >
                    <FileText size={16} className="mr-2 text-[#012e71]" />
                    <span className="text-sm">Document {index + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Marketing Materials */}
          {promotion.flyer && (
            <div>
              <h4 className="font-medium mb-2">Marketing Flyer</h4>
              <div className="border rounded-lg overflow-hidden">
                <img 
                  src={promotion.flyer} 
                  alt={`${promotion.brand} flyer`} 
                  className="w-full h-auto max-h-64 object-contain bg-gray-50"
                />
              </div>
            </div>
          )}
          
          {/* Checklist */}
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <CheckSquare size={18} className="mr-2 text-[#012e71]" />
              Promotion Checklist
            </h4>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailSent"
                  checked={promotion.checklist.emailSent}
                  onChange={() => handleChecklistToggle('emailSent')}
                  className="h-4 w-4 text-[#012e71] border-gray-300 rounded"
                />
                <label htmlFor="emailSent" className="ml-2 text-sm text-gray-700">
                  Sent to Members via Email
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="portalUploaded"
                  checked={promotion.checklist.portalUploaded}
                  onChange={() => handleChecklistToggle('portalUploaded')}
                  className="h-4 w-4 text-[#012e71] border-gray-300 rounded"
                />
                <label htmlFor="portalUploaded" className="ml-2 text-sm text-gray-700">
                  Uploaded to Member Portal
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsappShared"
                  checked={promotion.checklist.whatsappShared}
                  onChange={() => handleChecklistToggle('whatsappShared')}
                  className="h-4 w-4 text-[#012e71] border-gray-300 rounded"
                />
                <label htmlFor="whatsappShared" className="ml-2 text-sm text-gray-700">
                  Shared via WhatsApp
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;