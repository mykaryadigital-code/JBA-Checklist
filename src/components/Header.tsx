import React, { useState } from 'react';
import { 
  Heart, 
  ChevronDown, 
  UserPlus, 
  Edit3, 
  Download, 
  HelpCircle, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CandidateModal } from './CandidateModal';
import { ExportImportModal } from './ExportImportModal';
import { GuideModal } from './GuideModal';

export const Header: React.FC = () => {
  const { 
    candidates, 
    activeCandidate, 
    activeCandidateId, 
    setActiveCandidateId,
    addCandidate,
    updateCandidateInfo,
    deleteCandidate,
    stats,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<typeof activeCandidate | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'bujang':
        return 'Bujang';
      case 'duda_beranak':
        return 'Duda Beranak';
      case 'duda_tanpa_anak':
        return 'Duda';
      default:
        return 'Calon';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-2.5">
          {/* Top Row: App Title & Action Icons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-300/30">
                <Heart className="w-5 h-5 fill-white/80 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-pink-950 leading-tight tracking-tight flex items-center gap-1.5">
                  Checklist Bakal Suami
                </h1>
                <p className="text-[11px] text-pink-700/80 font-medium leading-none">
                  Kenali Tindakan, Bukan Kata-Kata
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsGuideModalOpen(true)}
                title="Panduan Aplikasi"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-pink-700 hover:bg-pink-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExportModalOpen(true)}
                title="Eksport & Import Data"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-pink-700 hover:bg-pink-50 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Candidate Switcher Bar */}
          <div className="mt-2 pt-2 border-t border-pink-50 flex items-center justify-between relative">
            {/* Candidate Selector Dropdown Trigger */}
            <div className="relative flex-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-pink-50/70 hover:bg-pink-100/70 border border-pink-200/60 text-left transition-all w-full max-w-[280px]"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                  {activeCandidate.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-xs text-pink-950 truncate">
                      {activeCandidate.name}
                    </span>
                    <span className="text-[10px] text-pink-700 font-medium shrink-0">
                      ({activeCandidate.age} thn)
                    </span>
                  </div>
                  <span className="inline-block text-[10px] font-medium text-slate-500 leading-none truncate">
                    {getStatusBadge(activeCandidate.status)} • {activeCandidate.occupation || 'Calon'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-pink-600 shrink-0 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-pink-100 p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Senarai Calon ({candidates.length})
                    </div>
                    <div className="space-y-1 max-h-56 overflow-y-auto">
                      {candidates.map(c => {
                        const isSelected = c.id === activeCandidateId;
                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              setActiveCandidateId(c.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-pink-100/70 text-pink-950 font-medium'
                                : 'hover:bg-pink-50/50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <p className="text-xs truncate font-semibold">
                                  {c.name} ({c.age})
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {getStatusBadge(c.status)}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-pink-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-1 border-t border-pink-50 flex items-center justify-between gap-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setCandidateToEdit(null);
                          setIsCandidateModalOpen(true);
                        }}
                        className="flex-1 py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Tambah Calon
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setCandidateToEdit(activeCandidate);
                          setIsCandidateModalOpen(true);
                        }}
                        className="py-1.5 px-2.5 text-slate-600 hover:bg-slate-100 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Ubah
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-2 pl-2">
              <div 
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  stats.scorePercentage >= 75
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : stats.scorePercentage >= 50
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
                title="Skor Kelayakan Semasa"
              >
                <span>{stats.scorePercentage}%</span>
                {stats.criticalRedFlags > 0 && (
                  <span className="flex items-center text-[10px] text-rose-700 ml-0.5" title="Ada Red Flag Pada Asas Wajib">
                    <AlertCircle className="w-3 h-3 fill-rose-600 text-white" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Candidate Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidateToEdit={candidateToEdit}
        onSave={data => {
          if (candidateToEdit) {
            updateCandidateInfo(candidateToEdit.id, data);
          } else {
            addCandidate(data);
          }
        }}
        onDelete={id => deleteCandidate(id)}
      />

      {/* Export / Import Modal */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Guide Info Modal */}
      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </>
  );
};
