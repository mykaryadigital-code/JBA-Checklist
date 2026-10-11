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
import { OfflineIndicator } from './components/OfflineIndicator';

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
      <OfflineIndicator />
      <div className="min-h-screen bg-[#fff0f5] flex justify-center selection:bg-[#ffbcd4] selection:text-[#d70f64]">
        {/* Viewport Container (Generous, responsive width on tablet & desktop) */}
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white min-h-screen shadow-xl shadow-[#d70f64]/15 border-x border-[#fcc2d7] flex flex-col relative">
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
