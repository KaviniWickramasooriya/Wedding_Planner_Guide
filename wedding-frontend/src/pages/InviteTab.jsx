import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Mail, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export const InviteTab = () => {
  const { data, updateData } = useWedding();
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

  const defaultCategories = [
    "Family",
    "Mother's Relative",
    "Father's Relative",
    "Sibling Guests",
    "Friends",
    "Colleagues",
    "Office",
    "Other Guests"
  ];

  const customCategories = data?.customGuestCategories || [];
  const categories = Array.from(new Set([...defaultCategories, ...customCategories]));

  const filteredGuests = guests.filter(g => {
    const matchSide = (g.side || "Bride's") === activeSide;
    const matchCategory = selectedCategory === "All" || g.category === selectedCategory;
    return matchSide && matchCategory;
  });

  const handleUpdateInviteStatus = (absoluteIdx, newStatus) => {
    const updatedGuests = [...guests];
    updatedGuests[absoluteIdx].inviteStatus = newStatus;
    updateData({ guests: updatedGuests }, true);
  };

  const handleSendWhatsApp = (guest, absoluteIdx) => {
    if (!guest.phone) {
      toast.error("Please add a phone number for this guest first.");
      return;
    }
    const message = encodeURIComponent(`Hi ${guest.firstName}, you are warmly invited to our wedding! Please let us know your RSVP status.`);
    window.open(`https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    
    const updatedGuests = [...guests];
    updatedGuests[absoluteIdx].inviteStatus = 'Sent';
    updateData({ guests: updatedGuests }, true);
  };

  const calculatePax = (guestList) => {
    return guestList.reduce((sum, g) => sum + (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0), 0);
  };

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
            <p className="text-xs text-gray-500">Send and manage your wedding invitations separately for Bride and Groom</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveSide("Bride's")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeSide === "Bride's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Bride's Invitations
            </button>
            <button 
              onClick={() => setActiveSide("Groom's")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeSide === "Groom's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Groom's Invitations
            </button>
          </div>
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
            <span className="text-xs font-bold text-emerald-600">{guests.length} Total Guests</span>
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
                  <td className="py-3 font-semibold text-gray-800">Bride's Side</td>
                  <td className="py-3 text-center text-gray-700">{brideStats.totalSeats}</td>
                  <td className="py-3 text-center font-bold text-blue-600">{brideStats.confirmed}</td>
                  <td className="py-3 text-center font-bold text-rose-500">{brideStats.declined}</td>
                  <td className="py-3 text-center font-bold text-amber-600">{brideStats.maybe}</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold text-gray-800">Groom's Side</td>
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
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-white gap-3">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            {activeSide} Invitation List ({filteredGuests.length})
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Filter by Category:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Separate Tables by Category */}
        {categories
          .filter(cat => selectedCategory === "All" || selectedCategory === cat)
          .map(catName => {
            const catGuests = filteredGuests.filter(g => g.category === catName);
            if (catGuests.length === 0 && selectedCategory !== catName) return null;

            const catPax = calculatePax(catGuests);

            return (
              <div key={catName} className="border-b border-gray-200 last:border-0">
                <div className="bg-gray-50/80 px-4 py-2.5 font-bold text-xs text-gray-800 border-b border-gray-200 flex justify-between items-center">
                  <span>{catName}</span>
                  <span className="text-[11px] text-gray-500 font-normal">({catGuests.length} Guests - {catPax} Pax)</span>
                </div>

                {catGuests.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs font-medium">
                    No guests in this category for {activeSide}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Guest Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">RSVP Status</th>
                          <th className="p-3">Invitation Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {catGuests.map((g) => {
                          const absoluteIdx = guests.findIndex(item => item === g);
                          const currentStatus = g.inviteStatus || 'Pending';

                          return (
                            <tr key={absoluteIdx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-3">
                                <span className="font-bold text-gray-900">{g.title || ''} {g.firstName} {g.lastName}</span>
                              </td>
                              <td className="p-3">
                                <span className="text-gray-600 font-mono">{g.phone || 'No phone'}</span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full font-bold ${
                                  g.rsvp === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                  g.rsvp === 'Declined' ? 'bg-rose-50 text-rose-600' :
                                  g.rsvp === 'Maybe' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {g.rsvp || 'Pending'}
                                </span>
                              </td>
                              <td className="p-3">
                                <select 
                                  value={currentStatus}
                                  onChange={(e) => handleUpdateInviteStatus(absoluteIdx, e.target.value)}
                                  className={`border rounded-lg px-2.5 py-1 text-xs font-bold outline-none cursor-pointer ${
                                    currentStatus === 'Sent' 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                      : 'bg-amber-50 text-amber-700 border-amber-300'
                                  }`}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Sent">Sent</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <button 
                                    onClick={() => handleSendWhatsApp(g, absoluteIdx)}
                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                  >
                                    <MessageSquare size={13} /> Send Invite
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};