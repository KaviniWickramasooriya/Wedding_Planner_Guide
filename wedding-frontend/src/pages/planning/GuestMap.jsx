import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Users, Download, Eye, EyeOff, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const GuestMap = () => {
  const { data, updateData } = useWedding();
  const [activeSide, setActiveSide] = useState("Bride's");
  const [hiddenCategories, setHiddenCategories] = useState({});

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['guests'];

  const categories = [
    "Family",
    "Mother's Relative",
    "Father's Relative",
    "Sibling Guests",
    "Friends",
    "Colleagues and Office",
    "Other Guests"
  ];

  const guests = data?.guests || [];

  const handleToggleHide = (cat) => {
    setHiddenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleUpdateGuest = (index, field, value) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    updateData({ guests: newGuests });
  };

  const handleDeleteGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    updateData({ guests: newGuests });
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, guests: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  const filteredGuests = guests.filter(g => (g.side || "Bride's") === activeSide);

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
            <button 
              onClick={() => setActiveSide("Bride's")}
              className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${activeSide === "Bride's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Bride's
            </button>
            <button 
              onClick={() => setActiveSide("Groom's")}
              className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all ${activeSide === "Groom's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'}`}
            >
              Groom's
            </button>
          </div>
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
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-50"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-gray-800 text-sm">{activeSide} Guest Statistics</h3>
          <span className="text-xs font-bold text-emerald-600">{filteredGuests.length} Guests</span>
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

        {categories.map((catTitle, cIdx) => {
          const catGuests = guests
            .map((g, originalIndex) => ({ ...g, originalIndex }))
            .filter(g => (g.side || "Bride's") === activeSide && g.category === catTitle);

          const totalCount = catGuests.length;
          const totalAdults = catGuests.reduce((sum, g) => sum + (Number(g.adults) || 0), 0);
          const totalHalf = catGuests.reduce((sum, g) => sum + (Number(g.half) || 0), 0);
          const totalKids = catGuests.reduce((sum, g) => sum + (Number(g.kids) || 0), 0);
          const totalLiquor = catGuests.reduce((sum, g) => sum + (Number(g.liquor) || 0), 0);

          return (
            <div key={cIdx} className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-800 text-sm">{catTitle}</h4>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {totalCount} total • {totalAdults} Adults • {totalHalf} Half • {totalKids} Kids • {totalLiquor} liquor
                  </span>
                </div>
                <button onClick={() => handleToggleHide(catTitle)} className="text-gray-400 hover:text-gray-600">
                  {hiddenCategories[catTitle] ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>

              {!hiddenCategories[catTitle] && (
                <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 gap-2 bg-gray-50/50 p-3 font-bold text-gray-500 border-b">
                    <div className="col-span-1">Order</div>
                    <div className="col-span-1">Title</div>
                    <div className="col-span-2">First Name</div>
                    <div className="col-span-2">Last Name</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-1">RSVP</div>
                    <div className="col-span-1 text-center">Adults</div>
                    <div className="col-span-1 text-center">Half</div>
                    <div className="col-span-1 text-center">Kids</div>
                  </div>

                  {catGuests.map((g, i) => (
                    <div key={g.originalIndex} className="grid grid-cols-12 gap-2 p-3 font-medium text-gray-700 border-b border-gray-100 items-center bg-white hover:bg-gray-50/50">
                      <div className="col-span-1 flex items-center gap-1.5">
                        <button onClick={() => handleDeleteGuest(g.originalIndex)} className="text-gray-300 hover:text-rose-500">
                          <Trash2 size={14}/>
                        </button>
                        <span>{i + 1}</span>
                      </div>
                      <div className="col-span-1">
                        <select 
                          value={g.title || 'Mr'} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'title', e.target.value)}
                          className="border border-gray-200 rounded px-1.5 py-1 bg-white outline-none text-xs"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Miss">Miss</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                          <option value="Prof">Prof</option>
                          <option value="Rev">Rev</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          value={g.firstName || ''} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'firstName', e.target.value)}
                          placeholder="First Name"
                          className="w-full border border-gray-200 rounded px-2 py-1 bg-white outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          value={g.lastName || ''} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'lastName', e.target.value)}
                          placeholder="Last Name"
                          className="w-full border border-gray-200 rounded px-2 py-1 bg-white outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          value={g.phone || ''} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'phone', e.target.value)}
                          placeholder="e.g. 9477..."
                          className="w-full border border-gray-200 rounded px-2 py-1 bg-white outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <select 
                          value={g.rsvp || 'Pending'} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'rsvp', e.target.value)}
                          className="border border-gray-200 rounded px-1.5 py-1 bg-white outline-none text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Declined">Declined</option>
                          <option value="Maybe">Maybe</option>
                        </select>
                      </div>
                      <div className="col-span-1 text-center">
                        <input 
                          type="number" 
                          value={g.adults ?? 1} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'adults', Number(e.target.value))}
                          className="w-12 border border-gray-200 rounded text-center py-1 bg-white outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <input 
                          type="number" 
                          value={g.half ?? 0} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'half', Number(e.target.value))}
                          className="w-12 border border-gray-200 rounded text-center py-1 bg-white outline-none"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <input 
                          type="number" 
                          value={g.kids ?? 0} 
                          onChange={(e) => handleUpdateGuest(g.originalIndex, 'kids', Number(e.target.value))}
                          className="w-12 border border-gray-200 rounded text-center py-1 bg-white outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="p-3 text-center bg-white">
                    <button 
                      onClick={() => {
                        const newGuests = [...guests, {
                          side: activeSide,
                          category: catTitle,
                          title: 'Mr',
                          firstName: '',
                          lastName: '',
                          phone: '',
                          rsvp: 'Pending',
                          adults: 1,
                          half: 0,
                          kids: 0,
                          liquor: 0
                        }];
                        updateData({ guests: newGuests });
                      }}
                      className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1 w-full py-1 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-dashed border-gray-200"
                    >
                      <Plus size={14}/> Add New Guest
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};