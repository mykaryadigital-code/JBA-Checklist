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
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-xl mx-auto px-2">
        <div className="grid grid-cols-5 items-center">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 relative transition-colors group min-h-[60px] ${
                  isActive ? 'text-rose-800 font-bold' : 'text-slate-500 hover:text-rose-700 font-medium'
                }`}
              >
                <div className="relative">
                  <div
                    className={`p-1 rounded-xl transition-all ${
                      isActive ? 'bg-rose-100 text-rose-850 scale-105' : 'group-hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`absolute -top-1 -right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full leading-tight shrink-0 shadow-xs ${
                        isActive
                          ? 'bg-rose-800 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-rose-800 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
