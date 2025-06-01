import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Promotion, FilterStatus, DateRange } from '../types';

interface PromotionContextType {
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, 'id' | 'status' | 'checklist'>) => void;
  updatePromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
  updateChecklistItem: (id: string, item: keyof Promotion['checklist'], value: boolean) => void;
  uploadFlyer: (id: string, flyerUrl: string) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  filterPromotions: () => Promotion[];
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const addPromotion = (promotion: Omit<Promotion, 'id' | 'status' | 'checklist'>) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString(),
      status: 'Pending Marketing',
      checklist: {
        emailSent: false,
        portalUploaded: false,
        whatsappShared: false
      }
    };
    setPromotions([...promotions, newPromotion]);
  };

  const updatePromotion = (updatedPromotion: Promotion) => {
    setPromotions(promotions.map(p => 
      p.id === updatedPromotion.id ? updatedPromotion : p
    ));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const updateChecklistItem = (id: string, item: keyof Promotion['checklist'], value: boolean) => {
    setPromotions(promotions.map(p => {
      if (p.id === id) {
        const updatedChecklist = { ...p.checklist, [item]: value };
        const allCompleted = Object.values(updatedChecklist).every(v => v);
        
        return {
          ...p,
          checklist: updatedChecklist,
          status: allCompleted ? 'Completed' : 'In Progress'
        };
      }
      return p;
    }));
  };

  const uploadFlyer = (id: string, flyerUrl: string) => {
    setPromotions(promotions.map(p => {
      if (p.id === id) {
        return {
          ...p,
          flyer: flyerUrl,
          status: 'In Progress'
        };
      }
      return p;
    }));
  };

  const filterPromotions = () => {
    return promotions.filter(p => {
      if (filterStatus !== 'All' && p.status !== filterStatus) {
        return false;
      }
      
      if (dateRange) {
        const promotionStart = new Date(p.startDate);
        const promotionEnd = new Date(p.endDate);
        const filterStart = new Date(dateRange.startDate);
        const filterEnd = new Date(dateRange.endDate);
        
        if (promotionEnd < filterStart || promotionStart > filterEnd) {
          return false;
        }
      }
      
      return true;
    });
  };

  return (
    <PromotionContext.Provider 
      value={{ 
        promotions, 
        addPromotion, 
        updatePromotion,
        deletePromotion,
        updateChecklistItem, 
        uploadFlyer,
        filterStatus,
        setFilterStatus,
        dateRange,
        setDateRange,
        filterPromotions
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};

export const usePromotions = () => {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
};