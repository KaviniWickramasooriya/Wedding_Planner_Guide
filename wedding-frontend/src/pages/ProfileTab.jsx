import React from 'react';
import { CheckCircle2, ShieldCheck, Calendar, Trash2 } from 'lucide-react';
import { useWedding } from '../context/WeddingContext';

export const ProfileTab = () => {
  const { user, events, activeEventId, setActiveEventId, deleteEvent } = useWedding();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Profile Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-cover bg-center overflow-hidden shrink-0 shadow-inner">
          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xl font-bold tracking-wider text-purple-200">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black flex flex-col sm:flex-row items-center gap-3">
            <span>{user?.name || 'Kavini Wickramasooriya'}</span>
            <span className="text-xs bg-slate-800 text-blue-300 border border-white/10 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-blue-400"/> Verified Account
            </span>
          </h2>
          <p className="text-xs text-purple-200/70 font-medium">{user?.email || 'kaviniwickramasooriya@gmail.com'}</p>
          <p className="text-[11px] text-gray-400 font-medium">Member since Aug 7, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Managed Events Summary Section */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600"/> Managed Events ({events.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => {
              const guestsCount = ev.guests?.length || 0;
              const tablesCount = ev.tables?.length || 0;
              const isSelected = ev._id === activeEventId;

              return (
                <div 
                  key={ev._id} 
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected ? 'border-blue-500 bg-blue-50/20 shadow-sm' : 'border-gray-200 bg-gray-50/50 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {ev.eventType || 'Wedding'}
                      </span>
                      <p className="text-xs text-gray-600 font-semibold pt-1">Venue: {ev.eventInfo?.venueName || 'Not set'}</p>
                      <p className="text-xs text-gray-500 font-medium">Date: {ev.eventInfo?.date || 'TBD'}</p>
                    </div>
                    {events.length > 1 && (
                      <button 
                        onClick={() => deleteEvent(ev._id)} 
                        className="text-gray-300 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-gray-200/60 text-xs gap-2">
                    <span className="text-gray-600 font-bold">{guestsCount} Guests • {tablesCount} Tables</span>
                    <button 
                      onClick={() => setActiveEventId(ev._id)}
                      className={`w-full sm:w-auto px-3.5 py-2 rounded-xl font-bold transition-all shadow-2xs ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected ? 'Active Event' : 'Switch to'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Details Sidebar Section */}
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Plan</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">Free</h3>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full">Multiple Events</span>
              <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">Full Portal Access</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Features</p>
            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Guest Map <CheckCircle2 size={16} className="text-emerald-500"/></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Budget Map <CheckCircle2 size={16} className="text-emerald-500"/></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Seating Map <CheckCircle2 size={16} className="text-emerald-500"/></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};