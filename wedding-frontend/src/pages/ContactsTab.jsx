import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { Phone, Share2, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { ExportPdfModal } from '../components/modals/ExportPdfModal';
import toast from 'react-hot-toast';

export const ContactsTab = () => {
  const { data, updateData } = useWedding();
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Local state for the new contact form row
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
    // Reset form
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <Phone size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Contacts</h2>
            <p className="text-sm text-gray-500 font-medium">Important contacts for your special day</p>
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700"><Share2 size={14}/> Share</button>
          <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-medium">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
            <tr>
              <th className="p-4 w-12 text-center"></th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Type</th>
              <th className="p-4">Notes</th>
              <th className="p-4 w-32 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Create Row with Trash / Remove Icon placeholder/disabled to maintain alignment */}
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
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="email" 
                  value={newContact.email} 
                  onChange={e => setNewContact({...newContact, email: e.target.value})} 
                  placeholder="email@example.com" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newContact.phone} 
                  onChange={e => setNewContact({...newContact, phone: e.target.value})} 
                  placeholder="+94771234567" 
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newContact.type} 
                  onChange={e => setNewContact({...newContact, type: e.target.value})} 
                  placeholder="Friend, Vendor, etc." 
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                />
              </td>
              <td className="p-3">
                <input 
                  type="text" 
                  value={newContact.notes} 
                  onChange={e => setNewContact({...newContact, notes: e.target.value})} 
                  placeholder="Additional notes..." 
                  className="w-full bg-white border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                />
              </td>
              <td className="p-3 text-right">
                <button 
                  onClick={handleCreateContact}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  Create
                </button>
              </td>
            </tr>

            {/* Existing Contacts List with functional Trash / Remove Icon */}
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-16 text-center text-gray-400 font-medium">
                  No contacts added yet. Use the form above to create your first contact.
                </td>
              </tr>
            ) : (
              contacts.map((contact, idx) => (
                <tr key={idx} className="bg-white hover:bg-gray-50/50">
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDeleteContact(idx)} 
                      className="text-gray-300 hover:text-rose-500 transition-colors p-1"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="email" 
                      value={contact.email || ''} 
                      onChange={e => handleUpdateContact(idx, 'email', e.target.value)} 
                      placeholder="email@example.com" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={contact.phone || ''} 
                      onChange={e => handleUpdateContact(idx, 'phone', e.target.value)} 
                      placeholder="+94771234567" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={contact.type || ''} 
                      onChange={e => handleUpdateContact(idx, 'type', e.target.value)} 
                      placeholder="Friend, Vendor, etc." 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={contact.notes || ''} 
                      onChange={e => handleUpdateContact(idx, 'notes', e.target.value)} 
                      placeholder="Additional notes..." 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400" 
                    />
                  </td>
                  <td className="p-4"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          <span className="text-xs text-gray-400 font-medium">Total Contacts: {contacts.length}</span>
        </div>
      </div>

      <ExportPdfModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};