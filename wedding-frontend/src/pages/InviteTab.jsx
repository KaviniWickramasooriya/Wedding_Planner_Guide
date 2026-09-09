import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Mail, Palette, Filter, ChevronUp, ChevronDown } from 'lucide-react';

export const InviteTab = () => {
  const { data } = useWedding();
  const [activeSide, setActiveSide] = useState("Bride's");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isStatsOpen, setIsStatsOpen] = useState(true);

  const guests = data?.guests || [];

  // Calculate statistics dynamically
  const brideGuests = guests.filter(g => (g.side || "Bride's") === "Bride's");
  const groomGuests = guests.filter(g => g.side === "Groom's");

  const getSideStats = (sideList) => {
    let totalSeats = 0;
    let confirmed = 0;
    let declined = 0;
    let maybe = 0;

    sideList.forEach(g => {
      const seats = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
      totalSeats += seats;
      if (g.rsvp === 'Confirmed') confirmed += seats;
      if (g.rsvp === 'Declined') declined += seats;
      if (g.rsvp === 'Maybe') maybe += seats;
    });

    return { totalSeats, confirmed, declined, maybe };
  };

  const brideStats = getSideStats(brideGuests);
  const groomStats = getSideStats(groomGuests);
  const totalStats = {
    totalSeats: brideStats.totalSeats + groomStats.totalSeats,
    confirmed: brideStats.confirmed + groomStats.confirmed,
    declined: brideStats.declined + groomStats.declined,
    maybe: brideStats.maybe + groomStats.maybe
  };

  const totalAttending = totalStats.confirmed;

  const filteredGuests = guests.filter(g => {
    const matchSide = (g.side || "Bride's") === activeSide;
    const matchCategory = selectedCategory === "All" || g.category === selectedCategory;
    return matchSide && matchCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Wedding Invitations</h2>
            <p className="text-xs text-gray-500">Send your wedding invitations via WhatsApp</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveSide("Bride's")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeSide === "Bride's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Bride's
            </button>
            <button 
              onClick={() => setActiveSide("Groom's")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeSide === "Groom's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Groom's
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700">
            <Palette size={14} /> Design
          </button>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Guest Statistics Accordion Header */}
        <div 
          onClick={() => setIsStatsOpen(!isStatsOpen)}
          className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-100/50"
        >
          <span className="text-xs font-bold text-gray-800">
            Guest Statistics <span className="text-gray-500 font-normal">(Attending: {totalAttending})</span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600">{guests.length} Guests</span>
            {isStatsOpen ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
          </div>
        </div>

        {/* Statistics Table */}
        {isStatsOpen && (
          <div className="p-4 border-b border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Side</th>
                  <th className="pb-3 text-center font-semibold">Total Seats</th>
                  <th className="pb-3 text-center font-semibold text-blue-600">Confirmed</th>
                  <th className="pb-3 text-center font-semibold text-rose-500">Declined</th>
                  <th className="pb-3 text-center font-semibold text-amber-600">Maybe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Bride</td>
                  <td className="py-3 text-center text-gray-700">{brideStats.totalSeats}</td>
                  <td className="py-3 text-center font-bold text-blue-600">{brideStats.confirmed}</td>
                  <td className="py-3 text-center font-bold text-rose-500">{brideStats.declined}</td>
                  <td className="py-3 text-center font-bold text-amber-600">{brideStats.maybe}</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Groom</td>
                  <td className="py-3 text-center text-gray-700">{groomStats.totalSeats}</td>
                  <td className="py-3 text-center font-bold text-blue-600">{groomStats.confirmed}</td>
                  <td className="py-3 text-center font-bold text-rose-500">{groomStats.declined}</td>
                  <td className="py-3 text-center font-bold text-amber-600">{groomStats.maybe}</td>
                </tr>
                <tr className="font-bold bg-gray-50/50">
                  <td className="py-3 pl-2 text-gray-900">Total</td>
                  <td className="py-3 text-center text-gray-900">{totalStats.totalSeats}</td>
                  <td className="py-3 text-center text-blue-600">{totalStats.confirmed}</td>
                  <td className="py-3 text-center text-rose-500">{totalStats.declined}</td>
                  <td className="py-3 text-center text-amber-600">{totalStats.maybe}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <span className="text-xs font-medium text-gray-500">Filter by Category:</span>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Family">Family</option>
              <option value="Mother's Relative">Mother's Relative</option>
              <option value="Father's Relative">Father's Relative</option>
              <option value="Sibling Guests">Sibling Guests</option>
              <option value="Friends">Friends</option>
              <option value="Colleagues and Office">Colleagues and Office</option>
              <option value="Other Guests">Other Guests</option>
            </select>
          </div>
        </div>

        {/* Guest List / Empty State */}
        {filteredGuests.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-sm font-medium">
            No guests found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredGuests.map((g, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center hover:bg-gray-50/50 text-xs">
                <div>
                  <p className="font-bold text-gray-900">{g.title} {g.firstName} {g.lastName}</p>
                  <p className="text-gray-400">{g.category} • {g.phone || 'No phone'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    g.rsvp === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                    g.rsvp === 'Declined' ? 'bg-rose-50 text-rose-600' :
                    g.rsvp === 'Maybe' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {g.rsvp || 'Pending'}
                  </span>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors">
                    Send Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};