import React, { useState, useRef } from 'react';
import { 
  CalendarCheck, 
  Copy, 
  Check, 
  AlertTriangle, 
  Quote, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THIRTY_DAY_GUIDE_DATA } from '../data/thirtyDayGuideData';

export const ThirtyDayGuideView: React.FC = () => {
  const { activeCandidate, toggleDayCompletion, updateDayNotes, stats } = useApp();
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [activeDayView, setActiveDayView] = useState<number | null>(null);

  const dayCardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleCopyQuestion = (day: number, question: string) => {
    navigator.clipboard.writeText(question);
    setCopiedDay(day);
    setTimeout(() => {
      setCopiedDay(null);
    }, 2000);
  };

  const scrollToDay = (day: number) => {
    setActiveDayView(day);
    const targetElement = dayCardRefs.current[day];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Find next incomplete day
  const nextIncompleteDay = THIRTY_DAY_GUIDE_DATA.find(
    d => !activeCandidate.dayProgress[d.day]?.completed
  )?.day;

  const filteredDays = THIRTY_DAY_GUIDE_DATA.filter(d => {
    if (selectedPhase === 'all') return true;
    return d.phaseId === selectedPhase;
  });

  const completionPercentage = Math.round((stats.completedDaysCount / 30) * 100);

  return (
    <div className="space-y-4">
      {/* 1. Kad Kemajuan (Progress Header) */}
      <div className="bg-gradient-to-br from-rose-900 to-rose-950 text-white p-4.5 rounded-2xl shadow-md shadow-rose-950/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-800/80 border border-rose-700/50 text-[11px] font-semibold text-rose-200">
            <Sparkles className="w-3 h-3 text-rose-300" />
            <span>Panduan Lengkap 30 Hari</span>
          </div>
          <span className="text-xs font-bold text-rose-200">
            {stats.completedDaysCount} / 30 Hari ({completionPercentage}%)
          </span>
        </div>

        <h2 className="text-lg font-bold mt-2">Perjalanan Mengenal Calon</h2>
        <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">
          30 langkah tersusun tanpa jalan pintas demi kepastian masa depan.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-rose-950/70 h-2.5 rounded-full mt-3 overflow-hidden border border-rose-800">
          <div
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Quick action: Mark Next Day Completed */}
        {nextIncompleteDay && (
          <div className="mt-3.5 pt-3 border-t border-rose-800/60 flex items-center justify-between">
            <span className="text-xs text-rose-200">
              Langkah seterusnya: <strong>Hari {nextIncompleteDay}</strong>
            </span>
            <button
              onClick={() => scrollToDay(nextIncompleteDay)}
              className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Pergi ke Hari {nextIncompleteDay}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Matriks Grid 30 Hari (Peta H1 hingga H30) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-rose-700" />
            Matriks Peta 30 Hari (Tekan Untuk Lompat)
          </h3>
          <span className="text-[11px] text-slate-500">
            {stats.completedDaysCount} Selesai
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
          {THIRTY_DAY_GUIDE_DATA.map(d => {
            const isCompleted = activeCandidate.dayProgress[d.day]?.completed;
            const isSelected = activeDayView === d.day;
            return (
              <button
                key={d.day}
                onClick={() => scrollToDay(d.day)}
                className={`h-9 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isSelected
                    ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60'
                }`}
                title={`Hari ${d.day}: ${d.title}`}
              >
                <span>H{d.day}</span>
                {isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            <span>Selesai</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-700 inline-block" />
            <span>Sedang Dilihat</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" />
            <span>Belum Selesai</span>
          </div>
        </div>
      </div>

      {/* Phase Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedPhase('all')}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
            selectedPhase === 'all'
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3 h-3" />
          Semua (30 Hari)
        </button>
        <button
          onClick={() => setSelectedPhase(1)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedPhase === 1
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          M1: Niat & Sempadan (H1-7)
        </button>
        <button
          onClick={() => setSelectedPhase(2)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedPhase === 2
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          M2: Emosi & Konflik (H8-14)
        </button>
        <button
          onClick={() => setSelectedPhase(3)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedPhase === 3
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          M3: Kewangan (H15-21)
        </button>
        <button
          onClick={() => setSelectedPhase(4)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedPhase === 4
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          M4: Keluarga & Wali (H22-28)
        </button>
        <button
          onClick={() => setSelectedPhase(5)}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedPhase === 5
              ? 'bg-rose-850 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Fasa Keputusan (H29-30)
        </button>
      </div>

      {/* 3. Kandungan Kad Setiap Hari */}
      <div className="space-y-4">
        {filteredDays.map(guide => {
          const userRec = activeCandidate.dayProgress[guide.day] || { completed: false, notes: '' };
          const isDone = userRec.completed;

          return (
            <div
              key={guide.day}
              ref={el => {
                dayCardRefs.current[guide.day] = el;
              }}
              className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                isDone
                  ? 'border-emerald-300 ring-1 ring-emerald-200/50'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-850 text-white'
                    }`}
                  >
                    H{guide.day}
                  </span>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-850 block">
                      {guide.phaseName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {guide.title}
                    </h3>
                  </div>
                </div>

                {/* Completed Toggle Button */}
                <button
                  onClick={() => toggleDayCompletion(guide.day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{isDone ? 'Selesai' : 'Tanda Selesai'}</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3.5 text-xs">
                {/* 📌 Tindakan (Action Item) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                    <span>📌 Tindakan Nyata Diperhatikan</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {guide.actionItem}
                  </p>
                </div>

                {/* 📋 Soalan Ta'aruf & Copy Button */}
                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-rose-950 flex items-center gap-1">
                      📋 Soalan Ta'aruf Disyorkan
                    </span>
                    <button
                      onClick={() => handleCopyQuestion(guide.day, guide.taarufQuestion)}
                      className="px-2.5 py-1 bg-white border border-rose-300 text-rose-850 hover:bg-rose-100/60 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-2xs"
                    >
                      {copiedDay === guide.day ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Soalan</span>
                        </>
                      )}
                    </button>
                  </div>
                  <blockquote className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-rose-150 leading-relaxed font-serif text-[12px]">
                    "{guide.taarufQuestion}"
                  </blockquote>
                </div>

                {/* ⚠️ Amaran Red Flag */}
                <div className="p-3 rounded-xl bg-red-50/80 border border-red-200 text-red-950">
                  <div className="flex items-center gap-1.5 font-bold text-red-800 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Amaran Red Flag (Tanda Bahaya)</span>
                  </div>
                  <p className="text-red-900 leading-relaxed">
                    {guide.redFlagWarning}
                  </p>
                </div>

                {/* 💬 Kata Hikmah */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Quote className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Kata Hikmah & Pesanan</span>
                  </div>
                  <p className="italic font-serif text-[12px] text-amber-900 leading-relaxed">
                    "{guide.wiseQuote}"
                  </p>
                </div>

                {/* Personal Notes / Checkbox for Day */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catatan Refleksi & Bukti Respon Calon:
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`Tulis jawapan calon, responnya atau perbualan untuk Hari ${guide.day}...`}
                    value={userRec.notes || ''}
                    onChange={e => updateDayNotes(guide.day, e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-700 resize-none"
                  />
                  {userRec.completedAt && (
                    <div className="text-[10px] text-emerald-700 font-medium mt-1">
                      Diselesaikan pada: {userRec.completedAt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
