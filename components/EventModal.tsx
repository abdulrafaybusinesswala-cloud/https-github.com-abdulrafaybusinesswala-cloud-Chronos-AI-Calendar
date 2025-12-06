import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, AlignLeft, Check } from 'lucide-react';
import { CalendarEvent, EVENT_COLORS } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  initialDate?: Date;
  existingEvent?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  existingEvent
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState(EVENT_COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      if (existingEvent) {
        setTitle(existingEvent.title);
        setDescription(existingEvent.description || '');
        const start = new Date(existingEvent.startDate);
        const end = new Date(existingEvent.endDate);
        
        setStartDate(start.toISOString().split('T')[0]);
        setStartTime(start.toTimeString().slice(0, 5));
        setEndDate(end.toISOString().split('T')[0]);
        setEndTime(end.toTimeString().slice(0, 5));
        setIsAllDay(existingEvent.isAllDay);
        setSelectedColor(existingEvent.color);
      } else {
        // Reset for new event
        const dateStr = (initialDate || new Date()).toISOString().split('T')[0];
        setTitle('');
        setDescription('');
        setStartDate(dateStr);
        setEndDate(dateStr);
        setStartTime('09:00');
        setEndTime('10:00');
        setIsAllDay(false);
        setSelectedColor(EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)]);
      }
    }
  }, [isOpen, initialDate, existingEvent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct ISO strings
    const startDateTime = new Date(`${startDate}T${isAllDay ? '00:00:00' : startTime}`);
    const endDateTime = new Date(`${endDate}T${isAllDay ? '23:59:59' : endTime}`);

    const newEvent: CalendarEvent = {
      id: existingEvent?.id || crypto.randomUUID(),
      title,
      description,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      isAllDay,
      color: selectedColor
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {existingEvent ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add Title"
              className="w-full text-xl font-medium text-slate-800 placeholder-slate-400 border-none focus:ring-0 p-0 focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            {/* Date/Time Row */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-400 mt-2.5" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>All Day</span>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-2">
                      <input 
                        type="date" 
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                      {!isAllDay && (
                        <input 
                          type="time" 
                          required
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-24 px-2 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      )}
                   </div>
                   <div className="flex items-center gap-2">
                      <input 
                        type="date" 
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                      {!isAllDay && (
                        <input 
                          type="time" 
                          required
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-24 px-2 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      )}
                   </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <AlignLeft className="w-5 h-5 text-slate-400 mt-2" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description..."
                rows={3}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Colors */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5" /> {/* Spacer */}
              <div className="flex flex-wrap gap-2">
                {EVENT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`${color} w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ring-offset-1 focus:ring-2 focus:ring-slate-400`}
                  >
                    {selectedColor === color && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
             {existingEvent && onDelete && (
               <button
                 type="button"
                 onClick={() => {
                   onDelete(existingEvent.id);
                   onClose();
                 }}
                 className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mr-auto"
               >
                 Delete
               </button>
             )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
