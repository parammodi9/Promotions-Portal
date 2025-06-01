import React from 'react';
import { Check } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <div 
        className={`h-5 w-5 flex items-center justify-center rounded border ${
          checked 
            ? 'bg-[#012e71] border-[#012e71]' 
            : 'border-gray-300 bg-white'
        } cursor-pointer transition-colors duration-200`}
        onClick={onChange}
      >
        {checked && <Check size={14} className="text-white" />}
      </div>
      <label 
        htmlFor={id} 
        className="ml-2 text-sm text-gray-700 cursor-pointer"
        onClick={onChange}
      >
        {label}
      </label>
    </div>
  );
};

export default ChecklistItem;