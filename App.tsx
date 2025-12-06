import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { CalendarGrid } from './components/CalendarGrid';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import { SmartInput } from './components/SmartInput';
import { CalendarEvent } from './types';
import { addMonths, MONTHS } from './utils/dateUtils';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    // Load from local storage
    const saved = localStorage.getItem('chronos_events');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<Date>(new Date());

  // Persist events
  useEffect(() => {
    localStorage.setItem('chronos_events', JSON.stringify(events));
  }, [events]);

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
    // Navigate to event date if far away
    const eventDate = new Date(event.startDate);
    if (eventDate.getMonth() !== currentDate.getMonth()) {
       setCurrentDate(eventDate);
    }
    setSelectedDate(eventDate);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const openNewEventModal = (date?: Date) => {
    setEditingEvent(null);
    setModalInitialDate(date || selectedDate);
    setIsModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      
      {/* Top Navigation Bar */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                <CalendarIcon className="w-6 h-6" />
             </div>
             <h1 className="text-xl font-bold tracking-tight text-slate-800">Chronos <span className="text-indigo-600">AI</span></h1>
          </div>

          <div className="flex-1 max-w-2xl mx-auto w-full">
             <SmartInput onEventCreated={handleAddEvent} referenceDate={selectedDate} />
          </div>

          <div className="flex items-center gap-3">
             <button onClick={handleToday} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
               Today
             </button>
             <button onClick={() => openNewEventModal()} className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all">
               <Plus className="w-4 h-4" /> New Event
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6 overflow-hidden flex flex-col lg:flex-row gap-6">
        
        {/* Calendar Section */}
        <div className="flex-1 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
           
           {/* Calendar Controls */}
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {MONTHS[currentDate.getMonth()]} <span className="text-slate-400 font-medium">{currentDate.getFullYear()}</span>
              </h2>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                 <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors">
                   <ChevronRight className="w-5 h-5" />
                 </button>
              </div>
           </div>

           {/* Grid */}
           <div className="flex-1 relative">
             <CalendarGrid 
               currentDate={currentDate}
               selectedDate={selectedDate}
               events={events}
               onSelectDate={setSelectedDate}
               onAddEvent={openNewEventModal}
             />
           </div>
        </div>

        {/* Sidebar Event List */}
        <div className="lg:h-[calc(100vh-140px)] h-auto rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
           <EventList 
             selectedDate={selectedDate}
             events={events}
             onEditEvent={openEditEventModal}
           />
        </div>

      </main>

      {/* Mobile FAB */}
      <button 
        onClick={() => openNewEventModal()}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-300 flex items-center justify-center z-30 hover:scale-110 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(e) => {
          if (editingEvent) {
            handleUpdateEvent(e);
          } else {
            handleAddEvent(e);
          }
        }}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
        initialDate={modalInitialDate}
        existingEvent={editingEvent}
      />
    </div>
  );
};

export default App;
