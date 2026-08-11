import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewTab } from './pages/OverviewTab';
import { PlanningLayout } from './pages/planning/PlanningLayout';
import { NotesTab } from './pages/NotesTab';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { token } = useWedding();
  // Set default tab to overview so users land on the home dashboard after logging in
  const [activeTab, setActiveTab] = useState('overview'); 
  const [authView, setAuthView] = useState('login'); 

  if (!token) {
    return authView === 'login' 
      ? <Login onSwitch={() => setAuthView('register')} /> 
      : <Register onSwitch={() => setAuthView('login')} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto relative">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'planning' && <PlanningLayout />}
          {activeTab === 'notes' && <NotesTab />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <WeddingProvider>
      <AppContent />
    </WeddingProvider>
  );
}