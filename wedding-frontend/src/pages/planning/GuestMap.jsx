import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Users, Download, Eye, Plus } from 'lucide-react';

export const GuestMap = () => {
  const { data } = useWedding();
  const guests = data?.guests || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Users size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Guests</h2>
            <p className="text-sm text-gray-500 font-medium">Enter the details of the guests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-5 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-md">Bride's</button>
            <button className="px-5 py-1.5 text-gray-600 text-xs font-bold">Groom's</button>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50">Mark as completed</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-gray-800 text-sm">Guest Statistics</h3>
          <span className="text-xs font-bold text-emerald-600">{guests.length} Guests</span>
        </div>

        <div className="flex justify-between items-center bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
          <div>
            <p className="text-xs font-bold text-emerald-700">Set Plate Rates</p>
            <p className="text-[11px] text-emerald-600/70">Set full plate and half plate rate for calculations</p>
          </div>
          <div className="flex gap-3">
            <input type="number" placeholder="Full Rate" className="border border-emerald-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white w-28 focus:border-emerald-400" />
            <input type="number" placeholder="Half Rate" className="border border-emerald-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white w-28 focus:border-emerald-400" />
          </div>
        </div>

        <GuestCategory title="Family" guests={guests.filter(g => g.category === 'Family')} />
        <GuestCategory title="Mother's Relative" guests={guests.filter(g => g.category === "Mother's Relative")} />
      </div>
    </div>
  );
};

const GuestCategory = ({ title, guests = [] }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
      <Eye size={16} className="text-gray-400 cursor-pointer hover:text-gray-600"/>
    </div>
    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
      <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 font-bold text-gray-500 border-b">
        <div className="col-span-1">Order</div>
        <div className="col-span-1">Title</div>
        <div className="col-span-3">First Name</div>
        <div className="col-span-3">Last Name</div>
        <div className="col-span-2">Phone</div>
        <div className="col-span-2">RSVP</div>
      </div>
      
      {guests.map((g, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 p-3 font-medium text-gray-700 border-b border-gray-100 items-center">
          <div className="col-span-1">{i + 1}</div>
          <div className="col-span-1">{g.title || ''}</div>
          <div className="col-span-3">{g.firstName || ''}</div>
          <div className="col-span-3">{g.lastName || ''}</div>
          <div className="col-span-2">{g.phone || ''}</div>
          <div className="col-span-2">{g.rsvp || 'Pending'}</div>
        </div>
      ))}
      
      <div className="p-3 text-center bg-white">
        <button className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 w-full">
          <Plus size={14}/> Add New Guest
        </button>
      </div>
    </div>
  </div>
);