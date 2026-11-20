import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Users, Download, Eye, EyeOff, Plus, Trash2, CheckCircle2, Save, Edit3, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

export const GuestMap = () => {
  const { data, updateData } = useWedding();
  const [activeSide, setActiveSide] = useState("Bride's");
  
  const [expandedCategories, setExpandedCategories] = useState({});
  const [fullRate, setFullRate] = useState(data?.plateRates?.fullRate || '');
  const [halfRate, setHalfRate] = useState(data?.plateRates?.halfRate || '');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ title: 'Mr', firstName: '', lastName: '', phone: '', category: '', rsvp: 'Pending', adults: 1, half: 0, kids: 0 });

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['guests'];

  const guests = data?.guests || [];

  // Sync plate rates from backend after page refresh/async load
  useEffect(() => {
    if (data?.plateRates) {
      setFullRate(data.plateRates.fullRate || '');
      setHalfRate(data.plateRates.halfRate || '');
    }
  }, [data?.plateRates]);

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
  
  const guestCategories = guests.map(g => g.category).filter(Boolean);
  
  const categories = Array.from(new Set([...defaultCategories, ...customCategories, ...guestCategories]));

  const handleToggleView = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleDeleteGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    updateData({ guests: newGuests }, true);
  };

  const handleDeleteCategory = (catTitle) => {
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
    setExpandedCategories(prev => ({ ...prev, [catTitle]: true }));
  };

  const handleSavePlateRates = () => {
    const fRate = Number(fullRate) || 0;
    const hRate = Number(halfRate) || 0;

    updateData({ 
      plateRates: { fullRate: fRate, halfRate: hRate }
    }, true);
    toast.success("Plate rates saved successfully!");
  };

  const fRateNum = Number(fullRate) || 0;
  const hRateNum = Number(halfRate) || 0;

  // Cost calculation strictly factors: Adult at Adult Rate, Half at Half Rate, Kids at 0
  const calcStats = (guestList) => {
    const init = { entries: 0, pax: 0, adults: 0, half: 0, kids: 0, cost: 0 };
    const s = { 
      Total: { ...init }, 
      Confirmed: { ...init }, 
      Pending: { ...init }, 
      Maybe: { ...init }, 
      Declined: { ...init } 
    };

    guestList.forEach(g => {
      const adults = Number(g.adults) || 0;
      const half = Number(g.half) || 0;
      const kids = Number(g.kids) || 0;
      const totalPax = adults + half + kids;
      const cost = (adults * fRateNum) + (half * hRateNum); // Kids plate cost is 0
      const rsvpStatus = g.rsvp || 'Pending';

      s.Total.entries += 1;
      s.Total.pax += totalPax;
      s.Total.adults += adults;
      s.Total.half += half;
      s.Total.kids += kids;
      s.Total.cost += cost;

      if (s[rsvpStatus]) {
        s[rsvpStatus].entries += 1;
        s[rsvpStatus].pax += totalPax;
        s[rsvpStatus].adults += adults;
        s[rsvpStatus].half += half;
        s[rsvpStatus].kids += kids;
        s[rsvpStatus].cost += cost;
      }
    });
    return s;
  };

  const allStats = calcStats(guests);
  const brideStats = calcStats(guests.filter(g => (g.side || "Bride's") === "Bride's"));
  const groomStats = calcStats(guests.filter(g => g.side === "Groom's"));

  const sumGuestBreakdown = (list) => {
    const adults = list.reduce((sum, g) => sum + (Number(g.adults) || 0), 0);
    const half = list.reduce((sum, g) => sum + (Number(g.half) || 0), 0);
    const kids = list.reduce((sum, g) => sum + (Number(g.kids) || 0), 0);
    return {
      families: list.length,
      adults,
      half,
      kids,
      pax: adults + half + kids
    };
  };

  const statCardsConfig = [
    {
      key: 'Total',
      label: 'Grand Total',
      cardClass: 'bg-blue-50/50 border-blue-100',
      labelClass: 'text-blue-600',
      badgeClass: 'bg-blue-100/60 text-blue-700',
      paxClass: 'text-blue-900',
      subClass: 'text-blue-700',
      famClass: 'text-blue-600/70',
      dividerClass: 'border-blue-200/40',
      sideTextClass: 'text-blue-800',
      sideLabelClass: 'text-blue-600/60'
    },
    {
      key: 'Confirmed',
      label: 'Confirmed',
      cardClass: 'bg-emerald-50/50 border-emerald-100',
      labelClass: 'text-emerald-600',
      badgeClass: 'bg-emerald-100/60 text-emerald-700',
      paxClass: 'text-emerald-900',
      subClass: 'text-emerald-700',
      famClass: 'text-emerald-600/70',
      dividerClass: 'border-emerald-200/40',
      sideTextClass: 'text-emerald-800',
      sideLabelClass: 'text-emerald-600/60'
    },
    {
      key: 'Pending',
      label: 'Pending',
      cardClass: 'bg-amber-50/50 border-amber-100',
      labelClass: 'text-amber-600',
      badgeClass: 'bg-amber-100/60 text-amber-700',
      paxClass: 'text-amber-900',
      subClass: 'text-amber-700',
      famClass: 'text-amber-600/70',
      dividerClass: 'border-amber-200/40',
      sideTextClass: 'text-amber-800',
      sideLabelClass: 'text-amber-600/60'
    },
    {
      key: 'Maybe',
      label: 'Maybe',
      cardClass: 'bg-purple-50/50 border-purple-100',
      labelClass: 'text-purple-600',
      badgeClass: 'bg-purple-100/60 text-purple-700',
      paxClass: 'text-purple-900',
      subClass: 'text-purple-700',
      famClass: 'text-purple-600/70',
      dividerClass: 'border-purple-200/40',
      sideTextClass: 'text-purple-800',
      sideLabelClass: 'text-purple-600/60'
    },
    {
      key: 'Declined',
      label: 'Declined',
      cardClass: 'bg-rose-50/50 border-rose-100',
      labelClass: 'text-rose-600',
      badgeClass: 'bg-rose-100/60 text-rose-700',
      paxClass: 'text-rose-900',
      subClass: 'text-rose-700',
      famClass: 'text-rose-600/70',
      dividerClass: 'border-rose-200/40',
      sideTextClass: 'text-rose-800',
      sideLabelClass: 'text-rose-600/60'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-300 p-4 md:p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Guests Management</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Organize guest lists, track headcounts, and manage RSVP responses</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
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

      {/* Global Wedding Statistics Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
          <ClipboardList size={18} className="text-gray-400" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Global Wedding Statistics</h3>
            <p className="text-xs text-gray-500 mt-0.5">Comprehensive breakdown of guests, pax, and estimated costs (Adults × Full Rate + Half × Half Rate; Kids: 0)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCardsConfig.map((cfg) => {
            const allS = allStats[cfg.key];
            const bS = brideStats[cfg.key];
            const gS = groomStats[cfg.key];

            return (
              <div key={cfg.key} className={`${cfg.cardClass} border p-4 rounded-xl flex flex-col justify-between h-full`}>
                <div>
                  <div className={`text-[10px] ${cfg.labelClass} font-bold uppercase tracking-wider mb-1`}>
                    {cfg.label}
                  </div>
                  <div className={`${cfg.badgeClass} px-2.5 py-1 rounded-md font-bold text-[10px] w-fit mb-3`}>
                    LKR {allS.cost.toLocaleString()}
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-3xl font-black ${cfg.paxClass} leading-none`}>{allS.pax}</span>
                    <span className={`text-xs font-bold ${cfg.subClass}`}>Pax</span>
                  </div>
                  <div className={`text-[11px] font-semibold ${cfg.famClass} mt-1`}>
                    ({allS.entries} Fam)
                  </div>

                  {/* Separate Adults, Half, Kids Counts */}
                  <div className={`mt-2.5 pt-2 border-t ${cfg.dividerClass} flex flex-wrap gap-1.5 text-[10px] font-bold ${cfg.sideTextClass}`}>
                    <span className="bg-white/70 px-1.5 py-0.5 rounded">Adults: {allS.adults}</span>
                    <span className="bg-white/70 px-1.5 py-0.5 rounded">Half: {allS.half}</span>
                    <span className="bg-white/70 px-1.5 py-0.5 rounded opacity-75">Kids: {allS.kids} (Free)</span>
                  </div>
                </div>
                
                <div className={`mt-3 pt-3 border-t ${cfg.dividerClass} flex flex-col gap-2 text-[10px] font-bold ${cfg.sideTextClass}`}>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <span className={`${cfg.sideLabelClass} uppercase`}>Bride</span>
                      <span className="whitespace-nowrap">{bS.pax} Pax <span className="opacity-70">({bS.entries})</span></span>
                    </div>
                    <div className="text-[9px] opacity-85 flex justify-between">
                      <span>A: {bS.adults} • H: {bS.half} • K: {bS.kids}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <span className={`${cfg.sideLabelClass} uppercase`}>Groom</span>
                      <span className="whitespace-nowrap">{gS.pax} Pax <span className="opacity-70">({gS.entries})</span></span>
                    </div>
                    <div className="text-[9px] opacity-85 flex justify-between">
                      <span>A: {gS.adults} • H: {gS.half} • K: {gS.kids}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container Card for List Editing */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6 space-y-6 overflow-hidden">
        
        {/* Side Tabs and Plate Rates Header */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-4 border-b border-gray-100 pb-6">
          
          <div className="flex flex-nowrap bg-gray-100/80 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => { setActiveSide("Bride's"); setEditingIndex(null); }}
              className={`flex-1 px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeSide === "Bride's" ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
            >
              Bride's Side List
            </button>
            <button 
              onClick={() => { setActiveSide("Groom's"); setEditingIndex(null); }}
              className={`flex-1 px-4 sm:px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeSide === "Groom's" ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
            >
              Groom's Side List
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto bg-gray-50 p-3 rounded-xl border border-gray-200/60">
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <label className="text-[11px] font-bold text-gray-500 whitespace-nowrap">Adult Full Rate:</label>
                <input 
                  type="number" 
                  value={fullRate} 
                  onChange={e => setFullRate(e.target.value)} 
                  placeholder="LKR" 
                  className="w-full sm:w-28 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-blue-500 font-medium min-w-[80px]" 
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <label className="text-[11px] font-bold text-gray-500 whitespace-nowrap">Half Rate:</label>
                <input 
                  type="number" 
                  value={halfRate} 
                  onChange={e => setHalfRate(e.target.value)} 
                  placeholder="LKR" 
                  className="w-full sm:w-28 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-blue-500 font-medium min-w-[80px]" 
                />
              </div>
              <button 
                onClick={handleSavePlateRates}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Save size={14}/> Save
              </button>
            </div>
          </div>
        </div>

        {/* Add Custom Category Form Bar */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Category Management</h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Add custom groups to organize the {activeSide.toLowerCase()} side list</p>
          </div>
          <form onSubmit={handleAddCustomCategory} className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. VIP, Work Friends"
              className="border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none bg-white w-full sm:w-56 focus:border-blue-500 font-medium shadow-sm"
            />
            <button 
              type="submit"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14}/> Add
            </button>
          </form>
        </div>

        {/* Categories Loop */}
        <div className="space-y-4 pt-2">
          {categories.map((catTitle, cIdx) => {
            const catGuests = guests
              .map((g, originalIndex) => ({ ...g, originalIndex }))
              .filter(g => (g.side || "Bride's") === activeSide && g.category === catTitle);

            const totalBreakdown = sumGuestBreakdown(catGuests);
            const confirmedBreakdown = sumGuestBreakdown(catGuests.filter(g => (g.rsvp || 'Pending') === 'Confirmed'));
            const pendingBreakdown = sumGuestBreakdown(catGuests.filter(g => (g.rsvp || 'Pending') === 'Pending'));
            const maybeBreakdown = sumGuestBreakdown(catGuests.filter(g => (g.rsvp || 'Pending') === 'Maybe'));
            const declinedBreakdown = sumGuestBreakdown(catGuests.filter(g => (g.rsvp || 'Pending') === 'Declined'));

            const isCustomCategory = !defaultCategories.includes(catTitle);

            return (
              <div key={cIdx}>
                <div className="flex flex-col gap-3 bg-white px-5 py-4 rounded-xl border border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-extrabold text-gray-900 text-sm min-w-[130px]">{catTitle}</h4>
                      <span className="text-[11px] text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                        Total: {totalBreakdown.pax} Pax ({totalBreakdown.families} Fam)
                      </span>
                      <span className="text-[11px] text-slate-800 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                        Adults: {totalBreakdown.adults}
                      </span>
                      <span className="text-[11px] text-slate-800 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                        Half: {totalBreakdown.half}
                      </span>
                      <span className="text-[11px] text-slate-800 bg-slate-100 border border-slate-200/70 px-2.5 py-1 rounded-md font-bold whitespace-nowrap opacity-75">
                        Kids: {totalBreakdown.kids} (Free)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
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
                        onClick={() => handleToggleView(catTitle)} 
                        className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {expandedCategories[catTitle] ? <Eye size={16}/> : <EyeOff size={16}/>}
                      </button>
                    </div>
                  </div>

                  {/* RSVP Breakdown Row (Confirmed, Pending, Maybe, Declined) */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-[10px] font-bold">
                    <span className="text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-md whitespace-nowrap">
                      Confirmed ({confirmedBreakdown.pax} Pax / {confirmedBreakdown.families} Fam): Adults {confirmedBreakdown.adults} • Half {confirmedBreakdown.half} • Kids {confirmedBreakdown.kids}
                    </span>
                    <span className="text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-md whitespace-nowrap">
                      Pending ({pendingBreakdown.pax} Pax / {pendingBreakdown.families} Fam): Adults {pendingBreakdown.adults} • Half {pendingBreakdown.half} • Kids {pendingBreakdown.kids}
                    </span>
                    <span className="text-purple-800 bg-purple-50 border border-purple-200/70 px-2.5 py-1 rounded-md whitespace-nowrap">
                      Maybe ({maybeBreakdown.pax} Pax / {maybeBreakdown.families} Fam): Adults {maybeBreakdown.adults} • Half {maybeBreakdown.half} • Kids {maybeBreakdown.kids}
                    </span>
                    <span className="text-rose-800 bg-rose-50 border border-rose-200/70 px-2.5 py-1 rounded-md whitespace-nowrap">
                      Declined ({declinedBreakdown.pax} Pax / {declinedBreakdown.families} Fam): Adults {declinedBreakdown.adults} • Half {declinedBreakdown.half} • Kids {declinedBreakdown.kids}
                    </span>
                  </div>
                </div>

                {expandedCategories[catTitle] && (
                  <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-sm mt-3">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3 w-12 text-center">#</th>
                          <th className="p-3 w-20">Title</th>
                          <th className="p-3">First Name</th>
                          <th className="p-3">Last Name</th>
                          <th className="p-3 w-32">Phone</th>
                          <th className="p-3 w-28">RSVP</th>
                          <th className="p-3 w-16 text-center">Adults</th>
                          <th className="p-3 w-16 text-center">Half</th>
                          <th className="p-3 w-16 text-center">Kids</th>
                          <th className="p-3 w-28 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {catGuests.length === 0 ? (
                           <tr>
                             <td colSpan="10" className="p-6 text-center text-gray-400 font-medium italic text-xs">
                               No guests added to this category yet. Click below to add a guest.
                             </td>
                           </tr>
                        ) : (
                          catGuests.map((g, i) => {
                            const absoluteIdx = g.originalIndex;
                            const isEditing = editingIndex === absoluteIdx;

                            return (
                              <tr key={absoluteIdx} className={`bg-white transition-colors ${isEditing ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                                <td className="p-3 text-center text-gray-400 font-bold flex items-center justify-center gap-1.5">
                                  <button onClick={() => handleDeleteGuest(absoluteIdx)} className="text-gray-300 hover:text-rose-600 transition-colors" title="Delete Guest">
                                    <Trash2 size={13}/>
                                  </button>
                                  <span>{i + 1}</span>
                                </td>

                                <td className="p-3">
                                  {isEditing ? (
                                    <select 
                                      value={editForm.title} 
                                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                      className="border border-blue-300 rounded-md px-1.5 py-1.5 bg-white outline-none text-[11px] w-full font-bold shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                                      className="w-full border border-blue-300 rounded-md px-2 py-1.5 bg-white outline-none font-semibold shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                                      className="w-full border border-blue-300 rounded-md px-2 py-1.5 bg-white outline-none font-semibold shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                                      placeholder="Phone"
                                      className="w-full border border-blue-300 rounded-md px-2 py-1.5 bg-white outline-none font-semibold font-mono text-[11px] shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="text-gray-600 font-mono text-[11px] font-medium">{g.phone || '-'}</span>
                                  )}
                                </td>

                                <td className="p-3">
                                  {isEditing ? (
                                    <select 
                                      value={editForm.rsvp} 
                                      onChange={(e) => setEditForm({...editForm, rsvp: e.target.value})}
                                      className="border border-blue-300 rounded-md px-1.5 py-1.5 bg-white outline-none text-[11px] w-full font-bold shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Declined">Declined</option>
                                      <option value="Maybe">Maybe</option>
                                    </select>
                                  ) : (
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${
                                      g.rsvp === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                      g.rsvp === 'Declined' ? 'bg-rose-100 text-rose-700' :
                                      g.rsvp === 'Maybe' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
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
                                      className="w-12 border border-blue-300 rounded-md text-center py-1.5 bg-white outline-none font-bold mx-auto shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="font-bold text-gray-800">{g.adults ?? 1}</span>
                                  )}
                                </td>

                                <td className="p-3 text-center">
                                  {isEditing ? (
                                    <input 
                                      type="number" 
                                      value={editForm.half} 
                                      onChange={(e) => setEditForm({...editForm, half: e.target.value})}
                                      className="w-12 border border-blue-300 rounded-md text-center py-1.5 bg-white outline-none font-bold mx-auto shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="font-bold text-gray-800">{g.half ?? 0}</span>
                                  )}
                                </td>

                                <td className="p-3 text-center">
                                  {isEditing ? (
                                    <input 
                                      type="number" 
                                      value={editForm.kids} 
                                      onChange={(e) => setEditForm({...editForm, kids: e.target.value})}
                                      className="w-12 border border-blue-300 rounded-md text-center py-1.5 bg-white outline-none font-bold mx-auto shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                  ) : (
                                    <span className="font-bold text-gray-800">{g.kids ?? 0}</span>
                                  )}
                                </td>

                                <td className="p-3 text-center">
                                  {isEditing ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button 
                                        onClick={() => handleSaveEdit(absoluteIdx)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all shadow-sm"
                                        title="Save Changes"
                                      >
                                        Save
                                      </button>
                                      <button 
                                        onClick={() => setEditingIndex(null)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded-md text-[11px] font-bold transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => handleStartEdit(absoluteIdx, g)}
                                      className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 mx-auto shadow-sm"
                                      title="Edit Row"
                                    >
                                      <Edit3 size={12}/> Edit
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                    <div className="p-2.5 bg-gray-50 border-t border-gray-200 text-center">
                      <button 
                        onClick={() => handleAddNewGuestRow(catTitle)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-blue-50/50 rounded-lg transition-all border border-dashed border-blue-300 shadow-sm"
                      >
                        <Plus size={14}/> Add New Guest to {catTitle}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};