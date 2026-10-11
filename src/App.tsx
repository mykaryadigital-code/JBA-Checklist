/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ChecklistView } from './components/ChecklistView';
import { ThirtyDayGuideView } from './components/ThirtyDayGuideView';
import { AnalysisView } from './components/AnalysisView';
import { JournalView } from './components/JournalView';
import { TaarufQuestionsView } from './components/TaarufQuestionsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="px-4 py-3 pb-28">
      {activeTab === 'checklist' && <ChecklistView />}
      {activeTab === 'guide30' && <ThirtyDayGuideView />}
      {activeTab === 'analysis' && <AnalysisView />}
      {activeTab === 'journal' && <JournalView />}
      {activeTab === 'questions' && <TaarufQuestionsView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-rose-200 selection:text-rose-900">
        {/* Mobile Viewport Container (Centered max-w-lg on desktop, full width on mobile) */}
        <div className="w-full max-w-md md:max-w-lg bg-slate-50 min-h-screen shadow-xl border-x border-slate-200/80 flex flex-col relative">
          <Header />
          <div className="flex-1">
            <MainContent />
          </div>
          <BottomNav />
        </div>
      </div>
    </AppProvider>
  );
}
