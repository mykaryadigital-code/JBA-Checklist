import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Copy, 
  Check, 
  Search, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles
} from 'lucide-react';
import { TAARUF_QUESTIONS_DATA } from '../data/taarufQuestionsData';

export const TaarufQuestionsView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { key: 'all', label: `Semua (${TAARUF_QUESTIONS_DATA.length})` },
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
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQ = item.question.toLowerCase().includes(q);
      const matchPurpose = item.purpose.toLowerCase().includes(q);
      const matchGreen = item.greenFlagAnswer.toLowerCase().includes(q);
      const matchRed = item.redFlagAnswer.toLowerCase().includes(q);
      if (!matchQ && !matchPurpose && !matchGreen && !matchRed) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white p-4.5 rounded-2xl shadow-lg shadow-[#d70f64]/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-semibold text-white">
            <Sparkles className="w-3 h-3 text-pink-100" />
            <span>Koleksi 32 Soalan Ta'aruf Matang</span>
          </div>
          <span className="text-xs font-bold text-pink-100">
            {TAARUF_QUESTIONS_DATA.length} Soalan & Analisis
          </span>
        </div>

        <h2 className="text-lg font-bold mt-2">Panduan Pertanyaan & Bedah Jawapan</h2>
        <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
          32 skrip pertanyaan matang untuk mencungkil watak sebenar calon, dilengkapi tujuan syarak, tanda respon jujur (Green Flag), dan amaran manipulasi (Red Flag).
        </p>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari soalan mengikut topik atau kata kunci..."
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

      {/* Categories chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-[#d70f64] text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <MessageSquareQuote className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Tiada soalan menepati carian ini.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 bg-[#fff0f5] text-[#d70f64] rounded-lg text-xs font-semibold"
            >
              Lihat Semua Soalan
            </button>
          </div>
        ) : (
          filteredQuestions.map((item, idx) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Header with copy button */}
                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#d70f64] text-white shadow-2xs">
                        Soalan #{item.questionNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#d70f64] px-2 py-0.5 rounded-full bg-[#fff0f5] border border-[#fcc2d7]">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      <span className="text-[#d70f64] font-black mr-1.5">
                        Soalan {item.questionNumber}:
                      </span>
                      "{item.question}"
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, item.question)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:bg-[#fff0f5] hover:text-[#d70f64] text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors"
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

                  {/* 🟢 Tanda Jawapan Matang (Green Flag) */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                    <div className="flex items-center gap-1 font-bold text-emerald-900 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tanda Jawapan Matang (Green Flag):</span>
                    </div>
                    <p className="italic leading-relaxed">
                      {item.greenFlagAnswer}
                    </p>
                  </div>

                  {/* 🔴 Tanda Jawapan Bahaya / Manipulatif (Red Flag) */}
                  <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950">
                    <div className="flex items-center gap-1 font-bold text-rose-900 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Tanda Jawapan Manipulatif / Bahaya (Red Flag):</span>
                    </div>
                    <p className="italic leading-relaxed">
                      {item.redFlagAnswer}
                    </p>
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
