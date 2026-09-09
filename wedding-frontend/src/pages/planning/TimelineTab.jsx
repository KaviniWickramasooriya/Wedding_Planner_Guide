import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Calendar, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const TimelineTab = () => {
  const { data, updateData } = useWedding();
  const timeline = data?.timeline || [];

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['timeline'];

  // Local state for the new timeline item row
  const [newItem, setNewItem] = useState({ day: '', startTime: '', endTime: '', event: '', coordinator: '' });

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItem.event.trim()) {
      toast.error('Please enter an event name.');
      return;
    }
    const updated = [...timeline, newItem];
    updateData({ timeline: updated }, true);
    // Reset form
    setNewItem({ day: '', startTime: '', endTime: '', event: '', coordinator: '' });
  };

  const handleUpdate = (idx, field, value) => {
    const updated = [...timeline];
    updated[idx][field] = value;
    updateData({ timeline: updated });
  };

  const handleDelete = (idx) => {
    const updated = [...timeline];
    updated.splice(idx, 1);
    updateData({ timeline: updated }, true);
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, timeline: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
            <p className="text-sm text-gray-500 font-medium">Timeline</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleCompleted} 
            className={`px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isCompleted 
                ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={14}/> {isCompleted ? 'Completed' : 'Mark as completed'}
          </button>
          <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50">Export</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-medium">
          <thead className="bg-gray-50 border-b text-gray-500 font-bold">
            <tr>
              <th className="w-10 p-4"></th>
              <th className="p-4">Day</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">End Time</th>
              <th className="p-4">Event</th>
              <th className="p-4">Coordinator</th>
              <th className="p-4 text-right w-28"></th>
            </tr>
          </thead>
          <tbody>
            {/* Create Row */}
            <tr className="bg-gray-50/40 border-b border-gray-100">
              <td className="p-4 text-center"></td>
              <td className="p-3">
                <input 
                  type="date" 
                  value={newItem.day} 
                  onChange={(e) => setNewItem({...newItem, day: e.target.value})} 
                  className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newItem.startTime} 
                  onChange={(e) => setNewItem({...newItem, startTime: e.target.value})} 
                  placeholder="HH : MM : AM" 
                  className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newItem.endTime} 
                  onChange={(e) => setNewItem({...newItem, endTime: e.target.value})} 
                  placeholder="HH : MM : AM" 
                  className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newItem.event} 
                  onChange={(e) => setNewItem({...newItem, event: e.target.value})} 
                  placeholder="Enter event name" 
                  className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newItem.coordinator} 
                  onChange={(e) => setNewItem({...newItem, coordinator: e.target.value})} 
                  placeholder="Enter coordinator" 
                  className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" 
                />
              </td>
              <td className="p-3 text-right">
                <button 
                  onClick={handleCreateItem}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold w-full transition-colors shadow-sm"
                >
                  Create
                </button>
              </td>
            </tr>

            {/* Existing Timeline Items */}
            {timeline.length === 0 ? (
               <tr>
                 <td colSpan="7" className="p-8 text-center text-gray-400">No events added to timeline yet. Use the form above to create items.</td>
               </tr>
            ) : timeline.map((event, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(idx)}><Trash2 size={16} className="text-gray-300 hover:text-rose-500 transition-colors"/></button>
                </td>
                <td className="p-3"><input type="date" value={event.day || ''} onChange={(e) => handleUpdate(idx, 'day', e.target.value)} className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" /></td>
                <td className="p-3"><input type="text" value={event.startTime || ''} onChange={(e) => handleUpdate(idx, 'startTime', e.target.value)} placeholder="HH : MM : AM" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" /></td>
                <td className="p-3"><input type="text" value={event.endTime || ''} onChange={(e) => handleUpdate(idx, 'endTime', e.target.value)} placeholder="HH : MM : AM" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" /></td>
                <td className="p-3"><input type="text" value={event.event || ''} onChange={(e) => handleUpdate(idx, 'event', e.target.value)} placeholder="Enter event name" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" /></td>
                <td className="p-3"><input type="text" value={event.coordinator || ''} onChange={(e) => handleUpdate(idx, 'coordinator', e.target.value)} placeholder="Enter coordinator" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-white" /></td>
                <td className="p-3 text-right"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t flex justify-center">
          <span className="text-xs text-gray-400 font-medium">Total Timeline Events: {timeline.length}</span>
        </div>
      </div>
    </div>
  );
};