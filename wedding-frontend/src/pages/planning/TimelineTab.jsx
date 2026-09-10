import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const TimelineTab = () => {
  const { data, updateData } = useWedding();
  const timeline = data?.timeline || [];

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['timeline'];

  const [newItem, setNewItem] = useState({ day: '', startTime: '', endTime: '', event: '', coordinator: '' });

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!newItem.event.trim()) {
      toast.error('Please enter an event name.');
      return;
    }
    const updated = [...timeline, newItem];
    updateData({ timeline: updated }, true);
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Timeline</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage event schedule and coordination</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={toggleCompleted} 
            className={`px-4 py-2.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompleted 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm' 
                : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={14}/> {isCompleted ? 'Completed' : 'Mark as completed'}
          </button>
          <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm">Export</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium min-w-[800px]">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="w-12 p-4 text-center">#</th>
                <th className="p-4 w-40">Day</th>
                <th className="p-4 w-32">Start Time</th>
                <th className="p-4 w-32">End Time</th>
                <th className="p-4">Event</th>
                <th className="p-4">Coordinator</th>
                <th className="p-4 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Create Row */}
              <tr className="bg-gray-50/40">
                <td className="p-4 text-center text-gray-300">
                  <Trash2 size={16} className="opacity-20 cursor-not-allowed mx-auto"/>
                </td>
                <td className="p-3">
                  <input 
                    type="date" 
                    value={newItem.day} 
                    onChange={(e) => setNewItem({...newItem, day: e.target.value})} 
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-white font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newItem.startTime} 
                    onChange={(e) => setNewItem({...newItem, startTime: e.target.value})} 
                    placeholder="09:00 AM" 
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-white font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newItem.endTime} 
                    onChange={(e) => setNewItem({...newItem, endTime: e.target.value})} 
                    placeholder="10:00 AM" 
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-white font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newItem.event} 
                    onChange={(e) => setNewItem({...newItem, event: e.target.value})} 
                    placeholder="Enter event name" 
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-white font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newItem.coordinator} 
                    onChange={(e) => setNewItem({...newItem, coordinator: e.target.value})} 
                    placeholder="Enter coordinator" 
                    className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-white font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={handleCreateItem}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold w-full transition-all shadow-sm"
                  >
                    Create
                  </button>
                </td>
              </tr>

              {/* Existing Timeline Items */}
              {timeline.length === 0 ? (
                 <tr>
                   <td colSpan="7" className="p-16 text-center text-gray-400 font-medium">No events added to timeline yet. Use the form above to create items.</td>
                 </tr>
              ) : timeline.map((event, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(idx)} className="text-gray-300 hover:text-rose-600 transition-colors p-1" title="Delete Timeline Item">
                      <Trash2 size={16} className="mx-auto"/>
                    </button>
                  </td>
                  <td className="p-3"><input type="date" value={event.day || ''} onChange={(e) => handleUpdate(idx, 'day', e.target.value)} className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-gray-50/50 font-medium shadow-2xs" /></td>
                  <td className="p-3"><input type="text" value={event.startTime || ''} onChange={(e) => handleUpdate(idx, 'startTime', e.target.value)} placeholder="HH:MM AM" className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-gray-50/50 font-medium shadow-2xs" /></td>
                  <td className="p-3"><input type="text" value={event.endTime || ''} onChange={(e) => handleUpdate(idx, 'endTime', e.target.value)} placeholder="HH:MM AM" className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-gray-50/50 font-medium shadow-2xs" /></td>
                  <td className="p-3"><input type="text" value={event.event || ''} onChange={(e) => handleUpdate(idx, 'event', e.target.value)} placeholder="Enter event name" className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-gray-50/50 font-medium shadow-2xs" /></td>
                  <td className="p-3"><input type="text" value={event.coordinator || ''} onChange={(e) => handleUpdate(idx, 'coordinator', e.target.value)} placeholder="Enter coordinator" className="border border-gray-200 rounded-xl p-2.5 w-full text-xs outline-none bg-gray-50/50 font-medium shadow-2xs" /></td>
                  <td className="p-3 text-center text-xs text-gray-400">Saved</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          <span className="text-xs text-gray-500 font-semibold">Total Timeline Events: {timeline.length}</span>
        </div>
      </div>
    </div>
  );
};