import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { MapPin } from 'lucide-react';

export const EventInformation = () => {
  const { data, updateData } = useWedding();
  const [info, setInfo] = useState({});

  useEffect(() => {
    if (data?.eventInfo) setInfo(data.eventInfo);
  }, [data]);

  const handleUpdate = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateData({ eventInfo: info }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <MapPin size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Venue Details</h2>
            <p className="text-sm text-gray-500 font-medium">Enter the details of the venue</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Save Details</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <MapPin size={18} className="text-blue-500"/> Venue Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Venue Name</label>
            <input type="text" value={info.venueName || ''} onChange={e => handleUpdate('venueName', e.target.value)} placeholder="Start typing a venue name..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none font-medium focus:border-blue-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Venue Type</label>
            <select value={info.venueType || ''} onChange={e => handleUpdate('venueType', e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium bg-white focus:border-blue-500">
              <option value="" disabled>-Select a venue style-</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Venue Address</label>
          <input type="text" value={info.venueAddress || ''} onChange={e => handleUpdate('venueAddress', e.target.value)} placeholder="Full venue address will appear here..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none font-medium focus:border-blue-500" />
        </div>
      </div>
    </div>
  );
};