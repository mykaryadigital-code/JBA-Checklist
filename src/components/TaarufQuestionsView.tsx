import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Copy, 
  Check, 
  Search, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Lightbulb, 
  Sparkles,
  User,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TAARUF_QUESTIONS_DATA } from '../data/taarufQuestionsData';
import { CriterionRating } from '../types';

type RatingFilterType = 'all' | 'green' | 'red' | 'unrated';

export const TaarufQuestionsView: React.FC = () => {
  const { activeCandidate, rateQuestion, updateQuestionNotes, stats } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<RatingFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { key: 'all', label: `Semua Topik (${TAARUF_QUESTIONS_DATA.length})` },
    { key: 'niat', label: 'Niat & Matlamat (4)' },
    { key: 'kewangan', label: 'Kewangan & Nafkah (5)' },
    { key: 'emosi', label: 'Marah & Emosi (5)' },
    { key: 'anak', label: 'Anak & Ibu Tunggal (5)' },
    { key: 'silam', label: 'Sejarah Silam (3)' },
    { key: 'wali', label: 'Wali & Keluarga (4)' },
    { key: 'kerjaya', label: 'Kerjaya Isteri (4)' },
    { key: 'kesihatan', label: 'Kesihatan & Tabiat (2)' },
  ];

  const filteredQuestions = TAARUF_QUESTIONS_DATA.filter(item => {
    // 1. Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // 2. Rating filter
    const userRating = activeCandidate?.questionRatings?.[item.id]?.rating || 'unrated';
    if (ratingFilter === 'green' && userRating !== 'green') return false;
    if (ratingFilter === 'red' && userRating !== 'red') return false;
    if (ratingFilter === 'unrated' && userRating !== 'unrated') return false;

    // 3. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = item.question.toLowerCase().includes(q);
      const matchPurpose = item.purpose.toLowerCase().includes(q);
      const matchGreen = item.greenFlagAnswer.toLowerCase().includes(q);
      const matchRed = item.redFlagAnswer.toLowerCase().includes(q);
      const matchNotes = (activeCandidate?.questionRatings?.[item.id]?.notes || '').toLowerCase().includes(q);
      if (!matchQ && !matchPurpose && !matchGreen && !matchRed && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Progress Bar */}
      <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white p-4.5 rounded-2xl shadow-lg shadow-[#d70f64]/25">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-semibold text-white">
            <Sparkles className="w-3 h-3 text-pink-100" />
            <span>Koleksi 32 Soalan Ta'aruf Matang</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-pink-100 bg-black/15 px-2.5 py-0.5 rounded-full">
            <User className="w-3 h-3 text-pink-200" />
            <span className="truncate max-w-[140px] sm:max-w-none">{activeCandidate.name}</span>
          </div>
        </div>

        <h2 className="text-lg font-bold mt-2">Panduan Pertanyaan & Bedah Jawapan</h2>
        <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
          Pilih status jawapan calon (Green Flag atau Red Flag) untuk merekod ketelusan dan watak sebenar calon semasa sesi ta'aruf.
        </p>

        {/* Progress Bar & Rating Counters */}
        <div className="mt-3.5 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span>Kemajuan Penilaian Soalan:</span>
            <span>{stats.questionRatedCount} / {stats.questionTotalCount} Dinilai</span>
          </div>
          <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden flex">
            <div 
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(stats.questionGreenCount / stats.questionTotalCount) * 100}%` }}
              title={`Green Flag: ${stats.questionGreenCount}`}
            />
            <div 
              className="bg-rose-400 h-full transition-all duration-300"
              style={{ width: `${(stats.questionRedCount / stats.questionTotalCount) * 100}%` }}
              title={`Red Flag: ${stats.questionRedCount}`}
            />
          </div>

          <div className="flex items-center gap-2 mt-2 text-[11px] font-semibold flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-300/40 text-emerald-100">
              🟢 {stats.questionGreenCount} Green Flag
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-300/40 text-rose-100">
              🔴 {stats.questionRedCount} Red Flag
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 border border-white/30 text-pink-100">
              ⚪ {stats.questionUnratedCount} Belum Dinilai
            </span>
          </div>
        </div>
      </div>

      {/* 2. Rating Status Filter Buttons (3D Tactile Filter Bar) */}
      <div className="bg-white p-2.5 rounded-2xl border border-[#fcc2d7] shadow-xs">
        <div className="flex items-center justify-between gap-1.5 mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#d70f64]" />
            Tapis Mengikut Status Jawapan:
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {filteredQuestions.length} soalan dipaparkan
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          <button
            onClick={() => setRatingFilter('all')}
            className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center border cursor-pointer ${
              ratingFilter === 'all'
                ? 'bg-slate-800 text-white border-slate-900 border-b-[3px] border-b-black shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 border-b-[2px]'
            }`}
          >
            Semua ({stats.questionTotalCount})
          </button>
          <button
            onClick={() => setRatingFilter('green')}
            className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center border cursor-pointer ${
              ratingFilter === 'green'
                ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border-emerald-700 border-b-[3px] border-b-emerald-800 shadow-xs'
                : 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100 border-b-[2px]'
            }`}
          >
            🟢 Green ({stats.questionGreenCount})
          </button>
          <button
            onClick={() => setRatingFilter('red')}
            className={`py-1.5 px-1 rounded-xl font-bold transition-all text-center border cursor-pointer ${
              ratingFilter === 'red'
                ? 'bg-gradient-to-b from-rose-500 to-rose-600 text-white border-rose-700 border-b-[3px] border-b-rose-800 shadow-xs'
                : 'bg-rose-50/80 text-rose-800 border-rose-200 hover:bg-rose-100 border-b-[2px]'
            }`}
          >
            🔴 Red ({stats.questionRedCount})
          </button>
          <button
            onClick={() => setRatingFilter('unrated')}
            className={`py-1.5 px-1 rounded-xl font-semibold transition-all text-center border cursor-pointer ${
              ratingFilter === 'unrated'
                ? 'bg-slate-200 text-slate-800 border-slate-400 border-b-[3px] border-b-slate-500 shadow-xs'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 border-b-[2px]'
            }`}
          >
            ⚪ Belum ({stats.questionUnratedCount})
          </button>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari kata kunci soalan, jawapan atau topik..."
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

      {/* 4. Categories chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <MessageSquareQuote className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Tiada soalan menepati carian atau tapisan ini.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setRatingFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 bg-[#fff0f5] text-[#d70f64] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Set Semula Semua Tapisan
            </button>
          </div>
        ) : (
          filteredQuestions.map(item => {
            const isCopied = copiedId === item.id;
            const userRecord = activeCandidate?.questionRatings?.[item.id];
            const currentRating: CriterionRating = userRecord?.rating || 'unrated';
            const userNotes = userRecord?.notes || '';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  currentRating === 'green'
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : currentRating === 'red'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Header with status badge & copy button */}
                <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-[#d70f64] text-white shadow-2xs">
                        Soalan #{item.questionNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d70f64] px-2 py-0.5 rounded-full bg-[#fff0f5] border border-[#fcc2d7]">
                        {item.categoryLabel}
                      </span>

                      {/* Live evaluation status badge */}
                      {currentRating === 'green' ? (
                        <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Respon Green Flag
                        </span>
                      ) : currentRating === 'red' ? (
                        <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Respon Red Flag
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          Belum Dinilai
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-[13px] sm:text-sm leading-snug">
                      <span className="text-[#d70f64] font-black mr-1.5">
                        Soalan {item.questionNumber}:
                      </span>
                      "{item.question}"
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, item.question)}
                    className="self-start sm:self-auto px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-[#fff0f5] hover:text-[#d70f64] text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Soalan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Details Breakdown */}
                <div className="p-4 space-y-3 text-xs">
                  {/* 🎯 Tujuan Psikologi & Syarak */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1 text-slate-800 font-bold mb-0.5">
                      <Target className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span>Tujuan Psikologi & Syarak:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {item.purpose}
                    </p>
                  </div>

                  {/* 🟢 Green Flag & 🔴 Red Flag in 2-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {/* 🟢 Tanda Jawapan Matang (Green Flag) */}
                    <div className={`p-3 rounded-xl border transition-all flex flex-col ${
                      currentRating === 'green'
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/30 text-emerald-950 shadow-xs'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    }`}>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1 font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Tanda Jawapan Matang (Green Flag):</span>
                        </div>
                        {currentRating === 'green' && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-200/80 px-1.5 py-0.2 rounded">
                            Dipilih ✓
                          </span>
                        )}
                      </div>
                      <p className="italic leading-relaxed flex-1 text-slate-700">
                        {item.greenFlagAnswer}
                      </p>
                    </div>

                    {/* 🔴 Tanda Jawapan Bahaya / Manipulatif (Red Flag) */}
                    <div className={`p-3 rounded-xl border transition-all flex flex-col ${
                      currentRating === 'red'
                        ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/30 text-rose-950 shadow-xs'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1 font-bold text-rose-900">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>Tanda Jawapan Bahaya (Red Flag):</span>
                        </div>
                        {currentRating === 'red' && (
                          <span className="text-[10px] font-extrabold text-rose-700 bg-rose-200/80 px-1.5 py-0.2 rounded">
                            Dipilih ⚠️
                          </span>
                        )}
                      </div>
                      <p className="italic leading-relaxed flex-1 text-slate-700">
                        {item.redFlagAnswer}
                      </p>
                    </div>
                  </div>

                  {/* 🎮 BUTTONS JAWAPAN CALON (Green Flag, Red Flag, Belum Dinilai - 3D Tactile Buttons) */}
                  <div className="pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Pilih Penilaian Respon Calon:
                      </span>
                      <span className="text-[10.5px] font-semibold text-slate-500">
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
                        onClick={() => rateQuestion(item.id, 'unrated')}
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
                        onClick={() => rateQuestion(item.id, 'green')}
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
                        onClick={() => rateQuestion(item.id, 'red')}
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

                  {/* Catatan Jawapan & Bukti Calon (Textarea) */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-700">
                        Catatan Jawapan & Bukti Sebenar Calon:
                      </label>
                      {userNotes && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Disimpan
                        </span>
                      )}
                    </div>
                    <textarea
                      value={userNotes}
                      onChange={e => updateQuestionNotes(item.id, e.target.value)}
                      placeholder="Catat apa yang dijawab atau reaksi tubuh calon semasa soalan ini ditanya..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#d70f64] resize-none"
                    />
                  </div>

                  {/* 💡 Petua Pemerhatian (Pro-tip) */}
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-700">Petua:</strong> {item.proTip}
                    </span>
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
