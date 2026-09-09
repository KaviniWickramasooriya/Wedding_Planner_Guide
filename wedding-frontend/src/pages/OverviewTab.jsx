import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { Calendar, Users, DollarSign, Utensils, CheckCircle2, Clock, HelpCircle, XCircle, Bell } from 'lucide-react';

export const OverviewTab = () => {
  const { analytics } = useWedding();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Calendar} color="blue" label="Days Until Event" value={analytics.daysUntil ?? 'TBD'} />
        <StatCard icon={Users} color="emerald" label="Total Guests" value={analytics.totalGuests || 0} subtext={`${analytics.confirmedCount || 0} confirmed`} />
        <StatCard icon={DollarSign} color="rose" label="Budget Utilized" value={`Rs. ${(analytics.totalBudgetUsed || 0).toLocaleString()}`} subtext={`${analytics.budgetPercentage || 0}% used`} />
        <StatCard icon={Utensils} color="amber" label="Seat Utilization" value={`${analytics.seatUtilizationRate || 0}%`} subtext={`${analytics.allocatedSeats || 0}/${analytics.totalSeats || 0} seats`} />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Users size={18} className="text-blue-600" /> RSVP Status
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <RsvpCard label="Confirmed" icon={CheckCircle2} color="emerald" count={analytics.confirmedCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Invited" icon={Clock} color="amber" count={analytics.invitedCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Pending" icon={HelpCircle} color="gray" count={analytics.pendingCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Maybe" icon={HelpCircle} color="purple" count={analytics.maybeCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Declined" icon={XCircle} color="rose" count={analytics.declinedCount || 0} total={analytics.totalGuests || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Guest Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-xl">
                <span className="text-xs text-gray-500 font-semibold">Bride's Side</span>
                <p className="text-3xl font-bold text-rose-600 mt-2">{analytics.brideSideCount || 0}</p>
              </div>
              <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl">
                <span className="text-xs text-gray-500 font-semibold">Groom's Side</span>
                <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.groomSideCount || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Total PAX</span>
                <span className="font-bold text-gray-900">{analytics.totalPax || 0}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Adults</span>
                <span className="font-bold text-gray-900">{analytics.totalAdults || 0}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Children (All Ages)</span>
                <span className="font-bold text-gray-900">{analytics.totalChildren || 0}</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex justify-between items-center text-emerald-800">
                <span className="font-semibold">✓ Confirmed PAX</span>
                <span className="font-bold">{analytics.confirmedPax || 0}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(analytics.categoryCounts || {}).map(([catName, count]) => (
                  <div key={catName} className="flex justify-between items-center bg-gray-50/60 p-2.5 rounded-lg border border-gray-100 text-xs">
                    <span className="text-gray-600 font-medium capitalize">{catName}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                ))}
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
                <p className="text-2xl font-bold text-purple-700">{analytics.totalTables || 0}</p>
                <p className="text-xs font-semibold text-purple-600 mt-1">Tables</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100">
                <p className="text-2xl font-bold text-emerald-700">{analytics.totalSeats || 0}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">Total Seats</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 font-medium">Allocated Seats</span>
                <span className="font-bold text-gray-900">{analytics.allocatedSeats || 0}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-gray-500 font-medium">Available Seats</span>
                <span className="font-bold text-gray-900">{analytics.availableSeats || 0}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-center">
                <span className="text-gray-400 font-medium block">Utilization Rate</span>
                <p className="text-lg font-bold text-amber-600">{analytics.seatUtilizationRate || 0}%</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${analytics.seatUtilizationRate || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <DollarSign size={16} className="text-rose-500"/> Budget Overview
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {Object.entries(analytics.budgetByCategory || {}).map(([catName, amount]) => (
                <div key={catName} className="flex justify-between items-center text-xs bg-gray-50/60 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-600 font-medium">{catName}</span>
                  <span className="font-bold text-gray-900">Rs. {(amount || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-36 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Bell size={24} className="opacity-20"/>
            <p className="text-xs font-medium">No upcoming reminders</p>
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

const RsvpCard = ({ label, icon: Icon, color, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`bg-${color}-50/40 border border-${color}-100 p-4 rounded-xl`}>
      <div className={`flex justify-between items-center text-xs text-${color}-700 font-semibold`}>
        <span className="flex items-center gap-1.5"><Icon size={14}/> {label}</span>
        <span>{percentage}%</span>
      </div>
      <p className={`text-2xl font-bold text-${color}-700 mt-3`}>{count}</p>
    </div>
  );
};