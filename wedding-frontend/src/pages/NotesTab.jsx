import React, { useState } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { CreateNoteModal } from '../components/modals/CreateNoteModal';

export const NotesTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState('Reminders (0)');

  const tabs = ['All Notes (0)', 'Notes (0)', 'Checklists (0)', 'Reminders (0)', 'Invoice/Receipts (0)'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
        <div className="flex items-center gap-4">
          <BookOpen size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Wedding Notes</h2>
            <p className="text-xs text-gray-500 font-medium">Capture your wedding planning journey, one note at a time</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search your notes..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none bg-gray-50" />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
            <Plus size={16}/> Create Note
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveNoteTab(tab)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeNoteTab === tab ? 'bg-slate-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button onClick={() => setIsModalOpen(true)} className="h-64 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-all gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="text-sm font-semibold">Create New Note</span>
        </button>
      </div>

      <CreateNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};