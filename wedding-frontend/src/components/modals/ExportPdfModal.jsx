import React from 'react';
import { X, Download } from 'lucide-react';

export const ExportPdfModal = ({ isOpen, onClose, title = "Export Contacts to PDF" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-center">
          <p className="text-xs text-gray-500 font-medium">Preview of data that will be exported to PDF:</p>

          <div className="py-2">
            <p className="text-3xl font-extrabold text-blue-600">0</p>
            <p className="text-xs font-semibold text-gray-500 mt-1">Total Contacts</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 space-y-2 text-left">
            <p className="font-bold text-gray-700">Export will include:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-500">
              <li>Contact name, email, and phone</li>
              <li>Contact type and notes</li>
              <li>Wedding details summary</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-xl text-xs">
            <p className="font-bold text-gray-800">PDF Structure:</p>
            <p className="text-gray-500 mt-1">Summary page with wedding details and complete contacts list</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 border border-gray-300 bg-white rounded-lg text-xs font-bold text-gray-700">Cancel</button>
          <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};