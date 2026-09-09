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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Heart size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Couple Details</h2>
            <p className="text-sm text-gray-500 font-medium">Enter the details of the couple</p>
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
          <button onClick={handleSave} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">
            Save Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bride */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Heart size={18} className="text-rose-500 fill-rose-50"/> Bride Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={couple.bride?.firstName || ''} onChange={e => handleUpdate('bride', 'firstName', e.target.value)} placeholder="Bride's first name" />
            <Input label="Last Name" value={couple.bride?.lastName || ''} onChange={e => handleUpdate('bride', 'lastName', e.target.value)} placeholder="Bride's last name" />
          </div>
          <Input label="Email Address" value={couple.bride?.email || ''} onChange={e => handleUpdate('bride', 'email', e.target.value)} placeholder="email@example.com" />
          <Input label="Phone Number" value={couple.bride?.phone || ''} onChange={e => handleUpdate('bride', 'phone', e.target.value)} placeholder="07XXXXXXXX" />
        </div>

        {/* Groom */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Gift size={18} className="text-blue-500"/> Groom Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
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
      className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none font-medium focus:border-blue-500 bg-white"
    />
  </div>
);