import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Armchair, Palette, Plus, ChevronDown, Trash2 } from 'lucide-react';

export const SeatingMap = () => {
  const { data, updateData } = useWedding();
  const tables = data?.tables || [];

  const handleAddTable = () => {
    const newTable = { id: Date.now().toString(), name: `Table ${tables.length + 1}`, capacity: 4, assignedGuests: [] };
    updateData({ tables: [...tables, newTable] });
  };

  const handleDeleteTable = (id) => {
    updateData({ tables: tables.filter(t => t.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Armchair size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seating Map</h2>
            <p className="text-sm text-gray-500 font-medium">Arrange the guests into tables</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">Mark as completed</button>
          <button className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-1 text-gray-700 hover:bg-gray-50"><Palette size={14}/> Design</button>
          <button onClick={handleAddTable} className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800"><Plus size={14}/> Add Table</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6">
        {tables.length === 0 ? (
          <div className="md:col-span-4 flex items-center justify-center bg-gray-100/50 border border-dashed border-gray-300 rounded-2xl p-8 text-gray-400 font-medium">
             No tables added yet. Click "Add Table" to begin.
          </div>
        ) : (
          <>
            <div className="md:col-span-1 space-y-4">
              {tables.map((table) => (
                <div key={table.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5"><Armchair size={14} className="text-gray-400"/> {table.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600">0/{table.capacity} seats</span>
                      <ChevronDown size={16} className="text-gray-400"/>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">{table.name} Capacity</span>
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 font-bold">-</button>
                        <span className="px-3 py-0.5 text-xs font-bold border-x border-gray-200">{table.capacity}</span>
                        <button className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 font-bold">+</button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
                        <span className="w-12">Seat</span><span>Guest</span>
                      </div>
                      {Array.from({ length: table.capacity }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 w-8">1-{i + 1}</span>
                          <input type="text" placeholder="Select Guest" className="border border-gray-200 rounded-md p-1.5 text-xs w-full outline-none focus:border-blue-400 bg-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-gray-100 bg-gray-50/30 rounded-b-2xl">
                    <button onClick={() => handleDeleteTable(table.id)} className="w-full border border-rose-200 text-rose-500 font-bold text-xs py-2 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors">
                      <Trash2 size={14}/> Delete Table
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-3 bg-gray-100/50 border border-dashed border-gray-300 rounded-2xl p-8 flex items-center justify-center text-gray-400 text-sm font-medium">
               Select a table to view it on the canvas.
            </div>
          </>
        )}
      </div>
    </div>
  );
};