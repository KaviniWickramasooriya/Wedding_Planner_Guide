import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const ProfileTab = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-cover bg-center overflow-hidden">
          <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xl font-bold">KW</div>
        </div>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Kavini Wickramasooriya
            <span className="text-xs bg-slate-800 text-gray-300 border border-white/10 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck size={14} className="text-blue-400"/> Verified
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">kaviniwickramasooriya@gmail.com</p>
          <p className="text-xs text-gray-400 mt-1">Member since Aug 7, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Current plan</p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-1">Free</h3>
            <div className="flex gap-2 mt-3">
              <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Up to 50 guests</span>
              <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Guest list only</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Plan Features</p>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-gray-700">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Wedding Planning Portal <span className="text-gray-400 font-normal">1</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Guest Map <CheckCircle2 size={16} className="text-emerald-500"/></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Budget Map <span className="text-gray-400 font-normal">40</span></div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">Event Map <span className="text-gray-400 font-normal">20</span></div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h4 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Payment</h4>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Amount Paid</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">—</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Paid On</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">Not paid yet</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Payment Status</p>
            <p className="text-sm font-bold text-amber-600 mt-1">Payment pending</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Plan Code</p>
            <p className="text-xs font-mono text-gray-500 mt-1">plan-1-free</p>
          </div>
        </div>
      </div>
    </div>
  );
};