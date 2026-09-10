import React from 'react';
import { LayoutDashboard, Calendar, Mail, FileText, Contact, LogOut, X } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, data, logout, analytics } = useWedding();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const initials = getInitials(user?.name);
  const eventDate = data?.eventInfo?.date;
  const completedCount = analytics?.completedCountVal || 0;
  const progressPercentage = analytics?.progressPercentage || 0;

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-2xs transition-opacity"
        ></div>
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full shrink-0
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* User Account Info & Mobile Close */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-sm text-gray-800 truncate" title={user?.name || 'Guest User'}>
                  {user?.name || 'Guest User'}
                </h4>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase">Free</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            <NavItem id="overview" label="Overview" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={handleNavClick} />
            <NavItem id="planning" label="Planning" icon={Calendar} activeTab={activeTab} setActiveTab={handleNavClick} />
            <NavItem id="invite" label="Invite" icon={Mail} activeTab={activeTab} setActiveTab={handleNavClick} />

            <div className="pt-4 pb-2 px-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Access</span>
            </div>

            <NavItem id="notes" label="Notes" icon={FileText} activeTab={activeTab} setActiveTab={handleNavClick} />
            <NavItem id="contacts" label="Contacts" icon={Contact} activeTab={activeTab} setActiveTab={handleNavClick} />
          </nav>
        </div>

        {/* Progress Card & Actions */}
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-sm font-medium mb-1">
              <span className="flex items-center gap-1.5 text-gray-700"><Calendar size={14}/> Planning Progress</span>
              <span className="text-slate-900 font-bold">{progressPercentage}%</span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium mb-2">{completedCount} of 6 tasks completed</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-900 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            {eventDate && <p className="text-xs text-gray-400 mt-3 font-medium">Event Date: {eventDate}</p>}
          </div>

          <div className="space-y-2">
            <button 
              onClick={logout} 
              className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 transition-colors text-rose-600 font-bold text-xs py-2.5 rounded-xl shadow-sm"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
      {label}
    </button>
  );
};