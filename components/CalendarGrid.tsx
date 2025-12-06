import React from 'react';
import { CalendarEvent } from '../types';
import { getCalendarDays, isSameDay, DAYS_OF_WEEK } from '../utils/dateUtils';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onAddEvent: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEvent
}) => {
  const calendarDays = getCalendarDays(currentDate);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((dayObj, index) => {
          const isSelected = isSameDay(dayObj.date, selectedDate);
          const isToday = isSameDay(dayObj.date, new Date());
          
          // Get events for this day
          const daysEvents = events.filter(e => isSameDay(new Date(e.startDate), dayObj.date));
          // Limit shown dots
          const shownEvents = daysEvents.slice(0, 4);
          
          return (
            <div
              key={index}
              onClick={() => onSelectDate(dayObj.date)}
              onDoubleClick={() => onAddEvent(dayObj.date)}
              className={`
                min-h-[100px] border-b border-r border-slate-100 p-2 relative transition-all cursor-pointer hover:bg-slate-50
                ${!dayObj.isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-700'}
                ${isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/50 z-10' : ''}
              `}
            >
               {/* Day Number */}
              <div className="flex justify-between items-start">
                 <span className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : ''}
                 `}>
                   {dayObj.day}
                 </span>
              </div>

              {/* Event Dots/Bars */}
              <div className="mt-2 space-y-1">
                {shownEvents.map(event => (
                   <div 
                     key={event.id}
                     className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium ${event.color} bg-opacity-15 text-slate-700 border-l-2 ${event.color.replace('bg-', 'border-')}`}
                   >
                     {event.title}
                   </div>
                ))}
                {daysEvents.length > 4 && (
                   <div className="text-[10px] text-slate-400 pl-1">
                      + {daysEvents.length - 4} more
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
