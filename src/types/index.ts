// Type definitions for HRA Promotion Management Portal

export interface Promotion {
  id: string;
  brand: string;
  company: string;
  details: string;
  supportingDocs: string[];
  comments?: string;
  startDate: string;
  endDate: string;
  status: 'Pending Marketing' | 'In Progress' | 'Completed';
  flyer?: string;
  checklist: {
    emailSent: boolean;
    portalUploaded: boolean;
    whatsappShared: boolean;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  color: string;
}

export type FilterStatus = 'All' | 'Completed' | 'In Progress' | 'Pending Marketing';

export interface DateRange {
  startDate: string;
  endDate: string;
}