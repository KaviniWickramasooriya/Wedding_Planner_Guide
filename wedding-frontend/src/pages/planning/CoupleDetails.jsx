import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Heart, Gift, CheckCircle2 } from 'lucide-react';

export const CoupleDetails = () => {
  const { data, updateData } = useWedding();
  const [couple, setCouple] = useState({ bride: {}, groom: {} });
  
  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['couple'];

  useEffect(() => {
    if (data?.couple) setCouple(data.couple);
  }, [data]);

  const handleUpdate = (side, field, value) => {
    setCouple(prev => ({
      ...prev, [side]: { ...prev[side], [field]: value }
    }));
  };

  const handleSave = () => {
    updateData({ couple }, true);
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, couple: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <Heart size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Couple Details</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Enter the details of the couple</p>
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
          <button onClick={handleSave} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
            Save Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bride */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Heart size={18} className="text-rose-500 fill-rose-50"/> Bride Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={couple.bride?.firstName || ''} onChange={e => handleUpdate('bride', 'firstName', e.target.value)} placeholder="Bride's first name" />
            <Input label="Last Name" value={couple.bride?.lastName || ''} onChange={e => handleUpdate('bride', 'lastName', e.target.value)} placeholder="Bride's last name" />
          </div>
          <Input label="Email Address" value={couple.bride?.email || ''} onChange={e => handleUpdate('bride', 'email', e.target.value)} placeholder="email@example.com" />
          <Input label="Phone Number" value={couple.bride?.phone || ''} onChange={e => handleUpdate('bride', 'phone', e.target.value)} placeholder="07XXXXXXXX" />
        </div>

        {/* Groom */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Gift size={18} className="text-blue-500"/> Groom Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={couple.groom?.firstName || ''} onChange={e => handleUpdate('groom', 'firstName', e.target.value)} placeholder="Groom's first name" />
            <Input label="Last Name" value={couple.groom?.lastName || ''} onChange={e => handleUpdate('groom', 'lastName', e.target.value)} placeholder="Groom's last name" />
          </div>
          <Input label="Email Address" value={couple.groom?.email || ''} onChange={e => handleUpdate('groom', 'email', e.target.value)} placeholder="email@example.com" />
          <Input label="Phone Number" value={couple.groom?.phone || ''} onChange={e => handleUpdate('groom', 'phone', e.target.value)} placeholder="07XXXXXXXX" />
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
      <span>{label}</span>
      {value && <CheckCircle2 size={14} className="text-emerald-500"/>}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none font-medium focus:border-blue-500 bg-white shadow-2xs"
    />
  </div>
);