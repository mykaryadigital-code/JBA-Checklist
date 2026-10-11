import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, Check, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode (already installed as PWA)
  if (isInstalled) {
    return (
      <div 
        title="Aplikasi dipasang sebagai PWA"
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold"
      >
        <Check className="w-3 h-3 text-emerald-600" />
        <span className="hidden sm:inline">PWA Dipasang</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else {
      // Show guided instructions for iOS Safari or Chrome menu
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Pasang Aplikasi ke Telefon / Desktop (PWA)"
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-b from-[#ff2b85] to-[#d70f64] hover:brightness-105 active:translate-y-0.5 text-white rounded-xl text-xs font-bold shadow-sm shadow-[#d70f64]/30 border-t border-white/30 border-b-[2px] border-b-[#9f0747] transition-all"
      >
        <DownloadCloud className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Pasang App</span>
      </button>

      {/* Guide modal if beforeinstallprompt is not natively triggered (e.g., iOS Safari or browser menu) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#fcc2d7] space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-pink-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#fff0f5] text-[#d70f64] flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Pasang Checklist Bakal Suami
                  </h3>
                  <p className="text-[11px] text-[#d70f64] font-semibold">
                    Progressive Web App (PWA)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs text-slate-600 bg-[#fff0f5] p-3 rounded-xl border border-[#fcc2d7]">
                <p className="font-bold text-[#d70f64] flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" /> Cara Pasang di iPhone / iPad (Safari):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>
                    Tekan ikon <strong>Kongsi (Share)</strong> di bar bawah Safari browser.
                  </li>
                  <li>
                    Skrol ke bawah dan pilih <strong>&quot;Tambah ke Skrin Utama&quot; (Add to Home Screen)</strong>.
                  </li>
                  <li>
                    Tekan <strong>Tambah (Add)</strong> di bucu kanan atas. Ikon aplikasi akan muncul di skrin telefon anda!
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Cara Pasang di Android / Chrome / Edge:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>
                    Tekan butang menu titik tiga <strong>(⋮)</strong> di bucu kanan atas browser anda.
                  </li>
                  <li>
                    Pilih <strong>&quot;Pasang aplikasi&quot;</strong> atau <strong>&quot;Tambah ke skrin utama&quot;</strong> (Install app / Add to Home screen).
                  </li>
                  <li>
                    Aplikasi akan dipasang terus seperti aplikasi natif telefon dengan sokongan luar talian (offline cache)!
                  </li>
                </ol>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              {isInstallable && (
                <button
                  onClick={async () => {
                    setShowGuideModal(false);
                    await install();
                  }}
                  className="flex-1 py-2 bg-gradient-to-b from-[#ff2b85] to-[#d70f64] hover:brightness-105 active:translate-y-0.5 text-white rounded-xl text-xs font-bold border-b-[3px] border-b-[#9f0747] transition-all"
                >
                  Terus Pasang Sekarang
                </button>
              )}
              <button
                onClick={() => setShowGuideModal(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 border-b-[2px] border-b-slate-300 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
