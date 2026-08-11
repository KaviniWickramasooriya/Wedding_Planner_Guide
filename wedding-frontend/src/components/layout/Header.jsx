import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

export const Header = ({ onProfileClick }) => (
  <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-10">
    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
      <span>My Project</span>
      <ChevronRight size={14} className="text-gray-400"/>
      <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Wedding
      </span>
      <button className="text-xs text-blue-600 hover:underline ml-1">Change</button>
    </div>

    <div className="flex items-center gap-4">
      <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm font-medium">
        <Sparkles size={14} />
        <span>Early Bird Offer — Get 25% off all WeddingMap packages. Pay once, plan forever.</span>
        <button className="bg-white text-amber-600 px-2 py-0.5 rounded font-bold ml-2 hover:bg-gray-50">
          Claim 25% Off
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
        <span>3% used</span>
        <span className="text-gray-400">(5/193)</span>
      </div>

      <button onClick={onProfileClick} className="border border-gray-300 text-gray-700 text-xs px-4 py-1.5 rounded-lg font-semibold hover:bg-gray-50">
        Profile
      </button>
    </div>
  </header>
);