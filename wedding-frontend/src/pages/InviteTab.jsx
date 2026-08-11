import React from 'react';
import { Mail, Palette, Filter } from 'lucide-react';

export const InviteTab = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
        <div className="flex items-center gap-4">
          <Mail size={24} className="text-gray-400" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Wedding Invitations</h2>
            <p className="text-xs text-gray-500">Send your wedding invitations via WhatsApp</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold shadow-sm">Bride's</button>
            <button className="px-4 py-1.5 text-gray-600 text-xs font-bold">Groom's</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-xs font-semibold hover:bg-gray-50">
            <Palette size={14} /> Design
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <span className="text-xs font-bold text-gray-700">Guest Statistics (Attending: 0)</span>
          <span className="text-xs font-bold text-emerald-600">2 Guests</span>
        </div>

        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Filter by Category:</span>
          <button className="flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
            <Filter size={14}/> All Categories
          </button>
        </div>

        <div className="p-16 text-center text-gray-400 text-sm font-medium">
          No guests found
        </div>
      </div>
    </div>
  );
};