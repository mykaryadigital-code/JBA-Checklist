import React from 'react';
import { X, HeartHandshake, ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, Sparkles, ExternalLink } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-[#fcc2d7] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#d70f64] via-[#e21b70] to-[#ff2b85] text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-pink-100" />
            <h3 className="font-semibold text-base sm:text-lg">Panduan Penggunaan Aplikasi</h3>
          </div>
          <button
            onClick={onClose}
            className="text-pink-100 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-sm text-slate-700">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-xs text-rose-950 font-medium leading-relaxed">
              <strong>Prinsip Utama:</strong> Aplikasi ini dibina khas untuk membantu wanita matang dan ibu tunggal menilai bakal pasangan hidup berasaskan <span className="text-rose-800 font-bold">bukti tindakan harian sebenar</span> dan lunas syarak, bukan kata-kata manis.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                  1. Senarai Semak 25 Kriteria
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Tandakan sama ada setiap kriteria adalah <strong>Green Flag (+1)</strong> atau <strong>Red Flag (-1)</strong>. Tulis catatan bukti tindakan yang diperhatikan.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-rose-100 text-rose-800 rounded-lg shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                  2. Panduan Lengkap 30 Hari
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Ikuti langkah demi langkah dari Hari 1 hingga Hari 30 merentasi 5 fasa: Niat, Emosi, Kewangan, Keluarga & Anak, serta Fasa Keputusan Muktamad.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                  3. Jurnal: Kata-Kata vs Tindakan
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Catatkan setiap insiden secara objektif: bandingkan apa yang dijanji dengan apa yang sebenarnya dilakukannya.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
                  4. Keputusan & Restu Wali
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Semak skor analisis dan amaran red flag kritikal. Solat istikharah dan libatkan wali sebelum sebarang ikatan dimeterai.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            <a
              href="https://saudagarpantaimanis.bcl.my/form/janda-bukan-akhir"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#fff0f5] to-[#ffe4ee] border border-[#fcc2d7] hover:border-[#f48fb1] hover:shadow-xs transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d70f64] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#d70f64] uppercase block">Belum Dapatkan Pakej Penuh?</span>
                  <span className="text-xs font-black text-slate-900 block leading-tight">Dapatkan Pakej Janda Bukan Akhir</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#d70f64] shrink-0" />
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-b from-[#ff2b85] to-[#d70f64] hover:brightness-105 text-white rounded-xl text-xs font-bold border-t border-white/30 border-b-[4px] border-b-[#9f0747] shadow-[0_4px_12px_rgba(215,15,100,0.3)] active:translate-y-0.5 active:border-b-[1px] transition-all cursor-pointer"
            >
              Faham & Mula Menilai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
