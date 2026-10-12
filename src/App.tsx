/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ChecklistView } from './components/ChecklistView';
import { ThirtyDayGuideView } from './components/ThirtyDayGuideView';
import { AnalysisView } from './components/AnalysisView';
import { JournalView } from './components/JournalView';
import { TaarufQuestionsView } from './components/TaarufQuestionsView';
import { CandidateModal } from './components/CandidateModal';
import { GuideModal } from './components/GuideModal';
import { OfflineIndicator } from './components/OfflineIndicator';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    activeCandidate, 
    updateCandidateInfo,
    addCandidate,
    deleteCandidate 
  } = useApp();

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  return (
    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-white min-h-screen shadow-xl shadow-[#d70f64]/15 border-x border-[#fcc2d7] flex flex-col relative">
      {/* Header bar displayed on inner tool tabs */}
      {activeTab !== 'home' && <Header />}

      <div className="flex-1">
        <main className={activeTab === 'home' ? 'p-0 pb-28' : 'px-4 py-3 pb-28'}>
          {activeTab === 'home' && (
            <HomeView 
              onOpenCandidateModal={() => setIsCandidateModalOpen(true)}
              onOpenGuideModal={() => setIsGuideModalOpen(true)}
            />
          )}
          {activeTab === 'checklist' && <ChecklistView />}
          {activeTab === 'guide30' && <ThirtyDayGuideView />}
          {activeTab === 'analysis' && <AnalysisView />}
          {activeTab === 'journal' && <JournalView />}
          {activeTab === 'questions' && <TaarufQuestionsView />}
        </main>
      </div>

      {/* Fixed Bottom Navigation (with 3D button styling) */}
      <BottomNav />

      {/* Candidate Modal Accessible from Home */}
      {isCandidateModalOpen && (
        <CandidateModal
          isOpen={isCandidateModalOpen}
          onClose={() => setIsCandidateModalOpen(false)}
          candidateToEdit={activeCandidate}
          onSave={(data) => {
            updateCandidateInfo(activeCandidate.id, data);
            setIsCandidateModalOpen(false);
          }}
          onDelete={(id) => {
            deleteCandidate(id);
            setIsCandidateModalOpen(false);
          }}
        />
      )}

      {/* Guide Modal Accessible from Home */}
      {isGuideModalOpen && (
        <GuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <OfflineIndicator />
      <div className="min-h-screen bg-[#fff0f5] flex justify-center selection:bg-[#ffbcd4] selection:text-[#d70f64]">
        <MainLayout />
      </div>
    </AppProvider>
  );
}
