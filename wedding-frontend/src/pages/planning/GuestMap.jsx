import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Users, Download, Eye, EyeOff, Plus, Trash2, CheckCircle2, Save, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

export const GuestMap = () => {
  const { data, updateData } = useWedding();
  const [activeSide, setActiveSide] = useState("Bride's");
  const [hiddenCategories, setHiddenCategories] = useState({});
  const [fullRate, setFullRate] = useState(data?.plateRates?.fullRate || '');
  const [halfRate, setHalfRate] = useState(data?.plateRates?.halfRate || '');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Track inline editing state for guest rows
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: 'Mr', firstName: '', lastName: '', phone: '', category: '', rsvp: 'Pending', adults: 1, half: 0, kids: 0 });

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['guests'];

  // Base/default categories merged with any custom ones stored in state/data
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

  const guests = data?.guests || [];

  const handleToggleHide = (cat) => {
    setHiddenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleDeleteGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    updateData({ guests: newGuests }, true);
  };

  const handleDeleteCategory = (catTitle) => {
    // Check if any guests belong to this category
    const hasGuests = guests.some(g => g.category === catTitle);
    if (hasGuests) {
      toast.error("Cannot delete category while guests are assigned to it.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove the category "${catTitle}"?`)) {
      const updatedCustom = customCategories.filter(c => c !== catTitle);
      updateData({ customGuestCategories: updatedCustom }, true);
      toast.success(`Category "${catTitle}" removed successfully!`);
    }
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, guests: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    if (categories.map(c => c.toLowerCase()).includes(newCategoryName.trim().toLowerCase())) {
      toast.error("Category already exists.");
      return;
    }
    const updatedCustomCategories = [...customCategories, newCategoryName.trim()];
    updateData({ customGuestCategories: updatedCustomCategories }, true);
    setNewCategoryName('');
    toast.success(`Category "${newCategoryName.trim()}" added successfully!`);
  };

  const handleStartEdit = (absoluteIdx, g) => {
    setEditingIndex(absoluteIdx);
    setEditForm({
      title: g.title || 'Mr',
      firstName: g.firstName || '',
      lastName: g.lastName || '',
      phone: g.phone || '',
      category: g.category || 'Family',
      rsvp: g.rsvp || 'Pending',
      adults: g.adults ?? 1,
      half: g.half ?? 0,
      kids: g.kids ?? 0
    });
  };

  const handleSaveEdit = (absoluteIdx) => {
    const updatedGuests = [...guests];
    updatedGuests[absoluteIdx] = {
      ...updatedGuests[absoluteIdx],
      title: editForm.title,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phone: editForm.phone,
      category: editForm.category,
      rsvp: editForm.rsvp,
      adults: Number(editForm.adults) || 0,
      half: Number(editForm.half) || 0,
      kids: Number(editForm.kids) || 0
    };
    updateData({ guests: updatedGuests }, true);
    setEditingIndex(null);
    toast.success("Guest updated successfully!");
  };

  const handleAddNewGuestRow = (catTitle) => {
    const newGuest = {
      side: activeSide,
      category: catTitle,
      title: 'Mr',
      firstName: 'New',
      lastName: 'Guest',
      phone: '',
      rsvp: 'Pending',
      adults: 1,
      half: 0,
      kids: 0,
      liquor: 0
    };
    const updated = [...guests, newGuest];
    updateData({ guests: updated }, true);
    setEditingIndex(updated.length - 1);
    setEditForm({
      title: 'Mr',
      firstName: 'New',
      lastName: 'Guest',
      phone: '',
      category: catTitle,
      rsvp: 'Pending',
      adults: 1,
      half: 0,
      kids: 0
    });
  };

  const handleSavePlateRates = () => {
    const fRate = Number(fullRate) || 0;
    const hRate = Number(halfRate) || 0;

    updateData({ 
      plateRates: { fullRate: fRate, halfRate: hRate }
    }, true);
    toast.success("Plate rates saved successfully!");
  };

  const filteredGuests = guests.filter(g => (g.side || "Bride's") === activeSide);

  let totalSidePax = 0;
  filteredGuests.forEach(g => {
    totalSidePax += (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
  });

  const fRateNum = Number(fullRate) || 0;
  const hRateNum = Number(halfRate) || 0;
  let currentTotalAdults = 0;
  let currentTotalHalf = 0;
  filteredGuests.forEach(g => {
    currentTotalAdults += Number(g.adults) || 0;
    currentTotalHalf += Number(g.half) || 0;
  });
  const calculatedFullPlateTotalCost = (currentTotalAdults * fRateNum) + (currentTotalHalf * hRateNum);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Guests Management</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Organize guest lists, headcounts, and RSVP responses</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveSide("Bride's"); setEditingIndex(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSide === "Bride's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Bride's Side
            </button>
            <button 
              onClick={() => { setActiveSide("Groom's"); setEditingIndex(null); }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeSide === "Groom's" ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Groom's Side
            </button>
          </div>

          <button 
            onClick={toggleCompleted} 
            className={`px-4 py-2.5 border rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isCompleted 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm' 
                : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={15}/> {isCompleted ? 'Completed' : 'Mark as completed'}
          </button>
          
          <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 text-gray-700 shadow-sm">
            <Download size={15}/> Export
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{activeSide} Guest Statistics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Total registered entries under this side</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            {filteredGuests.length} Guests ({totalSidePax} Pax)
          </span>
        </div>

        {/* Add Custom Category Form Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Add New Category</h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Create custom groupings for your guest list</p>
          </div>
          <form onSubmit={handleAddCustomCategory} className="flex items-center gap-2.5 w-full sm:w-auto">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. VIP, University Friends"
              className="border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-white w-full sm:w-64 focus:border-blue-500 font-medium shadow-2xs"
            />
            <button 
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={15}/> Add Category
            </button>
          </form>
        </div>

        {/* Plate Rate Calculation Box */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h4 className="text-sm font-bold text-gray-900">Set Plate Rates Calculator</h4>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Calculate total plate costs based on guest headcounts.</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold">
              Full Plate Total Cost: LKR {calculatedFullPlateTotalCost.toLocaleString()}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Plate Rate (LKR)</label>
              <input 
                type="number" 
                value={fullRate} 
                onChange={e => setFullRate(e.target.value)} 
                placeholder="0" 
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-white focus:border-blue-500 font-medium shadow-2xs" 
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Half Plate Rate (LKR)</label>
              <input 
                type="number" 
                value={halfRate} 
                onChange={e => setHalfRate(e.target.value)} 
                placeholder="0" 
                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none bg-white focus:border-blue-500 font-medium shadow-2xs" 
              />
            </div>
            <div className="flex items-end self-end sm:self-auto w-full sm:w-auto pt-1 sm:pt-0">
              <button 
                onClick={handleSavePlateRates}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Save size={15}/> Save Rates
              </button>
            </div>
          </div>
        </div>

        {/* Categories Loop */}
        {categories.map((catTitle, cIdx) => {
          const catGuests = guests
            .map((g, originalIndex) => ({ ...g, originalIndex }))
            .filter(g => (g.side || "Bride's") === activeSide && g.category === catTitle);

          const totalCount = catGuests.length;
          const totalAdults = catGuests.reduce((sum, g) => sum + (Number(g.adults) || 0), 0);
          const totalHalf = catGuests.reduce((sum, g) => sum + (Number(g.half) || 0), 0);
          const totalKids = catGuests.reduce((sum, g) => sum + (Number(g.kids) || 0), 0);
          const totalLiquor = catGuests.reduce((sum, g) => sum + (Number(g.liquor) || 0), 0);
          const categoryPax = totalAdults + totalHalf + totalKids;
          const isCustomCategory = customCategories.includes(catTitle);

          return (
            <div key={cIdx} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 px-5 py-3.5 rounded-xl border border-gray-100 gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="font-bold text-gray-900 text-sm">Category: {catTitle}</h4>
                  <span className="text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 font-bold">
                    {categoryPax} Pax Amount ({totalCount} Entries)
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-gray-500 font-medium">
                    {totalAdults} Adults • {totalHalf} Half • {totalKids} Kids • {totalLiquor} Liquor
                  </span>
                  <div className="flex items-center gap-1">
                    {isCustomCategory && (
                      <button 
                        onClick={() => handleDeleteCategory(catTitle)} 
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove Category"
                      >
                        <Trash2 size={16}/>
                      </button>
                    )}
                    <button 
                      onClick={() => handleToggleHide(catTitle)} 
                      className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-200/60 transition-colors"
                    >
                      {hiddenCategories[catTitle] ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </div>
              </div>

              {!hiddenCategories[catTitle] && (
                <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs min-w-[750px]">
                    <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3 w-12 text-center">#</th>
                        <th className="p-3 w-24">Title</th>
                        <th className="p-3">First Name</th>
                        <th className="p-3">Last Name</th>
                        <th className="p-3 w-36">Phone</th>
                        <th className="p-3 w-28">RSVP</th>
                        <th className="p-3 w-16 text-center">Adults</th>
                        <th className="p-3 w-16 text-center">Half</th>
                        <th className="p-3 w-16 text-center">Kids</th>
                        <th className="p-3 w-28 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {catGuests.map((g, i) => {
                        const absoluteIdx = g.originalIndex;
                        const isEditing = editingIndex === absoluteIdx;

                        return (
                          <tr key={absoluteIdx} className="bg-white hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 text-center text-gray-400 font-medium flex items-center justify-center gap-1">
                              <button onClick={() => handleDeleteGuest(absoluteIdx)} className="text-gray-300 hover:text-rose-600 transition-colors" title="Delete Guest">
                                <Trash2 size={14}/>
                              </button>
                              <span>{i + 1}</span>
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <select 
                                  value={editForm.title} 
                                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                  className="border border-blue-300 rounded-lg px-2 py-1.5 bg-white outline-none text-xs w-full font-medium shadow-2xs"
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
                              ) : (
                                <span className="text-gray-700 font-semibold">{g.title || 'Mr'}</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editForm.firstName} 
                                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                  placeholder="First Name"
                                  className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 bg-white outline-none font-medium shadow-2xs"
                                />
                              ) : (
                                <span className="text-gray-900 font-bold">{g.firstName || '—'}</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editForm.lastName} 
                                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                  placeholder="Last Name"
                                  className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 bg-white outline-none font-medium shadow-2xs"
                                />
                              ) : (
                                <span className="text-gray-900 font-bold">{g.lastName || '—'}</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editForm.phone} 
                                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                  placeholder="Phone Number"
                                  className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 bg-white outline-none font-medium shadow-2xs font-mono"
                                />
                              ) : (
                                <span className="text-gray-600 font-mono text-[11px]">{g.phone || 'No phone'}</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <select 
                                  value={editForm.rsvp} 
                                  onChange={(e) => setEditForm({...editForm, rsvp: e.target.value})}
                                  className="border border-blue-300 rounded-lg px-2 py-1.5 bg-white outline-none text-xs w-full font-medium shadow-2xs"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Declined">Declined</option>
                                  <option value="Maybe">Maybe</option>
                                </select>
                              ) : (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                  g.rsvp === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  g.rsvp === 'Declined' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                  g.rsvp === 'Maybe' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {g.rsvp || 'Pending'}
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editForm.adults} 
                                  onChange={(e) => setEditForm({...editForm, adults: e.target.value})}
                                  className="w-12 border border-blue-300 rounded-lg text-center py-1.5 bg-white outline-none font-medium mx-auto shadow-2xs"
                                />
                              ) : (
                                <span className="font-semibold text-gray-700">{g.adults ?? 1}</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editForm.half} 
                                  onChange={(e) => setEditForm({...editForm, half: e.target.value})}
                                  className="w-12 border border-blue-300 rounded-lg text-center py-1.5 bg-white outline-none font-medium mx-auto shadow-2xs"
                                />
                              ) : (
                                <span className="font-semibold text-gray-700">{g.half ?? 0}</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={editForm.kids} 
                                  onChange={(e) => setEditForm({...editForm, kids: e.target.value})}
                                  className="w-12 border border-blue-300 rounded-lg text-center py-1.5 bg-white outline-none font-medium mx-auto shadow-2xs"
                                />
                              ) : (
                                <span className="font-semibold text-gray-700">{g.kids ?? 0}</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button 
                                    onClick={() => handleSaveEdit(absoluteIdx)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                                    title="Save Changes"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={() => setEditingIndex(null)}
                                    className="border border-gray-300 text-gray-600 px-2 py-1.5 rounded-lg text-xs hover:bg-gray-100"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleStartEdit(absoluteIdx, g)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 mx-auto shadow-2xs"
                                  title="Edit Row"
                                >
                                  <Edit3 size={13}/> Edit
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <button 
                      onClick={() => handleAddNewGuestRow(catTitle)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-blue-50/50 rounded-xl transition-all border border-dashed border-blue-200 shadow-2xs"
                    >
                      <Plus size={15}/> Add New Guest to {catTitle}
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