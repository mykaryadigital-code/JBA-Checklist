import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  Activity,
  X,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JournalEntry } from '../types';

export const JournalView: React.FC = () => {
  const { activeCandidate, addJournalEntry, deleteJournalEntry, stats } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'konsisten' | 'tidak_konsisten'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Komunikasi & Ketepatan Masa');
  const [spokenPromise, setSpokenPromise] = useState('');
  const [actualAction, setActualAction] = useState('');
  const [status, setStatus] = useState<'konsisten' | 'tidak_konsisten'>('konsisten');
  const [impressionScore, setImpressionScore] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const journals = activeCandidate.journal || [];

  const filteredJournals = journals.filter(j => {
    if (statusFilter === 'all') return true;
    return j.status === statusFilter;
  });

  const handleOpenModal = () => {
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Komunikasi & Ketepatan Masa');
    setSpokenPromise('');
    setActualAction('');
    setStatus('konsisten');
    setImpressionScore(5);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !spokenPromise.trim() || !actualAction.trim()) {
      alert('Sila lengkapkan tajuk, kata-kata yang dijanji, dan tindakan sebenar.');
      return;
    }

    addJournalEntry({
      date,
      title: title.trim(),
      category,
      spokenPromise: spokenPromise.trim(),
      actualAction: actualAction.trim(),
      status,
      impressionScore,
      notes: notes.trim(),
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Banner & Consistency Score */}
      <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white p-4.5 rounded-2xl shadow-lg shadow-[#d70f64]/25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[11px] font-semibold text-white">
            <Activity className="w-3 h-3 text-pink-100" />
            <span>Jurnal Tindakan Sebenar</span>
          </div>
          <span className="text-xs font-bold text-pink-100">
            {stats.journalCount} Insiden Direkod
          </span>
        </div>

        <h2 className="text-lg font-bold mt-2">Kata-Kata vs Tindakan</h2>
        <p className="text-xs text-pink-100 mt-0.5 leading-relaxed">
          Bukti nyata adalah perbuatan, bukan janji manis di bibir semata-mata.
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/20">
          <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-pink-100">Kadar Konsistensi</div>
              <div className="text-lg font-black text-emerald-200">
                {stats.consistencyRate}%
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-300 opacity-90" />
          </div>

          <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-pink-100">Sejajar / Tidak</div>
              <div className="text-sm font-bold text-white">
                <span className="text-emerald-200">{stats.consistentJournalCount}</span> /{' '}
                <span className="text-rose-100">{stats.journalCount - stats.consistentJournalCount}</span>
              </div>
            </div>
            <BookOpen className="w-6 h-6 text-pink-100 opacity-80" />
          </div>
        </div>
      </div>

      {/* 2. Action Button & Filters */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleOpenModal}
          className="flex-1 py-2.5 px-4 bg-gradient-to-b from-[#ff2b85] to-[#d70f64] hover:brightness-105 active:translate-y-0.5 active:border-b-[1px] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-t border-white/30 border-b-[4px] border-b-[#9f0747] shadow-[0_4px_12px_rgba(215,15,100,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Insiden Baharu</span>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'all'
              ? 'bg-[#d70f64] text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Semua ({journals.length})
        </button>
        <button
          onClick={() => setStatusFilter('konsisten')}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'konsisten'
              ? 'bg-emerald-700 text-white font-bold'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          Konsisten ({journals.filter(j => j.status === 'konsisten').length})
        </button>
        <button
          onClick={() => setStatusFilter('tidak_konsisten')}
          className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'tidak_konsisten'
              ? 'bg-rose-700 text-white font-bold'
              : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
          }`}
        >
          Tidak Konsisten ({journals.filter(j => j.status === 'tidak_konsisten').length})
        </button>
      </div>

      {/* 3. Chronological Timeline List */}
      <div className="space-y-3.5">
        {filteredJournals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Belum ada catatan insiden untuk calon ini.</p>
            <p className="text-xs text-slate-400 mt-1">
              Catat bila ada peristiwa janji temu, perbualan kewangan, atau interaksi bersama anak.
            </p>
            <button
              onClick={handleOpenModal}
              className="mt-3 px-4 py-2 bg-rose-50 text-rose-800 rounded-xl text-xs font-semibold"
            >
              Tambah Catatan Pertama
            </button>
          </div>
        ) : (
          filteredJournals.map((item, index) => {
            const isConsistent = item.status === 'konsisten';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                  isConsistent
                    ? 'border-emerald-200/90 hover:border-emerald-300'
                    : 'border-rose-300/90 hover:border-rose-400 ring-1 ring-rose-200'
                }`}
              >
                {/* Header row */}
                <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                        isConsistent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isConsistent ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Konsisten</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-700" />
                          <span>Tidak Sejajar</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm('Padamkan catatan insiden ini?')) {
                          deleteJournalEntry(item.id);
                        }
                      }}
                      title="Padam Catatan"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Comparison: Spoken vs Action */}
                <div className="p-4 space-y-2.5 text-xs">
                  {/* Kata-Kata Yang Dijanjikan */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-600 mb-0.5 flex items-center gap-1">
                      <span>🗣️ Apa Yang Dikatakan / Dijanjikan:</span>
                    </div>
                    <p className="text-slate-800 italic leading-relaxed">
                      "{item.spokenPromise}"
                    </p>
                  </div>

                  {/* Tindakan Sebenar Yang Dilakukan */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isConsistent
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div
                      className={`text-[11px] font-bold mb-0.5 flex items-center gap-1 ${
                        isConsistent ? 'text-emerald-900' : 'text-rose-900'
                      }`}
                    >
                      <span>⚡ Tindakan Sebenar Yang Dilakukan:</span>
                    </div>
                    <p className="leading-relaxed font-medium">
                      {item.actualAction}
                    </p>
                  </div>

                  {/* Rating Stars & Notes */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <span>Skor Impresi:</span>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= item.impressionScore ? 'fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {item.notes && (
                      <span className="truncate max-w-[180px] text-slate-600">
                        Nota: {item.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#fcc2d7] flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#d70f64] to-[#e21b70] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-pink-100" />
                <h3 className="font-semibold text-lg">Catat Insiden / Peristiwa</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-pink-100 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEntry} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tajuk Peristiwa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Janji temu minum petang / Perbualan nafkah"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tarikh Peristiwa
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-xs bg-white"
                  >
                    <option value="Komunikasi & Ketepatan Masa">Komunikasi & Masa</option>
                    <option value="Kewangan & Nafkah">Kewangan & Nafkah</option>
                    <option value="Keluarga & Anak">Keluarga & Anak</option>
                    <option value="Pengurusan Marah & Emosi">Marah & Emosi</option>
                    <option value="Kejujuran & Sikap">Kejujuran & Sikap</option>
                  </select>
                </div>
              </div>

              {/* Spoken promise */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Apa Yang Dijanjikan / Dikatakan Calon *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Dia berjanji akan menjemput saya tepat jam 3 petang dan tidak akan merokok..."
                  value={spokenPromise}
                  onChange={e => setSpokenPromise(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-xs resize-none"
                />
              </div>

              {/* Actual action */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Apa Tindakan Sebenar Yang Dilakukannya *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Dia tiba jam 3.45 petang tanpa sebarang makluman awal, dan didapati menghisap vape..."
                  value={actualAction}
                  onChange={e => setActualAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-xs resize-none"
                />
              </div>

              {/* Status consistency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Penilaian Sejajar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('konsisten')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      status === 'konsisten'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konsisten (Sejajar)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('tidak_konsisten')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      status === 'tidak_konsisten'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Sejajar (Janji Manis)</span>
                  </button>
                </div>
              </div>

              {/* Impression Stars */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skor Impresi Keseluruhan:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setImpressionScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= impressionScore
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {impressionScore} daripada 5
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nota Tambahan (Pilihan)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Reaksi bila ditanya, rasa gerak hati..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-700 text-xs"
                />
              </div>

              {/* Footer buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 border-b-[3px] border-b-slate-300 active:translate-y-0.5 active:border-b-[1px] transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-b from-[#ff2b85] to-[#d70f64] hover:brightness-105 text-white rounded-xl text-xs font-bold border-t border-white/30 border-b-[4px] border-b-[#9f0747] shadow-[0_4px_12px_rgba(215,15,100,0.3)] active:translate-y-0.5 active:border-b-[1px] transition-all cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
