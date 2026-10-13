import React from 'react';
import { 
  ClipboardList, 
  CalendarDays, 
  BarChart3, 
  BookOpen, 
  MessageSquareQuote,
  ArrowRight,
  User,
  Heart,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface HomeViewProps {
  onOpenCandidateModal?: () => void;
  onOpenGuideModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onOpenCandidateModal,
  onOpenGuideModal 
}) => {
  const { setActiveTab, activeCandidate, stats } = useApp();

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col items-center w-full pb-8">
      {/* =========================================================================
          HERO SECTION (Sunset Reflections by the Mosque)
         ========================================================================= */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#fce4ec] via-[#fff0f5] to-white pt-2 sm:pt-4">
        
        {/* Top-left Handwritten Cursive Quote with Heart */}
        <div className="absolute top-4 left-5 z-20 max-w-[210px] pointer-events-none select-none">
          <div className="bg-white/40 backdrop-blur-xs p-1.5 rounded-lg -ml-1">
            <p 
              className="text-[17px] sm:text-[19px] leading-[1.25] text-slate-800 font-['Caveat',cursive] tracking-wide drop-shadow-xs"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Pilihan yang tepat<br />
              bermula dengan<br />
              penilaian yang jujur.
            </p>
            <div className="mt-1 flex items-center gap-1">
              <svg 
                className="w-4 h-4 text-[#d70f64] stroke-current fill-none stroke-[2] drop-shadow-xs" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Top-right Action Buttons */}
        {onOpenGuideModal && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
            <button 
              onClick={onOpenGuideModal}
              className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#fcc2d7] text-[11px] font-bold text-[#d70f64] flex items-center gap-1 shadow-xs hover:bg-white transition-all cursor-pointer"
              title="Panduan Penilaian"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d70f64]" />
              <span>Panduan</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            HERO VISUAL: SUNSET REFLECTIONS BY THE MOSQUE (The Exact Artwork)
           ========================================================================= */}
        <div className="w-full relative h-[340px] sm:h-[410px] overflow-hidden select-none">
          {/* The Exact User Artwork: Sunset Reflections by the Mosque */}
          <img 
            src="/hero-user-sunset.jpg" 
            alt="Sunset Reflections by the Mosque" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] scale-[1.01]"
          />

          {/* Seamless Bottom Gradient Fade into Page Surface */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          TITLE BRANDING & SUBTITLE (Exact Match to Screenshot)
         ========================================================================= */}
      <div className="text-center px-4 -mt-3 sm:-mt-5 relative z-10">
        <h1 className="leading-[1.1] tracking-tight">
          <span 
            className="block text-[34px] sm:text-[42px] font-black text-[#133c26]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Checklist
          </span>
          <span 
            className="block text-[34px] sm:text-[42px] font-black text-[#d70f64]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Bakal Suami
          </span>
        </h1>
        <p className="mt-2 text-[14px] sm:text-[15px] font-semibold text-slate-700 tracking-tight">
          Kenali Tindakan, Bukan Kata-Kata
        </p>
      </div>

      {/* =========================================================================
          PRIMARY CTA BUTTON ("Mula Penilaian Saya →")
         ========================================================================= */}
      <div className="w-full max-w-sm px-6 mt-5 sm:mt-6">
        <button
          onClick={() => handleNavigate('checklist')}
          className="w-full group relative flex items-center justify-center py-3.5 px-6 rounded-full bg-gradient-to-r from-[#e64980] via-[#d70f64] to-[#c2185b] text-white font-bold text-base shadow-[0_8px_20px_rgba(215,15,100,0.35)] border-t border-white/30 border-b-[3px] border-b-[#9f0747] active:translate-y-1 active:border-b-[1px] active:shadow-md transition-all duration-150 cursor-pointer"
        >
          <span className="tracking-wide">Mula Penilaian Saya</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* =========================================================================
          5 DASHBOARD NAVIGATION CARDS (Grid 2-Top, 3-Bottom as in Screenshot)
         ========================================================================= */}
      <div className="w-full max-w-md px-4 mt-6 sm:mt-7 space-y-3">
        {/* ROW 1: 2 Cards (Checklist & 30 Hari) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
          {/* Card 1: Checklist */}
          <button
            onClick={() => handleNavigate('checklist')}
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-[#fcd5e2] shadow-[0_4px_12px_rgba(215,15,100,0.06)] hover:shadow-[0_6px_18px_rgba(215,15,100,0.15)] hover:border-[#f48fb1] active:scale-[0.98] transition-all duration-150 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#fff0f5] border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] mb-2.5 group-hover:scale-105 group-hover:bg-[#ffe0eb] transition-transform">
              <ClipboardList className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-[14.5px] tracking-tight">
              Checklist
            </span>
            <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">
              Nilai & Tindakan
            </span>
          </button>

          {/* Card 2: 30 Hari */}
          <button
            onClick={() => handleNavigate('guide30')}
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white border border-[#fcd5e2] shadow-[0_4px_12px_rgba(215,15,100,0.06)] hover:shadow-[0_6px_18px_rgba(215,15,100,0.15)] hover:border-[#f48fb1] active:scale-[0.98] transition-all duration-150 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#fff0f5] border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] mb-2.5 group-hover:scale-105 group-hover:bg-[#ffe0eb] transition-transform">
              <CalendarDays className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-[14.5px] tracking-tight">
              30 Hari
            </span>
            <span className="text-[11.5px] font-medium text-slate-500 mt-0.5">
              Panduan Ta'aruf
            </span>
          </button>
        </div>

        {/* ROW 2: 3 Cards (Analisis, Jurnal, Soalan) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Card 3: Analisis */}
          <button
            onClick={() => handleNavigate('analysis')}
            className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white border border-[#fcd5e2] shadow-[0_4px_12px_rgba(215,15,100,0.06)] hover:shadow-[0_6px_18px_rgba(215,15,100,0.15)] hover:border-[#f48fb1] active:scale-[0.98] transition-all duration-150 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] mb-2 group-hover:scale-105 group-hover:bg-[#ffe0eb] transition-transform">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-[13px] tracking-tight">
              Analisis
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-medium text-slate-500 mt-0.5 leading-tight">
              Lihat Keputusan
            </span>
          </button>

          {/* Card 4: Jurnal */}
          <button
            onClick={() => handleNavigate('journal')}
            className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white border border-[#fcd5e2] shadow-[0_4px_12px_rgba(215,15,100,0.06)] hover:shadow-[0_6px_18px_rgba(215,15,100,0.15)] hover:border-[#f48fb1] active:scale-[0.98] transition-all duration-150 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] mb-2 group-hover:scale-105 group-hover:bg-[#ffe0eb] transition-transform">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-[13px] tracking-tight">
              Jurnal
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-medium text-slate-500 mt-0.5 leading-tight">
              Kata vs Tindakan
            </span>
          </button>

          {/* Card 5: Soalan */}
          <button
            onClick={() => handleNavigate('questions')}
            className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white border border-[#fcd5e2] shadow-[0_4px_12px_rgba(215,15,100,0.06)] hover:shadow-[0_6px_18px_rgba(215,15,100,0.15)] hover:border-[#f48fb1] active:scale-[0.98] transition-all duration-150 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff0f5] border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] mb-2 group-hover:scale-105 group-hover:bg-[#ffe0eb] transition-transform">
              <MessageSquareQuote className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-[13px] tracking-tight">
              Soalan
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-medium text-slate-500 mt-0.5 leading-tight">
              Soalan Ta'aruf
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE CANDIDATE STATUS & PROGRESS QUICK SUMMARY
         ========================================================================= */}
      <div className="w-full max-w-md px-4 mt-5">
        <div className="bg-gradient-to-br from-[#fff7f9] to-white border border-[#fcc2d7] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d70f64] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {activeCandidate.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {activeCandidate.name}
                  </h3>
                  <span className="text-[10px] font-bold text-[#d70f64] bg-[#fff0f5] border border-[#fcc2d7] px-1.5 py-0.2 rounded-full">
                    {activeCandidate.age} thn · {activeCandidate.status === 'bujang' ? 'Bujang' : 'Duda'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Calon Aktif Sedang Dinilai
                </p>
              </div>
            </div>

            {onOpenCandidateModal && (
              <button
                onClick={onOpenCandidateModal}
                className="text-[11px] font-bold text-[#d70f64] hover:text-[#b80c55] flex items-center gap-0.5 cursor-pointer"
              >
                Tukar Calon
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#fce4ec] text-center">
            <div className="bg-white p-2 rounded-xl border border-[#fde8ef]">
              <span className="text-[10px] text-slate-500 block">Kriteria</span>
              <span className="text-xs font-black text-slate-800">
                {stats.ratedCount}/25
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-[#fde8ef]">
              <span className="text-[10px] text-slate-500 block">Skor Sesuai</span>
              <span className="text-xs font-black text-emerald-600">
                {stats.scorePercentage}%
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-[#fde8ef]">
              <span className="text-[10px] text-slate-500 block">Red Flag</span>
              <span className={`text-xs font-black ${stats.redCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                {stats.redCount} tanda
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PAKEJ JANDA BUKAN AKHIR CALL-TO-ACTION (Untuk Yang Belum Membeli Pakej)
         ========================================================================= */}
      <div className="w-full max-w-md px-4 mt-4">
        <a
          href="https://saudagarpantaimanis.bcl.my/form/janda-bukan-akhir"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full group block p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#fff0f5] via-[#ffe4ee] to-[#fde2ec] border-2 border-[#f48fb1] shadow-[0_4px_16px_rgba(215,15,100,0.12)] hover:shadow-[0_6px_22px_rgba(215,15,100,0.22)] active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#e64980] via-[#d70f64] to-[#c2185b] text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black text-[#d70f64] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#fcc2d7]">
                    Pakej Penuh
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Belum dapatkan pakej?</span>
                </div>
                <h4 className="text-[13.5px] sm:text-[14.5px] font-black text-slate-900 leading-tight">
                  Dapatkan Pakej Janda Bukan Akhir
                </h4>
                <p className="text-[11px] sm:text-[11.5px] text-slate-600 mt-0.5 leading-snug">
                  Klik di sini untuk akses modul, panduan penuh & bimbingan eksklusif
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-[#fcc2d7] flex items-center justify-center text-[#d70f64] group-hover:bg-[#d70f64] group-hover:text-white transition-colors shadow-2xs">
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        </a>
      </div>

      {/* Reassurance Footer Quote */}
      <div className="px-6 mt-4 text-center">
        <p className="text-[11.5px] text-slate-400 italic">
          "Bukan mencari yang sempurna, tetapi mencari yang jujur berusaha menjadi pembimbing yang bertanggungjawab."
        </p>
      </div>
    </div>
  );
};
