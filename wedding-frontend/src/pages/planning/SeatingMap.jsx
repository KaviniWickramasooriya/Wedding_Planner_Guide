import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Armchair, Palette, Plus, ChevronDown, ChevronUp, Trash2, CheckCircle2 } from 'lucide-react';

export const SeatingMap = () => {
  const { data, updateData } = useWedding();
  const tables = data?.tables || [];
  const guests = data?.guests || [];
  const [expandedTableId, setExpandedTableId] = useState(null);

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['seating'];

  const handleAddTable = () => {
    const newTable = { id: Date.now().toString(), name: `Table ${tables.length + 1}`, capacity: 4, assignedGuests: [] };
    updateData({ tables: [...tables, newTable] });
  };

  const handleDeleteTable = (id) => {
    updateData({ tables: tables.filter(t => t.id !== id) });
  };

  const handleUpdateCapacity = (id, newCapacity) => {
    const capacity = Math.max(1, Number(newCapacity));
    const updated = tables.map(t => {
      if (t.id === id) {
        const assigned = [...(t.assignedGuests || [])];
        if (assigned.length > capacity) assigned.length = capacity;
        return { ...t, capacity, assignedGuests: assigned };
      }
      return t;
    });
    updateData({ tables: updated });
  };

  const handleAssignGuest = (tableId, seatIndex, guestName) => {
    const updated = tables.map(t => {
      if (t.id === tableId) {
        const assigned = [...(t.assignedGuests || Array(t.capacity).fill(''))];
        assigned[seatIndex] = guestName;
        return { ...t, assignedGuests: assigned };
      }
      return t;
    });
    updateData({ tables: updated });
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, seating: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  const totalCapacity = tables.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const totalAssigned = tables.reduce((acc, t) => acc + (t.assignedGuests?.filter(Boolean).length || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-20">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <Armchair size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Seating Map</h2>
            <p className="text-sm text-gray-500 font-medium">Arrange the guests into tables</p>
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
          <button className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-1 text-gray-700 hover:bg-gray-50"><Palette size={14}/> Design</button>
          <button onClick={handleAddTable} className="px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-1 bg-slate-900 text-white hover:bg-slate-800"><Plus size={14}/> Add Table</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {tables.length === 0 ? (
          <div className="md:col-span-4 flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-gray-400 font-medium">
             No tables added yet. Click "Add Table" to begin.
          </div>
        ) : (
          <>
            <div className="md:col-span-1 space-y-4">
              {tables.map((table) => {
                const isExpanded = expandedTableId === table.id;
                const assignedCount = table.assignedGuests?.filter(Boolean).length || 0;

                return (
                  <div key={table.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div 
                      onClick={() => setExpandedTableId(isExpanded ? null : table.id)}
                      className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 cursor-pointer hover:bg-gray-100/50"
                    >
                      <h4 className="font-bold text-xs text-gray-800 flex items-center gap-1.5"><Armchair size={14} className="text-gray-400"/> {table.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600">{assignedCount}/{table.capacity} seats</span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 space-y-3 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">Capacity</span>
                          <div className="flex items-center border border-gray-200 rounded-md bg-white">
                            <button onClick={() => handleUpdateCapacity(table.id, table.capacity - 1)} className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 font-bold">-</button>
                            <span className="px-3 py-0.5 text-xs font-bold border-x border-gray-200">{table.capacity}</span>
                            <button onClick={() => handleUpdateCapacity(table.id, table.capacity + 1)} className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 font-bold">+</button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="flex text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">
                            <span className="w-12">Seat</span><span>Guest</span>
                          </div>
                          {Array.from({ length: table.capacity }).map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-400 w-8">1-{i + 1}</span>
                              <select 
                                value={table.assignedGuests?.[i] || ''}
                                onChange={(e) => handleAssignGuest(table.id, i, e.target.value)}
                                className="border border-gray-200 rounded-md p-1.5 text-xs w-full outline-none focus:border-blue-400 bg-white"
                              >
                                <option value="">Select Guest</option>
                                {guests.map((g, gIdx) => (
                                  <option key={gIdx} value={`${g.firstName} ${g.lastName}`}>
                                    {g.firstName} {g.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-3 bg-white">
                      <button onClick={() => handleDeleteTable(table.id)} className="w-full border border-rose-200 text-rose-500 font-bold text-xs py-2 rounded-lg hover:bg-rose-50 flex items-center justify-center gap-1.5 transition-colors">
                        <Trash2 size={14}/> Delete Table
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-500 min-h-[400px] shadow-sm space-y-4">
              <Armchair size={48} className="text-gray-300"/>
              <p className="text-sm font-semibold text-gray-700">Seating Visualizer Canvas</p>
              <p className="text-xs text-gray-400">Total Tables: {tables.length} • Total Capacity: {totalCapacity} • Allocated Seats: {totalAssigned}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};