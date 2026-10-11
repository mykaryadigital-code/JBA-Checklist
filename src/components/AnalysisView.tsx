import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldCheck, 
  Scale, 
  HelpCircle, 
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CRITERIA_DATA } from '../data/criteriaData';

export const AnalysisView: React.FC = () => {
  const { activeCandidate, stats, setActiveTab } = useApp();

  // Find all red-flagged criteria for this candidate
  const redFlaggedCriteria = CRITERIA_DATA.filter(
    item => activeCandidate.checklist[item.id]?.rating === 'red'
  );

  // Determine official verdict
  let verdictType: 'berpotensi' | 'pemerhatian' | 'bahaya' = 'pemerhatian';
  let verdictTitle = 'Perlu Pemerhatian Lanjut & Tempoh Ujian';
  let verdictDescription =
    'Skor calon berada di tahap sederhana (50% - 74%). Perbanyakkan soalan ta\'aruf mendalam, semak konsistensi tindakannya dalam jurnal, dan jangan tergesa-gesa menetapkan tarikh akad.';
  let verdictBadgeBg = 'bg-amber-500 text-white';
  let verdictCardBg = 'bg-amber-50/70 border-amber-300';

  if (stats.scorePercentage >= 75 && stats.criticalRedFlags === 0) {
    verdictType = 'berpotensi';
    verdictTitle = 'Sangat Berpotensi (Teruskan ke Fasa Wali & Akad)';
    verdictDescription =
      'Calon menunjukkan tahap kematangan, kebertanggungjawaban syarie, dan rekod perlakuan yang meyakinkan tanpa sebarang red flag pada kriteria asas wajib. Disarankan meneruskan ke fasa pertemuan rasmi bersama wali dan solat istikharah.';
    verdictBadgeBg = 'bg-emerald-600 text-white';
    verdictCardBg = 'bg-emerald-50/70 border-emerald-300';
  } else if (stats.scorePercentage < 50 || stats.criticalRedFlags >= 2) {
    verdictType = 'bahaya';
    verdictTitle = 'Amaran Bahaya: Disarankan Berundur Demi Keselamatan Emosi & Anak';
    verdictDescription =
      'Terdapat isu pada kriteria asas wajib seperti panas baran, pengabaian nafkah, ketidakjujuran status, atau manipulasi yang dikesan. Mengahwini calon ini berisiko tinggi mengorbankan kesejahteraan emosi anda dan anak.';
    verdictBadgeBg = 'bg-rose-700 text-white';
    verdictCardBg = 'bg-rose-50/80 border-rose-300';
  }

  const dimensionList = [
    { key: 'sahsiah', label: 'Sahsiah & Agama', desc: 'Solat, emosi, kejujuran & adab' },
    { key: 'kewangan', label: 'Kerjaya & Kewangan', desc: 'Punca rezeki, nafkah zahir & hutang' },
    { key: 'keluarga', label: 'Keluarga & Anak', desc: 'Kasih anak, nafkah anak & restu wali' },
    { key: 'komunikasi', label: 'Komunikasi & Masa Depan', desc: 'Tolak ansur, integriti janji & wawasan' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Main Score Meter Card */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-400 to-pink-500 text-white p-5 rounded-2xl shadow-md shadow-pink-500/20">
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-wider font-bold text-pink-100 block mb-1">
            Indeks Skor Kelayakan Calon
          </span>
          <h2 className="text-xl font-bold">{activeCandidate.name}</h2>
          <p className="text-xs text-pink-100 mt-0.5">
            Berasaskan nisbah 25 kriteria tindakan harian & syariat
          </p>
        </div>

        {/* Circular Gauge / Percentage Display */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG radial ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={
                  verdictType === 'berpotensi'
                    ? '#34d399'
                    : verdictType === 'bahaya'
                    ? '#fb7185'
                    : '#fbbf24'
                }
                strokeWidth="10"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * stats.scorePercentage) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black tracking-tight text-white leading-none">
                {stats.scorePercentage}%
              </span>
              <span className="text-[10px] text-pink-100 font-medium mt-1">
                Skor Kelayakan
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
          <div className="bg-white/15 p-2 rounded-xl border border-white/20">
            <div className="text-emerald-200 font-bold text-lg leading-tight">
              {stats.greenCount}
            </div>
            <div className="text-[10px] text-pink-100">Green Flag (+1)</div>
          </div>
          <div className="bg-white/15 p-2 rounded-xl border border-white/20">
            <div className="text-rose-100 font-bold text-lg leading-tight">
              {stats.redCount}
            </div>
            <div className="text-[10px] text-pink-100">Red Flag (-1)</div>
          </div>
          <div className="bg-white/15 p-2 rounded-xl border border-white/20">
            <div className="text-white font-bold text-lg leading-tight">
              {stats.unratedCount}
            </div>
            <div className="text-[10px] text-pink-100">Belum Nilai</div>
          </div>
        </div>
      </div>

      {/* 2. Official Verdict Card */}
      <div className={`p-4.5 rounded-2xl border ${verdictCardBg} shadow-xs`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${verdictBadgeBg}`}>
            Rumusan Muktamad
          </span>
          <span className="text-xs font-semibold text-slate-700">
            Status Kelayakan
          </span>
        </div>

        <h3 className="font-extrabold text-base text-slate-900 leading-snug">
          {verdictTitle}
        </h3>
        <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
          {verdictDescription}
        </p>

        {stats.unratedCount > 5 && (
          <div className="mt-3 p-2 bg-white/70 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Masih ada <strong>{stats.unratedCount} kriteria</strong> belum dinilai.</span>
            <button
              onClick={() => setActiveTab('checklist')}
              className="text-rose-800 font-bold hover:underline"
            >
              Lengkapkan Checklist &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 3. Red Flag Alerts (If any exist) */}
      {redFlaggedCriteria.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-bold text-sm">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Amaran Red Flag Ditandakan ({redFlaggedCriteria.length})</span>
            </div>
            {stats.criticalRedFlags > 0 && (
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                {stats.criticalRedFlags} Isu Asas Wajib!
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Perhatikan isu-isu ini secara serius. Jangan bertolak ansur dengan perkara yang memudaratkan syarak, emosi, atau anak.
          </p>

          <div className="space-y-2">
            {redFlaggedCriteria.map(item => {
              const note = activeCandidate.checklist[item.id]?.notes;
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950">
                      #{item.id} {item.title}
                    </span>
                    {item.isCritical && (
                      <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                        ASAS WAJIB
                      </span>
                    )}
                  </div>
                  <p className="text-rose-900 mt-1 leading-snug">
                    {item.description}
                  </p>
                  {note && (
                    <div className="mt-1.5 pt-1.5 border-t border-rose-200 text-slate-700 italic">
                      <strong>Bukti direkod:</strong> "{note}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Pecahan Mengikut 4 Dimensi */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-rose-700" />
          <span>Pecahan 4 Dimensi Utama</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Peratusan Green Flag yang dicapai dalam setiap aspek teras
        </p>

        <div className="space-y-3.5">
          {dimensionList.map(dim => {
            const data = stats.categoryScores[dim.key] || { total: 0, green: 0, red: 0, percentage: 0 };
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{dim.label}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({dim.desc})</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {data.percentage}% ({data.green}/{data.total})
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.percentage >= 70
                        ? 'bg-emerald-500'
                        : data.percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Jurnal & Panduan Syarak Istikharah */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
          <HeartHandshake className="w-4 h-4 text-rose-700" />
          <span>Panduan Syarak & Langkah Seterusnya</span>
        </div>

        <div className="space-y-2 text-xs text-slate-700">
          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
              1
            </span>
            <div>
              <strong className="text-slate-900">Solat Sunat Istikharah:</strong>
              <p className="text-slate-600 mt-0.5">
                Jangan bergantung semata-mata pada logik fikiran. Pohon ketetapan hati daripada Allah agar dipermudahkan urusan jika calon ini membawa barakah.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
              2
            </span>
            <div>
              <strong className="text-slate-900">Musyawarah Bersama Wali & Keluarga:</strong>
              <p className="text-slate-600 mt-0.5">
                Bentangkan pemerhatian anda kepada bapa atau wali secara jujur. Pandangan orang tua yang berpengalaman adalah pelindung penting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
              3
            </span>
            <div>
              <strong className="text-slate-900">Perhatikan Konsistensi Jurnal:</strong>
              <p className="text-slate-600 mt-0.5">
                Kadar konsistensi tindakannya setakat ini: <strong>{stats.consistencyRate}%</strong>. Pastikan tidak ada jurang antara janji manis dengan tindakan sebenar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
