import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { MapPin, CheckCircle2, Calendar as CalendarIcon, UtensilsCrossed, Plus, Trash2 } from 'lucide-react';

export const EventInformation = () => {
  const { data, updateData } = useWedding();
  const [info, setInfo] = useState({
    venueName: '',
    venueType: 'Indoor',
    venueAddress: '',
    hallName: '',
    date: '',
    session: 'Morning',
    startTime: '',
    endTime: '',
    additionalDetails: []
  });

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['event'];

  useEffect(() => {
    if (data?.eventInfo) {
      setInfo(prev => ({
        ...prev,
        ...data.eventInfo,
        additionalDetails: data.eventInfo.additionalDetails || []
      }));
    }
  }, [data]);

  const handleUpdate = (field, value) => {
    setInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAdditionalField = () => {
    setInfo(prev => ({
      ...prev,
      additionalDetails: [...(prev.additionalDetails || []), { label: '', value: '' }]
    }));
  };

  const handleUpdateAdditionalField = (index, field, value) => {
    const updated = [...info.additionalDetails];
    updated[index][field] = value;
    setInfo(prev => ({ ...prev, additionalDetails: updated }));
  };

  const handleDeleteAdditionalField = (index) => {
    const updated = info.additionalDetails.filter((_, i) => i !== index);
    setInfo(prev => ({ ...prev, additionalDetails: updated }));
  };

  const handleSave = () => {
    updateData({ eventInfo: info }, true);
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, event: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <MapPin size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Event Information</h2>
            <p className="text-sm text-gray-500 font-medium">Wedding date, venue, and ceremony details</p>
          </div>
        </div>
        <div className="flex gap-3">
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
          <button onClick={handleSave} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">Save Details</button>
        </div>
      </div>

      {/* Venue Information Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <MapPin size={18} className="text-blue-500"/> Venue Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Venue Name</label>
              {info.venueName && <CheckCircle2 size={14} className="text-emerald-500" />}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
                <MapPin size={16} />
              </span>
              <input 
                type="text" 
                value={info.venueName || ''} 
                onChange={e => handleUpdate('venueName', e.target.value)} 
                placeholder="Start typing a venue name..." 
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Venue Type</label>
            <select 
              value={info.venueType || 'Indoor'} 
              onChange={e => handleUpdate('venueType', e.target.value)} 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium bg-white focus:border-blue-500"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Both">Both</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Venue Address</label>
            {info.venueAddress && <CheckCircle2 size={14} className="text-emerald-500" />}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
              <MapPin size={16} />
            </span>
            <input 
              type="text" 
              value={info.venueAddress || ''} 
              onChange={e => handleUpdate('venueAddress', e.target.value)} 
              placeholder="Full venue address will appear here..." 
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Hall Name</label>
            {info.hallName && <CheckCircle2 size={14} className="text-emerald-500" />}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
              <MapPin size={16} />
            </span>
            <input 
              type="text" 
              value={info.hallName || ''} 
              onChange={e => handleUpdate('hallName', e.target.value)} 
              placeholder="e.g. Eagle Hall" 
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
            />
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <CalendarIcon size={18} className="text-blue-500"/> Event Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Date <span className="text-rose-500">*</span></label>
              {info.date && <CheckCircle2 size={14} className="text-emerald-500" />}
            </div>
            <div className="relative">
              <input 
                type="date" 
                value={info.date || ''} 
                onChange={e => handleUpdate('date', e.target.value)} 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium bg-white focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Event Session</label>
            <select 
              value={info.session || 'Morning'} 
              onChange={e => handleUpdate('session', e.target.value)} 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium bg-white focus:border-blue-500"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Start Time</label>
              {info.startTime && <CheckCircle2 size={14} className="text-emerald-500" />}
            </div>
            <input 
              type="text" 
              value={info.startTime || ''} 
              onChange={e => handleUpdate('startTime', e.target.value)} 
              placeholder="09 : 30 AM" 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">End Time</label>
            <input 
              type="text" 
              value={info.endTime || ''} 
              onChange={e => handleUpdate('endTime', e.target.value)} 
              placeholder="e.g. 12:00 PM" 
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium text-gray-400 focus:border-blue-500" 
            />
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <UtensilsCrossed size={18} className="text-blue-500"/> Additional Details
        </h3>

        <div className="space-y-3">
          {(info.additionalDetails || []).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input 
                type="text" 
                value={item.label || ''} 
                onChange={e => handleUpdateAdditionalField(index, 'label', e.target.value)} 
                placeholder="Field name (e.g., Music)" 
                className="w-1/3 p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
              />
              <input 
                type="text" 
                value={item.value || ''} 
                onChange={e => handleUpdateAdditionalField(index, 'value', e.target.value)} 
                placeholder="Description" 
                className="flex-1 p-2.5 border border-gray-200 rounded-lg text-sm outline-none font-medium focus:border-blue-500" 
              />
              <button 
                onClick={() => handleDeleteAdditionalField(index)} 
                className="p-2.5 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button 
            onClick={handleAddAdditionalField}
            className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-600 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus size={16} /> Add More Additional Information
          </button>
        </div>
      </div>
    </div>
  );
};