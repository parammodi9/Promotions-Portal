import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePromotions } from '../../context/PromotionContext';
import { CalendarEvent } from '../../types';
import EventModal from './EventModal';

const CalendarView: React.FC = () => {
  const { promotions } = usePromotions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of month and number of days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Format date to YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Convert promotions to calendar events
  const getCalendarEvents = (): { [key: string]: CalendarEvent[] } => {
    const events: { [key: string]: CalendarEvent[] } = {};
    
    promotions.forEach(promotion => {
      const startDate = new Date(promotion.startDate);
      const endDate = new Date(promotion.endDate);
      
      // Skip promotions not in current month
      if (startDate.getMonth() !== currentMonth && endDate.getMonth() !== currentMonth) {
        return;
      }
      
      // Get status color
      let color = '#6B7280'; // Default gray
      if (promotion.status === 'Completed') {
        color = '#10B981'; // Green
      } else if (promotion.status === 'In Progress') {
        color = '#3B82F6'; // Blue
      } else if (promotion.status === 'Pending Marketing') {
        color = '#F59E0B'; // Amber
      }
      
      const event: CalendarEvent = {
        id: promotion.id,
        title: promotion.brand,
        start: promotion.startDate,
        end: promotion.endDate,
        status: promotion.status,
        color
      };
      
      // Add event to each day in the range
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (currentDate.getMonth() === currentMonth) {
          const dateStr = formatDate(currentYear, currentMonth, currentDate.getDate());
          if (!events[dateStr]) {
            events[dateStr] = [];
          }
          events[dateStr].push(event);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return events;
  };
  
  const calendarEvents = getCalendarEvents();
  
  // Create calendar grid
  const calendarDays = [];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Add weekday headers
  const weekdayHeaders = weekdays.map((day, index) => (
    <div key={`header-${index}`} className="text-center font-medium py-2 border-b">
      {day}
    </div>
  ));
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="bg-white border p-1 min-h-[100px]"></div>
    );
  }
  
  // Add cells for days in month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const events = calendarEvents[dateStr] || [];
    
    calendarDays.push(
      <div key={`day-${day}`} className="bg-white border p-1 min-h-[100px]">
        <div className="font-medium text-sm mb-1">{day}</div>
        <div className="space-y-1">
          {events.map((event, index) => (
            <div 
              key={`event-${event.id}-${index}`}
              className="text-xs p-1 rounded cursor-pointer truncate"
              style={{ backgroundColor: `${event.color}25`, borderLeft: `3px solid ${event.color}` }}
              onClick={() => setSelectedEvent(event.id)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Get selected promotion
  const selectedPromotion = selectedEvent 
    ? promotions.find(p => p.id === selectedEvent)
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-[#012e71]">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-[#012e71] text-white rounded-md hover:bg-[#01235a] transition-colors"
          >
            Today
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-px">
        {weekdayHeaders}
        {calendarDays}
      </div>
      
      {/* Event Modal */}
      {selectedPromotion && (
        <EventModal 
          promotion={selectedPromotion} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default CalendarView;