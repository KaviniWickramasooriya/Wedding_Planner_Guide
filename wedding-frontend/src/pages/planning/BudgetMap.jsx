import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Wallet, ChevronDown, ChevronUp, Plus, Trash2, UtensilsCrossed, CheckCircle2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const BudgetMap = () => {
  const { data, updateData } = useWedding();
  const [expandedCat, setExpandedCat] = useState(null);
  
  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['budget'];

  // Local state for morning plate to ensure persistence after refresh
  const [morningPax, setMorningPax] = useState(data?.morningPlate?.pax || '');
  const [morningRate, setMorningRate] = useState(data?.morningPlate?.rate || '');

  // Sync morning plate data from backend after page refresh/async load
  useEffect(() => {
    if (data?.morningPlate) {
      setMorningPax(data.morningPlate.pax || '');
      setMorningRate(data.morningPlate.rate || '');
    }
  }, [data?.morningPlate]);

  const guests = data?.guests || [];
  let confirmedAdultsCount = 0;
  let confirmedHalfCount = 0;

  guests.forEach(g => {
    if (g.rsvp === 'Confirmed') {
      confirmedAdultsCount += Number(g.adults) || 0;
      confirmedHalfCount += Number(g.half) || 0;
    }
  });

  const plateRates = data?.plateRates || { fullRate: 0, halfRate: 0 };
  const fullRateNum = Number(plateRates.fullRate) || 0;
  const halfRateNum = Number(plateRates.halfRate) || 0;

  // Lunch Costs
  const lunchFullPlateTotal = confirmedAdultsCount * fullRateNum;
  const lunchHalfPlateTotal = confirmedHalfCount * halfRateNum;
  const grandTotalLunchPlateCost = lunchFullPlateTotal + lunchHalfPlateTotal;

  // Morning Costs
  const morningPaxNum = Number(morningPax) || 0;
  const morningRateNum = Number(morningRate) || 0;
  const morningPlateTotal = morningPaxNum * morningRateNum;

  // Combined Total for reference display
  const grandTotalAllPlates = grandTotalLunchPlateCost + morningPlateTotal;

  const handleSaveMorningPlate = () => {
    updateData({ 
      morningPlate: { 
        pax: morningPaxNum, 
        rate: morningRateNum, 
        amount: morningPlateTotal 
      } 
    }, true);
    toast.success("Morning plate costs saved successfully!");
  };

  const defaultCategories = [
    { name: "Reception Hall", items: [
      { name: "Reception Hall", cost: 0, payment: 0, balance: 0 },
      { name: "Beverages handling fees", cost: 0, payment: 0, balance: 0 },
      { name: "Other location charges", cost: 0, payment: 0, balance: 0 },
      { name: "Seat covers/ Chairs", cost: 0, payment: 0, balance: 0 },
      { name: "Tax & Service charges", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Wedding registration", items: [
      { name: "Registrar Fee", cost: 0, payment: 0, balance: 0 },
      { name: "Marriage Registration Fee", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Beauty Salon", items: [
      { name: "Prewedding Pampering", cost: 0, payment: 0, balance: 0 },
      { name: "Bride's Hair and makeup", cost: 0, payment: 0, balance: 0 },
      { name: "Bride's Dressing", cost: 0, payment: 0, balance: 0 },
      { name: "Bridesmaids'", cost: 0, payment: 0, balance: 0 },
      { name: "Flower Girls'", cost: 0, payment: 0, balance: 0 },
      { name: "Groom's Hair and makeup", cost: 0, payment: 0, balance: 0 },
      { name: "Groom's Dressing", cost: 0, payment: 0, balance: 0 },
      { name: "Groomsmen's", cost: 0, payment: 0, balance: 0 },
      { name: "Flower Boys'", cost: 0, payment: 0, balance: 0 },
      { name: "Bride's Going away", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Cultural Requirements", items: [
      { name: "Astrologer", cost: 0, payment: 0, balance: 0 },
      { name: "Ashtaka and Jayamangala gatha", cost: 0, payment: 0, balance: 0 },
      { name: "Shashrika table", cost: 0, payment: 0, balance: 0 },
      { name: "Traditional Dancing Group", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Photography", items: [
      { name: "Pre-shoot", cost: 0, payment: 0, balance: 0 },
      { name: "Wedding shoot", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Wedding Shoes", items: [
      { name: "Bride's, Bridesmaids', Flower Girls', Groom, Groomsmen, Flower Boys', Bride's Going away, Groom's Going away", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Flowers Bouquets", items: [
      { name: "Bride's Bouquets", cost: 0, payment: 0, balance: 0 },
      { name: "Bridesmaids' Bouquets", cost: 0, payment: 0, balance: 0 },
      { name: "Flower Girls Flowers", cost: 0, payment: 0, balance: 0 },
      { name: "Groomsmen Boutonnieres, Groom's Boutonnieres", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Wedding Decoration", items: [
      { name: "Wedding Decoration", cost: 0, payment: 0, balance: 0 },
      { name: "Reception Hall Decor", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Entertainment", items: [
      { name: "Band", cost: 0, payment: 0, balance: 0 },
      { name: "Master of Ceremony (MC)", cost: 0, payment: 0, balance: 0 },
      { name: "Dancing Group", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Jewelry", items: [
      { name: "Bride's Ring, Bride's necklace", cost: 0, payment: 0, balance: 0 },
      { name: "Groom's Ring, Brother's Ring (Gift)", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Stationary", items: [
      { name: "Invitation cards", cost: 0, payment: 0, balance: 0 },
      { name: "Wedding cake boxes, Other printing elements", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Wedding cakes", items: [
      { name: "Wedding cake", cost: 0, payment: 0, balance: 0 },
      { name: "Wedding cake pieces", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Transportation", items: [
      { name: "Wedding Car", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Foods and beverages", items: [
      { name: "Catering service", cost: 0, payment: 0, balance: 0 },
      { name: "Liquor", cost: 0, payment: 0, balance: 0 },
      { name: "Soft drinks, Bites", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Gifts", items: [
      { name: "Bride's Mother", cost: 0, payment: 0, balance: 0 },
      { name: "Bride's Father", cost: 0, payment: 0, balance: 0 },
      { name: "Bride's Uncle", cost: 0, payment: 0, balance: 0 },
      { name: "Groom's Mother", cost: 0, payment: 0, balance: 0 },
      { name: "Groom's Father, Groom's Uncle", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Rental Items", items: [
      { name: "Marquees and Lightings", cost: 0, payment: 0, balance: 0 },
      { name: "Table Numbers", cost: 0, payment: 0, balance: 0 },
      { name: "Table Clothes", cost: 0, payment: 0, balance: 0 },
      { name: "Show Plates", cost: 0, payment: 0, balance: 0 },
      { name: "Cutleries", cost: 0, payment: 0, balance: 0 },
      { name: "Chairs, Guest Book", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Honey-moon", items: [
      { name: "Shopping.", cost: 0, payment: 0, balance: 0 },
      { name: "Transportation.", cost: 0, payment: 0, balance: 0 },
      { name: "Foods and drinks.", cost: 0, payment: 0, balance: 0 },
      { name: "Activities and tickets., Hotels & Resorts", cost: 0, payment: 0, balance: 0 }
    ]},
    { name: "Other", items: [] }
  ];

  const budget = data?.budget || { totalBudget: 0, categories: defaultCategories };
  if (!budget.categories || budget.categories.length === 0) {
    budget.categories = defaultCategories;
  }

  budget.categories = budget.categories.filter(cat => cat.name !== "Plate Costs" && !cat.isPlateCost);

  let totalItemsCost = 0;
  let totalPaid = 0;
  
  budget.categories?.forEach(cat => {
    cat.items?.forEach(item => {
      totalItemsCost += (Number(item.cost) || 0);
      totalPaid += (Number(item.payment) || 0);
    });
  });

  const totalEstimatedCost = totalItemsCost;
  const balanceToPay = totalEstimatedCost - totalPaid;
  const remainingBudget = (Number(budget.totalBudget) || 0) - totalEstimatedCost;

  const handleUpdateTotal = (e) => {
    updateData({ budget: { ...budget, totalBudget: Number(e.target.value) } }, true);
  };

  const handleUpdateItem = (catIdx, itemIdx, field, val) => {
    const newCategories = JSON.parse(JSON.stringify(budget.categories));
    const item = newCategories[catIdx].items[itemIdx];
    
    item[field] = field === 'name' ? val : Number(val);
    item.balance = Math.max(0, (Number(item.cost) || 0) - (Number(item.payment) || 0));
    
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  const handleAddItem = (catIdx) => {
    const newCategories = JSON.parse(JSON.stringify(budget.categories));
    newCategories[catIdx].items.push({ name: '', cost: 0, payment: 0, balance: 0 });
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  const handleDeleteItem = (catIdx, itemIdx) => {
    const newCategories = JSON.parse(JSON.stringify(budget.categories));
    newCategories[catIdx].items.splice(itemIdx, 1);
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  const handleDeleteCategory = (catIdx) => {
    const catName = budget.categories[catIdx].name;
    if (window.confirm(`Are you sure you want to delete the category "${catName}"?`)) {
      const newCategories = budget.categories.filter((_, idx) => idx !== catIdx);
      updateData({ budget: { ...budget, categories: newCategories } }, true);
      toast.success(`Category "${catName}" deleted successfully!`);
    }
  };

  const handleAddCustomCategory = () => {
    const catName = prompt("Enter new budget category name:");
    if (!catName || !catName.trim()) return;
    const newCategories = JSON.parse(JSON.stringify(budget.categories));
    if (newCategories.some(c => c.name.toLowerCase() === catName.trim().toLowerCase())) {
      toast.error("Category already exists.");
      return;
    }
    newCategories.push({ name: catName.trim(), items: [] });
    updateData({ budget: { ...budget, categories: newCategories } }, true);
    toast.success(`Category "${catName.trim()}" added successfully!`);
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, budget: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto p-4 md:p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Budget</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Enter the budget for the wedding</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            onClick={toggleCompleted} 
            className={`px-4 py-2.5 border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isCompleted 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm' 
                : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={14}/> {isCompleted ? 'Completed' : 'Mark as completed'}
          </button>
          <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm">Export</button>
        </div>
      </div>

      {/* Main Budget Input and 5-Column Summary Dashboard */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 gap-4">
          <div>
            <p className="text-sm font-extrabold text-indigo-900">Set Your Wedding Budget</p>
            <p className="text-xs text-indigo-700/80 font-medium mt-1">Setting a budget helps you track expenses and stay on target</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-indigo-200 px-4 py-2.5 rounded-xl shadow-sm w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500">LKR</span>
            <input 
              type="number" 
              value={budget.totalBudget || ''} 
              onChange={handleUpdateTotal}
              placeholder="0"
              className="w-32 outline-none text-right font-black text-sm text-indigo-950 bg-transparent" 
            />
          </div>
        </div>

        {/* 5-Column Accurate Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100/80 flex flex-col justify-center">
            <p className="text-blue-600/80 font-bold mb-1 uppercase tracking-wider text-[10px]">Total Budget</p>
            <p className="text-lg font-black text-blue-700">LKR {(Number(budget.totalBudget) || 0).toLocaleString()}</p>
          </div>
          
          <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100/80 flex flex-col justify-center">
            <p className="text-purple-600/80 font-bold mb-1 uppercase tracking-wider text-[10px]">Total Est. Cost</p>
            <p className="text-lg font-black text-purple-700">LKR {totalEstimatedCost.toLocaleString()}</p>
          </div>
          
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100/80 flex flex-col justify-center">
            <p className="text-emerald-600/80 font-bold mb-1 uppercase tracking-wider text-[10px]">Total Paid</p>
            <p className="text-lg font-black text-emerald-700">LKR {totalPaid.toLocaleString()}</p>
          </div>
          
          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-100/80 flex flex-col justify-center">
            <p className="text-rose-600/80 font-bold mb-1 uppercase tracking-wider text-[10px]">Balance to Pay</p>
            <p className="text-lg font-black text-rose-700">LKR {balanceToPay.toLocaleString()}</p>
          </div>
          
          <div className={`${remainingBudget >= 0 ? 'bg-teal-50/60 border-teal-100/80' : 'bg-red-50/60 border-red-100/80'} p-4 rounded-xl border flex flex-col justify-center`}>
            <p className={`${remainingBudget >= 0 ? 'text-teal-600/80' : 'text-red-600/80'} font-bold mb-1 uppercase tracking-wider text-[10px]`}>
              {remainingBudget >= 0 ? 'Budget Surplus' : 'Over Budget'}
            </p>
            <p className={`text-lg font-black ${remainingBudget >= 0 ? 'text-teal-700' : 'text-red-700'}`}>
              LKR {Math.abs(remainingBudget).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* --- ALL PLATE COSTS COMBINED MASTER BANNER --- */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-sm p-5 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-800">
        <div>
          <h3 className="font-extrabold text-sm md:text-base text-slate-100">Total Food & Beverage Plate Costs</h3>
          <p className="text-[11px] text-slate-400 mt-1">Combined total of Morning Plate and Lunch Plate amounts (tracked in categories)</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Grand Total Plates</span>
          <span className="text-lg md:text-xl font-black text-emerald-400">
            LKR {grandTotalAllPlates.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Lunch Plate Cost Summary */}
      <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs md:text-sm">
            <UtensilsCrossed size={18}/> Lunch Plate Cost Summary (Confirmed Guests)
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
            Lunch Total: LKR {grandTotalLunchPlateCost.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3">Plate Type</th>
                <th className="p-3 text-center">Confirmed Pax</th>
                <th className="p-3 text-right">Rate (LKR)</th>
                <th className="p-3 text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              <tr>
                <td className="p-3 font-bold text-gray-800">Full Plate (Adults)</td>
                <td className="p-3 text-center font-bold text-blue-600">{confirmedAdultsCount}</td>
                <td className="p-3 text-right">{fullRateNum.toLocaleString()}</td>
                <td className="p-3 text-right font-bold text-emerald-600">{lunchFullPlateTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-gray-800">Half Plate (Children/Half)</td>
                <td className="p-3 text-center font-bold text-blue-600">{confirmedHalfCount}</td>
                <td className="p-3 text-right">{halfRateNum.toLocaleString()}</td>
                <td className="p-3 text-right font-bold text-emerald-600">{lunchHalfPlateTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Morning Plate Cost Calculator */}
      <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-3 gap-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs md:text-sm">
            <UtensilsCrossed size={18}/> Morning Plate Cost Calculator (Manual Entry)
          </div>
          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
            Morning Total: LKR {morningPlateTotal.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center w-36">Pax (Manual)</th>
                <th className="p-3 text-right w-44">Rate (LKR)</th>
                <th className="p-3 text-right w-44">Amount (LKR)</th>
                <th className="p-3 text-center w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              <tr>
                <td className="p-3 font-bold text-gray-800">Morning Plate / Breakfast</td>
                <td className="p-3 text-center">
                  <input 
                    type="number"
                    value={morningPax}
                    onChange={(e) => setMorningPax(e.target.value)}
                    placeholder="0"
                    className="w-24 border border-gray-200 rounded-xl text-center py-2 bg-gray-50 outline-none font-bold focus:bg-white focus:border-amber-400"
                  />
                </td>
                <td className="p-3 text-right">
                  <input 
                    type="number"
                    value={morningRate}
                    onChange={(e) => setMorningRate(e.target.value)}
                    placeholder="0"
                    className="w-32 border border-gray-200 rounded-xl text-right px-3 py-2 bg-gray-50 outline-none font-bold focus:bg-white focus:border-amber-400"
                  />
                </td>
                <td className="p-3 text-right font-extrabold text-amber-700">
                  {morningPlateTotal.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={handleSaveMorningPlate}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 w-full"
                  >
                    <Save size={13}/> Save
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider">Expense Categories</h3>
        <button 
          onClick={handleAddCustomCategory}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus size={14}/> Add Category
        </button>
      </div>

      <div className="space-y-2">
        {budget.categories?.map((cat, idx) => {
          const isExpanded = expandedCat === cat.name;
          const catTotal = cat.items?.reduce((sum, i) => sum + (Number(i.cost) || 0), 0) || 0;
          const catPaid = cat.items?.reduce((sum, i) => sum + (Number(i.payment) || 0), 0) || 0;
          const catBalance = Math.max(0, catTotal - catPaid);

          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="w-full flex flex-col sm:flex-row justify-between p-4 hover:bg-gray-50/60 items-start sm:items-center transition-colors gap-3">
                <button 
                  onClick={() => setExpandedCat(isExpanded ? null : cat.name)} 
                  className="flex items-center gap-2.5 flex-1 text-left"
                >
                  <Wallet size={16} className="text-emerald-500 shrink-0"/>
                  <span className="font-bold text-xs md:text-sm text-gray-800">{cat.name || 'Unnamed Category'}</span>
                </button>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-bold">
                    <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                      Paid: LKR {catPaid.toLocaleString()}
                    </span>
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 whitespace-nowrap">
                      Bal: LKR {catBalance.toLocaleString()}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-extrabold whitespace-nowrap">
                      LKR {catTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDeleteCategory(idx)}
                      className="text-gray-300 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                      title="Delete Category"
                    >
                      <Trash2 size={16}/>
                    </button>
                    <button 
                      onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
                      className="text-gray-400 p-1"
                    >
                      {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 bg-gray-50/50 border-t space-y-3 overflow-x-auto">
                  <div className="grid grid-cols-12 gap-3 text-[10px] md:text-[11px] font-bold text-gray-400 px-6 uppercase tracking-wider min-w-[600px]">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-right">Budget</div>
                    <div className="col-span-2 text-right">Payment</div>
                    <div className="col-span-3 text-right">Balance</div>
                  </div>
                  
                  {cat.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 min-w-[600px]">
                      <button onClick={() => handleDeleteItem(idx, i)} className="text-gray-300 hover:text-rose-600 p-1">
                        <Trash2 size={15}/>
                      </button>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <input 
                          type="text" 
                          value={item.name || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'name', e.target.value)}
                          placeholder="Item Name"
                          className="col-span-5 border border-gray-200 rounded-xl p-2.5 text-xs bg-white outline-none focus:border-blue-500 font-medium shadow-2xs" 
                        />
                        <input 
                          type="number" 
                          value={item.cost || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'cost', e.target.value)}
                          placeholder="0"
                          className="col-span-2 border border-gray-200 rounded-xl p-2.5 text-xs bg-white text-right outline-none focus:border-blue-500 font-medium shadow-2xs" 
                        />
                        <input 
                          type="number" 
                          value={item.payment || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'payment', e.target.value)}
                          placeholder="0"
                          className="col-span-2 border border-gray-200 rounded-xl p-2.5 text-xs bg-white text-right outline-none focus:border-blue-500 font-medium shadow-2xs" 
                        />
                        <div className="col-span-3 border border-transparent rounded-xl p-2.5 text-xs bg-gray-100 text-right font-bold text-gray-700 flex items-center justify-end">
                          LKR {(item.balance || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleAddItem(idx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 pt-2 ml-7"
                  >
                    <Plus size={14}/> Add item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};