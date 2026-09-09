import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Calendar, Trash2 } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

export const Header = ({ onProfileClick }) => {
  const { data, events, activeEventId, setActiveEventId, createNewEvent, deleteEvent } = useWedding();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [newEventType, setNewEventType] = useState('Birthday');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newEventType.trim()) return;
    createNewEvent(newEventType);
    setIsNewEventModalOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-50 relative">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium relative">
        <span>My Project</span>
        <ChevronRight size={14} className="text-gray-400"/>
        
        {/* Event Type Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 font-semibold hover:bg-rose-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 
            {data?.eventType || 'Wedding'}
            <ChevronDown size={12} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Switch / Manage Events</div>
              {events.map(ev => (
                <div 
                  key={ev._id}
                  className={`w-full px-4 py-2 text-xs font-semibold hover:bg-gray-50 flex items-center justify-between group ${ev._id === activeEventId ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                >
                  <button
                    onClick={() => {
                      setActiveEventId(ev._id);
                      setIsDropdownOpen(false);
                    }}
                    className="flex-1 text-left flex items-center justify-between"
                  >
                    <span>{ev.eventType || 'Wedding'}</span>
                    {ev._id === activeEventId && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  </button>
                  {events.length > 1 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(ev._id);
                      }}
                      className="ml-2 text-gray-300 hover:text-rose-500 transition-colors p-1"
                      title="Delete Event"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsNewEventModalOpen(true);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New Event
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onProfileClick} className="border border-gray-300 text-gray-700 text-xs px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-50">
          Profile
        </button>
      </div>

      {/* New Event Modal */}
      {isNewEventModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600"/> Create New Event
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Event Type / Name</label>
              <input 
                type="text" 
                value={newEventType} 
                onChange={e => setNewEventType(e.target.value)} 
                placeholder="e.g. Birthday, Anniversary, Corporate" 
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none font-medium focus:border-blue-500" 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setIsNewEventModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};