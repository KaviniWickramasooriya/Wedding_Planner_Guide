import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Phone, Share2, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { ExportPdfModal } from '../components/modals/ExportPdfModal';
import toast from 'react-hot-toast';

export const ContactsTab = () => {
  const { data, updateData } = useWedding();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', type: '', notes: '' });

  const contacts = data?.contacts || [];
  const completedSections = data?.completedSections || {};
  const isCompleted = !!completedSections['contacts'];

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!newContact.name.trim()) {
      toast.error('Please enter a contact name.');
      return;
    }
    const updated = [...contacts, newContact];
    updateData({ contacts: updated }, true);
    setNewContact({ name: '', email: '', phone: '', type: '', notes: '' });
  };

  const handleUpdateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    updateData({ contacts: updated });
  };

  const handleDeleteContact = (index) => {
    const updated = contacts.filter((_, i) => i !== index);
    updateData({ contacts: updated }, true);
  };

  const toggleCompleted = () => {
    const newCompleted = { ...completedSections, contacts: !isCompleted };
    updateData({ completedSections: newCompleted }, true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-950 tracking-tight">Contacts</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Important contacts for your special day</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
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
          <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-50 text-gray-700 shadow-sm">
            <Share2 size={14}/> Share
          </button>
          <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-50 text-gray-700 shadow-sm">
            <Download size={14}/> Export
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium min-w-[850px]">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Type</th>
                <th className="p-4">Notes</th>
                <th className="p-4 w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Create Row */}
              <tr className="bg-gray-50/40">
                <td className="p-4 text-center text-gray-300">
                  <Trash2 size={16} className="opacity-20 cursor-not-allowed mx-auto"/>
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newContact.name} 
                    onChange={e => setNewContact({...newContact, name: e.target.value})} 
                    placeholder="Enter name" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="email" 
                    value={newContact.email} 
                    onChange={e => setNewContact({...newContact, email: e.target.value})} 
                    placeholder="email@example.com" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newContact.phone} 
                    onChange={e => setNewContact({...newContact, phone: e.target.value})} 
                    placeholder="+94771234567" 
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs font-mono" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newContact.type} 
                    onChange={e => setNewContact({...newContact, type: e.target.value})} 
                    placeholder="Friend, Vendor, etc." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3">
                  <input 
                    type="text" 
                    value={newContact.notes} 
                    onChange={e => setNewContact({...newContact, notes: e.target.value})} 
                    placeholder="Additional notes..." 
                    className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                  />
                </td>
                <td className="p-3 text-center">
                  <button 
                    onClick={handleCreateContact}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-full"
                  >
                    Create
                  </button>
                </td>
              </tr>

              {/* Existing Contacts List */}
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center text-gray-400 font-medium">
                    No contacts added yet. Use the form above to create your first contact.
                  </td>
                </tr>
              ) : (
                contacts.map((contact, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDeleteContact(idx)} 
                        className="text-gray-300 hover:text-rose-600 transition-colors p-1"
                        title="Remove Contact"
                      >
                        <Trash2 size={16} className="mx-auto"/>
                      </button>
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={contact.name || ''} 
                        onChange={e => handleUpdateContact(idx, 'name', e.target.value)} 
                        placeholder="Enter name" 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="email" 
                        value={contact.email || ''} 
                        onChange={e => handleUpdateContact(idx, 'email', e.target.value)} 
                        placeholder="email@example.com" 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={contact.phone || ''} 
                        onChange={e => handleUpdateContact(idx, 'phone', e.target.value)} 
                        placeholder="+94771234567" 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs font-mono" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={contact.type || ''} 
                        onChange={e => handleUpdateContact(idx, 'type', e.target.value)} 
                        placeholder="Friend, Vendor, etc." 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="text" 
                        value={contact.notes || ''} 
                        onChange={e => handleUpdateContact(idx, 'notes', e.target.value)} 
                        placeholder="Additional notes..." 
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-medium shadow-2xs" 
                      />
                    </td>
                    <td className="p-4 text-center text-xs text-gray-400">Saved</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          <span className="text-xs text-gray-500 font-semibold">Total Contacts: {contacts.length}</span>
        </div>
      </div>

      <ExportPdfModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};