import React, { useState } from 'react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { parseNaturalLanguageEvent } from '../services/geminiService';
import { CalendarEvent } from '../types';

interface SmartInputProps {
  onEventCreated: (event: CalendarEvent) => void;
  referenceDate: Date;
}

export const SmartInput: React.FC<SmartInputProps> = ({ onEventCreated, referenceDate }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const parsedEvent = await parseNaturalLanguageEvent(input, referenceDate);
      
      if (parsedEvent && parsedEvent.title && parsedEvent.startDate && parsedEvent.endDate) {
        onEventCreated(parsedEvent as CalendarEvent);
        setInput('');
      } else {
        setError("Could not understand the event. Try being more specific.");
      }
    } catch (err) {
      setError("Failed to process with AI. Check your connection or API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isProcessing ? (
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to add an event... e.g., 'Lunch with Sarah tomorrow at 12:30 PM'"
          disabled={isProcessing}
          className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base"
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="absolute inset-y-2 right-2 flex items-center justify-center px-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-500 ml-4 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};
