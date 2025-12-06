export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO String
  endDate: string; // ISO String
  isAllDay: boolean;
  color: string;
}

export enum ViewMode {
  Month = 'MONTH',
  Week = 'WEEK'
}

export const EVENT_COLORS = [
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-teal-500',
];
