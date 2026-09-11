import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Armchair, Plus, ChevronDown, ChevronUp, Trash2, CheckCircle2, LayoutGrid, Users, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const SeatingMap = () => {
  const { data, updateData } = useWedding();
  const tables = data?.tables || [];
  const guests = data?.guests || [];
  const [expandedTableId, setExpandedTableId] = useState(null);

  // Editing state for table rename or capacity changes
  const [editingTableId, setEditingTableId] = useState(null);
  const [editTableName, setEditTableName] = useState('');
  const [editTableCapacity, setEditTableCapacity] = useState(10);

  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['seating'];

  // Only consider Confirmed guests for seating allocation
  const confirmedGuests = guests.filter(g => g.rsvp === 'Confirmed');

  // Separate Confirmed guests by Bride and Groom side
  const brideConfirmed = confirmedGuests.filter(g => (g.side || "Bride's") === "Bride's");
  const groomConfirmed = confirmedGuests.filter(g => g.side === "Groom's");

  // Helper to get total pax count for a selected guest name
  const getGuestPaxCount = (guestFullName) => {
    const guestObj = confirmedGuests.find(g => `${g.title || 'Mr'} ${g.firstName || ''} ${g.lastName || ''}`.trim() === guestFullName);
    return guestObj ? ((Number(guestObj.adults) || 0) + (Number(guestObj.half) || 0) + (Number(guestObj.kids) || 0)) : 1;
  };

  // Helper to calculate total assigned pax count for a guest name across all tables
  const getAssignedPaxForGuest = (guestFullName, excludeTableId = null, excludeSeatIdx = null) => {
    let count = 0;
    tables.forEach(t => {
      if (t.assignedGuests) {
        t.assignedGuests.forEach((gName, sIdx) => {
          if (excludeTableId && t.id === excludeTableId && sIdx === excludeSeatIdx) return;
          if (gName === guestFullName) {
            count += getGuestPaxCount(gName);
          }
        });
      }
    });
    return count;
  };

  const handleAddTable = () => {
    const newTable = { 
      id: Date.now().toString(), 
      name: `Table ${tables.length + 1}`, 
      capacity: 10, 
      assignedGuests: [] 
    };
    updateData({ tables: [...tables, newTable] }, true);
    toast.success("New table created with 10 pax capacity!");
  };

  const handleDeleteTable = (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      updateData({ tables: tables.filter(t => t.id !== id) }, true);
      toast.success("Table deleted successfully.");
    }
  };

  const handleStartEditTable = (table) => {
    setEditingTableId(table.id);
    setEditTableName(table.name);
    setEditTableCapacity(table.capacity);
  };

  const handleSaveEditTable = (id) => {
    const newCap = Math.min(10, Math.max(1, Number(editTableCapacity) || 10));
    const targetTable = tables.find(t => t.id === id);
    
    // Calculate current total pax in table
    const currentTablePax = (targetTable?.assignedGuests || []).reduce((sum, gName) => sum + (gName ? getGuestPaxCount(gName) : 0), 0);

    if (currentTablePax > newCap) {
      toast.error(`Cannot reduce capacity to ${newCap}. Current assigned guests total ${currentTablePax} pax at this table.`);
      return;
    }

    const updated = tables.map(t => {
      if (t.id === id) {
        return { ...t, name: editTableName || t.name, capacity: newCap };
      }
      return t;
    });
    updateData({ tables: updated }, true);
    setEditingTableId(null);
    toast.success("Table updated successfully!");
  };

  const handleUpdateCapacity = (id, newCapacity) => {
    const capacity = Math.min(10, Math.max(1, Number(newCapacity)));
    const targetTable = tables.find(t => t.id === id);
    const currentTablePax = (targetTable?.assignedGuests || []).reduce((sum, gName) => sum + (gName ? getGuestPaxCount(gName) : 0), 0);

    if (currentTablePax > capacity) {
      toast.error(`Cannot reduce capacity below current assigned pax (${currentTablePax}).`);
      return;
    }

    const updated = tables.map(t => {
      if (t.id === id) {
        return { ...t, capacity };
      }
      return t;
    });
    updateData({ tables: updated });
  };

  const handleAssignGuest = (tableId, seatIndex, guestFullName) => {
    const targetTable = tables.find(t => t.id === tableId);
    if (!targetTable) return;

    if (guestFullName) {
      // Prevent adding the same family entry multiple times into this exact same table
      const isAlreadyInThisTable = (targetTable.assignedGuests || []).some((gName, idx) => idx !== seatIndex && gName === guestFullName);
      if (isAlreadyInThisTable) {
        toast.error("This family entry is already assigned to this table!");
        return;
      }

      const incomingPax = getGuestPaxCount(guestFullName);

      // Calculate current table total pax excluding this specific seat index being updated/replaced
      let currentTablePax = 0;
      (targetTable.assignedGuests || []).forEach((gName, idx) => {
        if (gName && idx !== seatIndex) {
          currentTablePax += getGuestPaxCount(gName);
        }
      });

      // Enforce Max 10 pax per table limit based on total guest pax count
      if (currentTablePax + incomingPax > targetTable.capacity) {
        toast.error(`Table capacity exceeded! This entry has ${incomingPax} pax, but only ${targetTable.capacity - currentTablePax} seats remaining.`);
        return;
      }

      // Check if this guest has already been assigned beyond their total allowed count across all tables
      const currentAssignedTotalPax = getAssignedPaxForGuest(guestFullName, tableId, seatIndex);
      const guestObj = confirmedGuests.find(g => `${g.title || 'Mr'} ${g.firstName || ''} ${g.lastName || ''}`.trim() === guestFullName);
      const allowedTotalPax = guestObj ? ((Number(guestObj.adults) || 0) + (Number(guestObj.half) || 0) + (Number(guestObj.kids) || 0)) : 1;

      if (currentAssignedTotalPax + incomingPax > allowedTotalPax) {
        toast.error(`Cannot assign! This family entry only has a total of ${allowedTotalPax} pax allocated.`);
        return;
      }
    }

    const updated = tables.map(t => {
      if (t.id === tableId) {
        const assigned = [...(t.assignedGuests || [])];
        assigned[seatIndex] = guestFullName;
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

  // Calculate total capacity and total assigned pax across all tables
  const totalCapacity = tables.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const totalAssignedPax = tables.reduce((acc, t) => {
    const tablePax = (t.assignedGuests || []).reduce((sum, gName) => sum + (gName ? getGuestPaxCount(gName) : 0), 0);
    return acc + tablePax;
  }, 0);

  // Helper to group confirmed guests by category
  const getCategoriesGrouped = (sideList) => {
    const groups = {};
    sideList.forEach(g => {
      const cat = g.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(g);
    });
    return groups;
  };

  const brideCategories = getCategoriesGrouped(brideConfirmed);
  const groomCategories = getCategoriesGrouped(groomConfirmed);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col pb-24 max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Armchair size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">Seating Map</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Arrange confirmed family entries into tables (Max 10 pax per table)</p>
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
          <button onClick={handleAddTable} className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
            <Plus size={14}/> Add Table (10 Pax)
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {tables.length === 0 ? (
          <div className="lg:col-span-12 flex items-center justify-center bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-gray-400 font-medium shadow-sm">
             No tables added yet. Click "Add Table (10 Pax)" to begin.
          </div>
        ) : (
          <>
            {/* Left Sidebar Table List Column */}
            <div className="lg:col-span-4 space-y-4">
              {tables.map((table) => {
                const isExpanded = expandedTableId === table.id;
                const tableTotalPax = (table.assignedGuests || []).reduce((sum, gName) => sum + (gName ? getGuestPaxCount(gName) : 0), 0);
                const isEditing = editingTableId === table.id;

                return (
                  <div key={table.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                      {isEditing ? (
                        <div className="space-y-3 w-full pr-2">
                          <input 
                            type="text" 
                            value={editTableName} 
                            onChange={(e) => setEditTableName(e.target.value)}
                            className="border border-indigo-300 rounded-lg p-2 text-sm w-full font-bold bg-white outline-none"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEditTable(table.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold">Save</button>
                            <button onClick={() => setEditingTableId(null)} className="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-md text-xs bg-white">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => setExpandedTableId(isExpanded ? null : table.id)} className="flex-1 cursor-pointer min-w-0 pr-2">
                          <h4 className="font-bold text-sm text-gray-900 flex items-start gap-2 break-words leading-tight">
                            <Armchair size={16} className="text-indigo-600 shrink-0 mt-0.5"/> 
                            <span>{table.name}</span>
                          </h4>
                          <div className="mt-2">
                            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block whitespace-nowrap">
                              {tableTotalPax} / {table.capacity} pax
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        {!isEditing && (
                          <button onClick={() => handleStartEditTable(table)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Edit Table">
                            <Edit2 size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDeleteTable(table.id)} className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors" title="Delete Table">
                          <Trash2 size={16} />
                        </button>
                        <div onClick={() => setExpandedTableId(isExpanded ? null : table.id)} className="cursor-pointer p-1.5 text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 space-y-4 border-b border-gray-100 bg-gray-50/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700">Table Capacity (Max 10)</span>
                          <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                            <button onClick={() => handleUpdateCapacity(table.id, table.capacity - 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">-</button>
                            <span className="px-3 py-1.5 text-xs font-bold border-x border-gray-200">{table.capacity}</span>
                            <button onClick={() => handleUpdateCapacity(table.id, table.capacity + 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold">+</button>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
                            <span>Slot / Family Entries</span>
                          </div>
                          {Array.from({ length: Math.min(10, table.capacity) }).map((_, i) => {
                            const assignedEntry = table.assignedGuests?.[i] || '';

                            return (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 w-5 text-center shrink-0">{i + 1}</span>
                                <div className="w-full relative min-w-0">
                                  <select 
                                    value={assignedEntry}
                                    onChange={(e) => handleAssignGuest(table.id, i, e.target.value)}
                                    className="border border-gray-200 rounded-xl p-2.5 text-xs w-full outline-none focus:border-indigo-500 bg-white shadow-2xs font-medium text-gray-800"
                                  >
                                    <option value="">Select Family Entry</option>
                                    <optgroup label="Bride's Side (Confirmed)">
                                      {Object.entries(brideCategories).map(([cat, list]) => (
                                        <React.Fragment key={`b-cat-${cat}`}>
                                          <option disabled className="font-bold text-rose-700">--- {cat} ---</option>
                                          {list.map((g, gIdx) => {
                                            const fullName = `${g.title || 'Mr'} ${g.firstName || ''} ${g.lastName || ''}`.trim();
                                            const totalP = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
                                            return (
                                              <option key={`b-g-${gIdx}`} value={fullName}>
                                                {fullName} ({totalP} Pax)
                                              </option>
                                            );
                                          })}
                                        </React.Fragment>
                                      ))}
                                    </optgroup>
                                    <optgroup label="Groom's Side (Confirmed)">
                                      {Object.entries(groomCategories).map(([cat, list]) => (
                                        <React.Fragment key={`g-cat-${cat}`}>
                                          <option disabled className="font-bold text-blue-700">--- {cat} ---</option>
                                          {list.map((g, gIdx) => {
                                            const fullName = `${g.title || 'Mr'} ${g.firstName || ''} ${g.lastName || ''}`.trim();
                                            const totalP = (Number(g.adults) || 0) + (Number(g.half) || 0) + (Number(g.kids) || 0);
                                            return (
                                              <option key={`g-g-${gIdx}`} value={fullName}>
                                                {fullName} ({totalP} Pax)
                                              </option>
                                            );
                                          })}
                                        </React.Fragment>
                                      ))}
                                    </optgroup>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Right Side Visual Table Stack Display Canvas (Tables down in down) */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-5 md:p-6 flex flex-col shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} className="text-indigo-600 shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm">Seating Visualizer Tables ({tables.length})</h3>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 whitespace-nowrap">
                  {totalAssignedPax} / {totalCapacity} Total Pax Allocated
                </span>
              </div>

              {/* Stack Tables Vertically ("down in down") */}
              <div className="flex flex-col gap-6 max-h-[700px] overflow-y-auto pr-2">
                {tables.map(table => {
                  const assignedList = table.assignedGuests || [];
                  const tableTotalPax = assignedList.reduce((sum, gName) => sum + (gName ? getGuestPaxCount(gName) : 0), 0);

                  return (
                    <div key={table.id} className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100/80 rounded-2xl p-6 shadow-2xs w-full">
                      <div className="flex justify-between items-center gap-4 pb-4 border-b border-indigo-100/50 mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-base flex items-center gap-2">
                            <Armchair size={18} className="text-indigo-600 shrink-0" /> 
                            <span className="truncate">{table.name}</span>
                          </h4>
                          <p className="text-xs text-gray-500 font-medium mt-1">Capacity: {table.capacity} Pax Max</p>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full border shrink-0 whitespace-nowrap ${
                          tableTotalPax === table.capacity ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {tableTotalPax} / {table.capacity} Pax
                        </span>
                      </div>

                      {/* Family Entries Visual Badges Layout */}
                      <div className="space-y-3">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assigned Family Entries</p>
                        <div className="flex flex-col gap-3">
                          {assignedList.filter(Boolean).length === 0 ? (
                            <p className="text-sm text-gray-400 italic py-2">No family entries assigned yet.</p>
                          ) : (
                            assignedList.filter(Boolean).map((guestName, sIdx) => {
                              const pCount = getGuestPaxCount(guestName);
                              return (
                                <div key={sIdx} className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-black flex items-center justify-center shrink-0">
                                      {sIdx + 1}
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm break-words whitespace-normal leading-snug">
                                      {guestName}
                                    </span>
                                  </div>
                                  <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 shrink-0 whitespace-nowrap">
                                    {pCount} Pax
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};