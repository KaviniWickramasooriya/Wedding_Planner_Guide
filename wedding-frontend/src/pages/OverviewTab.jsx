import React from 'react';
import { useWedding } from '../context/WeddingContext';
import { Calendar, Users, DollarSign, Utensils, CheckCircle2, Clock, HelpCircle, XCircle, Bell, Heart, Gift, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

export const OverviewTab = () => {
  const { analytics, data } = useWedding();
  const guests = data?.guests || [];

  // Separate Bride's Side and Groom's Side guests
  const brideGuests = guests.filter(g => (g.side || "Bride's") === "Bride's");
  const groomGuests = guests.filter(g => g.side === "Groom's");

  // Calculate Bride Side Metrics
  const brideEntries = brideGuests.length;
  let bridePax = 0;
  let brideConfirmedPax = 0;
  let bridePendingPax = 0;
  brideGuests.forEach(g => {
    const p = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
    bridePax += p;
    if (g.rsvp === 'Confirmed') brideConfirmedPax += p;
    else if (g.rsvp === 'Pending' || !g.rsvp) bridePendingPax += p;
  });

  // Calculate Groom Side Metrics
  const groomEntries = groomGuests.length;
  let groomPax = 0;
  let groomConfirmedPax = 0;
  let groomPendingPax = 0;
  groomGuests.forEach(g => {
    const p = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
    groomPax += p;
    if (g.rsvp === 'Confirmed') groomConfirmedPax += p;
    else if (g.rsvp === 'Pending' || !g.rsvp) groomPendingPax += p;
  });

  // Category breakdown grouped separately by side
  const getCategoryBreakdown = (sideList) => {
    const map = {};
    sideList.forEach(g => {
      const cat = g.category || 'Other Guests';
      if (!map[cat]) {
        map[cat] = { entries: 0, pax: 0 };
      }
      map[cat].entries += 1;
      const p = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
      map[cat].pax += p;
    });
    return map;
  };

  const brideCategories = getCategoryBreakdown(brideGuests);
  const groomCategories = getCategoryBreakdown(groomGuests);

  // Calculate comprehensive financial metrics across all budget categories & items
  const totalBudget = Number(data?.budget?.totalBudget) || 0;
  let totalCostSum = 0;
  let totalPaymentSum = 0;

  const vendorItemsList = [];

  data?.budget?.categories?.forEach(cat => {
    cat.items?.forEach(item => {
      const cost = Number(item.cost) || 0;
      const payment = Number(item.payment) || 0;
      const balance = Math.max(0, cost - payment);

      totalCostSum += cost;
      totalPaymentSum += payment;

      vendorItemsList.push({
        categoryName: cat.name || 'General',
        itemName: item.name || 'Vendor Item',
        fullAmount: cost,
        didPayment: payment,
        shouldDoPayment: balance
      });
    });
  });

  const remainingPayment = Math.max(0, totalCostSum - totalPaymentSum);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Calendar} color="blue" label="Days Until Event" value={analytics.daysUntil ?? 'TBD'} />
        
        {/* Total Guests (Family Entries) Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <Users size={24} />
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-xs text-gray-500 font-medium">Total Guests</p>
            <h3 className="text-base font-black text-gray-900 mt-0.5 truncate">
              {guests.length} families
            </h3>
            <span className="text-[11px] text-gray-400 font-medium block">
              {analytics.confirmedCount || 0} confirmed entries
            </span>
          </div>
        </div>

        {/* Total Guests (Total Pax) Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <Users size={24} />
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-xs text-gray-500 font-medium">Total Guests</p>
            <h3 className="text-base font-black text-gray-900 mt-0.5 truncate">
              {analytics.totalPax || 0} pax
            </h3>
            <span className="text-[11px] text-gray-400 font-medium block">
              {analytics.confirmedPax || 0} confirmed pax
            </span>
          </div>
        </div>

        <StatCard icon={Utensils} color="amber" label="Seat Utilization" value={`${analytics.seatUtilizationRate || 0}%`} subtext={`${analytics.allocatedSeats || 0}/${analytics.totalSeats || 0} seats`} />
      </div>

      {/* Comprehensive Financial Overview Section */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
          <DollarSign size={18} className="text-emerald-600" /> Financial Summary & Payment Tracker
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5"><TrendingUp size={14}/> Total Budget</span>
            <p className="text-xl font-black text-emerald-900 mt-1">Rs. {totalBudget.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600/80 font-medium">Overall allocated budget limit</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5"><CreditCard size={14}/> Total Did Payments</span>
            <p className="text-xl font-black text-blue-900 mt-1">Rs. {totalPaymentSum.toLocaleString()}</p>
            <span className="text-[11px] text-blue-600/80 font-medium">Total settled vendor payments</span>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5"><AlertCircle size={14}/> Should Do Payment (Balances)</span>
            <p className="text-xl font-black text-amber-900 mt-1">Rs. {remainingPayment.toLocaleString()}</p>
            <span className="text-[11px] text-amber-600/80 font-medium">Pending balance to be cleared</span>
          </div>

          <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl space-y-1">
            <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5"><DollarSign size={14}/> Full Amount (Total Cost)</span>
            <p className="text-xl font-black text-purple-900 mt-1">Rs. {totalCostSum.toLocaleString()}</p>
            <span className="text-[11px] text-purple-600/80 font-medium">Cumulative items full amount cost</span>
          </div>
        </div>
      </div>

      {/* RSVP Status Bar */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
          <Users size={18} className="text-blue-600" /> RSVP Status
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <RsvpCard label="Confirmed" icon={CheckCircle2} color="emerald" count={analytics.confirmedCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Invited" icon={Clock} color="amber" count={analytics.invitedCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Pending" icon={HelpCircle} color="gray" count={analytics.pendingCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Maybe" icon={HelpCircle} color="purple" count={analytics.maybeCount || 0} total={analytics.totalGuests || 0} />
          <RsvpCard label="Declined" icon={XCircle} color="rose" count={analytics.declinedCount || 0} total={analytics.totalGuests || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Detailed Guest Breakdown Separated by Bride and Groom */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> Guest Breakdown (Bride vs Groom - Categories & Pax)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bride's Side Detailed Card */}
              <div className="bg-rose-50/35 border border-rose-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <span className="text-xs font-black text-rose-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Heart size={14} className="text-rose-500 fill-rose-100"/> Bride's Side
                  </span>
                  <span className="text-xs font-extrabold text-rose-900 bg-rose-100/80 px-3 py-1 rounded-full">
                    {bridePax} Total Pax
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-rose-100/60 shadow-2xs">
                    <p className="text-gray-400 font-medium text-[11px]">Family Entries</p>
                    <p className="text-lg font-black text-rose-700 mt-1">{brideEntries}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100/60 shadow-2xs">
                    <p className="text-gray-400 font-medium text-[11px]">Confirmed Pax</p>
                    <p className="text-lg font-black text-emerald-600 mt-1">{brideConfirmedPax}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100/60 shadow-2xs col-span-2">
                    <p className="text-gray-400 font-medium text-[11px]">Pending / Unconfirmed Pax</p>
                    <p className="text-base font-black text-amber-600 mt-1">{bridePendingPax}</p>
                  </div>
                </div>

                {/* Bride's Categories and Count Summary */}
                <div className="space-y-3 pt-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bride's Categories Breakdown</p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {Object.keys(brideCategories).length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No guests on this side yet.</p>
                    ) : (
                      Object.entries(brideCategories).map(([cat, info]) => (
                        <div key={cat} className="bg-white px-3.5 py-2.5 rounded-xl border border-rose-100/60 flex justify-between items-center text-xs shadow-2xs">
                          <span className="font-bold text-gray-800">{cat}</span>
                          <span className="font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                            {info.pax} Pax ({info.entries} entries)
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Groom's Side Detailed Card */}
              <div className="bg-blue-50/35 border border-blue-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                  <span className="text-xs font-black text-blue-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Gift size={14} className="text-blue-500"/> Groom's Side
                  </span>
                  <span className="text-xs font-extrabold text-blue-900 bg-blue-100/80 px-3 py-1 rounded-full">
                    {groomPax} Total Pax
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-100/60 shadow-2xs">
                    <p className="text-gray-400 font-medium text-[11px]">Family Entries</p>
                    <p className="text-lg font-black text-blue-700 mt-1">{groomEntries}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100/60 shadow-2xs">
                    <p className="text-gray-400 font-medium text-[11px]">Confirmed Pax</p>
                    <p className="text-lg font-black text-emerald-600 mt-1">{groomConfirmedPax}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100/60 shadow-2xs col-span-2">
                    <p className="text-gray-400 font-medium text-[11px]">Pending / Unconfirmed Pax</p>
                    <p className="text-base font-black text-amber-600 mt-1">{groomPendingPax}</p>
                  </div>
                </div>

                {/* Groom's Categories and Count Summary */}
                <div className="space-y-3 pt-1">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Groom's Categories Breakdown</p>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {Object.keys(groomCategories).length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No guests on this side yet.</p>
                    ) : (
                      Object.entries(groomCategories).map(([cat, info]) => (
                        <div key={cat} className="bg-white px-3.5 py-2.5 rounded-xl border border-blue-100/60 flex justify-between items-center text-xs shadow-2xs">
                          <span className="font-bold text-gray-800">{cat}</span>
                          <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                            {info.pax} Pax ({info.entries} entries)
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* General Pax Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-gray-400 font-semibold">Total PAX</span>
                <span className="font-extrabold text-gray-900 text-sm mt-1">{analytics.totalPax || 0}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-gray-400 font-semibold">Adults</span>
                <span className="font-extrabold text-gray-900 text-sm mt-1">{analytics.totalAdults || 0}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-gray-400 font-semibold">Children (All)</span>
                <span className="font-extrabold text-gray-900 text-sm mt-1">{analytics.totalChildren || 0}</span>
              </div>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex flex-col justify-between text-emerald-900">
                <span className="font-bold text-emerald-700">Confirmed PAX</span>
                <span className="font-black text-sm mt-1">{analytics.confirmedPax || 0}</span>
              </div>
            </div>
          </div>

          {/* Vendor & Expense Itemized Table Placed Right Below Guest Breakdown */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" /> Vendor Payment Breakdown Table
              </h4>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {vendorItemsList.length} Items Tracked
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="p-3">Category</th>
                    <th className="p-3">Vendor / Item Name</th>
                    <th className="p-3 text-right">Full Amount (Cost)</th>
                    <th className="p-3 text-right">Did Payments (Paid)</th>
                    <th className="p-3 text-right">Should Do Payment (Balance)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {vendorItemsList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">
                        No budget items found. Add items in the Budget tab to populate this table.
                      </td>
                    </tr>
                  ) : (
                    vendorItemsList.map((v, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-semibold text-gray-700">{v.categoryName}</td>
                        <td className="p-3 font-bold text-gray-900">{v.itemName}</td>
                        <td className="p-3 text-right font-bold text-purple-700">Rs. {v.fullAmount.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-blue-600">Rs. {v.didPayment.toLocaleString()}</td>
                        <td className="p-3 text-right font-bold text-amber-600">Rs. {v.shouldDoPayment.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Utensils size={18} className="text-purple-600"/> Seating Arrangement
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50/50 p-4 rounded-xl text-center border border-purple-100">
                <p className="text-2xl font-black text-purple-700">{analytics.totalTables || 0}</p>
                <p className="text-xs font-bold text-purple-600 mt-1">Tables</p>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-xl text-center border border-emerald-100">
                <p className="text-2xl font-black text-emerald-700">{analytics.totalSeats || 0}</p>
                <p className="text-xs font-bold text-emerald-600 mt-1">Total Seats</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">
                <span className="text-gray-500">Allocated Seats</span>
                <span className="font-bold text-gray-900">{analytics.allocatedSeats || 0}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">
                <span className="text-gray-500">Available Seats</span>
                <span className="font-bold text-gray-900">{analytics.availableSeats || 0}</span>
              </div>
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-center">
                <span className="text-gray-400 font-semibold block text-[11px] uppercase tracking-wider">Utilization Rate</span>
                <p className="text-lg font-black text-amber-600">{analytics.seatUtilizationRate || 0}%</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${analytics.seatUtilizationRate || 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <DollarSign size={16} className="text-rose-500"/> Budget Overview
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {Object.entries(analytics.budgetByCategory || {}).map(([catName, amount]) => (
                <div key={catName} className="flex justify-between items-center text-xs bg-gray-50/60 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-medium">{catName}</span>
                  <span className="font-bold text-gray-900">Rs. {(amount || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-36 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Bell size={24} className="opacity-20"/>
            <p className="text-xs font-medium">No upcoming reminders</p>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, color, label, value, subtext }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="overflow-hidden">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-0.5 truncate">{value}</h3>
      {subtext && <span className="text-[11px] text-gray-400 font-medium">{subtext}</span>}
    </div>
  </div>
);

const RsvpCard = ({ label, icon: Icon, color, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`bg-${color}-50/40 border border-${color}-100 p-4 rounded-xl`}>
      <div className={`flex justify-between items-center text-xs text-${color}-700 font-semibold`}>
        <span className="flex items-center gap-1"><Icon size={13}/> {label}</span>
        <span>{percentage}%</span>
      </div>
      <p className={`text-xl md:text-2xl font-black text-${color}-800 mt-2`}>{count}</p>
    </div>
  );
};