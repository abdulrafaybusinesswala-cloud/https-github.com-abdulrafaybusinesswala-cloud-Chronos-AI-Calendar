import React from 'react';
import { CalendarEvent } from '../types';
import { formatDate, isSameDay } from '../utils/dateUtils';
import { Clock, Calendar as CalendarIcon, MapPin } from 'lucide-react';

interface EventListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({ selectedDate, events, onEditEvent }) => {
  const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), selectedDate));
  
  // Sort events: All-day first, then by time
  dayEvents.sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="w-full lg:w-80 border-l border-slate-200 bg-white flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">{selectedDate.getDate()}</h2>
        <p className="text-slate-500 font-medium">{formatDate(selectedDate)}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
             <CalendarIcon className="w-12 h-12 mb-2 opacity-20" />
             <p>No events for this day</p>
          </div>
        ) : (
          dayEvents.map(event => (
            <div 
              key={event.id}
              onClick={() => onEditEvent(event)}
              className={`p-3 rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group bg-white hover:border-indigo-100`}
            >
              <div className="flex items-start gap-3">
                 <div className={`w-1 h-10 rounded-full ${event.color} mt-1`}></div>
                 <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {event.isAllDay ? (
                        <span>All Day</span>
                      ) : (
                        <span>
                          {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                          {' - '}
                          {new Date(event.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.description}</p>
                    )}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
