import React, { useState } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { CreateNoteModal } from '../components/modals/CreateNoteModal';

export const NotesTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState('Reminders (0)');

  const tabs = ['All Notes (0)', 'Notes (0)', 'Checklists (0)', 'Reminders (0)', 'Invoice/Receipts (0)'];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 md:p-6 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Wedding Notes</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Capture your wedding planning journey, one note at a time</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search your notes..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none bg-gray-50 focus:bg-white focus:border-amber-400 transition-all font-medium" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm shrink-0"
          >
            <Plus size={16}/> Create Note
          </button>
        </div>
      </div>

      {/* Filter Tabs Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveNoteTab(tab)} 
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeNoteTab === tab 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notes Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="h-60 md:h-64 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/20 transition-all gap-3 group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 group-hover:border-blue-500 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
            <Plus size={24} />
          </div>
          <span className="text-xs md:text-sm font-semibold">Create New Note</span>
        </button>
      </div>

      <CreateNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};