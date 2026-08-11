import React, { useState } from 'react';
import { Phone, Share2, Download, Plus } from 'lucide-react';
import { ExportPdfModal } from '../components/modals/ExportPdfModal';

export const ContactsTab = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50"><Share2 size={14}/> Share</button>
          <button onClick={() => setIsExportOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50"><Download size={14}/> Export</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-medium">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Type</th>
              <th className="p-4">Notes</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="bg-white">
              <td className="p-4"></td>
              <td className="p-3"><input type="text" placeholder="Enter name" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none" /></td>
              <td className="p-3"><input type="email" placeholder="email@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none" /></td>
              <td className="p-3"><input type="text" placeholder="+94771234567" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none" /></td>
              <td className="p-3"><input type="text" placeholder="Friend, Vendor, etc." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none" /></td>
              <td className="p-3"><input type="text" placeholder="Additional notes..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none" /></td>
              <td className="p-3"><button className="bg-emerald-400 text-white px-4 py-2 rounded-lg text-xs font-bold w-full">Create</button></td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
          <button className="flex items-center gap-1.5 text-xs font-bold text-gray-600"><Plus size={16}/> Add item</button>
        </div>
      </div>

      <ExportPdfModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};