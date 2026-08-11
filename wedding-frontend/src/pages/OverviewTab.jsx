import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { Calendar, Users, DollarSign, Utensils, CheckCircle2, Clock, HelpCircle, XCircle, Bell } from 'lucide-react';

export const OverviewTab = () => {
  const { analytics } = useWedding();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Calendar} color="blue" label="Days Until Event" value={analytics.daysUntil || 113} />
        <StatCard icon={Users} color="emerald" label="Total Guests" value={analytics.totalGuests || 2} subtext="0 confirmed" />
        <StatCard icon={DollarSign} color="rose" label="Budget Utilized" value="Rs. 2,200,000" subtext="0% used" />
        <StatCard icon={Utensils} color="amber" label="Seat Utilization" value="0%" subtext="0/4 seats" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Users size={18} className="text-blue-600" /> RSVP Status
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <RsvpCard label="Confirmed" icon={CheckCircle2} color="emerald" count={0} />
          <RsvpCard label="Invited" icon={Clock} color="amber" count={0} />
          <RsvpCard label="Pending" icon={HelpCircle} color="gray" count={0} />
          <RsvpCard label="Maybe" icon={HelpCircle} color="purple" count={0} />
          <RsvpCard label="Declined" icon={XCircle} color="rose" count={0} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Guest Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-xl">
                <span className="text-xs text-gray-500 font-semibold">Bride's Side</span>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                <span className="text-xs text-gray-500 font-semibold">Groom's Side</span>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Utensils size={18} className="text-purple-600"/> Seating Arrangement
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50/50 p-4 rounded-xl text-center border border-purple-100">
                <p className="text-2xl font-bold text-purple-700">1</p>
                <p className="text-xs font-semibold text-purple-600 mt-1">Tables</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700">4</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">Total Seats</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Bell size={28} className="opacity-20"/>
            <p className="text-sm font-medium">No upcoming reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, value, subtext }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 bg-${color}-50 text-${color}-500 rounded-xl`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h3>
      {subtext && <span className="text-[11px] text-gray-400 font-medium">{subtext}</span>}
    </div>
  </div>
);

const RsvpCard = ({ label, icon: Icon, color, count }) => (
  <div className={`bg-${color}-50/40 border border-${color}-100 p-4 rounded-xl`}>
    <div className={`flex justify-between items-center text-xs text-${color}-700 font-semibold`}>
      <span className="flex items-center gap-1.5"><Icon size={14}/> {label}</span>
      <span>0%</span>
    </div>
    <p className={`text-2xl font-bold text-${color}-700 mt-3`}>{count}</p>
  </div>
);