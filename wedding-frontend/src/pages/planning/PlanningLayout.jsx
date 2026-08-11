import React, { useState } from 'react';
import { CoupleDetails } from './CoupleDetails';
import { EventInformation } from './EventInformation';
import { GuestMap } from './GuestMap';
import { BudgetMap } from './BudgetMap';
import { TimelineTab } from './TimelineTab';
import { SeatingMap } from './SeatingMap';

export const PlanningLayout = () => {
  const [activeStep, setActiveStep] = useState(4); // Default to Budget Map based on your screenshots

  const steps = [
    { id: 1, title: 'Couple Details', desc: 'Basic information about the bride and groom' },
    { id: 2, title: 'Event Information', desc: 'Wedding date, venue, and ceremony details' },
    { id: 3, title: 'Guest Map', desc: 'Guest lists, categories, and RSVP tracking' },
    { id: 4, title: 'Budget Map', desc: 'Detailed budget breakdown and tracking' },
    { id: 5, title: 'Event Map', desc: 'Schedule of events and coordination' },
    { id: 6, title: 'Seating Map', desc: 'Seating Arrangement' },
  ];

  return (
    <div className="flex h-full bg-white relative">
      <div className="w-72 border-r border-gray-200 p-4 space-y-2 overflow-y-auto hidden md:block shrink-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10 bg-white">
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

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
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