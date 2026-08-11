import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Wallet, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

export const BudgetMap = () => {
  const { data, updateData } = useWedding();
  const [expandedCat, setExpandedCat] = useState(null);
  
  // Safe defaults without hardcoded names or amounts
  const budget = data?.budget || { totalBudget: 0, categories: [] };

  // Dynamically calculate metrics
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
    updateData({ budget: { ...budget, totalBudget: Number(e.target.value) } });
  };

  const handleUpdateItem = (catIdx, itemIdx, field, val) => {
    const newCategories = [...budget.categories];
    const item = newCategories[catIdx].items[itemIdx];
    
    item[field] = field === 'name' ? val : Number(val);
    item.balance = Math.max(0, (Number(item.cost) || 0) - (Number(item.payment) || 0));
    
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  const handleAddItem = (catIdx) => {
    const newCategories = [...budget.categories];
    newCategories[catIdx].items.push({ name: '', cost: 0, payment: 0, balance: 0 });
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  const handleDeleteItem = (catIdx, itemIdx) => {
    const newCategories = [...budget.categories];
    newCategories[catIdx].items.splice(itemIdx, 1);
    updateData({ budget: { ...budget, categories: newCategories } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Wallet size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Budget</h2>
            <p className="text-sm text-gray-500 font-medium">Enter the budget for the wedding</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Mark as completed</button>
          <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Export</button>
        </div>
      </div>

      {/* Top Level Tracker */}
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

      {/* Category Accordions */}
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
                  <Wallet size={16} className="text-emerald-500"/>
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
                          {(item.balance || 0).toLocaleString()}
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