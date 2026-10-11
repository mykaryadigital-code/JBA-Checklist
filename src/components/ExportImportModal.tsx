import React, { useState, useRef } from 'react';
import { X, Download, Upload, RefreshCw, Copy, Check, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { exportDataJson, importDataJson, resetToSampleData } = useApp();
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `backup_checklist_bakal_suami_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const dataStr = exportDataJson();
    navigator.clipboard.writeText(dataStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataJson(content);
        if (result.success) {
          setImportStatus({ message: 'Data berjaya diimport dan dimuat semula!', isError: false });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setImportStatus({ message: result.error || 'Gagal mengimport fail.', isError: true });
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReset = () => {
    if (confirm('Adakah anda pasti mahu set semula semua data kepada data contoh asal? Semua perubahan peribadi akan dipadamkan.')) {
      resetToSampleData();
      setImportStatus({ message: 'Data telah diset semula ke konfigurasi asal.', isError: false });
      setTimeout(() => onClose(), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-rose-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-100" />
            <h3 className="font-semibold text-lg">Sandaran & Eksport Data</h3>
          </div>
          <button
            onClick={onClose}
            className="text-pink-100 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                importStatus.isError
                  ? 'bg-rose-50 border border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}
            >
              {importStatus.message}
            </div>
          )}

          {/* Export Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-950 font-semibold text-sm">
              <Download className="w-4 h-4 text-rose-700" />
              <span>Eksport Data Calon (Simpan Fail)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Muat turun semua profil calon, semakan checklist, progres 30 hari, dan jurnal tindakan ke dalam peranti anda dalam format JSON.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadJson}
                className="flex-1 px-3 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Muat Turun Fail JSON
              </button>
              <button
                onClick={handleCopyJson}
                className="px-3 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Disalin!' : 'Salin JSON'}
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-950 font-semibold text-sm">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Import Data (Pulihkan Sandaran)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih fail sandaran `.json` yang telah dieksport sebelum ini untuk memulihkan rekod penilaian anda.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-3 py-2.5 bg-white border border-emerald-600/40 hover:bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              Pilih & Muat Naik Fail JSON
            </button>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Mahu mula semula dari awal?</span>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Set Semula Data Contoh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
