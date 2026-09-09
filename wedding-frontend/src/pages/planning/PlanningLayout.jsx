import React, { useState } from 'react';
import { CoupleDetails } from './CoupleDetails';
import { EventInformation } from './EventInformation';
import { GuestMap } from './GuestMap';
import { BudgetMap } from './BudgetMap';
import { TimelineTab } from './TimelineTab';
import { SeatingMap } from './SeatingMap';
import { Menu, X } from 'lucide-react';

export const PlanningLayout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    { id: 1, title: 'Couple Details', desc: 'Basic information about the bride and groom' },
    { id: 2, title: 'Event Information', desc: 'Wedding date, venue, and ceremony details' },
    { id: 3, title: 'Guest Map', desc: 'Guest lists, categories, and RSVP tracking' },
    { id: 4, title: 'Budget Map', desc: 'Detailed budget breakdown and tracking' },
    { id: 5, title: 'Event Map', desc: 'Schedule of events and coordination' },
    { id: 6, title: 'Seating Map', desc: 'Seating Arrangement' },
  ];

  const currentStepObj = steps.find(s => s.id === activeStep);

  return (
    <div className="flex flex-col md:flex-row h-full bg-white relative z-0">
      {/* Mobile Step Selector Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
            {activeStep}
          </span>
          <span className="font-bold text-sm text-gray-900">{currentStepObj?.title}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={16}/> : <Menu size={16}/>} Steps
        </button>
      </div>

      {/* Mobile Dropdown Steps Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 inset-x-0 bg-white border-b border-gray-200 shadow-xl z-30 p-3 space-y-1">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left p-3 rounded-lg text-xs font-bold flex items-center gap-3 ${activeStep === step.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
            >
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">{step.id}</span>
              {step.title}
            </button>
          ))}
        </div>
      )}

      {/* Desktop Sidebar Steps */}
      <div className="w-72 border-r border-gray-200 p-4 space-y-2 overflow-y-auto hidden md:block shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-0 bg-white">
        {steps.map(step => {
          const isActive = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex gap-3.5 ${
                isActive ? 'border-blue-400 bg-blue-50/50 shadow-sm' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {step.id}
              </div>
              <div>
                <h5 className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{step.title}</h5>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto h-full">
          {activeStep === 1 && <CoupleDetails />}
          {activeStep === 2 && <EventInformation />}
          {activeStep === 3 && <GuestMap />}
          {activeStep === 4 && <BudgetMap />}
          {activeStep === 5 && <TimelineTab />}
          {activeStep === 6 && <SeatingMap />}
        </div>
      </div>
    </div>
  );
};