import React, { useState, useRef } from 'react';
import { 
  CalendarCheck, 
  Copy, 
  Check, 
  AlertTriangle, 
  Quote, 
  Sparkles,
  ChevronRight,
  Filter,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THIRTY_DAY_GUIDE_DATA } from '../data/thirtyDayGuideData';
import { CriterionRating } from '../types';

export const ThirtyDayGuideView: React.FC = () => {
  const { activeCandidate, rateDay, updateDayNotes, stats } = useApp();
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'green' | 'red' | 'unrated'>('all');
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

  // Find next incomplete or unrated day
  const nextIncompleteDay = THIRTY_DAY_GUIDE_DATA.find(d => {
    const rec = activeCandidate.dayProgress[d.day];
    const r = rec?.rating || (rec?.completed ? 'green' : 'unrated');
    return r === 'unrated';
  })?.day;

  const filteredDays = THIRTY_DAY_GUIDE_DATA.filter(d => {
    if (selectedPhase !== 'all' && d.phaseId !== selectedPhase) return false;
    if (ratingFilter !== 'all') {
      const rec = activeCandidate.dayProgress[d.day];
      const r = rec?.rating || (rec?.completed ? 'green' : 'unrated');
      if (r !== ratingFilter) return false;
    }
    return true;
  });

  const completionPercentage = Math.round((stats.completedDaysCount / 30) * 100);

  return (
    <div className="space-y-4">
      {/* 1. Kad Kemajuan (Progress Header) */}
      <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white p-4.5 rounded-2xl shadow-lg shadow-[#d70f64]/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-semibold text-white">
            <Sparkles className="w-3 h-3 text-pink-100" />
            <span>Panduan Lengkap 30 Hari</span>
          </div>
          <span className="text-xs font-bold text-pink-100">
            {stats.completedDaysCount} / 30 Hari ({completionPercentage}%)
          </span>
        </div>

        <h2 className="text-lg font-bold mt-2">Perjalanan Mengenal Calon</h2>
        <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
          30 langkah tersusun tanpa jalan pintas demi kepastian masa depan.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-black/15 h-2.5 rounded-full mt-3 overflow-hidden border border-white/20">
          <div
            className="bg-gradient-to-r from-emerald-300 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Rating Breakdown Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/20 text-center">
          <button
            onClick={() => setRatingFilter(ratingFilter === 'green' ? 'all' : 'green')}
            className={`bg-white/15 hover:bg-white/25 backdrop-blur-xs rounded-xl py-1.5 px-2 transition-all cursor-pointer text-left sm:text-center ${
              ratingFilter === 'green' ? 'ring-2 ring-white bg-white/30' : ''
            }`}
          >
            <div className="text-[10px] text-pink-100 font-medium">Green Flag</div>
            <div className="text-sm font-black text-emerald-200">🟢 {stats.dayGreenCount}</div>
          </button>
          <button
            onClick={() => setRatingFilter(ratingFilter === 'red' ? 'all' : 'red')}
            className={`bg-white/15 hover:bg-white/25 backdrop-blur-xs rounded-xl py-1.5 px-2 transition-all cursor-pointer text-left sm:text-center ${
              ratingFilter === 'red' ? 'ring-2 ring-white bg-white/30' : ''
            }`}
          >
            <div className="text-[10px] text-pink-100 font-medium">Red Flag</div>
            <div className="text-sm font-black text-rose-200">🔴 {stats.dayRedCount}</div>
          </button>
          <button
            onClick={() => setRatingFilter(ratingFilter === 'unrated' ? 'all' : 'unrated')}
            className={`bg-white/15 hover:bg-white/25 backdrop-blur-xs rounded-xl py-1.5 px-2 transition-all cursor-pointer text-left sm:text-center ${
              ratingFilter === 'unrated' ? 'ring-2 ring-white bg-white/30' : ''
            }`}
          >
            <div className="text-[10px] text-pink-100 font-medium">Belum Dinilai</div>
            <div className="text-sm font-black text-white">⚪ {stats.dayUnratedCount}</div>
          </button>
        </div>

        {/* Quick action: Mark Next Day Completed */}
        {nextIncompleteDay && (
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs text-pink-100">
              Langkah seterusnya: <strong className="text-white">Hari {nextIncompleteDay}</strong>
            </span>
            <button
              onClick={() => scrollToDay(nextIncompleteDay)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Pergi ke Hari {nextIncompleteDay}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Matriks Grid 30 Hari (Peta H1 hingga H30) */}
      <div className="bg-white rounded-2xl p-4 border border-[#fcc2d7] shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#d70f64]" />
            Matriks Peta 30 Hari (Tekan Untuk Lompat)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            {stats.completedDaysCount}/30 Selesai
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
          {THIRTY_DAY_GUIDE_DATA.map(d => {
            const rec = activeCandidate.dayProgress[d.day];
            const rating = rec?.rating || (rec?.completed ? 'green' : 'unrated');
            const isSelected = activeDayView === d.day;
            return (
              <button
                key={d.day}
                onClick={() => scrollToDay(d.day)}
                className={`h-9 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  rating === 'green'
                    ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                    : rating === 'red'
                    ? 'bg-rose-600 text-white shadow-xs hover:bg-rose-700'
                    : isSelected
                    ? 'bg-[#d70f64] text-white ring-2 ring-[#ff2b85]'
                    : 'bg-slate-100 hover:bg-[#fff0f5] text-slate-700 border border-slate-200/60'
                } ${isSelected ? 'ring-2 ring-[#d70f64] ring-offset-1 scale-105 z-10' : ''}`}
                title={`Hari ${d.day}: ${d.title} (${
                  rating === 'green' ? 'Green Flag' : rating === 'red' ? 'Red Flag' : 'Belum Dinilai'
                })`}
              >
                <span>H{d.day}</span>
                {rating === 'green' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 -mt-0.5" />
                )}
                {rating === 'red' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-200 -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            <span className="font-medium text-slate-700">Green Flag ({stats.dayGreenCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block" />
            <span className="font-medium text-slate-700">Red Flag ({stats.dayRedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-300 inline-block" />
            <span className="font-medium text-slate-700">Belum Dinilai ({stats.dayUnratedCount})</span>
          </div>
        </div>
      </div>

      {/* 3. Filters: Fasa & Status Penilaian */}
      <div className="space-y-2">
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
              selectedPhase === 'all'
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3 h-3" />
            Semua Fasa (30 Hari)
          </button>
          <button
            onClick={() => setSelectedPhase(1)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhase === 1
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            M1: Asas & Sempadan (H1-7)
          </button>
          <button
            onClick={() => setSelectedPhase(2)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhase === 2
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            M2: Agama & Sahsiah (H8-14)
          </button>
          <button
            onClick={() => setSelectedPhase(3)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhase === 3
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            M3: Kewangan & Integriti (H15-21)
          </button>
          <button
            onClick={() => setSelectedPhase(4)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhase === 4
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            M4: Keluarga & Wali (H22-28)
          </button>
          <button
            onClick={() => setSelectedPhase(5)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedPhase === 5
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Fasa Keputusan (H29-30)
          </button>
        </div>

        {/* Rating Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap pl-1">
            Status:
          </span>
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              ratingFilter === 'all'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua Status
          </button>
          <button
            onClick={() => setRatingFilter('green')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              ratingFilter === 'green'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Check className="w-3 h-3" />
            Green Flag ({stats.dayGreenCount})
          </button>
          <button
            onClick={() => setRatingFilter('red')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              ratingFilter === 'red'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Red Flag ({stats.dayRedCount})
          </button>
          <button
            onClick={() => setRatingFilter('unrated')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              ratingFilter === 'unrated'
                ? 'bg-slate-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            Belum Dinilai ({stats.dayUnratedCount})
          </button>
        </div>
      </div>

      {/* 4. Kandungan Kad Setiap Hari */}
      <div className="space-y-4">
        {filteredDays.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Tiada rekod hari yang sepadan dengan tapisan ini.
            </p>
            <button
              onClick={() => {
                setSelectedPhase('all');
                setRatingFilter('all');
              }}
              className="mt-3 px-3 py-1.5 bg-[#d70f64] text-white text-xs font-semibold rounded-xl"
            >
              Set Semula Tapisan
            </button>
          </div>
        ) : (
          filteredDays.map(guide => {
            const userRec = activeCandidate.dayProgress[guide.day] || { completed: false, notes: '', rating: 'unrated' };
            const currentRating: CriterionRating = userRec.rating || (userRec.completed ? 'green' : 'unrated');

            return (
              <div
                key={guide.day}
                ref={el => {
                  dayCardRefs.current[guide.day] = el;
                }}
                className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs ${
                  currentRating === 'green'
                    ? 'border-emerald-300 ring-1 ring-emerald-200/60'
                    : currentRating === 'red'
                    ? 'border-rose-300 ring-1 ring-rose-200/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="p-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        currentRating === 'green'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : currentRating === 'red'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-[#d70f64] text-white shadow-2xs'
                      }`}
                    >
                      H{guide.day}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#d70f64] block">
                        {guide.phaseName}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {guide.title}
                      </h3>
                    </div>
                  </div>

                  {/* Rating Status Badge */}
                  <div className="shrink-0">
                    {currentRating === 'green' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Green Flag
                      </span>
                    )}
                    {currentRating === 'red' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-1 rounded-full">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                        Red Flag
                      </span>
                    )}
                    {currentRating === 'unrated' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        Belum Dinilai
                      </span>
                    )}
                  </div>
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
                  <div className="p-3 rounded-xl bg-[#fff0f5] border border-[#fcc2d7]">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-[#b80650] flex items-center gap-1">
                        📋 Soalan Ta'aruf Hari {guide.day}
                      </span>
                      <button
                        onClick={() => handleCopyQuestion(guide.day, guide.taarufQuestion)}
                        className="px-2.5 py-1 bg-white border border-[#fcc2d7] text-[#d70f64] hover:bg-[#ffe0ec] rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-2xs cursor-pointer"
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
                    <blockquote className="italic text-slate-800 bg-white p-2.5 rounded-lg border border-[#fcc2d7] leading-relaxed font-serif text-[12px]">
                      <strong className="font-sans font-black text-[#d70f64] not-italic mr-1.5">
                        Soalan Hari {guide.day}:
                      </strong>
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

                  {/* 🎯 Pilihan Penilaian Hari Ini (Green Flag, Red Flag, Belum Dinilai) */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Penilaian Respon Hari {guide.day}:
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {currentRating === 'green'
                          ? '🟢 Dinilai Positif (Green Flag)'
                          : currentRating === 'red'
                          ? '🔴 Tanda Amaran (Red Flag)'
                          : '⚪ Belum Ditetapkan'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Belum Dinilai button */}
                      <button
                        onClick={() => rateDay(guide.day, 'unrated')}
                        className={`py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                          currentRating === 'unrated'
                            ? 'bg-slate-100 border-slate-400 text-slate-800 border-b-[3px] border-b-slate-400 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 border-b-[2px]'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                        <span>Belum Dinilai</span>
                      </button>

                      {/* Green Flag button */}
                      <button
                        onClick={() => rateDay(guide.day, 'green')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                          currentRating === 'green'
                            ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 border-emerald-700 text-white border-b-[3px] border-b-emerald-800 shadow-sm shadow-emerald-700/20'
                            : 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100 border-b-[2px]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Green Flag</span>
                      </button>

                      {/* Red Flag button */}
                      <button
                        onClick={() => rateDay(guide.day, 'red')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                          currentRating === 'red'
                            ? 'bg-gradient-to-b from-rose-500 to-rose-600 border-rose-700 text-white border-b-[3px] border-b-rose-800 shadow-sm shadow-rose-700/20'
                            : 'bg-rose-50/80 border-rose-200 text-rose-800 hover:bg-rose-100 border-b-[2px]'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Red Flag</span>
                      </button>
                    </div>
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
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d70f64] resize-none"
                    />
                    {userRec.completedAt && (
                      <div className="text-[10px] text-emerald-700 font-medium mt-1">
                        Direkod pada: {userRec.completedAt}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
