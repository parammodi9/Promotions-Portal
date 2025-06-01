import React, { useState } from 'react';
import { Upload, Plus, CheckSquare } from 'lucide-react';
import { usePromotions } from '../../context/PromotionContext';
import { Promotion } from '../../types';
import ChecklistItem from './ChecklistItem';

const MarketingPanel: React.FC = () => {
  const { promotions, uploadFlyer, updateChecklistItem } = usePromotions();
  const [activePromotion, setActivePromotion] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Filter pending promotions
  const pendingPromotions = promotions.filter(p => 
    p.status === 'Pending Marketing' || (p.status === 'In Progress' && !p.checklist.emailSent)
  );
  
  // Handle flyer upload (mock)
  const handleFlyerUpload = (id: string) => {
    setUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock flyer URL (in a real app, this would be the uploaded file URL)
      const mockFlyerUrl = `/sample/flyer-${id}.jpg`;
      uploadFlyer(id, mockFlyerUrl);
      setUploading(false);
    }, 1500);
  };
  
  // Handle checklist item toggle
  const handleChecklistToggle = (id: string, item: keyof Promotion['checklist']) => {
    updateChecklistItem(id, item, true);
  };
  
  if (pendingPromotions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <CheckSquare size={48} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">No Pending Promotions</h3>
        <p className="text-gray-500 mt-1">All promotions have been processed by the marketing team.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-[#012e71]">Marketing Tasks</h2>
        <p className="text-sm text-gray-500 mt-1">Upload flyers and complete marketing tasks for pending promotions</p>
      </div>
      
      <div className="divide-y">
        {pendingPromotions.map(promotion => (
          <div key={promotion.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium">{promotion.brand}</h3>
                <p className="text-sm text-gray-500">{promotion.company}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {!promotion.flyer ? (
                  <div>
                    <input
                      type="file"
                      id={`flyer-${promotion.id}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={() => handleFlyerUpload(promotion.id)}
                    />
                    <label
                      htmlFor={`flyer-${promotion.id}`}
                      className={`flex items-center gap-2 px-4 py-2 bg-[#e2b969] text-[#012e71] rounded-md cursor-pointer hover:bg-[#d5ad5e] transition-colors ${
                        uploading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload size={16} />
                      <span>Upload Flyer</span>
                    </label>
                  </div>
                ) : (
                  <button
                    onClick={() => setActivePromotion(activePromotion === promotion.id ? null : promotion.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#012e71] text-white rounded-md hover:bg-[#01235a] transition-colors"
                  >
                    <CheckSquare size={16} />
                    <span>Marketing Checklist</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Checklist Section */}
            {activePromotion === promotion.id && promotion.flyer && (
              <div className="mt-4 pl-4 border-l-4 border-[#e2b969]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Flyer Preview</h4>
                    <div className="border rounded overflow-hidden">
                      <img 
                        src={promotion.flyer} 
                        alt={`${promotion.brand} flyer`} 
                        className="w-full h-auto max-h-48 object-contain bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Marketing Checklist</h4>
                    <div className="space-y-2">
                      <ChecklistItem
                        id="emailSent"
                        label="Sent to Members via Email"
                        checked={promotion.checklist.emailSent}
                        onChange={() => handleChecklistToggle(promotion.id, 'emailSent')}
                      />
                      
                      <ChecklistItem
                        id="portalUploaded"
                        label="Uploaded to Member Portal"
                        checked={promotion.checklist.portalUploaded}
                        onChange={() => handleChecklistToggle(promotion.id, 'portalUploaded')}
                      />
                      
                      <ChecklistItem
                        id="whatsappShared"
                        label="Shared via WhatsApp"
                        checked={promotion.checklist.whatsappShared}
                        onChange={() => handleChecklistToggle(promotion.id, 'whatsappShared')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingPanel;