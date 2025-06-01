import React, { useState } from 'react';
import { Calendar, Upload, X } from 'lucide-react';
import { usePromotions } from '../../context/PromotionContext';

const UploadForm: React.FC = () => {
  const { addPromotion } = usePromotions();
  
  const [formData, setFormData] = useState({
    brand: '',
    company: '',
    details: '',
    comments: '',
    startDate: '',
    endDate: ''
  });
  
  const [supportingDocs, setSupportingDocs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle file upload (mock)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the file to a server
    // Here we're just mocking the file upload by using a placeholder URL
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = [...supportingDocs];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        // Create a mock URL for demonstration
        const mockUrl = `/sample/document${supportingDocs.length + i + 1}.pdf`;
        newDocs.push(mockUrl);
      }
      
      setSupportingDocs(newDocs);
    }
  };
  
  // Remove document
  const removeDocument = (index: number) => {
    const newDocs = [...supportingDocs];
    newDocs.splice(index, 1);
    setSupportingDocs(newDocs);
  };
  
  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.brand.trim()) {
      errors.brand = 'Brand is required';
    }
    
    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }
    
    if (!formData.details.trim()) {
      errors.details = 'Promotion details are required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (supportingDocs.length === 0) {
      errors.supportingDocs = 'At least one supporting document is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        addPromotion({
          ...formData,
          supportingDocs
        });
        
        // Reset form
        setFormData({
          brand: '',
          company: '',
          details: '',
          comments: '',
          startDate: '',
          endDate: ''
        });
        setSupportingDocs([]);
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }, 1000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#012e71] mb-6">Upload New Promotion</h2>
      
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
          Promotion successfully uploaded! It will now appear as "Pending Marketing" in the calendar.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.brand ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]`}
              placeholder="Enter brand name"
            />
            {formErrors.brand && (
              <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
            )}
          </div>
          
          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                formErrors.company ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]`}
              placeholder="Enter company name"
            />
            {formErrors.company && (
              <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>
            )}
          </div>
        </div>
        
        {/* Promotion Details */}
        <div className="mb-6">
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
            Promotion Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border ${
              formErrors.details ? 'border-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]`}
            placeholder="Describe the promotion details"
          ></textarea>
          {formErrors.details && (
            <p className="mt-1 text-sm text-red-600">{formErrors.details}</p>
          )}
        </div>
        
        {/* Supporting Documents */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documents <span className="text-red-500">*</span>
          </label>
          
          <div className={`border-2 border-dashed ${
            formErrors.supportingDocs ? 'border-red-300' : 'border-gray-300'
          } rounded-md p-4 text-center`}>
            <input
              type="file"
              id="supportingDocs"
              onChange={handleFileUpload}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="supportingDocs"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-[#012e71]">Click to upload</span>
              <span className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
              </span>
            </label>
          </div>
          
          {supportingDocs.length > 0 && (
            <div className="mt-4 space-y-2">
              {supportingDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                  <div className="flex items-center">
                    <span className="text-sm">{doc.split('/').pop()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="p-1 rounded-full hover:bg-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {formErrors.supportingDocs && (
            <p className="mt-1 text-sm text-red-600">{formErrors.supportingDocs}</p>
          )}
        </div>
        
        {/* Extra Comments */}
        <div className="mb-6">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
            Extra Comments (Optional)
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]"
            placeholder="Any additional comments or instructions"
          ></textarea>
        </div>
        
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  formErrors.startDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]`}
              />
            </div>
            {formErrors.startDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
            )}
          </div>
          
          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border ${
                  formErrors.endDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#012e71]`}
              />
            </div>
            {formErrors.endDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-[#e2b969] text-[#012e71] font-medium rounded-md hover:bg-[#d5ad5e] transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Promotion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;