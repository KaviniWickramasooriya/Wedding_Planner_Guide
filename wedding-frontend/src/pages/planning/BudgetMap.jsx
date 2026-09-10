import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Wallet, ChevronDown, ChevronUp, Plus, Trash2, UtensilsCrossed, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const BudgetMap = () => {
  const { data, updateData } = useWedding();
  const [expandedCat, setExpandedCat] = useState(null);
  
  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['budget'];

  // Calculate Lunch Plate Cost based ONLY on Confirmed guests and dynamic rates set in guest map
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

  const lunchFullPlateTotal = confirmedAdultsCount * fullRateNum;
  const lunchHalfPlateTotal = confirmedHalfCount * halfRateNum;
  const grandTotalLunchPlateCost = lunchFullPlateTotal + lunchHalfPlateTotal;

  // Manual Morning Plate Cost State (manually entered pax, rate, amount)
  const morningPlate = data?.morningPlate || { pax: 0, rate: 0, amount: 0 };

  const handleMorningPlateChange = (field, value) => {
    const val = Number(value) || 0;
    const updated = { ...morningPlate, [field]: val };
    
    if (field === 'pax' || field === 'rate') {
      const p = field === 'pax' ? val : (Number(morningPlate.pax) || 0);
      const r = field === 'rate' ? val : (Number(morningPlate.rate) || 0);
      updated.amount = p * r;
    }

    updateData({ morningPlate: updated }, true);
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

  // Filter out legacy plate cost categories if present
  budget.categories = budget.categories.filter(cat => cat.name !== "Plate Costs" && !cat.isPlateCost);

  let utilizedBudget = 0;
  let unpaidItems = 0;
  
  budget.categories?.forEach(cat => {
    cat.items?.forEach(item => {
      const cost = Number(item.cost) || 0;
      const payment = Number(item.payment) || 0;
      utilizedBudget += cost;
      if (cost > payment) {
        unpaidItems += 1;
      }
    });
  });

  const remainingPayment = Math.max(0, (Number(budget.totalBudget) || 0) - utilizedBudget);

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Wallet size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Budget</h2>
            <p className="text-sm text-gray-500 font-medium">Enter the budget for the wedding</p>
          </div>
        </div>
        <div className="flex gap-2">
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
          <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Export</button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center bg-blue-50/40 p-3 rounded-xl border border-blue-100">
          <div>
            <p className="text-xs font-bold text-blue-800">Set Your Wedding Budget</p>
            <p className="text-[11px] text-blue-600/70">Setting a budget helps you track expenses and stay on target</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-bold text-gray-500">LKR</span>
            <input 
              type="number" 
              value={budget.totalBudget || ''} 
              onChange={handleUpdateTotal}
              placeholder="0"
              className="w-28 outline-none text-right font-bold text-xs" 
            />
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-end text-xs">
          <div>
            <p className="text-gray-400 font-semibold mb-1">Total Budget</p>
            <p className="text-lg font-bold text-emerald-600">LKR {(budget.totalBudget || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold mb-1">Remaining Payment</p>
            <p className="text-sm font-bold text-rose-500">LKR {remainingPayment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold mb-1">Unpaid Items</p>
            <p className="text-sm font-bold text-amber-600">{unpaidItems}</p>
          </div>
        </div>
      </div>

      {/* Lunch Plate Cost Calculator Section (Calculated with Confirmed Guests) */}
      <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <UtensilsCrossed size={18}/> Lunch Plate Cost Summary (Confirmed Guests Only)
          </div>
          <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Total Lunch Plate Cost: LKR {grandTotalLunchPlateCost.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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

      {/* Manual Morning Plate Cost Calculator Section */}
      <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <UtensilsCrossed size={18}/> Morning Plate Cost Calculator (Manual Entry)
          </div>
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            Total Morning Plate Amount: LKR {(Number(morningPlate.amount) || 0).toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center w-36">Pax (Manual)</th>
                <th className="p-3 text-right w-44">Rate (LKR)</th>
                <th className="p-3 text-right w-44">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              <tr>
                <td className="p-3 font-bold text-gray-800">Morning Plate / Breakfast</td>
                <td className="p-3 text-center">
                  <input 
                    type="number"
                    value={morningPlate.pax || ''}
                    onChange={(e) => handleMorningPlateChange('pax', e.target.value)}
                    placeholder="0"
                    className="w-24 border border-gray-300 rounded-lg text-center py-1.5 bg-white outline-none font-bold"
                  />
                </td>
                <td className="p-3 text-right">
                  <input 
                    type="number"
                    value={morningPlate.rate || ''}
                    onChange={(e) => handleMorningPlateChange('rate', e.target.value)}
                    placeholder="0"
                    className="w-32 border border-gray-300 rounded-lg text-right px-2 py-1.5 bg-white outline-none font-bold"
                  />
                </td>
                <td className="p-3 text-right font-extrabold text-amber-700">
                  {(Number(morningPlate.amount) || 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Expense Categories</h3>
        <button 
          onClick={handleAddCustomCategory}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus size={14}/> Add Category
        </button>
      </div>

      <div className="space-y-2">
        {budget.categories?.map((cat, idx) => {
          const isExpanded = expandedCat === cat.name;
          const catTotal = cat.items?.reduce((sum, i) => sum + (Number(i.cost) || 0), 0) || 0;

          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="w-full flex justify-between p-4 hover:bg-gray-50 items-center">
                <button 
                  onClick={() => setExpandedCat(isExpanded ? null : cat.name)} 
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <Wallet size={16} className="text-emerald-500"/>
                  <span className="font-bold text-sm text-gray-700">{cat.name || 'Unnamed Category'}</span>
                </button>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-emerald-600">LKR {catTotal.toLocaleString()}</span>
                  <button 
                    onClick={() => handleDeleteCategory(idx)}
                    className="text-gray-300 hover:text-rose-500 transition-colors p-1"
                    title="Delete Category"
                  >
                    <Trash2 size={16}/>
                  </button>
                  <button 
                    onClick={() => setExpandedCat(isExpanded ? null : cat.name)}
                    className="text-gray-400"
                  >
                    {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 bg-gray-50/50 border-t space-y-3">
                  <div className="grid grid-cols-12 gap-3 text-[11px] font-bold text-gray-400 px-6 uppercase tracking-wider">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-right">Budget</div>
                    <div className="col-span-2 text-right">Payment</div>
                    <div className="col-span-3 text-right">Balance</div>
                  </div>
                  
                  {cat.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button onClick={() => handleDeleteItem(idx, i)}>
                        <Trash2 size={16} className="text-gray-300 hover:text-rose-500 transition-colors"/>
                      </button>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <input 
                          type="text" 
                          value={item.name || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'name', e.target.value)}
                          placeholder="Item Name"
                          className="col-span-5 border border-gray-200 rounded-lg p-2 text-xs bg-white outline-none focus:border-blue-400" 
                        />
                        <input 
                          type="number" 
                          value={item.cost || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'cost', e.target.value)}
                          placeholder="0"
                          className="col-span-2 border border-gray-200 rounded-lg p-2 text-xs bg-white text-right outline-none focus:border-blue-400" 
                        />
                        <input 
                          type="number" 
                          value={item.payment || ''} 
                          onChange={(e) => handleUpdateItem(idx, i, 'payment', e.target.value)}
                          placeholder="0"
                          className="col-span-2 border border-gray-200 rounded-lg p-2 text-xs bg-white text-right outline-none focus:border-blue-400" 
                        />
                        <div className="col-span-3 border border-transparent rounded-lg p-2 text-xs bg-gray-100 text-right font-bold text-gray-700">
                          LKR {(item.balance || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleAddItem(idx)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 pt-2 ml-7"
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