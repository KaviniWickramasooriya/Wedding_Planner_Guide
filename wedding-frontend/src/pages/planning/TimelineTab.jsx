import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Calendar, Trash2, Plus } from 'lucide-react';

export const TimelineTab = () => {
  const { data, updateData } = useWedding();
  const timeline = data?.timeline || [];

  const handleAdd = () => {
    updateData({ timeline: [...timeline, { day: '', startTime: '', endTime: '', event: '', coordinator: '' }] });
  };

  const handleUpdate = (idx, field, value) => {
    const updated = [...timeline];
    updated[idx][field] = value;
    updateData({ timeline: updated });
  };

  const handleDelete = (idx) => {
    const updated = [...timeline];
    updated.splice(idx, 1);
    updateData({ timeline: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Calendar size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Timeline</h2>
            <p className="text-sm text-gray-500 font-medium">Timeline</p>
          </div>
        </div>
        <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50">Export</button>
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
              <th className="p-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {timeline.length === 0 ? (
               <tr>
                 <td colSpan="7" className="p-8 text-center text-gray-400">No events added to timeline yet.</td>
               </tr>
            ) : timeline.map((event, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(idx)}><Trash2 size={16} className="text-gray-300 hover:text-rose-500 transition-colors"/></button>
                </td>
                <td className="p-3"><input type="date" value={event.day || ''} onChange={(e) => handleUpdate(idx, 'day', e.target.value)} className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none" /></td>
                <td className="p-3"><input type="text" value={event.startTime || ''} onChange={(e) => handleUpdate(idx, 'startTime', e.target.value)} placeholder="HH : MM : AM" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none" /></td>
                <td className="p-3"><input type="text" value={event.endTime || ''} onChange={(e) => handleUpdate(idx, 'endTime', e.target.value)} placeholder="HH : MM : AM" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none" /></td>
                <td className="p-3"><input type="text" value={event.event || ''} onChange={(e) => handleUpdate(idx, 'event', e.target.value)} placeholder="Enter event name" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none" /></td>
                <td className="p-3"><input type="text" value={event.coordinator || ''} onChange={(e) => handleUpdate(idx, 'coordinator', e.target.value)} placeholder="Enter coordinator" className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none" /></td>
                <td className="p-3 text-right"></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t flex justify-center">
          <button onClick={handleAdd} className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900"><Plus size={14}/> Add item</button>
        </div>
      </div>
    </div>
  );
};