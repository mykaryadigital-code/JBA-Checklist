import React from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  MessageSquareQuote 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'checklist',
      label: 'Checklist',
      icon: <ClipboardCheck className="w-5 h-5" />,
      badge: `${stats.ratedCount}/25`,
    },
    {
      id: 'guide30',
      label: '30 Hari',
      icon: <Calendar className="w-5 h-5" />,
      badge: `${stats.completedDaysCount}/30`,
    },
    {
      id: 'analysis',
      label: 'Analisis',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: `${stats.scorePercentage}%`,
    },
    {
      id: 'journal',
      label: 'Jurnal',
      icon: <BookOpen className="w-5 h-5" />,
      badge: stats.journalCount > 0 ? stats.journalCount : undefined,
    },
    {
      id: 'questions',
      label: 'Soalan',
      icon: <MessageSquareQuote className="w-5 h-5" />,
      badge: stats.questionRatedCount > 0 ? `${stats.questionRatedCount}/32` : undefined,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#fcc2d7] shadow-[0_-6px_25px_rgba(215,15,100,0.12)]">
      <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-2.5 py-2">
        <div className="grid grid-cols-5 items-stretch gap-1.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 select-none cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#ff2b85] to-[#d70f64] text-white border-t border-white/40 border-b-[4px] border-b-[#9f0747] shadow-[0_4px_12px_rgba(215,15,100,0.35)] -translate-y-1 active:translate-y-0.5 active:border-b-[1px]'
                    : 'bg-gradient-to-b from-white to-slate-100/90 text-slate-600 hover:text-[#d70f64] border border-slate-200/90 border-b-[3.5px] border-b-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:bg-gradient-to-b hover:from-[#fff5f8] hover:to-[#ffe0eb] hover:border-[#fcc2d7] hover:border-b-[#f48fb1] active:translate-y-0.5 active:border-b-[1px]'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`transition-transform duration-150 ${isActive ? 'scale-110 drop-shadow-sm' : ''}`}>
                    {item.icon}
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-2.5 -right-3 text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shrink-0 shadow-xs border ${
                        isActive
                          ? 'bg-white text-[#d70f64] border-white/80 font-black'
                          : 'bg-[#fff0f5] text-[#d70f64] border-[#fcc2d7]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10.5px] mt-1 tracking-tight truncate max-w-full ${isActive ? 'font-black text-white drop-shadow-xs' : 'font-semibold text-slate-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
