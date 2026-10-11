import React, { useState } from 'react';
import { 
  Check, 
  AlertOctagon, 
  HelpCircle, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Compass, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CRITERIA_DATA } from '../data/criteriaData';
import { CriteriaCategory, CriterionRating } from '../types';

type FilterType = 'all' | CriteriaCategory | 'green' | 'red' | 'unrated';

export const ChecklistView: React.FC = () => {
  const { activeCandidate, rateCriterion, updateCriterionNotes, stats } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});

  const toggleNotes = (id: number) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCriteria = CRITERIA_DATA.filter(item => {
    // Category or rating filter
    if (filter === 'sahsiah' && item.category !== 'sahsiah') return false;
    if (filter === 'kewangan' && item.category !== 'kewangan') return false;
    if (filter === 'keluarga' && item.category !== 'keluarga') return false;
    if (filter === 'komunikasi' && item.category !== 'komunikasi') return false;

    const userRating = activeCandidate.checklist[item.id]?.rating || 'unrated';
    if (filter === 'green' && userRating !== 'green') return false;
    if (filter === 'red' && userRating !== 'red') return false;
    if (filter === 'unrated' && userRating !== 'unrated') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchPrompt = item.actionEvidencePrompt.toLowerCase().includes(q);
      const matchNotes = (activeCandidate.checklist[item.id]?.notes || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchPrompt && !matchNotes) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats Summary */}
      <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white p-4.5 rounded-2xl shadow-lg shadow-[#d70f64]/25">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-semibold text-white mb-1.5">
              <Sparkles className="w-3 h-3 text-pink-100" />
              <span>Senarai Semak 25 Kriteria</span>
            </div>
            <h2 className="text-lg font-bold">Penilaian Bukti Tindakan</h2>
            <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
              Nilai calon berdasarkan perbuatan harian & kepatuhan syarak.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{stats.ratedCount}</span>
            <span className="text-xs text-pink-100">/25 Dinilai</span>
          </div>
        </div>

        {/* Flag count pill chips */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20">
          <div className="bg-white/15 rounded-xl p-2 text-center border border-white/20">
            <div className="text-emerald-200 font-bold text-base leading-none">
              +{stats.greenCount}
            </div>
            <div className="text-[10px] text-pink-100 mt-1 font-medium">Green Flag</div>
          </div>
          <div className="bg-white/15 rounded-xl p-2 text-center border border-white/20">
            <div className="text-rose-100 font-bold text-base leading-none">
              -{stats.redCount}
            </div>
            <div className="text-[10px] text-pink-100 mt-1 font-medium">Red Flag</div>
          </div>
          <div className="bg-white/15 rounded-xl p-2 text-center border border-white/20">
            <div className="text-white font-bold text-base leading-none">
              {stats.unratedCount}
            </div>
            <div className="text-[10px] text-pink-100 mt-1 font-medium">Belum Nilai</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari kriteria, kata kunci, atau nota..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d70f64]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Category / Status Filter Chips (Scrollable horizontal) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#d70f64] text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua (25)
        </button>
        <button
          onClick={() => setFilter('sahsiah')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'sahsiah'
              ? 'bg-[#d70f64] text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Sahsiah (7)
        </button>
        <button
          onClick={() => setFilter('kewangan')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'kewangan'
              ? 'bg-[#d70f64] text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Kewangan (6)
        </button>
        <button
          onClick={() => setFilter('keluarga')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'keluarga'
              ? 'bg-[#d70f64] text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Keluarga (6)
        </button>
        <button
          onClick={() => setFilter('komunikasi')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'komunikasi'
              ? 'bg-[#d70f64] text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Komunikasi (6)
        </button>
        <button
          onClick={() => setFilter('green')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'green'
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Green Flag ({stats.greenCount})
        </button>
        <button
          onClick={() => setFilter('red')}
          className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
            filter === 'red'
              ? 'bg-rose-700 text-white font-bold shadow-xs'
              : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
          }`}
        >
          Red Flag ({stats.redCount})
        </button>
      </div>

      {/* Criteria Cards List */}
      <div className="space-y-3.5">
        {filteredCriteria.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <Compass className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Tiada kriteria menepati carian atau tapisan ini.</p>
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold"
            >
              Reset Tapisan
            </button>
          </div>
        ) : (
          filteredCriteria.map(item => {
            const userRecord = activeCandidate.checklist[item.id] || { rating: 'unrated', notes: '' };
            const currentRating = userRecord.rating;
            const hasNotes = Boolean(userRecord.notes && userRecord.notes.trim().length > 0);
            const isNotesExpanded = expandedNotes[item.id] ?? hasNotes;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  currentRating === 'green'
                    ? 'border-emerald-300 ring-1 ring-emerald-200/60'
                    : currentRating === 'red'
                    ? 'border-rose-300 ring-1 ring-rose-200/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold flex items-center justify-center shrink-0">
                        {item.id}
                      </span>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {item.isCritical && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                        Asas Wajib
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Evidence prompt & Syarak Explanation box */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1.5 text-[11px]">
                    <div className="text-slate-700 leading-snug">
                      <strong className="text-rose-900 font-semibold">🔍 Tindakan Sebenar: </strong>
                      <span>{item.actionEvidencePrompt}</span>
                    </div>
                    <div className="text-slate-500 leading-snug italic pt-1 border-t border-slate-200/60">
                      <span>💡 <strong>Kenapa Penting:</strong> {item.whyImportant}</span>
                    </div>
                  </div>

                  {/* 3-Way Rating Selector Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5">
                    {/* Unrated / Neutral button */}
                    <button
                      onClick={() => rateCriterion(item.id, 'unrated')}
                      className={`py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                        currentRating === 'unrated'
                          ? 'bg-slate-100 border-slate-400 text-slate-800 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Belum Dinilai</span>
                    </button>

                    {/* Green Flag button */}
                    <button
                      onClick={() => rateCriterion(item.id, 'green')}
                      className={`py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                        currentRating === 'green'
                          ? 'bg-emerald-600 border-emerald-700 text-white font-bold shadow-sm shadow-emerald-700/20'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Green Flag</span>
                    </button>

                    {/* Red Flag button */}
                    <button
                      onClick={() => rateCriterion(item.id, 'red')}
                      className={`py-2 px-1 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border transition-all ${
                        currentRating === 'red'
                          ? 'bg-rose-600 border-rose-700 text-white font-bold shadow-sm shadow-rose-700/20'
                          : 'bg-rose-50/70 border-rose-200 text-rose-800 hover:bg-rose-100'
                      }`}
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Red Flag</span>
                    </button>
                  </div>

                  {/* Toggle Note Section */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleNotes(item.id)}
                      className="text-xs text-[#d70f64] hover:text-[#b80650] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>
                        {hasNotes ? 'Lihat/Edit Catatan Bukti' : 'Tambah Catatan Bukti'}
                      </span>
                      {isNotesExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {userRecord.updatedAt && (
                      <span className="text-[10px] text-slate-400">
                        Disemak: {userRecord.updatedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Collapsible Notes Field */}
                {isNotesExpanded && (
                  <div className="bg-[#fff0f5] p-3.5 border-t border-[#fcc2d7] animate-in fade-in duration-150">
                    <label className="block text-[11px] font-bold text-[#b80650] mb-1">
                      Catatan Bukti / Situasi Sebenar:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tulis tarikh, peristiwa, kata-katanya atau tindakan konkrit yang anda saksikan sendiri..."
                      value={userRecord.notes || ''}
                      onChange={e => updateCriterionNotes(item.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#fcc2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d70f64] resize-none"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
