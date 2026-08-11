import React, { useState } from 'react';
import { X, BookOpen, CheckSquare, Bell, FileText, Upload } from 'lucide-react';
import axios from 'axios';

export const CreateNoteModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [activeTab, setActiveTab] = useState('Note');
  const [color, setColor] = useState('bg-amber-100');
  const [isPinned, setIsPinned] = useState(false);

  const [noteContent, setNoteContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderDetails, setReminderDetails] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    let content = {};
    if (activeTab === 'Note') content = { text: noteContent };
    if (activeTab === 'Reminder') content = { date: reminderDate, time: reminderTime, details: reminderDetails };

    const payload = { type: activeTab, content, color, isPinned };
    try {
      const res = await axios.post('http://localhost:5000/api/notes', payload);
      onSaveSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-xl">Create New Note</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('Note')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'Note' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-600'}`}><BookOpen size={16} /> Note</button>
            <button onClick={() => setActiveTab('Checklist')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'Checklist' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-600'}`}><CheckSquare size={16} /> Checklist</button>
            <button onClick={() => setActiveTab('Reminder')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'Reminder' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-600'}`}><Bell size={16} /> Reminder</button>
            <button onClick={() => setActiveTab('Invoice/Receipts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold ${activeTab === 'Invoice/Receipts' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-600'}`}><FileText size={16} /> Invoice/Receipts</button>
          </div>

          <div className="space-y-4">
            {activeTab === 'Note' && (
              <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write your note..." className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm outline-none resize-none font-medium" />
            )}
            {activeTab === 'Reminder' && (
              <>
                <p className="text-sm font-bold text-gray-800">Reminder Date & Time</p>
                <div className="flex gap-4">
                  <input type="date" value={reminderDate} onChange={e => setReminderDate(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-3 text-sm outline-none" />
                  <input type="text" placeholder="HH : MM : AM" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-3 text-sm outline-none" />
                </div>
                <textarea placeholder="Reminder details..." value={reminderDetails} onChange={e => setReminderDetails(e.target.value)} className="w-full h-24 border border-gray-200 rounded-lg p-3 text-sm outline-none resize-none" />
              </>
            )}
            {activeTab === 'Invoice/Receipts' && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <Upload size={24} className="text-gray-400 mb-2"/>
                <p className="text-sm font-semibold text-gray-600">Click to upload or drag and drop multiple files</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (Max 10MB per file)</p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-bold text-gray-800">Color</p>
            <div className="flex gap-3">
              {['bg-amber-100', 'bg-rose-100', 'bg-sky-100', 'bg-emerald-100', 'bg-purple-100', 'bg-pink-100'].map(c => (
                <div key={c} onClick={() => setColor(c)} className={`w-7 h-7 rounded-full ${c} border-2 cursor-pointer ${color === c ? 'border-slate-900' : 'border-transparent'}`}></div>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer pt-2">
              <input type="checkbox" checked={isPinned} onChange={e => setIsPinned(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              Pin this note
            </label>
          </div>
        </div>

        <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-bold text-gray-700">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-bold">Create Note</button>
        </div>
      </div>
    </div>
  );
};