import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Wallet, ChevronDown, ChevronUp, Plus, Trash2, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

export const BudgetMap = () => {
  const { data, updateData } = useWedding();
  const [expandedCat, setExpandedCat] = useState(null);
  
  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['budget'];

  const defaultCategories = [
    {
      name: "Plate Costs",
      isPlateCost: true,
      items: [
        { name: "Full Plate Cost", cost: 0, payment: 0, balance: 0 },
        { name: "Half Plate Cost", cost: 0, payment: 0, balance: 0 }
      ]
    },
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

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, budget: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
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

      <div className="space-y-2">
        {budget.categories?.map((cat, idx) => {
          const isExpanded = expandedCat === cat.name;
          const catTotal = cat.items?.reduce((sum, i) => sum + (Number(i.cost) || 0), 0) || 0;

          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setExpandedCat(isExpanded ? null : cat.name)} 
                className="w-full flex justify-between p-4 hover:bg-gray-50 items-center"
              >
                <div className="flex items-center gap-2">
                  {cat.isPlateCost ? <UtensilsCrossed size={16} className="text-emerald-500"/> : <Wallet size={16} className="text-emerald-500"/>}
                  <span className="font-bold text-sm text-gray-700">{cat.name || 'Unnamed Category'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-emerald-600">LKR {catTotal.toLocaleString()}</span>
                  {isExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                </div>
              </button>

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